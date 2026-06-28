// Pure scoring functions for the where-to-live model. No I/O, no React.
// fit = normalized(wCost*cost + wCareer*career + wPeople*people), all axes 0-100.
// All tunables come from lib/policy.ts. Constraints are hard FILTERS (they mark
// a city excluded), never silent penalties.

import { policy } from "@/lib/policy";
import { cities, careers, peopleByCity } from "@/lib/data";
import type {
  City,
  Field,
  UserInput,
  ScoredCity,
  AxisBreakdown,
  AdmiredPerson,
  PeopleAnchor,
  Constraints,
  Weights,
} from "@/lib/types";

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

// ── Cost (runway) ──────────────────────────────────────────────────────────
// Higher budget relative to the city's cost = higher score. budget == cost
// lands at 100/comfortRatio (=50 by default): affordable, but no buffer.
export function costScore(city: City, budget: number): number {
  if (budget <= 0 || city.costIndex <= 0) return 0;
  return clamp((100 * (budget / city.costIndex)) / policy.cost.comfortRatio);
}

// ── Career upside ──────────────────────────────────────────────────────────
export function careerScore(city: City, field: Field | "any"): number {
  const row = careers.scores[city.slug] ?? {};
  if (field === "any") {
    const vals = careers.fields.map((f) => row[f] ?? policy.career.missingFieldScore);
    return clamp(vals.reduce((a, b) => a + b, 0) / vals.length);
  }
  return clamp(row[field] ?? policy.career.missingFieldScore);
}

// ── People / Schelling ─────────────────────────────────────────────────────
function relevance(person: AdmiredPerson, field: Field | "any"): number {
  if (field === "any") return policy.people.relevanceNoFieldSelected;
  return person.fields.includes(field)
    ? policy.people.relevanceFieldMatch
    : policy.people.relevanceCrossField;
}

// peopleScore = baselineWeight*ambient(sceneScore) + (1-baselineWeight)*personalized.
// personalized = 100*(1 - e^(-Σ (admiration/5)*relevance / kPersonal)) — diminishing returns.
export function peopleScore(
  city: City,
  admired: AdmiredPerson[],
  field: Field | "any"
): { score: number; anchors: PeopleAnchor[] } {
  const anchors: PeopleAnchor[] = [];
  let rawSum = 0;
  for (const p of admired) {
    if (p.citySlug !== city.slug) continue;
    const rel = relevance(p, field);
    const contribution = (p.admiration / policy.people.admirationMax) * rel;
    rawSum += contribution;
    anchors.push({ person: p, relevance: rel, contribution });
  }
  anchors.sort((a, b) => b.contribution - a.contribution);
  const personalized = 100 * (1 - Math.exp(-rawSum / policy.people.kPersonal));
  const ambient = clamp(city.sceneScore);
  const score = clamp(
    policy.people.baselineWeight * ambient +
      (1 - policy.people.baselineWeight) * personalized
  );
  return { score, anchors };
}

// v2 hook: seed a PageRank from the user's admired set and let a place inherit
// quality from the quality of people who cluster there. Not implemented in v1.
export function propagateQuality(): Record<string, number> {
  return {};
}

// ── Composition ────────────────────────────────────────────────────────────
export function normalizeWeights(w: Weights): Weights {
  const sum = w.cost + w.career + w.people;
  if (sum <= 0) return { cost: 1 / 3, career: 1 / 3, people: 1 / 3 };
  return { cost: w.cost / sum, career: w.career / sum, people: w.people / sum };
}

export function constraintFails(city: City, c: Constraints): string[] {
  const fails: string[] = [];
  if (c.visaEasyOnly && city.visaOpenness < policy.constraints.visaEasyThreshold)
    fails.push("Hard to enter / stay long on a typical passport");
  if (c.requireEnglishWorkable && !city.englishWorkable)
    fails.push("Not easily English-workable");
  if (c.climate.length && !c.climate.some((t) => city.climateTags.includes(t)))
    fails.push("Climate doesn't match your picks");
  if (c.languages.length) {
    const speaksHere =
      c.languages.some((l) => city.primaryLanguages.includes(l)) ||
      (c.languages.includes("English") && city.englishWorkable);
    if (!speaksHere) fails.push("No shared working language");
  }
  if (c.utcCenter !== null) {
    const diff = Math.abs(city.utcOffset - c.utcCenter);
    if (diff > c.utcToleranceHours)
      fails.push(`Timezone >${c.utcToleranceHours}h from your target`);
  }
  return fails;
}

function buildWhy(
  axes: AxisBreakdown,
  anchors: PeopleAnchor[],
  input: UserInput
): string {
  if (anchors.length) {
    const names = anchors.slice(0, 2).map((a) => a.person.name).join(" & ");
    const extra = anchors.length > 2 ? ` +${anchors.length - 2} more` : "";
    return `Your people: ${names}${extra} anchor the scene here.`;
  }
  const entries: [string, number][] = [
    ["affordable runway", axes.cost],
    ["career upside", axes.career],
    ["scene quality", axes.people],
  ];
  const top = entries.slice().sort((a, b) => b[1] - a[1])[0];
  const fieldTag =
    input.field !== "any" && top[0] === "career upside" ? ` for ${input.field}` : "";
  return `Strong ${top[0]}${fieldTag} (${top[1]}/100).`;
}

export function scoreCity(city: City, input: UserInput): ScoredCity {
  const { score: peep, anchors } = peopleScore(city, input.admired, input.field);
  const axes: AxisBreakdown = {
    cost: Math.round(costScore(city, input.budget)),
    career: Math.round(careerScore(city, input.field)),
    people: Math.round(peep),
  };
  const w = normalizeWeights(input.weights);
  const fit = Math.round(w.cost * axes.cost + w.career * axes.career + w.people * axes.people);
  const fails = constraintFails(city, input.constraints);
  return {
    city,
    fit,
    axes,
    anchors,
    ambientNotables: peopleByCity[city.slug] ?? [],
    why: buildWhy(axes, anchors, input),
    constraintFails: fails,
    excluded: fails.length > 0,
  };
}

// Excluded cities (failing a hard constraint) sink to the bottom but are kept
// for transparency — the UI shows them behind a "filtered" expander.
export function rankCities(input: UserInput): ScoredCity[] {
  return cities
    .map((c) => scoreCity(c, input))
    .sort((a, b) => {
      if (a.excluded !== b.excluded) return a.excluded ? 1 : -1;
      return b.fit - a.fit;
    });
}
