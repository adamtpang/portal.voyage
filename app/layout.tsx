import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "portal.voyage · Where on Earth should you live?",
  description:
    "A data-driven map for deciding where to live. Set your passport, field, and what you want out of life, and find the cities on Earth that actually fit you, visas included.",
  metadataBase: new URL("https://portal.voyage"),
  openGraph: {
    title: "portal.voyage · Where on Earth should you live?",
    description:
      "Earth is the open world; every city is a DLC. Find the place that fits your life, your work, and your people.",
    url: "https://portal.voyage",
    siteName: "portal.voyage",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "portal.voyage · Where on Earth should you live?",
    description:
      "A data-driven map for deciding where to live. Find your place on Earth.",
  },
};

const SPECTRUM = [
  "--pv-cyan", "--pv-magenta", "--pv-gold", "--pv-green",
  "--pv-red", "--pv-indigo", "--pv-orange",
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark overflow-x-hidden">
      <head>
        {/* No-flash theme: default dark, honor saved preference */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.classList.remove('light', 'dark');
                document.documentElement.classList.add(theme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased min-h-screen overflow-x-hidden flex flex-col`}
        suppressHydrationWarning
      >
        <header className="border-b-2 border-border">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-mono font-bold text-lg tracking-tight">
              portal<span className="text-muted-foreground">.voyage</span>
            </Link>
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.25em] text-muted-foreground uppercase">
              Find your place on Earth
            </span>
          </div>
          <div className="flex" aria-hidden>
            {SPECTRUM.map((c) => (
              <span key={c} className="block h-1 flex-1" style={{ background: `var(${c})` }} />
            ))}
          </div>
        </header>

        <main className="flex-1 w-full">{children}</main>

        <footer className="border-t-2 border-border mt-20">
          <div className="max-w-6xl mx-auto px-4 py-8 font-mono text-xs text-muted-foreground flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
            <span>portal.voyage — a data-driven map for where to live.</span>
            <span>Earth is the open world. Every city is a DLC.</span>
            <a
              href="https://adampang.com"
              className="underline underline-offset-4 hover:text-foreground"
            >
              built by Adam Pangelinan
            </a>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
