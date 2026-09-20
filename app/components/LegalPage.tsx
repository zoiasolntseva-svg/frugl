import Link from "next/link";
import type { ReactNode } from "react";
import { LEGAL_UPDATED } from "@/lib/legal";

export type LegalSection = {
  title: string;
  body?: string[];
  items?: string[];
  extra?: ReactNode;
  highlight?: boolean;
};

export default function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <main className="flex-1 bg-[#f9f9f7] text-ink px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-xs text-ink/40 mb-4">Last updated {LEGAL_UPDATED}</p>
        <p className="text-ink/70 mb-10">{intro}</p>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <section
              key={section.title}
              className={
                section.highlight
                  ? "bg-white border-2 border-ink/20 rounded-xl p-5"
                  : undefined
              }
            >
              <h2 className="text-lg font-semibold mb-2">
                {index + 1}. {section.title}
              </h2>
              <div className="space-y-2">
                {section.body?.map((paragraph) => (
                  <p key={paragraph} className="text-sm text-ink/80 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
                {section.items && (
                  <ul className="list-disc pl-5 space-y-1">
                    {section.items.map((item) => (
                      <li key={item} className="text-sm text-ink/80 leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {section.extra}
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
          <Link href="/disclaimer" className="text-primary hover:underline">
            Disclaimer
          </Link>
          <Link href="/" className="text-primary hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
