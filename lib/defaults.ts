import type { UserInput, Constraints, AdmiredPerson, Person } from "@/lib/types";
import { policy } from "@/lib/policy";

export const emptyConstraints: Constraints = {
  visaEasyOnly: false,
  climate: [],
  requireEnglishWorkable: false,
  languages: [],
  utcCenter: null,
  utcToleranceHours: policy.constraints.defaultUtcTolerance,
};

export const defaultInput: UserInput = {
  budget: 3000,
  field: "any",
  admired: [],
  weights: { ...policy.defaultWeights },
  constraints: { ...emptyConstraints },
};

export function personToAdmired(
  p: Person,
  admiration: 1 | 2 | 3 | 4 | 5 = 4
): AdmiredPerson {
  return {
    id: p.id,
    name: p.name,
    admiration,
    why: p.why,
    citySlug: p.citySlug,
    fields: p.fields,
    verified: p.verified,
  };
}

// Common languages offered as constraint chips.
export const COMMON_LANGUAGES = [
  "English", "Spanish", "Portuguese", "French", "German",
  "Mandarin", "Japanese", "Korean", "Arabic",
];

export const CLIMATE_OPTIONS = [
  "tropical", "warm", "mild", "temperate", "cold", "arid",
] as const;
