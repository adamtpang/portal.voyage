"use client";

import { useMemo, useState } from "react";
import {
  CRITERIA,
  CITY_SCORES,
  scoreCity,
  verdictFor,
  type Category,
} from "@/lib/data/portal-criteria";

const CATEGORIES: Category[] = [
  "Access & Law",
  "Economics",
  "Community",
  "Livability",
  "Strategic",
];

const CAT_COLOR: Record<Category, string> = {
  "Access & Law": "#4f46e5",
  Economics: "#eab308",
  Community: "#d946ef",
  Livability: "#16a34a",
  Strategic: "#06b6d4",
};

function Dots({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          onClick={() => onChange(i === value ? 0 : i)}
          aria-label={`Rate ${i}`}
          className="w-5 h-5 border-2 border-border transition-colors"
          style={{ background: i <= value ? "var(--iw-green)" : "transparent" }}
        />
      ))}
    </div>
  );
}

export function PortalScorecard() {
  const [scores, setScores] = useState<Record<string, number>>(() =>
    Object.fromEntries(CRITERIA.map((c) => [c.key, 0]))
  );
  const [cityName, setCityName] = useState("");

  const pct = useMemo(() => scoreCity(scores), [scores]);
  const verdict = verdictFor(pct);
  const anyRated = Object.values(scores).some((v) => v > 0);

  const set = (key: string, v: number) =>
    setScores((s) => ({ ...s, [key]: v }));

  const loadPreset = (presetCity: string) => {
    const c = CITY_SCORES.find((x) => x.city === presetCity);
    if (c) {
      setScores({ ...c.scores });
      setCityName(c.city);
    }
  };

  const reset = () => {
    setScores(Object.fromEntries(CRITERIA.map((c) => [c.key, 0])));
    setCityName("");
  };

  return (
    <div className="border-2 border-border bg-background shadow-brutal-md p-5 sm:p-6">
      {/* Header: input + live score */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div className="flex-1">
          <label className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
            CANDIDATE LOCATION
          </label>
          <input
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            placeholder="Name a city..."
            className="w-full border-2 border-border bg-background px-3 py-2 font-mono text-base mt-1 focus:outline-none"
          />
        </div>
        <div className="text-center sm:text-right">
          <div
            className="font-mono font-bold text-5xl tabular-nums leading-none"
            style={{ color: anyRated ? verdict.color : "var(--muted-foreground)" }}
          >
            {pct}
          </div>
          <div className="font-mono text-[10px] tracking-widest text-muted-foreground">
            / 100 PORTAL SCORE
          </div>
        </div>
      </div>

      {/* Verdict banner */}
      {anyRated && (
        <div
          className="border-2 border-border p-4 mb-6 font-mono"
          style={{ background: `${verdict.color}14` }}
        >
          <div
            className="text-sm font-bold tracking-[0.2em]"
            style={{ color: verdict.color }}
          >
            {verdict.band}
          </div>
          <div className="text-xs text-foreground/75 mt-1 leading-relaxed">
            {verdict.note}
          </div>
        </div>
      )}

      {/* Presets */}
      <div className="mb-6">
        <div className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground mb-2">
          OR LOAD A KNOWN NODE
        </div>
        <div className="flex flex-wrap gap-2">
          {CITY_SCORES.map((c) => (
            <button
              key={c.city}
              onClick={() => loadPreset(c.city)}
              className="font-mono text-xs px-2.5 py-1 border-2 border-border bg-background hover:bg-muted transition-colors"
            >
              {c.flag} {c.city}
            </button>
          ))}
          <button
            onClick={reset}
            className="font-mono text-xs px-2.5 py-1 border-2 border-border bg-muted hover:bg-foreground hover:text-background transition-colors"
          >
            CLEAR
          </button>
        </div>
      </div>

      {/* Criteria, grouped by category */}
      <div className="space-y-5">
        {CATEGORIES.map((cat) => (
          <div key={cat}>
            <div
              className="font-mono text-[10px] tracking-[0.2em] mb-2 font-bold"
              style={{ color: CAT_COLOR[cat] }}
            >
              {cat.toUpperCase()}
            </div>
            <div className="space-y-2">
              {CRITERIA.filter((c) => c.category === cat).map((c) => (
                <div
                  key={c.key}
                  className="flex items-center justify-between gap-3 border-b border-border/50 pb-2"
                >
                  <div className="font-mono text-xs sm:text-sm flex items-center gap-2 min-w-0">
                    <span className="truncate">{c.name}</span>
                    {c.weight === 3 && (
                      <span
                        className="text-[8px] tracking-widest px-1 border border-border text-muted-foreground flex-shrink-0"
                        title="High weight"
                      >
                        KEY
                      </span>
                    )}
                  </div>
                  <Dots value={scores[c.key]} onChange={(v) => set(c.key, v)} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="font-mono text-[10px] text-muted-foreground mt-5 leading-relaxed">
        KEY criteria are weighted 3x; others 2x. Score is the weighted sum
        normalized to 100. This is a thinking tool, not an oracle. The
        location that scores 72 and that you can move to next month beats the
        one that scores 88 and stays hypothetical.
      </p>
    </div>
  );
}
