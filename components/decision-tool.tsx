"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { UserInput, Constraints, Weights, ScoredCity } from "@/lib/types";
import { defaultInput } from "@/lib/defaults";
import { rankCities } from "@/lib/score";
import { policy } from "@/lib/policy";
import { ControlsPanel, WeightSliders } from "@/components/controls";
import { YourPeople } from "@/components/your-people";
import { CityCard } from "@/components/city-card";
import { CityDetail, CompareView } from "@/components/overlays";

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-sm">
      <div className="flex items-baseline gap-2 mb-4">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/80">
          {title}
        </h2>
        {subtitle && (
          <span className="font-mono text-[10px] text-pv-magenta">{subtitle}</span>
        )}
      </div>
      {children}
    </section>
  );
}

export function DecisionTool() {
  const [input, setInput] = useState<UserInput>(defaultInput);
  const [detailSlug, setDetailSlug] = useState<string | null>(null);
  const [compare, setCompare] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [showFiltered, setShowFiltered] = useState(false);

  const patch = (p: Partial<UserInput>) => setInput((s) => ({ ...s, ...p }));
  const patchConstraints = (p: Partial<Constraints>) =>
    setInput((s) => ({ ...s, constraints: { ...s.constraints, ...p } }));
  const setWeights = (w: Weights) => setInput((s) => ({ ...s, weights: w }));

  const ranked = useMemo(() => rankCities(input), [input]);
  const included = ranked.filter((r) => !r.excluded);
  const excluded = ranked.filter((r) => r.excluded);

  const toggleCompare = (slug: string) =>
    setCompare((c) =>
      c.includes(slug) ? c.filter((s) => s !== slug) : c.length >= 5 ? c : [...c, slug]
    );

  const detail = detailSlug ? ranked.find((r) => r.city.slug === detailSlug) ?? null : null;
  const compareItems = compare
    .map((slug) => ranked.find((r) => r.city.slug === slug))
    .filter(Boolean) as ScoredCity[];

  return (
    <div className="grid lg:grid-cols-[340px_1fr] gap-6">
      {/* controls */}
      <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pr-1">
        <Section title="What you value">
          <WeightSliders weights={input.weights} onChange={setWeights} />
        </Section>
        <Section title="Your situation">
          <ControlsPanel input={input} onPatch={patch} onPatchConstraints={patchConstraints} />
        </Section>
        <Section title="Your people" subtitle="the differentiator">
          <YourPeople admired={input.admired} onChange={(a) => patch({ admired: a })} />
        </Section>
      </aside>

      {/* results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-xs text-muted-foreground">
            {included.length} places match · ranked by fit
          </p>
          {compare.length > 0 && (
            <button
              type="button"
              onClick={() => setShowCompare(true)}
              className="font-mono text-xs px-3 py-1.5 rounded-lg border border-foreground bg-foreground text-background"
            >
              Compare {compare.length}
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {included.map((r, i) => (
            <CityCard
              key={r.city.slug}
              scored={r}
              rank={i + 1}
              onOpen={() => setDetailSlug(r.city.slug)}
              onToggleCompare={() => toggleCompare(r.city.slug)}
              inCompare={compare.includes(r.city.slug)}
            />
          ))}
        </div>

        {included.length > 0 && (
          <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm leading-relaxed">
            <span className="font-medium">Top pick: {included[0].city.city}.</span>{" "}
            Don&apos;t commit yet — go spend{" "}
            <span className="font-mono">{policy.ui.samplingTripWeeks}</span> there on a
            sampling trip and pressure-test it before you uproot anything.
          </div>
        )}

        {excluded.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setShowFiltered((s) => !s)}
              className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {showFiltered ? "▾" : "▸"} {excluded.length} places filtered by your constraints
            </button>
            {showFiltered && (
              <div className="grid sm:grid-cols-2 gap-4 mt-3">
                {excluded.map((r, i) => (
                  <CityCard
                    key={r.city.slug}
                    scored={r}
                    rank={included.length + i + 1}
                    onOpen={() => setDetailSlug(r.city.slug)}
                    onToggleCompare={() => toggleCompare(r.city.slug)}
                    inCompare={compare.includes(r.city.slug)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {detail && (
        <CityDetail scored={detail} input={input} onClose={() => setDetailSlug(null)} />
      )}
      {showCompare && compareItems.length > 0 && (
        <CompareView
          items={compareItems}
          onClose={() => setShowCompare(false)}
          onRemove={(slug) => toggleCompare(slug)}
        />
      )}
    </div>
  );
}
