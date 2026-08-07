// Import pathway for pokedex.life exports.
//
// pokedex.life has no live API today (its DB is dormant, its scan pipeline
// has never been run at scale — see its own CLAUDE.md), so there is nothing
// to fetch live from. This module is the other half of "the WHO reweights
// the WHERE": a converter + parser that turns a pasted pokedex.life export
// into portal.voyage's AdmiredPerson[], ready the moment a real export
// exists. It is built against pokedex.life's actual Specimen schema
// (lib/types/pokedex.ts in that repo), not a guess.
//
// Deliberately conservative:
// - admiration is derived only from Level/Tier (a real pipeline output),
//   never fabricated when absent (falls back to a flagged neutral 3).
// - a city is only assigned when lat/lng resolve within 300km of one of
//   our cities, or the location text names one directly — see lib/geo.ts.
// - imported people always carry `fields: []` (pokedex.life's
//   builder/signaler/critic/fan/trader/reactor taxonomy is not a career
//   field and isn't force-mapped onto one) and `verified: false`.

import type { AdmiredPerson } from "@/lib/types";
import { nearestCity, matchCityByText } from "@/lib/geo";

// A loose, defensive shape: every field but `handle` is optional so this
// tolerates a partial or future export without throwing.
export type PokedexSpecimenLike = {
  handle: string;
  displayName?: string | null;
  level?: number | null;
  tier?: "rookie" | "trained" | "competitive" | "master" | "legendary" | null;
  locationNormalized?: string | null;
  locationLat?: number | null;
  locationLng?: number | null;
};

// Mirrors pokedex.life's TIER_BANDS (lib/types/pokedex.ts:270-276) exactly —
// bands are NOT evenly-sized (rookie is 1-19, the rest are 20-wide), so we
// replicate their boundaries rather than approximate with a /20 formula.
const TIER_ADMIRATION: Record<NonNullable<PokedexSpecimenLike["tier"]>, 1 | 2 | 3 | 4 | 5> = {
  rookie: 1,
  trained: 2,
  competitive: 3,
  master: 4,
  legendary: 5,
};

const LEVEL_BANDS: { min: number; max: number; tier: NonNullable<PokedexSpecimenLike["tier"]> }[] = [
  { min: 1, max: 19, tier: "rookie" },
  { min: 20, max: 39, tier: "trained" },
  { min: 40, max: 59, tier: "competitive" },
  { min: 60, max: 79, tier: "master" },
  { min: 80, max: 100, tier: "legendary" },
];

function admirationFor(s: PokedexSpecimenLike): { value: 1 | 2 | 3 | 4 | 5; source: string } {
  if (typeof s.level === "number") {
    const clamped = Math.max(1, Math.min(100, s.level));
    const band = LEVEL_BANDS.find((b) => clamped >= b.min && clamped <= b.max)!;
    return { value: TIER_ADMIRATION[band.tier], source: `Level ${s.level} (${band.tier})` };
  }
  if (s.tier && TIER_ADMIRATION[s.tier]) {
    return { value: TIER_ADMIRATION[s.tier], source: s.tier };
  }
  return { value: 3, source: "no Level/Tier in export — neutral default" };
}

function resolveCity(s: PokedexSpecimenLike): { slug?: string; note: string } {
  if (typeof s.locationLat === "number" && typeof s.locationLng === "number") {
    const m = nearestCity(s.locationLat, s.locationLng);
    if (m) return { slug: m.city.slug, note: `${m.city.city} (${Math.round(m.distanceKm)}km)` };
  }
  if (s.locationNormalized) {
    const m = matchCityByText(s.locationNormalized);
    if (m) return { slug: m.slug, note: `${m.city} (matched "${s.locationNormalized}")` };
  }
  return { note: s.locationNormalized ? `no nearby city for "${s.locationNormalized}"` : "no location in export" };
}

function toArray(parsed: unknown): unknown[] {
  if (Array.isArray(parsed)) return parsed;
  if (parsed && typeof parsed === "object") {
    const obj = parsed as Record<string, unknown>;
    if (Array.isArray(obj.specimens)) return obj.specimens;
    if (Array.isArray(obj.people)) return obj.people;
  }
  return [];
}

export type ImportResult = {
  people: AdmiredPerson[];
  notes: { handle: string; note: string }[]; // one line per person, for the UI summary
  parseError: string | null;
};

export function parsePokedexExport(raw: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { people: [], notes: [], parseError: "That's not valid JSON — paste a pokedex.life export as-is." };
  }

  const entries = toArray(parsed);
  if (entries.length === 0) {
    return {
      people: [],
      notes: [],
      parseError: "No entries found. Expected an array, or { specimens: [...] } / { people: [...] }.",
    };
  }

  const people: AdmiredPerson[] = [];
  const notes: { handle: string; note: string }[] = [];

  for (const raw of entries) {
    if (!raw || typeof raw !== "object" || typeof (raw as { handle?: unknown }).handle !== "string") {
      notes.push({ handle: "?", note: "skipped — missing handle" });
      continue;
    }
    const s = raw as PokedexSpecimenLike;
    const { value: admiration, source } = admirationFor(s);
    const { slug: citySlug, note: cityNote } = resolveCity(s);

    people.push({
      id: `pokedex-${s.handle}`,
      name: s.displayName || s.handle,
      admiration,
      why: `Imported from pokedex.life · ${source}`,
      citySlug,
      fields: [],
      verified: false,
    });
    notes.push({ handle: s.handle, note: `admiration ${admiration} (${source}) · ${cityNote}` });
  }

  return { people, notes, parseError: null };
}
