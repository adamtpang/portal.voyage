"use client";

import { useMemo, useState } from "react";
import { CITIES, SECTOR_LABELS, type Sector } from "@/lib/data/cities-livability";
import { PASSPORTS, getPassport } from "@/lib/data/passports";
import {
  ARCHETYPES,
  DIM_LABELS,
  scoreCity,
  fitBand,
  type Archetype,
  type Dim,
  type CityResult,
} from "@/lib/data/atlas";

const PALETTE_HEX = [
  "#06b6d4", "#d946ef", "#eab308", "#16a34a", "#dc2626", "#4f46e5", "#ea580c",
];

const DIMS: Dim[] = [
  "affordability", "growth", "career", "climate", "safety", "tax", "community",
];

function gradientFrom(i: number): string {
  return `linear-gradient(135deg, ${PALETTE_HEX[i % 7]} 0%, ${PALETTE_HEX[(i + 3) % 7]} 100%)`;
}

function CityCard({ r, rank }: { r: CityResult; rank: number }) {
  const band = fitBand(r.fit);
  const v = r.verdict;
  return (
    <div
      className="relative border-2 border-border shadow-brutal-md overflow-hidden flex flex-col"
      style={{ minHeight: 230 }}
    >
      <div className="absolute inset-0" style={{ background: gradientFrom(r.city.paletteIndex) }} />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.82) 100%)" }}
      />

      {/* rank + visa verdict */}
      <div className="relative flex items-start justify-between p-2.5">
        <div
          className="font-mono text-[10px] font-bold px-2 py-1 backdrop-blur-sm flex items-center gap-1"
          style={{ background: "rgba(0,0,0,0.45)", color: v.color }}
          title={v.note}
        >
          <span>{v.icon}</span>
          <span>{v.band.toUpperCase()}</span>
        </div>
        <div
          className="font-mono text-xs font-bold px-2 py-1 backdrop-blur-sm"
          style={{ background: "rgba(0,0,0,0.45)", color: band.color }}
        >
          {r.fit}
        </div>
      </div>

      {/* body */}
      <div className="relative mt-auto p-3 text-white">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl drop-shadow">{r.city.flag}</span>
          <div className="min-w-0">
            <div className="font-mono font-bold text-base leading-tight drop-shadow truncate">
              {r.city.city}
            </div>
            <div className="font-mono text-[10px] text-white/70 truncate">
              #{rank} · {r.city.country}
            </div>
          </div>
        </div>

        <div className="flex gap-1.5 mb-2">
          {r.topDims.map((d) => (
            <div key={d.dim} className="flex-1 bg-black/35 backdrop-blur-sm px-1.5 py-1 text-center">
              <div className="text-[7px] tracking-widest text-white/60 uppercase truncate">
                {DIM_LABELS[d.dim]}
              </div>
              <div className="text-[11px] font-bold font-mono">{d.value}</div>
            </div>
          ))}
        </div>

        <div className="font-mono text-[9px] text-white/70 leading-snug line-clamp-2">
          {v.icon} {r.city.residencyNote}
        </div>
      </div>
    </div>
  );
}

