import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Frugl — Budget meals, sorted",
  description: "Pick your grocery store, set a budget, and get estimated meal plans that fit.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Nav />
        <div className="flex-1 flex flex-col">{children}</div>
        <footer className="border-t border-ink/10 bg-paper">
          <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-ink/50">
            <p>Prices and nutrition in Frugl are estimates, not live store data.</p>
            <Link href="/disclaimer" className="text-primary hover:underline">
              Disclaimer
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
