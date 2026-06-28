# portal.voyage

> Where on Earth should you live? A data-driven map for the biggest decision nobody helps you make with data.

Portal is the successor to what [Teleport](https://en.wikipedia.org/wiki/Teleport_Inc.) and [Nomad List](https://nomadlist.com) did: it helps a person find the place on the planet where they should actually live, to do their best work, afford a good life, and find their people. You set your build (passport, field, what you value); the map re-ranks every city for *you*.

**Earth is the open world. Every city is a DLC** — some unlocked for your passport the moment you arrive, others you grind a visa for.

## What it does

Pick four things:

- **Passport** — sets which places are realistically open to you (Henley-style mobility tiers).
- **Field** — tech, crypto, finance, creative, bio, trades — sets your career score per city.
- **Class** — remote worker, founder, employee, investor, slow-living — sets the base weighting.
- **Perks** — boost up to 3 of: affordability, growth, career, climate, safety, tax, community.

Every city is scored 0–100 on personal fit, then adjusted by a **visa verdict** (Unlocked / Easy DLC / Grind / Locked) computed from your passport. Results render as a ranked grid of city cards.

## Origin

The matching engine was first built inside [interneta.world](https://interneta.world) as its "Atlas" tool, then extracted here into a clean, standalone home. Data is curated/approximate, sourced from Numbeo (cost of living), IMF/World Bank (growth), and the Henley Passport Index (mobility). It is meant to *start* the search, not end it.

## Stack

Next.js 15 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 · Geist fonts. No database — all data is static TypeScript in `lib/data/`.

## Architecture

```
app/
  layout.tsx        — shell: header, footer, fonts, dark-mode default
  page.tsx          — homepage: hero + the Portal tool + how-it-works
  globals.css       — design tokens (--pv-* spectrum, brutalist shadows)
components/
  portal-tool.tsx   — the interactive tool (client component)
lib/
  utils.ts          — cn() helper
  data/
    cities.ts       — City[] livability + opportunity data (the source of truth)
    passports.ts    — Passport[] mobility tiers
    match.ts        — the scoring engine (scoreCity, visaVerdict, fitBand)
```

To add or correct a city, edit `lib/data/cities.ts`. To change how fit is computed, edit `lib/data/match.ts`.

## Run it

```bash
npm install
npm run dev     # → http://localhost:3000
npm run build
npm run lint
```

## Roadmap

- **v0 (here):** the personal where-to-live tool. ✅
- **Next:** per-city detail pages (`/city/[slug]`); region/filter controls; shareable result URLs.
- **The differentiator:** the *people* axis Nomad List never nailed — who's there, community fit, finding your people (and your person).
- **Later:** real data pipelines (live cost-of-living + visa APIs), more cities, accounts/saved searches.

## License

Code: MIT. Data: curated, approximate, use at your own risk.
