"use client";

import type { ReactNode } from "react";
import type { ScoredCity, UserInput } from "@/lib/types";
import { policy } from "@/lib/policy";
import {
  AxisBar,
  FitRing,
  UnverifiedBadge,
  PeopleCaveat,
  AXIS_COLORS,
} from "@/components/ui-bits";

const VISA_LABEL = ["", "Hard to enter", "Moderate", "Open", "Very open"];

function Overlay({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-border bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function CityDetail({
  scored,
  input,
  onClose,
}: {
  scored: ScoredCity;
  input: UserInput;
  onClose: () => void;
}) {
  const { city, axes, anchors, ambientNotables } = scored;
  const overBudget = city.costIndex > input.budget;
  const anchorIds = new Set(anchors.map((a) => a.person.id));
  const ambientOnly = ambientNotables.filter((p) => !anchorIds.has(p.id));

  return (
    <Overlay onClose={onClose}>
      <div className="p-5 sm:p-6 space-y-5">
        {/* header */}
        <div className="flex items-start gap-3">
          <span className="text-3xl">{city.flag}</span>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold">{city.city}</h2>
            <p className="font-mono text-xs text-muted-foreground">{city.country}</p>
          </div>
          <FitRing value={scored.fit} size={64} />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-muted-foreground hover:text-foreground text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-foreground/80 leading-relaxed">{city.blurb}</p>

        {/* axes */}
        <div className="space-y-3">
          <AxisBar label="Cost (runway)" value={axes.cost} color={AXIS_COLORS.cost} />
          <AxisBar label="Career upside" value={axes.career} color={AXIS_COLORS.career} />
          <AxisBar label="People / scene" value={axes.people} color={AXIS_COLORS.people} />
        </div>

        {/* cost detail */}
        <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Runway
          </span>
          <p className="mt-1 text-foreground/85">
            Est. comfortable solo cost{" "}
            <span className="font-mono">${city.costIndex.toLocaleString()}/mo</span> vs your
            budget <span className="font-mono">${input.budget.toLocaleString()}/mo</span> —{" "}
            <span className={overBudget ? "text-pv-orange" : "text-pv-green"}>
              {overBudget ? "over budget" : "within budget"}
            </span>
            .
          </p>
        </div>

        {/* scene */}
        <div className="space-y-3">
          <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            The scene
          </div>
          {anchors.length > 0 && (
            <div>
              <div className="text-xs text-foreground/70 mb-1">Your admired people here</div>
              <div className="flex flex-wrap gap-1.5">
                {anchors.map((a) => (
                  <span
                    key={a.person.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs"
                  >
                    {a.person.name}
                    {!a.person.verified && <UnverifiedBadge />}
                  </span>
                ))}
              </div>
            </div>
          )}
          {ambientOnly.length > 0 && (
            <div>
              <div className="text-xs text-foreground/70 mb-1">Notables who anchor this scene</div>
              <ul className="space-y-1">
                {ambientOnly.map((p) => (
                  <li key={p.id} className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <span className="text-foreground/80">{p.name}</span> · {p.role}
                    {!p.verified && <UnverifiedBadge />}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <PeopleCaveat />
        </div>

        {/* facts */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <Fact label="Languages" value={city.primaryLanguages.join(", ")} />
          <Fact label="Climate" value={city.climateTags.join(", ")} />
          <Fact label="Timezone" value={`UTC${city.utcOffset >= 0 ? "+" : ""}${city.utcOffset}`} />
          <Fact label="Visa" value={VISA_LABEL[city.visaOpenness]} />
        </div>

        {/* constraints */}
        {scored.excluded ? (
          <p className="font-mono text-xs text-pv-orange">
            ⚠ Fails your constraints: {scored.constraintFails.join(" · ")}
          </p>
        ) : (
          <p className="font-mono text-xs text-pv-green">✓ Meets your hard constraints.</p>
        )}

        {/* visit don't commit */}
        <div className="rounded-lg border border-border bg-muted/40 p-3">
          <p className="text-xs text-foreground/80 leading-relaxed">
            <span className="font-medium">Visit, don&apos;t commit.</span> Before you move,
            spend <span className="font-mono">{policy.ui.samplingTripWeeks}</span> here on a
            sampling trip — test the scene, the cost, and whether you actually click with the
            place before you uproot your life.
          </p>
        </div>
      </div>
    </Overlay>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-2.5">
      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="text-foreground/85 mt-0.5">{value}</div>
    </div>
  );
}

export function CompareView({
  items,
  onClose,
  onRemove,
}: {
  items: ScoredCity[];
  onClose: () => void;
  onRemove: (slug: string) => void;
}) {
  const rows: [string, (s: ScoredCity) => ReactNode][] = [
    ["Fit", (s) => <span className="font-mono font-semibold">{s.fit}</span>],
    ["Cost", (s) => s.axes.cost],
    ["Career", (s) => s.axes.career],
    ["People", (s) => s.axes.people],
    ["$/mo", (s) => `$${s.city.costIndex.toLocaleString()}`],
    ["Visa", (s) => VISA_LABEL[s.city.visaOpenness]],
    ["Your people", (s) => s.anchors.length || "—"],
  ];
  return (
    <Overlay onClose={onClose}>
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Compare</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-muted-foreground hover:text-foreground text-lg leading-none"
          >
            ✕
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="text-left p-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground" />
                {items.map((s) => (
                  <th key={s.city.slug} className="p-2 text-center min-w-[96px]">
                    <div className="text-lg">{s.city.flag}</div>
                    <div className="text-xs font-medium">{s.city.city}</div>
                    <button
                      type="button"
                      onClick={() => onRemove(s.city.slug)}
                      className="font-mono text-[10px] text-muted-foreground hover:text-foreground"
                    >
                      remove
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, render]) => (
                <tr key={label} className="border-t border-border">
                  <td className="p-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    {label}
                  </td>
                  {items.map((s) => (
                    <td key={s.city.slug} className="p-2 text-center tabular-nums">
                      {render(s)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Overlay>
  );
}
