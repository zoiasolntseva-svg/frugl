import Link from "next/link";

export const PRICES_COMPILED = "September 2026";

export function EstimateNotice({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-xs text-ink/50">
        Prices and nutrition are estimates, not live store data.{" "}
        <Link href="/disclaimer" className="text-primary hover:underline">
          Learn more
        </Link>
      </p>
    );
  }

  return (
    <div
      role="note"
      className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-900"
    >
      <p className="font-semibold mb-1">These are estimates</p>
      <p className="text-amber-900/80">
        Prices are our estimates (compiled {PRICES_COMPILED}), not live prices from any store, and the
        differences between stores are approximate. The shopping total assumes typical pack sizes, so
        your real till total may differ: pack sizes, prices, specials and loyalty deals vary. Nutrition
        figures are estimates only and are not medical advice.{" "}
        <Link href="/disclaimer" className="underline font-medium">
          Read the full disclaimer
        </Link>
        .
      </p>
    </div>
  );
}
