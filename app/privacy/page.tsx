import Link from "next/link";
import LegalPage, { type LegalSection } from "@/app/components/LegalPage";
import { LEGAL, INFORMATION_REGULATOR } from "@/lib/legal";

export const metadata = {
  title: "Privacy Policy — Frugl",
  description: "How Frugl collects, uses and protects your personal information.",
};

const sections: LegalSection[] = [
  {
    title: "Who is responsible for your information",
    body: [
      "The responsible party under the Protection of Personal Information Act (POPIA) is:",
    ],
    items: [
      `Business name: ${LEGAL.businessName}`,
      `Physical address: ${LEGAL.physicalAddress}`,
      `Email: ${LEGAL.email}`,
      `Information Officer: ${LEGAL.informationOfficer} (${LEGAL.informationOfficerEmail})`,
    ],
  },
  {
    title: "What we collect",
    items: [
      "Account details: your email address and a password (we do not see or store your password itself; our sign-in provider stores a secure hash).",
      "Your acceptance of our terms and privacy policy, including the date and version.",
      "Preferences: the store you choose and, if you give it, your city.",
      "Meal plan inputs and history: your budget, weekly or monthly choice, goal, store and the plan generated (estimated spend, calories and number of meals), saved each time you generate a plan.",
      "Health and fitness tracking, only if you switch it on: your weight and strength records (exercise, weight lifted, reps and sets). This is health information, which POPIA treats as special personal information.",
      "Technical information such as your IP address and device details, recorded in server and security logs by our hosting and sign-in providers.",
    ],
  },
  {
    title: "Why we use it and on what basis",
    items: [
      "To create and run your account and give you meal plans. This is necessary to provide the service you asked for.",
      "To keep Frugl secure and prevent misuse. This is in our and our users' legitimate interests.",
      "To show your weight and strength progress charts. We only do this with your explicit consent, given separately on the Progress page. You can withdraw it at any time.",
      "To comply with the law where it requires us to.",
    ],
    body: [
      "We do not sell your personal information and we do not use it for advertising.",
    ],
  },
  {
    title: "What you must give us and what is optional",
    body: [
      "An email address and password are needed to create an account. Your city and your weight and strength records are optional. If you do not provide the optional items, the rest of Frugl still works.",
    ],
  },
  {
    title: "Who we share it with",
    body: [
      "We use service providers (called operators under POPIA) to run Frugl. They only process your information on our behalf:",
    ],
    items: [
      "Supabase: database and sign-in. Our database is hosted in the European Union (Ireland).",
      "Vercel: hosting of the Frugl website.",
      "An email delivery provider: to send sign-up confirmation emails.",
      "A payment provider: only if and when paid plans are switched on. We will update this policy before that happens.",
    ],
    extra: (
      <p className="text-sm text-ink/80">
        We may also disclose information if the law requires it.
      </p>
    ),
  },
  {
    title: "Sending information outside South Africa",
    body: [
      "Our database is hosted in the European Union, and our other providers may process information in other countries, including the United States. Where information leaves South Africa, we rely on our agreements with these providers, which include data-protection terms that give protection substantially similar to POPIA, and on your consent when you accept this policy.",
    ],
  },
  {
    title: "How long we keep it",
    body: [
      "We keep your information while your account is open. When you delete your account, your profile, sign-in, plan history and tracking records are deleted. If you withdraw your health-tracking consent, your weight and strength records are deleted straight away. Our providers' backups and logs may hold copies for a short time afterwards before they are overwritten.",
    ],
  },
  {
    title: "How we protect it",
    body: [
      "We use reasonable technical and organisational measures. For example, connections to Frugl are encrypted, and access rules mean that each user can only read and change their own records. No system is perfectly secure, so we cannot promise absolute security.",
      "If there is a security breach that affects your personal information, we will notify the Information Regulator and the people affected as POPIA requires.",
    ],
  },
  {
    title: "Your rights",
    body: ["You have the right to:"],
    items: [
      "ask what personal information we hold about you and get a copy;",
      "ask us to correct or delete it;",
      "object to our processing of it;",
      "withdraw a consent you have given, without affecting what was done before you withdrew;",
      "complain to the Information Regulator.",
    ],
    extra: (
      <p className="text-sm text-ink/80">
        You can download your data, withdraw health-tracking consent or delete your account yourself on the{" "}
        <Link href="/account" className="text-primary hover:underline">
          Your data
        </Link>{" "}
        page. For anything else, contact our Information Officer at {LEGAL.informationOfficerEmail}.
      </p>
    ),
  },
  {
    title: "Complaints to the Information Regulator",
    items: [
      `Website: ${INFORMATION_REGULATOR.website}`,
      `Email: ${INFORMATION_REGULATOR.email}`,
      `Address: ${INFORMATION_REGULATOR.address}`,
    ],
  },
  {
    title: "Children",
    body: [
      "Frugl is for people aged 18 and over. We do not knowingly collect information from anyone under 18. If you believe a child has given us information, please contact us and we will delete it.",
    ],
  },
  {
    title: "Cookies and similar storage",
    body: [
      "Frugl stores a sign-in token in your browser so you stay logged in. This is essential for the service to work. At the time of writing we do not use advertising or analytics cookies. If that changes, we will update this policy first.",
    ],
  },
  {
    title: "Changes to this policy",
    body: [
      "We may update this policy. When we make an important change we will tell you, and the date at the top of this page will change.",
    ],
  },
];

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="This explains what personal information Frugl collects, why, who sees it, and the choices you have."
      sections={sections}
    />
  );
}
