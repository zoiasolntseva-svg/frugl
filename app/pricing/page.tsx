import Link from "next/link";

export default function Pricing() {
  return (
    <main className="flex-1 bg-paper text-ink">
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <img
            src="/brand/frugl-logo-exact.png"
            alt="Frugl logo"
            className="mx-auto mb-8"
            width={200}
          />

          <h1 className="text-4xl font-bold mb-4">Pricing</h1>
          <p className="text-xl mb-10">
            One simple plan. Cancel anytime.
          </p>

          {/* Plan card */}
          <div className="max-w-sm mx-auto border border-primary/20 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-2">Frugl Plan</h2>
            <p className="text-3xl font-bold mb-4">Coming soon</p>
            <ul className="text-left mb-8 space-y-2">
              <li>Set your grocery budget</li>
              <li>Pick your store</li>
              <li>Get optimized meal plans</li>
            </ul>
            <button
              disabled
              title="Checkout isn't set up yet"
              className="w-full bg-primary/40 text-white px-6 py-3 rounded-lg font-medium cursor-not-allowed"
            >
              Get Started
            </button>
          </div>

          <Link
            href="/"
            className="text-primary font-medium hover:underline"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
