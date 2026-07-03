# CLAUDE.md

Guidance for Claude Code working in this repository.

## What this is

**portal.voyage** — "Where on Earth should you live?" A data-driven tool that helps a *person* decide where to live: cost of living, career, taxes, climate, safety, community, and — crucially — whether they can actually get a visa. The spiritual successor to Teleport and Nomad List.

Framing: **Earth is the open world; every city is a DLC.** Your passport decides what's unlocked.

## Origin (important context)

The engine was extracted from [interneta.world](https://github.com/adamtpang/interneta.world) (a sibling project about network states), where it lived as the "Atlas" tool. interneta is a *civic/federation* project; this where-to-live tool never fit its mission, so it was spun out into its own clean home here. We took **only** the where-to-live pieces — no Supabase, no constitution/citizens/societies code came along.

The interneta.world `/portal` route was a *founder* node-siting scorecard (12 variables, Forest City case study) built on `lib/data/portal-criteria.ts`. That is **not** ported here yet — this repo is personal-first. It's a candidate for a future `/found` or `/node` mode.

## Tech stack

- Next.js 15 (App Router, Turbopack), React 19, TypeScript, Tailwind v4
- Geist Sans + Geist Mono fonts
- **No database.** All data is static TypeScript in `lib/data/`. Adding a city = editing a file.

## Layout

| Path | Purpose |
|------|---------|
| `app/layout.tsx` | Shell: header, footer, Geist fonts, dark-mode-default theme script. |
| `app/page.tsx` | Homepage: hero + `<DecisionTool />` + the three axes + honesty note. |
| `app/globals.css` | Design tokens: `--pv-*` spectrum, soft + brutal shadows, shadcn neutral tokens. Dark default. |
| `lib/types.ts` | All domain + scoring types (City, Person, AdmiredPerson, UserInput, ScoredCity…). |
| `lib/policy.ts` | **THE single editable config** — every axis weight, threshold, and curve constant. |
| `lib/score.ts` | Pure scoring: `costScore`, `careerScore`, `peopleScore`, `scoreCity`, `rankCities`, constraints. |
| `lib/data.ts` | Typed loaders + indexes (`cityBySlug`, `peopleByCity`) over the JSON. |
| `data/cities.json` | 30 cities: `costIndex`, `sceneScore`, climate, languages, timezone, visa. Source of truth for places. |
| `data/careers.json` | Per-field scene-strength (0–100) per city. 10 fields. |
| `data/people.json` | Seeded notable people → city (all `verified:false`, never fabricated). User-extendable. |
| `components/decision-tool.tsx` | Client orchestrator: holds `UserInput`, live re-sort, detail + compare overlays. |
| `components/controls.tsx` | `WeightSliders` + `ControlsPanel` (budget / field / hard constraints). |
| `components/your-people.tsx` | The "your people" input: search the seed, add custom, admiration 1–5. |
| `components/{city-card,overlays,ui-bits}.tsx` | Card, detail + compare overlays, shared presentational bits. |

## The scoring model (lib/policy.ts + lib/score.ts)

`fit = normalized(wCost·cost + wCareer·career + wPeople·people)`, all axes 0–100. **People is the highest weight by default** — it's the differentiator.

1. **Cost** = `100·(budget/costIndex)/comfortRatio`, clamped. Break-even (budget == cost) ≈ 50.
2. **Career** = seeded per-field scene-strength (average across fields when field = "any").
3. **People** = `baselineWeight·sceneScore + (1−baselineWeight)·personalized`, where `personalized = 100·(1−e^(−Σ (admiration/5)·relevance / kPersonal))` — diminishing returns. Relevance = field-match 1.0 / cross-field 0.5 / "any" 0.8.
4. **Constraints** (visa / climate / language / timezone) are hard FILTERS: they mark a city `excluded` (sunk to the bottom, shown behind an expander), never silent penalties.

**Every knob lives in `lib/policy.ts`.** Change weights/curves there; `lib/score.ts` is pure and reads only from policy. `propagateQuality()` is a v2 PageRank stub.

Honesty is mandatory: every seeded person is `verified:false` and shown with an `unverified` badge; the "proximity isn't access" caveat appears on each city card with anchors, in the detail view, and in the homepage honesty note. Never fabricate people or locations.

**Local-only files** (gitignored, exist on disk but not in the repo): `import/` + `reference/` (staging exports from interneta.world — source for the future globe + founder tool), and the superseded v1 engine (`lib/data/*.ts`, `components/portal-tool.tsx`) which the `aether-guard` hook keeps on disk. Don't re-add them to git; delete the v1 files manually whenever.

## Brand voice

- **Concrete and a little playful.** Game framing (character build, class, perks, DLC, unlock) is the through-line — keep it.
- **Honest about the data.** It's curated and approximate; say so. "Start the search, not end it."
- **The decision is huge; the tool is calm.** No hype, no FOMO.

## Visual language

- Brutalist: heavy borders (`border-2 border-border`), brutal shadows (`shadow-brutal-sm/md`), monospace (`font-mono`) for all UI/headers.
- Section markers: `::: THE OPEN WORLD :::` — uppercase, letter-spaced, muted.
- The 7-color `--pv-*` spectrum is the signature accent (wordmark bar, card gradients, step numbers).
- **Dark mode is the default.** Light mode tokens exist but there's no toggle yet.

## Conventions

- Page metadata title format: `[Page] · portal.voyage`. Descriptions 150–160 chars.
- Data files are plain TS exports; no fetching. Keep them sorted by region with `// ── Region ──` comments.
- shadcn is configured (`components.json`, New York style) but no UI components are installed yet; add via `npx shadcn@latest add <name>` if needed.

## Roadmap / when the user asks

- "add a city" / "fix the data" → `data/cities.json` (+ a column in `data/careers.json`).
- "change the ranking / weights / curves" → `lib/policy.ts` (the one knob file).
- "add notable people" → `data/people.json` (keep `verified:false` unless truly confirmed).
- "the people / love angle" → BUILT (the Schelling engine). Next: wire pokedex.life so the user's S/A-tier people seed the admired set automatically — "the WHO reweights the WHERE." See [[aether-trinity]].
- "lat/lng globe" → cities have `lat`/`lng`; a cobe globe + "find me → nearest cities" is the staged next unlock (see `import/` from interneta.world).
- "the founder tool" → port `portal-criteria.ts` + `portal-scorecard.tsx` from `import/` (interneta.world's node-siting scorecard).
