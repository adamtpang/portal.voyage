// Typed loaders over the editable JSON in /data. The JSON is the source of
// truth; these just type it and build a couple of lookup indexes.

import citiesRaw from "@/data/cities.json";
import careersRaw from "@/data/careers.json";
import peopleRaw from "@/data/people.json";
import type { City, CareersData, Person } from "@/lib/types";

export const cities = citiesRaw as unknown as City[];
export const careers = careersRaw as unknown as CareersData;
export const people = peopleRaw as unknown as Person[];

export const cityBySlug: Record<string, City> = Object.fromEntries(
  cities.map((c) => [c.slug, c])
);

export const peopleByCity: Record<string, Person[]> = (() => {
  const m: Record<string, Person[]> = {};
  for (const p of people) (m[p.citySlug] ??= []).push(p);
  return m;
})();
