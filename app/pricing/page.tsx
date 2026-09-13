import Link from "next/link";

export default function Pricing() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Pricing</h3>
          <p className="mb-6">
            Monthly subscription: <span className="font-semibold">${process.env.STRIPE_PRICE_ID ? "$9.99" : "price TBD"}</span> per month.
          </p>
          <div className="mb-8">
            <Link 
              href="/" 
              className="border border-primary text-primary px-4 py-2 rounded hover:bg-primary/10"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
