// ── THE POLICY FILE ──────────────────────────────────────────────────────
// The single place to tune the where-to-live model. Every weight, threshold,
// and curve constant lives here so the model is editable in ONE object.
// Pure scoring functions in lib/score.ts read from this; nothing else.

export const policy = {
  // Default axis weights. People is highest by default (the differentiator).
  // Normalized to sum to 1 at scoring time, so raw magnitudes are fine.
  defaultWeights: { cost: 0.25, career: 0.25, people: 0.5 },

  cost: {
    // budget / costIndex ratio that earns a perfect 100.
    // 2.0 => "budget covers 2x the city's cost" is a perfect score;
    // budget == cost lands at 100 / comfortRatio = 50 (you can afford it, no buffer).
    comfortRatio: 2.0,
  },

  career: {
    // when field === "any", score a city by the average of its field scores.
    anyFieldUsesAverage: true,
    // floor for cities/fields with no seeded score (treated as thin scene).
    missingFieldScore: 20,
  },

  people: {
    admirationMax: 5,
    // Personalized term: 100 * (1 - e^(-rawSum / kPersonal)).
    // rawSum = Σ (admiration/5) * relevance over your admired people in the city.
    // kPersonal=3 => one perfect anchor ≈ 28, three ≈ 63, saturating toward 100.
    kPersonal: 3,
    // peopleScore = baselineWeight*sceneScore + (1-baselineWeight)*personalized.
    // With no admired people entered, peopleScore == baselineWeight * sceneScore.
    baselineWeight: 0.35,
    // Relevance of an admired person to the user's selected field.
    relevanceFieldMatch: 1.0, // shares the user's field
    relevanceCrossField: 0.5, // admired but different field (still a real signal)
    relevanceNoFieldSelected: 0.8, // user picked "any" field
  },

  constraints: {
    // a place counts as "easy to enter" when visaOpenness >= this.
    visaEasyThreshold: 3,
    // default +/- hours when the user sets a timezone center.
    defaultUtcTolerance: 3,
  },

  ui: {
    // suggested length of a "visit, don't commit" sampling trip.
    samplingTripWeeks: "2-3 weeks",
  },
} as const;

export type Policy = typeof policy;
