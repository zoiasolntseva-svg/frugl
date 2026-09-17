"use client";

import { useState } from "react";
import Link from "next/link";

type Billing = "monthly" | "yearly";

type Tier = {
  name: string;
  tagline: string;
  monthly: number;
  yearly: number;
  features: string[];
  cta: string;
  highlighted?: boolean;
  disabled?: boolean;
};

const TIERS: Tier[] = [
  {
    name: "Free",
    tagline: "Try it out",
    monthly: 0,
    yearly: 0,
    features: [
      "1 meal plan, ever",
      "1 grocery store",
      "Balanced goal only",
      "Weekly budget only",
    ],
    cta: "Get Started",
  },
  {
    name: "Plus",
    tagline: "Full store comparison",
    monthly: 99,
    yearly: 950,
    features: [
      "All 6 grocery stores",
      "All goals (Weight Loss, Muscle Gain, Balanced)",
      "Weekly & monthly budgets",
      "Unlimited meal plans",
      "Full per-ingredient price breakdown",
    ],
    cta: "Coming soon",
    highlighted: true,
    disabled: true,
  },
  {
    name: "Pro",
    tagline: "Track your progress",
    monthly: 179,
    yearly: 1720,
    features: [
      "Everything in Plus",
      "Weight, strength & calorie history",
      "Bigger meal plans (more repeat batches)",
      "Early access to new stores & recipes",
    ],
    cta: "Coming soon",
    disabled: true,
  },
];

function yearlySavings(tier: Tier) {
  if (tier.monthly === 0) return 0;
  return tier.monthly * 12 - tier.yearly;
}

export default function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <main className="flex-1 bg-[#f9f9f7] text-ink">
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <img
            src="/brand/frugl-logo-exact.png"
            alt="Frugl logo"
            className="mx-auto mb-8"
            width={160}
          />

          <h1 className="text-4xl font-bold mb-3">Pricing</h1>
          <p className="text-lg text-ink/60 mb-8 max-w-md mx-auto">
            Start free. Upgrade when you want the full store comparison and progress tracking.
          </p>

          <div className="inline-flex items-center bg-white border border-ink/10 rounded-full p-1 mb-12 shadow-sm">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                billing === "monthly" ? "bg-primary text-white" : "text-ink/60"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                billing === "yearly" ? "bg-primary text-white" : "text-ink/60"
              }`}
            >
              Yearly
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  billing === "yearly" ? "bg-white/20" : "bg-primary/10 text-primary"
                }`}
              >
                Save 20%
              </span>
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {TIERS.map((tier) => {
              const price = billing === "monthly" ? tier.monthly : tier.yearly;
              const savings = yearlySavings(tier);
              return (
                <div
                  key={tier.name}
                  className={`tilt-card flex flex-col bg-white rounded-3xl p-8 shadow-sm text-left ${
                    tier.highlighted
                      ? "border-2 border-primary shadow-lg relative md:-translate-y-2"
                      : "border border-ink/10"
                  }`}
                >
                  {tier.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                  <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-1">
                    {tier.name}
                  </p>
                  <p className="text-sm text-ink/50 mb-4">{tier.tagline}</p>
                  <p className="mb-1">
                    <span className="text-4xl font-bold">R{price}</span>
                    <span className="text-sm font-medium text-ink/40">
                      {" "}
                      / {billing === "monthly" ? "month" : "year"}
                    </span>
                  </p>
                  <p className="text-xs text-ink/40 mb-6 h-4">
                    {billing === "yearly" && savings > 0 ? `Save R${savings}/year` : " "}
                  </p>

                  <ul className="space-y-2.5 mb-8 flex-1">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <svg
                          className="w-4 h-4 text-primary shrink-0 mt-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm text-ink/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {tier.disabled ? (
                    <button
                      disabled
                      title="Checkout isn't set up yet"
                      className="w-full bg-ink/10 text-ink/40 px-6 py-3 rounded-lg font-medium cursor-not-allowed"
                    >
                      {tier.cta}
                    </button>
                  ) : (
                    <Link
                      href="/signup"
                      className="block w-full text-center bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      {tier.cta}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-sm text-ink/40 mt-10">
            Questions?{" "}
            <Link href="/" className="text-primary hover:underline">
              Back to home
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
