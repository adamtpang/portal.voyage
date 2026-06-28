# portal.voyage — context export

> Where on Earth should you live? Earth is an open-world game; every city is a DLC.

The full context for **portal.voyage**, the "where to live" project split out of [interneta.world](https://interneta.world). The frameworks, data models, references, and a raw source snapshot (`import/`) are all here.

---

## 0. Current state (read this first)

portal.voyage is **already scaffolded and the personal tool is ported.** What exists:
- Next.js 15 + React 19 + Tailwind v4 app (`package.json` = `portal-voyage`).
- **`components/portal-tool.tsx`** — the personal "where should I live" tool (this is what interneta called *Atlas*; here it is simply **Portal**, the project's namesake).
- **`lib/data/cities.ts`** (the 36-city dataset), **`lib/data/match.ts`** (the matching engine), **`lib/data/passports.ts`** (37 passports).
- **`app/page.tsx`** — the homepage rendering `<PortalTool />`.
- Palette CSS vars are **`--pv-*`** (cyan, magenta, gold, green, red, indigo, orange).

**Naming note to avoid confusion:** in *interneta*, "Atlas" = the personal tool and "Portal" = a separate founder node-siting tool. In *portal.voyage*, "Portal" = the personal tool. The founder node-siting tool is **additive** (see §3) and, if you bring it in, give it a distinct name like *Node* or *Plant*.

`import/` is a **raw snapshot of the interneta source** (interneta-named, `--iw-*` vars) kept for reference. Some of it is already ported; some is additive. The map is in §3.

---

## 1. The trinity

Three sites, one game, three lenses:

| Site | Lens | What it is |
|------|------|-----------|
| **pokedex.life** | **WHO** | The humans you surround yourself with, tier-ranked S–F. Sign in with X. |
| **optimism.fun** | **WHAT** | Humanity's requests for startups. Problems worth solving. |
| **portal.voyage** | **WHERE** | Where on Earth you should live. This project. |
| interneta.world | (federation) | Stays the founder + society directory: the `/imagined` catalog of who would found which network state, its theme, its location. |

portal.voyage owns the **where**. interneta keeps the **founder/society directory**.

---

## 2. The tool

**Portal** (the personal where-to-live engine). Earth is an open-world game, cities are DLCs. Build a character (passport, class, field, perks); the map re-ranks. Each city shows a personal **fit %** and a DLC-style **visa unlock** for the player's passport.

- Input: passport · class (remote / founder / employee / investor / slow-living) · field (sector) · up to 3 boosted perks.
- Output: 36 cities ranked by visa-adjusted fit, each with its three strongest dimensions and an unlock verdict.
- Files (already in place): `components/portal-tool.tsx`, `lib/data/{cities,match,passports}.ts`, `app/page.tsx`.

---

## 3. `import/` map — already-ported vs additive

`import/` mirrors the interneta App-Router layout. Status of each piece:

### Already ported (ignore these in `import/`)
| import/ file | lives in portal.voyage as |
|---|---|
| `lib/data/cities-livability.ts` | `lib/data/cities.ts` ✓ |
| `lib/data/passports.ts` | `lib/data/passports.ts` ✓ |
| `lib/data/atlas.ts` | `lib/data/match.ts` ✓ |
| `components/atlas-tool.tsx` | `components/portal-tool.tsx` ✓ |
| `app/atlas/page.tsx` | `app/page.tsx` ✓ |

### Additive — not yet in portal.voyage (pull these in if you want them)
| import/ file | what it adds | to wire in |
|---|---|---|
| `lib/data/nation-stats.ts` | 41 nations with the census triad (population, GDP, area) + formatters. Lets Portal compare cities against nations. | Drop into `lib/data/`. No CSS-var deps. |
| `lib/data/world-capitals.ts` | 90 capital lat/lngs. | For a globe. |
| `lib/data/network-state-locations.ts` | Network-state coords (archipelago). | Optional; interneta-flavored. |
| `components/interneta-globe.tsx` | cobe WebGL globe wrapper. | `npm i cobe`; rename → `world-globe.tsx`; swap `--iw-*` → `--pv-*` if any. |
| `app/globe/page.tsx` + `app/globe/globe-client.tsx` | The Earth globe with **Find-Me geolocation + nearest-places** logic. The Find-Me UX is the prize. | Repoint markers from `network-state-locations` to cities (after adding lat/lng — §7 #1); drop the "Archipelago" toggle. |
| `lib/data/portal-criteria.ts` + `components/portal-scorecard.tsx` + `app/portal/page.tsx` | The **founder node-siting tool** (12 criteria + Forest City reverse-engineering). interneta calls this "Portal." | Optional. If you keep it, rename it (e.g. `Node`) so it doesn't collide with portal.voyage's "Portal." May instead belong in interneta. |

**Conversion when porting any additive file:** rename data imports (`cities-livability` → `cities`, `atlas` → `match`) and swap palette vars `--iw-*` → `--pv-*`.

---

## 4. Data models

### `City` (lib/data/cities.ts)
```ts
type Sector = "tech" | "crypto" | "finance" | "creative" | "bio" | "trades";
type City = {
  slug, city, country, flag, region;
  affordability: number;  // 0-100, higher = better value on a remote income
  popGrowth: number;      // %/yr
  gdpGrowth: number;      // %/yr
  climate, safety, tax, community: number;  // 0-100 (tax = favorable to an earner)
  visaOpenness: 1|2|3|4;
  sectors: Record<Sector, number>;  // 0-100 opportunity strength
  residencyNote: string;
  paletteIndex: number;
};
```
36 cities. **Missing: `lat`/`lng`** (§7 #1).

### `Passport` (lib/data/passports.ts)
`{ code, name, flag; tier: 1|2|3|4; visaFree }`. Tier 1 = strongest (180+), Tier 4 = restricted (<70). 37 passports.

### Matching (lib/data/match.ts)
- `scoreCity(city, { passport, archetype, sector, priorities })` → `{ fit, rawFit, verdict, topDims }`.
- **Fit** = weighted average of 7 dims (affordability, growth, career, climate, safety, tax, community), weighted by archetype + (+2 per perk), then × a visa factor.
- **Visa verdict** = `visaOpenness + (5 - tier) * 0.9`, banded ≥6.5 Unlocked 🔓 / ≥5 Easy DLC 🎟️ / ≥3.5 Grind ⚔️ / else Locked 🔒 (factors 1.0 / 0.95 / 0.8 / 0.55).
- `growthScore` = `clamp(popGrowth*10 + gdpGrowth*7, 0, 100)`.

### `NationStat` (import/lib/data/nation-stats.ts)
`{ name, flag, region; population /*M*/, gdp /*$B*/, area /*km²*/, gdpRank; mirrorSlug?; paletteIndex }`.

### Founder node criteria (import/lib/data/portal-criteria.ts)
12 weighted criteria in 5 categories. `scoreCity(scores)` → 0-100; `verdictFor(pct)` → PLANT HERE / STRONG CANDIDATE / WORKABLE / KEEP LOOKING. Includes the Forest City case study.

---

## 5. The frameworks (the IP)

**The variables that decide where to live** — Atlas/Portal scores on seven plus visa: affordability, growth (pop + GDP), career (your sector), climate, safety, tax, community, and the **visa reality** for *your* passport.

**The DLC / open-world framing** — the world is the base game, cities are DLCs. Your passport sets which are Unlocked (visa-free), Easy DLC (nomad/skilled visa), a Grind (sponsorship/investment), or Locked (a real quest). Locked zones are penalized in ranking but never hidden.

**Census KPIs — how to measure a place** — from Balaji's *The Network State*: population, income (GDP), and real-estate footprint (square meters). The same three a nation reports, made continuous. Cities and nations compare on the same axes.

**Node-siting + what Balaji optimized for at Forest City** — 12 criteria (visa, SEZ/charter, govt openness, cost, distressed/available real estate, proximity to capital, existing community, language, safety, climate, time-zone, pre-built infra). Forest City scored ~90: a $100B largely-empty megaproject (vacant high-quality canvas = the ultimate land-last play), 30 min from Singapore (proximity to capital), Singapore-adjacent lifestyle at Malaysian prices (arbitrage), friendly visa, English, pre-built towers + fiber. **Lesson: buy the empty, finished, cheap canvas next to the expensive hub.**

**When to launch a second node** — don't gate on a headcount (a vanity metric). Gate on three signals: a documented repeatable playbook, a node-2 leader who graduated from node 1, and concrete pull from a specific geography. Launch when all three are true. Make node 2 deliberately different (continent, visa, climate) to test portability.

---

## 6. Tools to study (verified live, June 2026)

**Personal-fit matchers** — [Nomads.com](https://nomads.com) (the master class; map: [nomadlist.com/map](https://nomadlist.com/map)) · [The Earth Awaits](https://www.theearthawaits.com) (budget → cities) · Teleport Zen (*defunct*; the slider→city gold standard, study via [Wayback](https://web.archive.org/web/2019*/teleport.org)).
**Cost depth** — [Numbeo](https://www.numbeo.com) · [Expatistan](https://www.expatistan.com).
**Passport & visa** — [Passport Index](https://www.passportindex.org) · [Henley Passport Index](https://www.henleyglobal.com/passport-index) (the tiers in `passports.ts`) · [VisaList](https://visalist.io).
**Relocator mindset** — [Nomad Capitalist](https://nomadcapitalist.com).

If you open three: Nomads.com (browse), The Earth Awaits (match), Passport Index (visa reality).

---

## 7. First enhancements

1. **Add `lat`/`lng` to every city** in `cities.ts` — unlocks a real city globe + "find me → nearest cities." Coords already exist in `import/lib/data/world-capitals.ts` and `network-state-locations.ts`; reuse them. **The #1 unlock.**
2. **Real photos on city tiles** — add an `imageUrl` field; drop in city photography for full nomadlist realism.
3. **Live cost data** — wire Numbeo / Nomads.com so `affordability` auto-updates.
4. **Shareable results** — encode the build (passport + class + field + perks) in the URL.
5. **pokedex.life integration ("where's my party")** — pull S/A-tier humans from pokedex.life, geocode their X location, pin them on the globe, and reweight the `community` dimension by where *your* people actually are. The *who* reweights the *where*. Data path: a `pokedex.life/api/people?tier=S` endpoint, a paste-handles importer, or shared X OAuth.
6. **Two-city compare** (Numbeo-style) + a **"center of gravity"** calc (the city minimizing distance to your top humans).

---

## 8. Conventions + rebrand notes

- Palette vars are **`--pv-*`**: cyan `#06b6d4`, magenta `#d946ef`, gold `#eab308`, green `#16a34a`, red `#dc2626`, indigo `#4f46e5`, orange `#ea580c`. (interneta used `--iw-*` — convert when porting additive files.)
- Data file names: `cities.ts`, `match.ts`, `passports.ts` (not the interneta `cities-livability` / `atlas`).
- Brutalist visual language carries over (heavy borders, brutal shadows, mono headers). `reference/design-system.md` documents the palette, typography, and voice.
- `import/` can be deleted once you've pulled what you want — it's a reference snapshot, not part of the build.

---

## 9. Run it

```bash
cd portal.voyage
npm install
npm run dev      # → http://localhost:3000  (Portal personal tool)

# to add the globe later:
npm i cobe
# then port import/components/interneta-globe.tsx + import/app/globe/* (see §3)
```

---

*Exported from interneta.world. The relocation tool lives here now; interneta keeps the founder + society directory. The interneta original of every file is in `import/`.*
