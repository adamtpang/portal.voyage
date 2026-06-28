// Core domain + scoring types for portal.voyage's where-to-live model.
// The model is a weighted blend of three axes — cost, career, people — all
// normalized to 0-100. People (Schelling) quality is the differentiator.

export type Field =
  | "AI"
  | "Crypto"
  | "Design"
  | "Finance"
  | "Biotech"
  | "Climate"
  | "Media" // film / writing / creative
  | "Gaming"
  | "Hardware"
  | "Startups"; // general / founders

export const FIELDS: Field[] = [
  "AI", "Crypto", "Design", "Finance", "Biotech",
  "Climate", "Media", "Gaming", "Hardware", "Startups",
];

export type ClimateTag =
  | "tropical"
  | "warm"
  | "mild"
  | "temperate"
  | "cold"
  | "arid";

export type City = {
  slug: string;
  city: string;
  country: string;
  flag: string;
  region: string;
  lat: number;
  lng: number;
  costIndex: number; // est. comfortable monthly solo cost, USD (approximate)
  sceneScore: number; // 0-100 ambient scene/network quality, independent of your people
  climateTags: ClimateTag[];
  primaryLanguages: string[];
  englishWorkable: boolean;
  utcOffset: number; // standard hours from UTC
  timezone: string; // IANA
  visaOpenness: 1 | 2 | 3 | 4; // 4 = very open / easy long-stay
  blurb: string;
};

export type CareersData = {
  fields: Field[];
  // citySlug -> field -> 0-100 scene-strength for that field
  scores: Record<string, Partial<Record<Field, number>>>;
};

// A seeded notable person and the city whose scene they anchor.
export type Person = {
  id: string;
  name: string;
  role: string;
  fields: Field[];
  citySlug: string;
  why: string; // what scene they anchor — NOT a claim of access
  verified: boolean; // is the location independently verified?
  sourceNote: string; // provenance / "last known, verify"
};

// A person the user admires (their own input, possibly from the seed).
export type AdmiredPerson = {
  id: string;
  name: string;
  admiration: 1 | 2 | 3 | 4 | 5;
  why: string;
  citySlug?: string;
  fields: Field[];
  verified: boolean;
};

export type Constraints = {
  visaEasyOnly: boolean; // only places easy to enter / stay long
  climate: ClimateTag[]; // desired climates (empty = any)
  requireEnglishWorkable: boolean;
  languages: string[]; // languages the user speaks (empty = any)
  utcCenter: number | null; // desired UTC offset center (null = any)
  utcToleranceHours: number; // +/- hours allowed around the center
};

export type Weights = { cost: number; career: number; people: number };

export type UserInput = {
  budget: number; // monthly USD
  field: Field | "any";
  admired: AdmiredPerson[];
  weights: Weights; // raw slider values; normalized at scoring time
  constraints: Constraints;
};

export type AxisBreakdown = {
  cost: number; // 0-100
  career: number; // 0-100
  people: number; // 0-100
};

export type PeopleAnchor = {
  person: AdmiredPerson;
  relevance: number; // 0-1 match to the user's field/goals
  contribution: number; // admiration(0-1) * relevance, pre-diminishing-returns
};

export type ScoredCity = {
  city: City;
  fit: number; // 0-100 (visa-adjusted? no — constraints are filters, not penalties)
  axes: AxisBreakdown;
  anchors: PeopleAnchor[]; // your admired people who live here (sorted desc)
  ambientNotables: Person[]; // seeded notables who anchor this scene (for display)
  why: string; // one-line generated rationale
  constraintFails: string[]; // human-readable hard constraints this city fails
  excluded: boolean; // fails >= 1 active hard constraint
};
