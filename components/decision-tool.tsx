"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { UserInput, Constraints, Weights, ScoredCity } from "@/lib/types";
import { defaultInput } from "@/lib/defaults";
import { rankCities } from "@/lib/score";
import { policy } from "@/lib/policy";
import { nearestCity } from "@/lib/geo";
import { ControlsPanel, WeightSliders } from "@/components/controls";
import { YourPeople } from "@/components/your-people";
import { CityCard } from "@/components/city-card";
import { CityDetail, CompareView } from "@/components/overlays";
import { WorldGlobe } from "@/components/world-globe";

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
  const [locating, setLocating] = useState(false);
  const [locateMsg, setLocateMsg] = useState<string | null>(null);
  const [nearestSlug, setNearestSlug] = useState<string | null>(null);

  function findMe() {
    if (!("geolocation" in navigator)) {
      setLocateMsg("Geolocation isn't available in this browser.");
      return;
    }
    setLocating(true);
    setLocateMsg(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const match = nearestCity(pos.coords.latitude, pos.coords.longitude);
        if (!match) {
          setNearestSlug(null);
          setLocateMsg("You're more than 300km from any of our 30 cities — explore the globe instead.");
          return;
        }
        setNearestSlug(match.city.slug);
        setLocateMsg(`Nearest: ${match.city.city} — ${Math.round(match.distanceKm)}km away.`);
      },
      (err) => {
        setLocating(false);
        setLocateMsg(
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied."
            : "Couldn't get your location."
        );
      },
      { timeout: 10_000 }
    );
  }

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
        <div>
          <WorldGlobe
            scored={ranked}
            onSelect={(slug) => setDetailSlug(slug)}
            highlightSlug={nearestSlug}
          />
          <div className="mt-2 flex items-start justify-between gap-3 flex-wrap">
            <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
              Drag to rotate, scroll to zoom, click a marker for details.{" "}
              <span style={{ color: "var(--pv-green)" }}>●</span> your zone{" "}
              <span style={{ color: "var(--pv-cyan)" }}>●</span> strong fit{" "}
              <span style={{ color: "var(--pv-gold)" }}>●</span> playable{" "}
              <span className="text-muted-foreground">●</span> off-meta / filtered{" "}
              <span className="text-foreground">○</span> you
            </p>
            <button
              type="button"
              onClick={findMe}
              disabled={locating}
              className="font-mono text-[10px] px-2.5 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50 whitespace-nowrap"
            >
              {locating ? "Locating…" : "📍 Find me"}
            </button>
          </div>
          {locateMsg && (
            <p className="mt-1 font-mono text-[10px] text-foreground/80">
              {locateMsg}{" "}
              {nearestSlug && (
                <button
                  type="button"
                  onClick={() => setDetailSlug(nearestSlug)}
                  className="underline hover:text-foreground"
                >
                  view details
                </button>
              )}
            </p>
          )}
        </div>

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

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
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
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
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
