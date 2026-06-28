import type { ScoredCity } from "@/lib/types";
import { AxisBar, FitRing, UnverifiedBadge, AXIS_COLORS } from "@/components/ui-bits";

export function CityCard({
  scored,
  rank,
  onOpen,
  onToggleCompare,
  inCompare,
}: {
  scored: ScoredCity;
  rank: number;
  onOpen: () => void;
  onToggleCompare: () => void;
  inCompare: boolean;
}) {
  const { city, fit, axes, anchors } = scored;
  return (
    <div
      className={`flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm transition-colors ${
        scored.excluded ? "border-border opacity-60" : "border-border"
      }`}
    >
      {/* header */}
      <div className="flex items-start gap-3">
        <span className="text-2xl leading-none mt-0.5">{city.flag}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-base leading-tight truncate">{city.city}</h3>
            <span className="font-mono text-[10px] text-muted-foreground shrink-0">#{rank}</span>
          </div>
          <p className="font-mono text-[11px] text-muted-foreground truncate">{city.country}</p>
        </div>
        <FitRing value={fit} />
      </div>

      {/* axes */}
      <div className="grid grid-cols-3 gap-3">
        <AxisBar label="Cost" value={axes.cost} color={AXIS_COLORS.cost} />
        <AxisBar label="Career" value={axes.career} color={AXIS_COLORS.career} />
        <AxisBar label="People" value={axes.people} color={AXIS_COLORS.people} />
      </div>

      {/* anchors */}
      {anchors.length > 0 && (
        <div className="rounded-lg border border-border bg-muted/30 p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Your people here
            </span>
            {anchors.some((a) => !a.person.verified) && <UnverifiedBadge />}
          </div>
          <p className="text-xs text-foreground/85 leading-relaxed">
            {anchors.map((a) => a.person.name).join(", ")}
          </p>
          <p className="mt-1.5 text-[10px] text-muted-foreground leading-snug">
            A signal about the scene — proximity isn&apos;t access.
          </p>
        </div>
      )}

      {/* why */}
      <p className="text-sm text-foreground/75 leading-relaxed">{scored.why}</p>

      {scored.excluded && (
        <p className="font-mono text-[11px] text-pv-orange">
          ⚠ {scored.constraintFails.join(" · ")}
        </p>
      )}

      {/* actions */}
      <div className="mt-auto flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={onOpen}
          className="font-mono text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
        >
          Details
        </button>
        <button
          type="button"
          onClick={onToggleCompare}
          aria-pressed={inCompare}
          className={`font-mono text-xs px-3 py-1.5 rounded-lg border transition-colors ${
            inCompare
              ? "border-foreground bg-foreground text-background"
              : "border-border hover:bg-muted"
          }`}
        >
          {inCompare ? "✓ Comparing" : "Compare"}
        </button>
      </div>
    </div>
  );
}
