import type { ReactNode } from "react";

export const AXIS_COLORS = {
  cost: "var(--pv-green)",
  career: "var(--pv-cyan)",
  people: "var(--pv-magenta)",
} as const;

export function UnverifiedBadge() {
  return (
    <span
      className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border border-border text-muted-foreground"
      title="Location based on public reporting — may be outdated. Verify before relying on it."
    >
      unverified
    </span>
  );
}

export function AxisBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
        <span>{label}</span>
        <span className="tabular-nums text-foreground/80">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function FitRing({ value, size = 52 }: { value: number; size?: number }) {
  const v = Math.round(Math.max(0, Math.min(100, value)));
  return (
    <div className="relative grid place-items-center shrink-0" style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: `conic-gradient(var(--pv-gold) ${v * 3.6}deg, var(--muted) 0deg)` }}
      />
      <div className="absolute rounded-full bg-card" style={{ inset: 4 }} />
      <span className="relative font-mono font-semibold tabular-nums text-sm leading-none">
        {v}
      </span>
    </div>
  );
}

export function Chip({
  active,
  disabled,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={active}
      className={`font-mono text-xs px-2.5 py-1 rounded-full border transition-colors ${
        active
          ? "border-foreground bg-foreground text-background"
          : disabled
            ? "border-border text-muted-foreground/40 cursor-not-allowed"
            : "border-border text-foreground/80 hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}

export function PeopleCaveat({ compact }: { compact?: boolean }) {
  return (
    <div
      className={`rounded-lg border border-border bg-muted/40 ${
        compact ? "p-2.5" : "p-3"
      } text-muted-foreground`}
    >
      <p className={`${compact ? "text-[11px]" : "text-xs"} leading-relaxed`}>
        <span className="font-medium text-foreground/80">Proximity isn&apos;t access.</span>{" "}
        These are signals about the <em>scene</em>, not a promise you&apos;ll meet
        anyone. Do you have a real way into that orbit — an intro, a job, an event,
        a reason to be in the room?
      </p>
    </div>
  );
}
