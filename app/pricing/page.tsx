import Link from "next/link";

export default function Pricing() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <img 
            src="/brand/frugl-logo-exact.png" 
            alt="Frugl logo" 
            className="mx-auto mb-8" 
            width={200} 
          />
          
          {/* Value proposition */}
          <h1 className="text-4xl font-bold mb-4">
            Budget meals, sorted.
          </h1>
          <p className="text-xl mb-6">
            Pick your grocery store, set a budget, and get meal plans that fit.
          </p>
          
          {/* Pricing and CTA */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 justify-center mb-8">
            <Link 
              href="/pricing" 
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              See Pricing
            </Link>
            <Link 
              href="/pricing" 
              className="border border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary/10 transition-colors"
            >
              Get Started
            </Link>
          </div>
          
          {/* Features */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-center">
            <div>
              <h3 className="font-semibold mb-2">Set Your Budget</h3>
              <p>Choose your weekly or monthly grocery budget.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Pick Your Store</h3>
              <p>Select from supported grocery stores in your area.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Get Meal Plans</h3>
              <p>Receive optimized meal plans with recipes and nutrition info.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
