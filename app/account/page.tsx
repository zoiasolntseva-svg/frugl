"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type ConsentProfile = {
  terms_version: string | null;
  terms_accepted_at: string | null;
  privacy_version: string | null;
  adult_confirmed_at: string | null;
  health_consent_version: string | null;
  health_consent_at: string | null;
};

function formatDateTime(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short" });
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-ink/10 rounded-2xl p-6 shadow-sm">
      <h2 className="font-semibold text-lg mb-3">{title}</h2>
      {children}
    </div>
  );
}

export default function Account() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [profile, setProfile] = useState<ConsentProfile | null>(null);

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deleteText, setDeleteText] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/login");
        return;
      }
      setUser(data.session.user);
      setCheckingAuth(false);
    });
  }, [router]);

  async function loadProfile(userId: string) {
    const { data } = await supabase
      .from("profiles")
      .select(
        "terms_version, terms_accepted_at, privacy_version, adult_confirmed_at, health_consent_version, health_consent_at"
      )
      .eq("id", userId)
      .maybeSingle();
    setProfile(data);
  }

  useEffect(() => {
    if (user) loadProfile(user.id);
  }, [user]);

  async function handleExport() {
    if (!user) return;
    setBusy(true);
    setError("");
    setMessage("");

    const [profileRes, weightRes, strengthRes, historyRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      supabase.from("weight_logs").select("*").eq("user_id", user.id),
      supabase.from("strength_logs").select("*").eq("user_id", user.id),
      supabase.from("meal_plan_history").select("*").eq("user_id", user.id),
    ]);

    const exportData = {
      exported_at: new Date().toISOString(),
      account: { id: user.id, email: user.email, created_at: user.created_at },
      profile: profileRes.data,
      weight_logs: weightRes.data ?? [],
      strength_logs: strengthRes.data ?? [],
      meal_plan_history: historyRes.data ?? [],
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "frugl-my-data.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    setBusy(false);
    setMessage("Your data has been downloaded.");
  }

  async function handleWithdrawConsent() {
    if (!user) return;
    const confirmed = window.confirm(
      "Withdrawing consent will permanently delete all of your weight and strength records. Continue?"
    );
    if (!confirmed) return;
    setBusy(true);
    setError("");
    setMessage("");
    const { error: rpcError } = await supabase.rpc("withdraw_health_consent");
    setBusy(false);
    if (rpcError) {
      setError("We couldn't withdraw your consent. Please try again.");
      return;
    }
    await loadProfile(user.id);
    setMessage("Consent withdrawn and your weight and strength records were deleted.");
  }

  async function handleDeleteAccount() {
    if (deleteText !== "DELETE") return;
    setBusy(true);
    setError("");
    setMessage("");
    const { error: rpcError } = await supabase.rpc("delete_my_account");
    if (rpcError) {
      setBusy(false);
      setError("We couldn't delete your account. Please try again or contact us.");
      return;
    }
    await supabase.auth.signOut({ scope: "local" });
    router.push("/");
  }

  if (checkingAuth) {
    return (
      <main className="flex-1 bg-paper text-ink flex items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  const termsAt = formatDateTime(profile?.terms_accepted_at ?? null);
  const adultAt = formatDateTime(profile?.adult_confirmed_at ?? null);
  const healthAt = formatDateTime(profile?.health_consent_at ?? null);

  return (
    <main className="flex-1 bg-[#f9f9f7] text-ink px-6 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Your data</h1>
          <p className="text-sm text-ink/50">
            See what Frugl holds about you, download it, or delete it. Signed in as {user?.email}.
          </p>
        </div>

        {message && (
          <p role="status" className="text-sm bg-primary/10 text-ink rounded-lg px-4 py-3">
            {message}
          </p>
        )}
        {error && (
          <p role="alert" className="text-sm bg-red-50 text-red-700 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        <Card title="What you have agreed to">
          <ul className="text-sm text-ink/80 space-y-2">
            <li>
              Terms of Use and Privacy Policy:{" "}
              {termsAt ? (
                <>
                  accepted {termsAt} (terms version {profile?.terms_version}, privacy version{" "}
                  {profile?.privacy_version})
                </>
              ) : (
                "no acceptance is recorded (this account was created before we recorded it)"
              )}
            </li>
            <li>Confirmed 18 or older: {adultAt ? `yes, ${adultAt}` : "not recorded"}</li>
            <li>
              Weight and strength tracking consent:{" "}
              {healthAt ? `given ${healthAt} (version ${profile?.health_consent_version})` : "not given"}
            </li>
          </ul>
          <p className="text-xs text-ink/50 mt-3">
            Read the{" "}
            <Link href="/terms" className="text-primary underline">
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary underline">
              Privacy Policy
            </Link>
            .
          </p>
          {healthAt && (
            <button
              type="button"
              onClick={handleWithdrawConsent}
              disabled={busy}
              className="mt-4 text-sm text-red-600 hover:underline disabled:opacity-50"
            >
              Withdraw consent and delete my weight and strength records
            </button>
          )}
        </Card>

        <Card title="Download your data">
          <p className="text-sm text-ink/70 mb-4">
            Get a copy of the information Frugl holds about you (your account, preferences, meal plan
            history and any tracking records) as a JSON file.
          </p>
          <button
            type="button"
            onClick={handleExport}
            disabled={busy}
            className="bg-primary text-white px-5 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            Download my data
          </button>
        </Card>

        <Card title="Delete your account">
          <p className="text-sm text-ink/70 mb-4">
            This permanently deletes your account, preferences, meal plan history and any tracking
            records. It cannot be undone. Type <span className="font-mono font-semibold">DELETE</span> to
            confirm.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
              placeholder="DELETE"
              aria-label="Type DELETE to confirm"
              className="border border-ink/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={busy || deleteText !== "DELETE"}
              className="bg-red-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-40"
            >
              Delete my account
            </button>
          </div>
        </Card>
      </div>
    </main>
  );
}
