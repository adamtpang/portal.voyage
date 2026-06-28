// Portal: the node site-selection framework. Cloud first, land last; the
// Portal is the doorway where a startup society chooses where to materialize.
// Criteria for scoring a candidate location, plus a reverse-engineering of
// what Balaji optimized for when he chose Forest City for Network School.

export type Category =
  | "Access & Law"
  | "Economics"
  | "Community"
  | "Livability"
  | "Strategic";

export type Criterion = {
  key: string;
  name: string;
  category: Category;
  weight: 2 | 3; // importance multiplier
  why: string;
};

export const CRITERIA: Criterion[] = [
  // Access & Law
  {
    key: "visa",
    name: "Visa & long-stay path",
    category: "Access & Law",
    weight: 3,
    why: "Citizens must be able to enter and stay. A long-stay or digital-nomad visa is the difference between a community and a vacation. Georgia's 365-day visa-free entry is the gold standard; a 30-day tourist stamp is a non-starter.",
  },
  {
    key: "sez",
    name: "SEZ or charter framework",
    category: "Access & Law",
    weight: 3,
    why: "A pre-existing special economic zone, charter-city law, or free-zone regime saves years of legal groundwork. Próspera's ZEDE, RAK DAO, e-Residency. Build on a scaffold, do not pour your own foundation.",
  },
  {
    key: "govt",
    name: "Government openness",
    category: "Access & Law",
    weight: 3,
    why: "A government that is curious about you is worth more than a low tax rate. Hostility kills nodes faster than cost. You want a state that treats a network-state node as an asset, not a threat.",
  },
  // Economics
  {
    key: "cost",
    name: "Cost of living",
    category: "Economics",
    weight: 3,
    why: "Can a citizen live well on a remote-work income? Geographic arbitrage (earn in dollars, spend in pesos) is the engine of early growth. The node should feel like a raise.",
  },
  {
    key: "realestate",
    name: "Distressed / available real estate",
    category: "Economics",
    weight: 3,
    why: "Cloud first, land last means you want land that is cheap, available, and ideally already built. Vacant high-quality inventory is the dream: you imprint a culture onto an empty canvas instead of competing for scarce space.",
  },
  {
    key: "proximity",
    name: "Proximity to capital",
    category: "Economics",
    weight: 3,
    why: "Closeness to a hub of financial capital and human capital. A node an hour from a global city (talent, flights, banking) compounds faster than one in the middle of nowhere. Proximity, not residence: near the hub, cheaper than the hub.",
  },
  // Community
  {
    key: "community",
    name: "Existing aligned community",
    category: "Community",
    weight: 3,
    why: "Does the reverse-diaspora already gather here? A node grows fastest where aligned people already flow. You want to channel an existing current, not dig a new river.",
  },
  {
    key: "language",
    name: "Working language",
    category: "Community",
    weight: 2,
    why: "Can citizens live and operate in the network's working language (usually English)? Friction here taxes every interaction, every lease, every hospital visit.",
  },
  // Livability
  {
    key: "safety",
    name: "Safety",
    category: "Livability",
    weight: 3,
    why: "People bring families. A node has to be somewhere a citizen will raise a kid. Safety is table stakes; one incident can empty a community.",
  },
  {
    key: "climate",
    name: "Climate & livability",
    category: "Livability",
    weight: 2,
    why: "Weather, air, healthcare, walkability. The ambient quality of a day. People stay where the days are good and leave where they are not.",
  },
  // Strategic
  {
    key: "timezone",
    name: "Time-zone fit",
    category: "Strategic",
    weight: 2,
    why: "Can citizens work with the networks that matter (usually California and London)? A node eight hours off its economic center forces a nocturnal life and quietly bleeds members.",
  },
  {
    key: "infra",
    name: "Pre-built infrastructure",
    category: "Strategic",
    weight: 2,
    why: "Towers, fiber, power, water, an airport. Materializing into existing infrastructure is land-last on easy mode. Building it yourself is a decade-long detour.",
  },
];

export const MAX_SCORE = CRITERIA.reduce((a, c) => a + c.weight * 5, 0);

export type Verdict = {
  band: string;
  color: string;
  note: string;
};

export function verdictFor(pct: number): Verdict {
  if (pct >= 80)
    return {
      band: "PLANT HERE",
      color: "#16a34a",
      note: "A founding-node-grade location. The scaffolds, the people, and the economics align. Move.",
    };
  if (pct >= 65)
    return {
      band: "STRONG CANDIDATE",
      color: "#eab308",
      note: "A serious contender. Shortlist it, visit it, pressure-test the one or two weak axes before committing.",
    };
  if (pct >= 45)
    return {
      band: "WORKABLE WITH EFFORT",
      color: "#ea580c",
      note: "Possible, but you will be spending energy compensating for what the place lacks. Better as a second node than a first.",
    };
  return {
    band: "KEEP LOOKING",
    color: "#dc2626",
    note: "Too much friction for a founding node. The thesis is hard enough without fighting the location too.",
  };
}

// Reverse-engineering of what Balaji optimized for at Forest City, Malaysia,
// for Network School. Scores are an interpretation, 0-5 per criterion.
export type CityScore = {
  city: string;
  flag: string;
  note: string;
  scores: Record<string, number>;
};

export const CITY_SCORES: CityScore[] = [
  {
    city: "Forest City",
    flag: "🇲🇾",
    note: "Network School's node. The reference case.",
    scores: {
      visa: 4, sez: 4, govt: 4, cost: 5, realestate: 5, proximity: 5,
      community: 4, language: 4, safety: 5, climate: 4, timezone: 3, infra: 5,
    },
  },
  {
    city: "Roatán",
    flag: "🇭🇳",
    note: "Próspera & Vitalia. The charter-city frontier.",
    scores: {
      visa: 4, sez: 5, govt: 3, cost: 4, realestate: 3, proximity: 2,
      community: 4, language: 4, safety: 3, climate: 5, timezone: 4, infra: 2,
    },
  },
  {
    city: "Dubai / RAK",
    flag: "🇦🇪",
    note: "RAK DAO, DIFC, ADGM. Builder-friendly free zones.",
    scores: {
      visa: 5, sez: 5, govt: 5, cost: 2, realestate: 2, proximity: 4,
      community: 4, language: 5, safety: 5, climate: 2, timezone: 3, infra: 5,
    },
  },
  {
    city: "Lisbon",
    flag: "🇵🇹",
    note: "Europe's remote-work capital.",
    scores: {
      visa: 4, sez: 2, govt: 3, cost: 3, realestate: 2, proximity: 4,
      community: 4, language: 4, safety: 5, climate: 5, timezone: 4, infra: 4,
    },
  },
  {
    city: "Chiang Mai",
    flag: "🇹🇭",
    note: "The original nomad hub.",
    scores: {
      visa: 3, sez: 2, govt: 3, cost: 5, realestate: 4, proximity: 3,
      community: 5, language: 3, safety: 4, climate: 4, timezone: 3, infra: 4,
    },
  },
  {
    city: "Tbilisi",
    flag: "🇬🇪",
    note: "365-day visa-free, free industrial zones.",
    scores: {
      visa: 5, sez: 3, govt: 4, cost: 5, realestate: 4, proximity: 2,
      community: 3, language: 3, safety: 4, climate: 3, timezone: 3, infra: 3,
    },
  },
];

export function scoreCity(scores: Record<string, number>): number {
  const total = CRITERIA.reduce(
    (a, c) => a + (scores[c.key] ?? 0) * c.weight,
    0
  );
  return Math.round((total / MAX_SCORE) * 100);
}
