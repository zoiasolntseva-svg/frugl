import Link from "next/link";
import LegalPage, { type LegalSection } from "@/app/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata = {
  title: "Terms of Use — Frugl",
  description: "The terms that apply when you use Frugl.",
};

const sections: LegalSection[] = [
  {
    title: "About these terms",
    body: [
      "These terms apply when you use Frugl, a meal-planning tool. By creating an account or using Frugl you agree to them. If you do not agree, please do not use Frugl.",
      "Frugl is provided by:",
    ],
    items: [
      `Business name: ${LEGAL.businessName}`,
      `Legal status: ${LEGAL.legalStatus}`,
      `Registration number: ${LEGAL.registrationNumber}`,
      `Physical address: ${LEGAL.physicalAddress}`,
      `Email: ${LEGAL.email}`,
      `Phone: ${LEGAL.phone}`,
    ],
  },
  {
    title: "Who can use Frugl",
    body: [
      "You must be 18 or older to use Frugl. You confirm this when you sign up. If we learn that someone under 18 has an account, we may close it.",
    ],
  },
  {
    title: "What Frugl is",
    body: [
      "Frugl helps you plan meals around a grocery budget. It suggests recipes and shows estimated costs and nutrition.",
      "The prices and nutrition figures in Frugl are estimates. They are not live prices from any store and have not been checked against current shelf prices. Frugl is not affiliated with, endorsed by or sponsored by any grocery store, and store names are used only to show which store an estimate refers to.",
      "Frugl does not give medical, dietary or financial advice. See our Disclaimer for more detail.",
    ],
  },
  {
    title: "Your responsibility for decisions",
    body: [
      "Because prices and nutrition are estimates, please check real prices and product labels before you buy. Your actual till total may differ from the estimate: we assume typical pack sizes, and stores' pack sizes, prices and specials vary.",
      "If you have a medical condition, allergy or special dietary need, speak to a doctor or registered dietitian and always read product labels. Do not rely on Frugl for allergen information.",
    ],
  },
  {
    title: "Your account",
    body: [
      "Give us accurate information when you sign up and keep your password safe. You are responsible for what happens under your account. Tell us promptly if you think someone else has used it.",
    ],
  },
  {
    title: "Acceptable use",
    body: ["You agree not to:"],
    items: [
      "use Frugl for anything unlawful;",
      "try to break, overload or get around the security of Frugl or its systems;",
      "use robots, scrapers or other automated tools to copy Frugl's content or data in bulk;",
      "access another person's account or data.",
    ],
  },
  {
    title: "Your data",
    body: [
      "How we handle your personal information is explained in our Privacy Policy. Weight and strength tracking is optional and only switched on with your separate consent. You can download your data or delete your account at any time from the Your data page.",
    ],
  },
  {
    title: "Plans and payments",
    body: [
      "Frugl currently offers a free plan. Paid plans are shown on the Pricing page but are not yet available to buy. If we start selling paid plans, we will show the full price in rand, how billing works and how to cancel before you pay, and these terms will be updated.",
      "Nothing in these terms limits any right you have by law, including any right to cancel or a cooling-off period that applies to your purchase.",
    ],
  },
  {
    title: "Our content",
    body: [
      "Frugl's software, design and content belong to us or our licensors. You may use Frugl for your own personal, non-commercial purposes. Store names and trademarks belong to their owners.",
    ],
  },
  {
    title: "Limits on our responsibility",
    highlight: true,
    body: [
      "Please read this section carefully. It limits what we are responsible for.",
      "Frugl is provided as it is. Because prices and nutrition are estimates, we do not promise that they are accurate, complete or up to date, or that Frugl will always be available or error-free.",
      "To the extent the law allows, we are not responsible for loss or damage that is indirect or consequential, or for loss that results from decisions you make by relying on Frugl's estimates, for example spending more at the till than an estimate showed.",
      "Nothing in these terms excludes or limits any liability, or any right you have, that cannot lawfully be excluded or limited. That includes rights under the Consumer Protection Act and liability for fraud, intentional wrongdoing or gross negligence.",
    ],
  },
  {
    title: "Suspending or ending your use",
    body: [
      "You can stop using Frugl and delete your account at any time. We may suspend or close an account if these terms are broken or if we need to for legal or security reasons.",
    ],
  },
  {
    title: "Changes to these terms",
    body: [
      "We may update these terms. When we make an important change we will tell you, for example by email or a notice in Frugl, and the date at the top of this page will change. If you keep using Frugl after a change takes effect, you accept the new terms. If you do not agree, you can delete your account.",
    ],
  },
  {
    title: "Governing law and complaints",
    body: [
      "These terms are governed by the law of South Africa. If you have a complaint, please contact us first so we can try to resolve it. You may also approach the National Consumer Commission or a competent court.",
    ],
  },
  {
    title: "Contact us",
    body: [`You can reach us at ${LEGAL.email}.`],
    extra: (
      <p className="text-sm text-ink/80">
        See also our{" "}
        <Link href="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="/disclaimer" className="text-primary hover:underline">
          Disclaimer
        </Link>
        .
      </p>
    ),
  },
];

export default function Terms() {
  return (
    <LegalPage
      title="Terms of Use"
      intro="These are the rules for using Frugl, written in plain language. Please read them before you create an account."
      sections={sections}
    />
  );
}