export function AtlasTool() {
  const [passportCode, setPassportCode] = useState("US");
  const [archetype, setArchetype] = useState<Archetype>("remote");
  const [sector, setSector] = useState<Sector | "any">("any");
  const [priorities, setPriorities] = useState<Dim[]>([]);

  const passport = getPassport(passportCode) ?? PASSPORTS[9];

  const results = useMemo(() => {
    return CITIES.map((c) =>
      scoreCity(c, { passport, archetype, sector, priorities })
    ).sort((a, b) => b.fit - a.fit);
  }, [passport, archetype, sector, priorities]);

  const togglePriority = (d: Dim) =>
    setPriorities((prev) =>
      prev.includes(d)
        ? prev.filter((x) => x !== d)
        : prev.length >= 3
          ? prev
          : [...prev, d]
    );

  const unlocked = results.filter(
    (r) => r.verdict.band === "Unlocked" || r.verdict.band === "Easy DLC"
  ).length;

  return (
    <div className="space-y-8">
      {/* Control panel */}
      <div className="border-2 border-border bg-background shadow-brutal-md p-4 sm:p-6 space-y-5">
        <div className="font-mono text-xs tracking-[0.3em] text-muted-foreground">
          ::: BUILD YOUR CHARACTER :::
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Passport */}
          <div>
            <label className="font-mono text-[11px] tracking-widest text-muted-foreground block mb-1.5">
              🛂 PASSPORT (sets your unlocks)
            </label>
            <select
              value={passportCode}
              onChange={(e) => setPassportCode(e.target.value)}
              className="w-full border-2 border-border bg-background shadow-brutal-sm px-3 py-2 font-mono text-sm cursor-pointer"
            >
              {PASSPORTS.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.flag} {p.name} · {p.visaFree} visa-free
                </option>
              ))}
            </select>
          </div>

          {/* Sector */}
          <div>
            <label className="font-mono text-[11px] tracking-widest text-muted-foreground block mb-1.5">
              💼 YOUR FIELD (sets career score)
            </label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value as Sector | "any")}
              className="w-full border-2 border-border bg-background shadow-brutal-sm px-3 py-2 font-mono text-sm cursor-pointer"
            >
              <option value="any">Any / remote-agnostic</option>
              {(Object.keys(SECTOR_LABELS) as Sector[]).map((k) => (
                <option key={k} value={k}>
                  {SECTOR_LABELS[k]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Archetype */}
        <div>
          <label className="font-mono text-[11px] tracking-widest text-muted-foreground block mb-1.5">
            🎮 CLASS
          </label>
          <div className="flex flex-wrap gap-2">
            {ARCHETYPES.map((a) => (
              <button
                key={a.key}
                onClick={() => setArchetype(a.key)}
                title={a.blurb}
                className={`font-mono text-xs px-3 py-2 border-2 transition-all ${
                  archetype === a.key
                    ? "border-foreground bg-foreground text-background shadow-brutal-sm"
                    : "border-border bg-background hover:bg-muted"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Priorities */}
        <div>
          <label className="font-mono text-[11px] tracking-widest text-muted-foreground block mb-1.5">
            ⭐ PERKS · boost up to 3 ({priorities.length}/3)
          </label>
          <div className="flex flex-wrap gap-2">
            {DIMS.map((d) => {
              const active = priorities.includes(d);
              const disabled = !active && priorities.length >= 3;
              return (
                <button
                  key={d}
                  onClick={() => togglePriority(d)}
                  disabled={disabled}
                  className={`font-mono text-xs px-3 py-1.5 border-2 transition-all ${
                    active
                      ? "border-foreground bg-foreground text-background shadow-brutal-sm"
                      : disabled
                        ? "border-border bg-muted/40 text-muted-foreground/40 cursor-not-allowed"
                        : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  {DIM_LABELS[d]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary line */}
      <div className="flex flex-wrap items-center gap-3 font-mono text-sm">
        <span className="text-muted-foreground">
          {passport.flag} {passport.name} ·{" "}
          {ARCHETYPES.find((a) => a.key === archetype)?.label} ·{" "}
          {sector === "any" ? "any field" : SECTOR_LABELS[sector]}
        </span>
        <span
          className="px-2 py-0.5 border-2 border-border font-bold"
          style={{ color: "var(--iw-green)" }}
        >
          {unlocked} / {CITIES.length} easy to enter
        </span>
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {results.map((r, i) => (
          <CityCard key={r.city.slug} r={r} rank={i + 1} />
        ))}
      </div>

      <p className="font-mono text-xs text-muted-foreground italic max-w-3xl">
        Fit blends affordability, growth (population + GDP), career (your field),
        climate, safety, tax, and community, weighted by your class and perks,
        then adjusted for how hard the place is to enter on your passport.
        Locked zones are penalized but still shown: you can always grind the
        quest. Figures are approximate (Numbeo, IMF, World Bank, Henley Passport
        Index) and meant to start the search, not end it.
      </p>
    </div>
  );
}
