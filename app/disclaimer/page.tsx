import Link from "next/link";
import { PRICES_COMPILED } from "@/app/components/EstimateNotice";

export const metadata = {
  title: "Disclaimer — Frugl",
  description: "How to read Frugl's prices, nutrition figures and meal plans.",
};

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "Prices are estimates",
    body: [
      `The prices in Frugl are our own estimates, compiled in ${PRICES_COMPILED}. They are not live prices from any store and they have not been checked against a store's current shelf prices.`,
      "Real prices change often and differ between branches, between online and in-store, and with specials and loyalty deals. The differences we show between stores are approximate and should not be read as a ranking of which store is cheapest.",
    ],
  },
  {
    title: "Your till total will usually be higher",
    body: [
      "A recipe uses a portion of an ingredient (for example, part of a tub of yoghurt), but stores sell whole packs. Frugl shows both the portion cost and the estimated full pack price, but the meal plan total is based on portions. What you actually pay at the till will usually be higher.",
    ],
  },
  {
    title: "Nutrition and health",
    body: [
      "Calorie, protein and other nutrition figures are estimates. They are not medical or dietary advice. Goals such as Weight Loss and Muscle Gain only change which meals are suggested first; they are not a personalised plan.",
      "Speak to a doctor or registered dietitian before making changes to your diet, especially if you have a medical condition.",
    ],
  },
  {
    title: "Allergens",
    body: [
      "Allergen information in Frugl is a guide only. Always read the label on the products you buy, and check with the manufacturer if you have a serious allergy.",
    ],
  },
  {
    title: "Progress tracking",
    body: [
      "The weight, strength and calorie history in Frugl is for your own tracking and is based on what you enter and the meal plans you generate. It is not a measure of what you actually ate and is not medical advice.",
    ],
  },
  {
    title: "Store names",
    body: [
      "Frugl is not affiliated with, endorsed by or sponsored by Checkers, Pick n Pay, Woolworths, Shoprite, Spar or Food Lover's Market. Store names are used only to show which store an estimate refers to. All trademarks belong to their respective owners.",
    ],
  },
];

export default function Disclaimer() {
  return (
    <main className="flex-1 bg-[#f9f9f7] text-ink px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Disclaimer</h1>
        <p className="text-ink/60 mb-10">How to read Frugl&apos;s prices, nutrition figures and meal plans.</p>

        <div className="space-y-8">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
              <div className="space-y-2">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-sm text-ink/80 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="text-sm text-ink/50 mt-12 flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Use
          </Link>
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          <Link href="/" className="text-primary hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
