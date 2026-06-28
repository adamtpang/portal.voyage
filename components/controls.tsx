"use client";

import type { UserInput, Constraints, Field, Weights, ClimateTag } from "@/lib/types";
import { FIELDS } from "@/lib/types";
import { normalizeWeights } from "@/lib/score";
import { Chip } from "@/components/ui-bits";
import { COMMON_LANGUAGES, CLIMATE_OPTIONS } from "@/lib/defaults";

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

const UTC_OPTIONS = [-8, -7, -6, -5, -3, 0, 1, 2, 3, 4, 5.5, 7, 8, 9];
const utcLabel = (n: number) => `UTC${n >= 0 ? "+" : ""}${n}`;

export function WeightSliders({
  weights,
  onChange,
}: {
  weights: Weights;
  onChange: (w: Weights) => void;
}) {
  const n = normalizeWeights(weights);
  const rows: [keyof Weights, string, string][] = [
    ["people", "People / Schelling", "var(--pv-magenta)"],
    ["cost", "Cost of living", "var(--pv-green)"],
    ["career", "Career upside", "var(--pv-cyan)"],
  ];
  return (
    <div className="space-y-4">
      {rows.map(([key, label, color]) => (
        <div key={key}>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              {label}
            </label>
            <span className="font-mono text-xs tabular-nums" style={{ color }}>
              {Math.round(n[key] * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={weights[key]}
            onChange={(e) => onChange({ ...weights, [key]: Number(e.target.value) })}
            className="w-full"
            style={{ accentColor: color }}
            aria-label={label}
          />
        </div>
      ))}
    </div>
  );
}

export function ControlsPanel({
  input,
  onPatch,
  onPatchConstraints,
}: {
  input: UserInput;
  onPatch: (p: Partial<UserInput>) => void;
  onPatchConstraints: (p: Partial<Constraints>) => void;
}) {
  const c = input.constraints;
  return (
    <div className="space-y-5">
      <div>
        <label className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">
          Monthly budget (USD)
        </label>
        <input
          type="number"
          min={0}
          step={100}
          value={input.budget}
          onChange={(e) => onPatch({ budget: Number(e.target.value) })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono"
        />
      </div>

      <div>
        <label className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">
          Your field
        </label>
        <select
          value={input.field}
          onChange={(e) => onPatch({ field: e.target.value as Field | "any" })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono cursor-pointer"
        >
          <option value="any">Any / remote-agnostic</option>
          {FIELDS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          Hard constraints
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={c.visaEasyOnly}
            onChange={(e) => onPatchConstraints({ visaEasyOnly: e.target.checked })}
          />
          Only easy-to-enter places
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={c.requireEnglishWorkable}
            onChange={(e) => onPatchConstraints({ requireEnglishWorkable: e.target.checked })}
          />
          Must be English-workable
        </label>

        <div>
          <div className="text-xs text-muted-foreground mb-1.5">Climate</div>
          <div className="flex flex-wrap gap-1.5">
            {CLIMATE_OPTIONS.map((t) => (
              <Chip
                key={t}
                active={c.climate.includes(t)}
                onClick={() => onPatchConstraints({ climate: toggle<ClimateTag>(c.climate, t) })}
              >
                {t}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs text-muted-foreground mb-1.5">Languages you speak</div>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_LANGUAGES.map((l) => (
              <Chip
                key={l}
                active={c.languages.includes(l)}
                onClick={() => onPatchConstraints({ languages: toggle(c.languages, l) })}
              >
                {l}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs text-muted-foreground mb-1.5">Timezone target</div>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={c.utcCenter ?? ""}
              onChange={(e) =>
                onPatchConstraints({
                  utcCenter: e.target.value === "" ? null : Number(e.target.value),
                })
              }
              className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm font-mono cursor-pointer"
            >
              <option value="">Any</option>
              {UTC_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {utcLabel(o)}
                </option>
              ))}
            </select>
            {c.utcCenter !== null && (
              <span className="font-mono text-xs text-muted-foreground flex items-center">
                ±
                <input
                  type="number"
                  min={0}
                  max={12}
                  value={c.utcToleranceHours}
                  onChange={(e) =>
                    onPatchConstraints({ utcToleranceHours: Number(e.target.value) })
                  }
                  className="w-12 mx-1 rounded border border-border bg-background px-1 py-0.5"
                />
                h
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
