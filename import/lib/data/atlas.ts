// Atlas matching engine. Given a user's passport, archetype, sector, and
// priorities, score every city for personal fit and compute the DLC-style
// "unlock" difficulty for their passport. Earth is the open world.

import type { City, Sector } from "@/lib/data/cities-livability";
import type { Passport } from "@/lib/data/passports";

export type Archetype =
  | "remote"
  | "founder"
  | "employee"
  | "investor"
  | "retiree";

export const ARCHETYPES: { key: Archetype; label: string; blurb: string }[] = [
  { key: "remote", label: "Remote worker", blurb: "Earn abroad, spend local. Cost, community, climate." },
  { key: "founder", label: "Founder", blurb: "Build a company. Growth, sector, tax, talent." },
  { key: "employee", label: "Employee", blurb: "Local job market. Career, safety, livability." },
  { key: "investor", label: "Investor", blurb: "Park capital, chase upside. Growth, tax, stability." },
  { key: "retiree", label: "Slow living", blurb: "Quality of days. Cost, safety, climate." },
];

export type Dim =
  | "affordability"
  | "growth"
  | "career"
  | "climate"
  | "safety"
  | "tax"
  | "community";

export const DIM_LABELS: Record<Dim, string> = {
  affordability: "Affordability",
  growth: "Growth",
  career: "Career",
  climate: "Climate",
  safety: "Safety",
  tax: "Low tax",
  community: "Community",
};

// Base weight per dimension by archetype.
const ARCHETYPE_WEIGHTS: Record<Archetype, Record<Dim, number>> = {
  remote: { affordability: 3, growth: 1, career: 2, climate: 2, safety: 2, tax: 2, community: 3 },
  founder: { affordability: 1, growth: 3, career: 3, climate: 1, safety: 1, tax: 3, community: 2 },
  employee: { affordability: 2, growth: 1, career: 3, climate: 2, safety: 2, tax: 1, community: 2 },
  investor: { affordability: 1, growth: 3, career: 2, climate: 1, safety: 2, tax: 3, community: 1 },
  retiree: { affordability: 3, growth: 0, career: 0, climate: 3, safety: 3, tax: 2, community: 1 },
};

// Normalize population + GDP growth into a 0-100 growth score.
export function growthScore(c: City): number {
  return Math.max(0, Math.min(100, Math.round(c.popGrowth * 10 + c.gdpGrowth * 7)));
}

function careerScore(c: City, sector: Sector | "any"): number {
  if (sector === "any") {
    const vals = Object.values(c.sectors);
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }
  return c.sectors[sector];
}

export function dimValue(c: City, dim: Dim, sector: Sector | "any"): number {
  switch (dim) {
    case "affordability": return c.affordability;
    case "growth": return growthScore(c);
    case "career": return careerScore(c, sector);
    case "climate": return c.climate;
    case "safety": return c.safety;
    case "tax": return c.tax;
    case "community": return c.community;
  }
}

export type VisaVerdict = {
  band: "Unlocked" | "Easy DLC" | "Grind" | "Locked";
  color: string;
  icon: string;
  note: string;
};

// DLC unlock difficulty for this passport at this city.
export function visaVerdict(c: City, p: Passport): VisaVerdict {
  const index = c.visaOpenness + (5 - p.tier) * 0.9;
  if (index >= 6.5)
    return { band: "Unlocked", color: "#16a34a", icon: "🔓", note: "Visa-free or a simple long-stay visa. Walk right in." };
  if (index >= 5)
    return { band: "Easy DLC", color: "#06b6d4", icon: "🎟️", note: "A nomad or skilled visa exists for you. Paperwork, not a wall." };
  if (index >= 3.5)
    return { band: "Grind", color: "#ea580c", icon: "⚔️", note: "Stayable with real effort: sponsorship, income proof, or an investment route." };
  return { band: "Locked", color: "#dc2626", icon: "🔒", note: "Hard to stay long on this passport. Possible, but it is a quest." };
}

const VISA_MULT: Record<VisaVerdict["band"], number> = {
  Unlocked: 1.0,
  "Easy DLC": 0.95,
  Grind: 0.8,
  Locked: 0.55,
};

export type AtlasInput = {
  passport: Passport;
  archetype: Archetype;
  sector: Sector | "any";
  priorities: Dim[]; // boosted dimensions
};

export type CityResult = {
  city: City;
  fit: number; // 0-100, visa-adjusted
  rawFit: number; // 0-100, pure preference fit
  verdict: VisaVerdict;
  topDims: { dim: Dim; value: number }[];
};

export function scoreCity(c: City, input: AtlasInput): CityResult {
  const base = ARCHETYPE_WEIGHTS[input.archetype];
  const dims: Dim[] = [
    "affordability", "growth", "career", "climate", "safety", "tax", "community",
  ];
  let weightSum = 0;
  let acc = 0;
  const contributions: { dim: Dim; value: number; weight: number }[] = [];
  for (const dim of dims) {
    const w = base[dim] + (input.priorities.includes(dim) ? 2 : 0);
    if (w <= 0) continue;
    const v = dimValue(c, dim, input.sector);
    acc += v * w;
    weightSum += w;
    contributions.push({ dim, value: v, weight: w });
  }
  const rawFit = weightSum > 0 ? acc / weightSum : 0;
  const verdict = visaVerdict(c, input.passport);
  const fit = Math.round(rawFit * VISA_MULT[verdict.band]);
  const topDims = contributions
    .sort((a, b) => b.value * b.weight - a.value * a.weight)
    .slice(0, 3)
    .map((x) => ({ dim: x.dim, value: x.value }));
  return { city: c, fit, rawFit: Math.round(rawFit), verdict, topDims };
}

export function fitBand(fit: number): { label: string; color: string } {
  if (fit >= 78) return { label: "YOUR ZONE", color: "#16a34a" };
  if (fit >= 64) return { label: "STRONG FIT", color: "#06b6d4" };
  if (fit >= 48) return { label: "PLAYABLE", color: "#eab308" };
  return { label: "OFF-META", color: "#94a3b8" };
}
