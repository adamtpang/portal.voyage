// Small geo helpers. Used to match an imported person's coordinates to the
// nearest city already in our dataset — real haversine math, no guessing.

import { cities } from "@/lib/data";
import type { City } from "@/lib/types";

const EARTH_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function haversineKm(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number
): number {
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.min(1, Math.sqrt(s)));
}

// Beyond this radius, don't force-assign a city — that would fabricate
// precision we don't have (e.g. someone in rural Wyoming isn't "in Denver").
const MAX_MATCH_KM = 300;

export function nearestCity(
  lat: number,
  lng: number
): { city: City; distanceKm: number } | null {
  let best: { city: City; distanceKm: number } | null = null;
  for (const c of cities) {
    const d = haversineKm(lat, lng, c.lat, c.lng);
    if (!best || d < best.distanceKm) best = { city: c, distanceKm: d };
  }
  if (best && best.distanceKm <= MAX_MATCH_KM) return best;
  return null;
}

// Fallback when we only have free text like "Bangkok, Thailand" and no
// coordinates: match against our own city/country names. Conservative —
// only exact-ish substring hits, never a fuzzy guess.
export function matchCityByText(text: string): City | null {
  const needle = text.toLowerCase();
  return (
    cities.find(
      (c) =>
        needle.includes(c.city.toLowerCase()) ||
        needle.includes(c.country.toLowerCase())
    ) ?? null
  );
}
