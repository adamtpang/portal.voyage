import type { Metadata } from "next";
import Link from "next/link";
import { PortalScorecard } from "@/components/portal-scorecard";
import {
  CRITERIA,
  CITY_SCORES,
  scoreCity,
  type Category,
} from "@/lib/data/portal-criteria";

export const metadata: Metadata = {
  title: "Portal · Where to plant your node | interneta.world",
  description:
    "Cloud first, land last. The Portal is the doorway where a startup society chooses where to materialize. Score a location, learn what Balaji optimized for at Forest City.",
  alternates: { canonical: "https://interneta.world/portal" },
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

const CAT_ORDER: Category[] = [
  "Access & Law",
  "Economics",
  "Community",
  "Livability",
  "Strategic",
];

// Forest City case study: what each criterion looked like to Balaji.
const FOREST_CITY_NOTES: { key: string; line: string }[] = [
  { key: "realestate", line: "A $100B Country Garden megaproject, largely vacant. Tens of thousands of finished apartments waiting for residents. The ultimate land-last canvas: built, empty, cheap." },
  { key: "proximity", line: "Thirty minutes from Singapore, one of the planet's densest concentrations of capital, talent, and flights. Near the hub, at a fraction of the hub's cost." },
  { key: "cost", line: "A Singapore-adjacent lifestyle at Malaysian prices. Geographic arbitrage built into the address." },
  { key: "infra", line: "Towers, fiber, power, malls, an international airport nearby. Nothing to build; everything to fill." },
  { key: "visa", line: "Malaysia's long-stay options and a government open to a Special Financial Zone make staying viable." },
  { key: "language", line: "English works day to day across Malaysia and Singapore." },
  { key: "safety", line: "Low crime, family-safe, politically stable. Somewhere you would raise a kid." },
];

function miniScore(scores: Record<string, number>) {
  return scoreCity(scores);
}

export default function PortalPage() {
  const forestCity = CITY_SCORES.find((c) => c.city === "Forest City")!;
  const ranked = [...CITY_SCORES].sort(
    (a, b) => miniScore(b.scores) - miniScore(a.scores)
  );

  return (
    <div className="min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Hero */}
        <div className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4">
          ::: PORTAL :::
        </div>
        <h1 className="font-mono font-bold text-4xl sm:text-6xl leading-tight tracking-tight mb-6">
          Where the cloud<br />
          <span className="text-muted-foreground">touches the land.</span>
        </h1>
        <div className="flex gap-1 mb-8" aria-hidden>
          {PALETTE.map((c, i) => (
            <span key={i} className="block h-2 flex-1" style={{ background: c }} />
          ))}
        </div>
        <p className="font-mono text-base sm:text-lg text-foreground/85 leading-relaxed max-w-3xl mb-4">
          A network state is cloud first and land last, but not land never. The
          Portal is the doorway: the moment a startup society chooses where to
          materialize its first physical node. Choose wrong and the community
          scatters. Choose right and it compounds.
        </p>
        <p className="font-mono text-sm text-muted-foreground max-w-3xl mb-14">
          Below: the twelve variables that matter, a live scorecard to rate any
          location, and a reverse-engineering of what Balaji optimized for when
          he chose Forest City for Network School.
        </p>

        {/* Scorecard */}
        <section className="mb-20">
          <div className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4">
            ::: THE SCORECARD :::
          </div>
          <h2 className="font-mono font-bold text-3xl sm:text-4xl mb-6">
            Score a location.
          </h2>
          <PortalScorecard />
        </section>

        {/* The 12 criteria explained */}
        <section className="mb-20">
          <div className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4">
            ::: THE TWELVE VARIABLES :::
          </div>
          <h2 className="font-mono font-bold text-3xl sm:text-4xl mb-3">
            What actually matters.
          </h2>
          <p className="font-mono text-sm text-muted-foreground mb-8 max-w-2xl">
            Your starting list, expanded. Visas, proximity to capital, cost of
            living, and distressed real estate are all here, weighted KEY,
            alongside the variables that quietly decide whether a node lives.
          </p>
          <div className="space-y-8">
            {CAT_ORDER.map((cat) => (
              <div key={cat}>
                <h3 className="font-mono font-bold text-lg mb-3 border-b-2 border-border pb-1">
                  {cat}
                </h3>
                <div className="space-y-4">
                  {CRITERIA.filter((c) => c.category === cat).map((c, i) => {
                    const accent =
                      PALETTE[(CAT_ORDER.indexOf(cat) + i) % PALETTE.length];
                    return (
                      <div
                        key={c.key}
                        className="border-l-4 pl-4"
                        style={{ borderColor: accent }}
                      >
                        <div className="font-mono font-bold text-base flex items-center gap-2">
                          {c.name}
                          {c.weight === 3 && (
                            <span className="text-[9px] tracking-widest px-1.5 py-0.5 border border-border text-muted-foreground">
                              KEY · 3x
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-foreground/75 leading-relaxed mt-1">
                          {c.why}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Forest City case study */}
        <section className="mb-20">
          <div className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4">
            ::: CASE STUDY :::
          </div>
          <div className="flex items-baseline justify-between flex-wrap gap-3 mb-4">
            <h2 className="font-mono font-bold text-3xl sm:text-4xl">
              🇲🇾 Why Forest City?
            </h2>
            <div className="font-mono">
              <span
                className="text-3xl font-bold tabular-nums"
                style={{ color: "var(--iw-green)" }}
              >
                {miniScore(forestCity.scores)}
              </span>
              <span className="text-muted-foreground text-sm"> / 100</span>
            </div>
          </div>
          <p className="font-mono text-base text-foreground/85 leading-relaxed max-w-3xl mb-6">
            When Balaji chose Forest City, Malaysia for Network School, he was
            not picking a pretty city. He was solving the land-last problem
            optimally. Here is what the location scored on, in his apparent
            order of priority.
          </p>
          <div className="space-y-3 mb-6">
            {FOREST_CITY_NOTES.map((n) => {
              const crit = CRITERIA.find((c) => c.key === n.key)!;
              return (
                <div
                  key={n.key}
                  className="border-2 border-border bg-background shadow-brutal-sm p-4"
                >
                  <div className="font-mono font-bold text-sm mb-1">
                    {crit.name}
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {n.line}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="font-mono text-sm text-foreground/80 leading-relaxed max-w-3xl">
            The pattern: <strong>vacant high-quality real estate, next to a
            global capital hub, at arbitrage prices, with infrastructure
            already built, a friendly visa, and English.</strong> Forest City
            is a master class in land-last. The lesson is not &ldquo;copy
            Forest City,&rdquo; it is &ldquo;find your Forest City.&rdquo;
          </p>
        </section>

        {/* Comparison */}
        <section className="mb-20">
          <div className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4">
            ::: KNOWN NODES, RANKED :::
          </div>
          <h2 className="font-mono font-bold text-3xl sm:text-4xl mb-6">
            Six candidates, scored.
          </h2>
          <div className="space-y-2">
            {ranked.map((c) => {
              const s = miniScore(c.scores);
              const color =
                s >= 80
                  ? "var(--iw-green)"
                  : s >= 65
                    ? "var(--iw-gold)"
                    : "var(--iw-orange)";
              return (
                <div
                  key={c.city}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-2 border-border bg-background shadow-brutal-sm p-3"
                >
                  <div className="text-2xl">{c.flag}</div>
                  <div className="min-w-0">
                    <div className="font-mono font-bold text-sm">{c.city}</div>
                    <div className="font-mono text-[11px] text-muted-foreground truncate">
                      {c.note}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 sm:w-40 h-3 bg-muted border border-border overflow-hidden">
                      <div
                        className="h-full"
                        style={{ width: `${s}%`, background: color }}
                      />
                    </div>
                    <div
                      className="font-mono font-bold text-lg tabular-nums w-8 text-right"
                      style={{ color }}
                    >
                      {s}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="font-mono text-xs text-muted-foreground italic mt-4">
            Scores are an interpretation, weighted by the framework above. Load
            any of these into the scorecard to see the per-criterion breakdown,
            or to argue with the ratings.
          </p>
        </section>

        {/* CTA */}
        <section className="border-2 border-border bg-background shadow-brutal-md p-6 sm:p-8 font-mono">
          <div className="text-xs tracking-[0.3em] text-muted-foreground mb-4">
            ::: NEXT :::
          </div>
          <h2 className="font-bold text-2xl sm:text-3xl mb-4">
            Found the place? Now build the polity.
          </h2>
          <p className="text-sm sm:text-base text-foreground/80 leading-relaxed mb-6 max-w-2xl">
            The Portal picks the land. The Playbook builds the society on it,
            and the World catalog shows which countries already have the legal
            scaffolds in place.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/playbook"
              className="border-2 border-border bg-foreground text-background shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all px-5 py-3 font-bold text-sm"
            >
              [ THE FOUNDER PLAYBOOK ]
            </Link>
            <Link
              href="/world"
              className="border-2 border-border bg-background shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all px-5 py-3 font-bold text-sm"
            >
              [ COUNTRIES WITH SCAFFOLDS ]
            </Link>
            <Link
              href="/explore"
              className="border-2 border-border bg-background shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all px-5 py-3 font-bold text-sm"
            >
              [ THE DIRECTORY ]
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
