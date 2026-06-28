import { DecisionTool } from "@/components/decision-tool";

const SPECTRUM = [
  "--pv-cyan", "--pv-magenta", "--pv-gold", "--pv-green",
  "--pv-red", "--pv-indigo", "--pv-orange",
];

const AXES: { n: string; title: string; body: string; color: string }[] = [
  {
    n: "01",
    title: "Cost of living",
    body: "How far your money goes. Your budget against each city's real cost — the runway that buys you time and freedom.",
    color: "--pv-green",
  },
  {
    n: "02",
    title: "Career upside",
    body: "Where your field actually compounds: the jobs, capital, scenes, and events for what you do — AI, crypto, design, and more.",
    color: "--pv-cyan",
  },
  {
    n: "03",
    title: "People / Schelling",
    body: "The differentiator, weighted highest by default. Where the people you admire cluster — your own Schelling points for who to be near.",
    color: "--pv-magenta",
  },
];

export default function Home() {
  return (
    <div className="py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero */}
        <div className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4">
          ::: THE OPEN WORLD :::
        </div>
        <h1 className="font-semibold text-3xl sm:text-5xl leading-[1.05] tracking-tight mb-5 max-w-3xl">
          Where on Earth should you live?
        </h1>
        <div className="flex gap-1 mb-7 max-w-md" aria-hidden>
          {SPECTRUM.map((c) => (
            <span key={c} className="block h-1.5 flex-1 rounded-full" style={{ background: `var(${c})` }} />
          ))}
        </div>
        <p className="text-base sm:text-lg text-foreground/80 leading-relaxed max-w-2xl mb-3">
          The biggest decision of your life, made with data instead of vibes.
          Portal scores every city on the three things that actually decide it —
          your <span className="text-pv-green">runway</span>, your{" "}
          <span className="text-pv-cyan">career</span>, and{" "}
          <span className="text-pv-magenta">your people</span> — then ranks them for you.
        </p>
        <p className="font-mono text-sm text-muted-foreground max-w-2xl mb-10">
          Move the sliders to weight what matters. Add the people you admire and
          watch the map re-rank around where they cluster. It structures the
          decision — it doesn&apos;t make it for you.
        </p>

        <DecisionTool />

        {/* The three axes */}
        <section className="mt-20">
          <div className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-6">
            ::: THE THREE AXES :::
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {AXES.map((a) => (
              <div key={a.n} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div
                  className="font-mono font-semibold text-2xl mb-3"
                  style={{ color: `var(${a.color})` }}
                >
                  {a.n}
                </div>
                <div className="font-semibold text-base mb-2">{a.title}</div>
                <p className="text-sm text-foreground/70 leading-relaxed">{a.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Honesty note */}
        <section className="mt-10 rounded-xl border border-border bg-muted/30 p-5">
          <div className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-3">
            ::: HONEST ABOUT THE DATA :::
          </div>
          <p className="text-sm text-foreground/75 leading-relaxed max-w-3xl">
            Costs, career scores, and people&apos;s locations are curated, approximate,
            and sometimes out of date — anyone marked{" "}
            <span className="font-mono text-[11px] uppercase tracking-wider px-1.5 py-0.5 rounded border border-border text-muted-foreground">
              unverified
            </span>{" "}
            is a public-reporting signal, not a confirmed address. And{" "}
            <span className="text-foreground/90">proximity isn&apos;t access</span>: a great
            scene only helps if you have a real way into it. This is decision-support,
            not gospel. Start the search here — then go see for yourself.
          </p>
        </section>

        <div className="mt-12 flex gap-1 max-w-md" aria-hidden>
          {SPECTRUM.map((c) => (
            <span key={c} className="block h-1.5 flex-1 rounded-full" style={{ background: `var(${c})` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
