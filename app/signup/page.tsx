"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { TERMS_VERSION, PRIVACY_VERSION } from "@/lib/legal";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdult, setIsAdult] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!isAdult || !acceptedTerms) {
      setError("Please confirm you are 18 or older and accept the Terms of Use and Privacy Policy.");
      return;
    }

    setLoading(true);

    // The database records these choices (with its own timestamp) when the account is created.
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          terms_version: TERMS_VERSION,
          privacy_version: PRIVACY_VERSION,
          adult_confirmed: true,
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      router.push("/dashboard");
    } else {
      setCheckEmail(true);
    }
  }

  if (checkEmail) {
    return (
      <main className="flex-1 bg-paper text-ink flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Check your email</h1>
        <p>We sent a confirmation link to {email}. Confirm it, then come back and log in.</p>
        <Link href="/login" className="text-primary font-medium hover:underline mt-6">
          Go to Login
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-paper text-ink flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-6 text-center">Create your account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-ink/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-ink/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2.5 pt-1">
            <label className="flex items-start gap-2.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                required
                checked={isAdult}
                onChange={(e) => setIsAdult(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-primary shrink-0"
              />
              <span>I am 18 years old or older.</span>
            </label>
            <label className="flex items-start gap-2.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                required
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-primary shrink-0"
              />
              <span>
                I have read and accept the{" "}
                <Link href="/terms" target="_blank" className="text-primary underline">
                  Terms of Use
                </Link>{" "}
                (including the limits on Frugl&apos;s responsibility) and the{" "}
                <Link href="/privacy" target="_blank" className="text-primary underline">
                  Privacy Policy
                </Link>
                , and I understand that prices and nutrition are estimates.
              </span>
            </label>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center mt-6 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
