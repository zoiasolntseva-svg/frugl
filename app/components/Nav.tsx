"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecked(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const linkClass = (href: string) =>
    `text-sm font-medium transition-colors ${
      pathname === href ? "text-primary" : "text-ink/60 hover:text-ink"
    }`;

  return (
    <header className="border-b border-ink/10 bg-paper">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-ink">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-primary" />
          frugl
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/" className={linkClass("/")}>
            Home
          </Link>
          <Link href="/pricing" className={linkClass("/pricing")}>
            Pricing
          </Link>
          {checked && session && (
            <>
              <Link href="/dashboard" className={linkClass("/dashboard")}>
                Dashboard
              </Link>
              <Link href="/progress" className={linkClass("/progress")}>
                Progress
              </Link>
            </>
          )}

          {!checked ? null : session ? (
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-white bg-primary px-4 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Log out
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className={linkClass("/login")}>
                Log in
              </Link>
              <Link
                href="/signup"
                className="text-sm font-medium text-white bg-primary px-4 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
