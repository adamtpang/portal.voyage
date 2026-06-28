import type { Metadata } from "next";
import Link from "next/link";
import { AtlasTool } from "@/components/atlas-tool";

export const metadata: Metadata = {
  title: "Atlas · Where on Earth should you live? | interneta.world",
  description:
    "Earth is the open world. Every city is a DLC. Set your passport, class, field, and perks, and find the zones that fit you, with the real visa unlock for your passport.",
  alternates: { canonical: "https://interneta.world/atlas" },
};

const PALETTE = [
  "var(--iw-cyan)",
  "var(--iw-magenta)",
  "var(--iw-gold)",
  "var(--iw-green)",
  "var(--iw-red)",
  "var(--iw-indigo)",
  "var(--iw-orange)",
];

export default function AtlasPage() {
  return (
    <div className="min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero */}
        <div className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4">
          ::: THE OPEN WORLD :::
        </div>
        <h1 className="font-mono font-bold text-4xl sm:text-6xl leading-tight tracking-tight mb-6">
          Where on Earth<br />
          <span className="text-muted-foreground">should you live?</span>
        </h1>
        <div className="flex gap-1 mb-8" aria-hidden>
          {PALETTE.map((c, i) => (
            <span key={i} className="block h-2 flex-1" style={{ background: c }} />
          ))}
        </div>
        <p className="font-mono text-base sm:text-lg text-foreground/85 leading-relaxed max-w-3xl mb-3">
          Earth is an open-world game and every city is a DLC. Some are unlocked
          for your passport the moment you arrive; others you have to grind for.
          Set your build, weight what you value, and the map re-ranks for you.
        </p>
        <p className="font-mono text-sm text-muted-foreground max-w-3xl mb-10">
          Portal is where a founder plants a node. Atlas is where a person finds
          their city. Same world, two doorways.
        </p>

        <AtlasTool />

        {/* Cross-links */}
        <section className="mt-16 border-2 border-border bg-background shadow-brutal-md p-6 sm:p-8">
          <div className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4">
            ::: NEXT DOORWAYS :::
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
            <Link
              href="/portal"
              className="border-2 border-border bg-background shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all p-4"
            >
              <div className="text-[10px] tracking-[0.3em] text-muted-foreground mb-1">
                FOR FOUNDERS
              </div>
              <div className="font-bold text-base mb-1">Portal →</div>
              <div className="text-xs text-foreground/70">
                Where to plant a network-state node. Score a site, see what
                Balaji optimized for at Forest City.
              </div>
            </Link>
            <Link
              href="/explore"
              className="border-2 border-border bg-background shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all p-4"
            >
              <div className="text-[10px] tracking-[0.3em] text-muted-foreground mb-1">
                THE DIRECTORY
              </div>
              <div className="font-bold text-base mb-1">Explore →</div>
              <div className="text-xs text-foreground/70">
                Every nation-state and network state in one grid, ranked and
                filterable.
              </div>
            </Link>
            <Link
              href="/playbook"
              className="border-2 border-border bg-background shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all p-4"
            >
              <div className="text-[10px] tracking-[0.3em] text-muted-foreground mb-1">
                THE HOW
              </div>
              <div className="font-bold text-base mb-1">Playbook →</div>
              <div className="text-xs text-foreground/70">
                Found your own polity instead of joining one. The full founder
                playbook.
              </div>
            </Link>
          </div>
        </section>

        <div className="mt-10 flex gap-1" aria-hidden>
          {PALETTE.map((c, i) => (
            <span key={i} className="block h-2 flex-1" style={{ background: c }} />
          ))}
        </div>
      </div>
    </div>
  );
}
