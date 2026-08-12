# MASTERPLAN — portal.voyage

The platonic ideal. Changes rarely — if it drifts, that's a real conversation,
not a routine update.

## 🎯 The thesis

When it's perfect, portal.voyage is the one tool a person opens before the
biggest location decision of their life — type your build (passport, field,
budget, who you admire) and get an honest, re-rankable map of the whole
world, backed by a founding license people actually pay for.

## ⚙️ The mechanism

1. User inputs: monthly budget, field/sector, admired people (with 1–5
   admiration), a weight slider per axis, and hard constraints (visa
   ease, climate, language, timezone).
2. Every city is scored 0–100 on three axes: **Cost** (budget vs. city cost
   index, comfort-ratio clamped), **Career** (seeded per-field scene
   strength), **People/Schelling** (baseline scene score blended with a
   diminishing-returns function of who you admire and where they cluster).
3. The three axes blend by the user's own weights — People is highest by
   default — into one `fit` score, all pure and computed client-side from
   `lib/policy.ts` + `lib/score.ts`.
4. Hard constraints are **filters, never penalties**: a failing city sinks
   to a collapsed "filtered" bucket, always visible on request, never
   hidden or silently down-ranked.
5. Everything re-ranks live as sliders move — no backend, no database, all
   data static TypeScript/JSON in `lib/data/` and `data/`.
6. A 3D globe (Three.js) visualizes the ranked world; "Find me" geolocates
   the user and highlights the nearest city against the same ranking.
7. The full tool is free to use end-to-end; a **$49 one-time founding
   license** (live Stripe payment link) is the monetization unlock.

## 💰 The model

**Who pays:** remote workers, founders, and anyone facing a real
passport/career/budget location tradeoff — people who want a personally
weighted answer, not another "best cities" listicle.

**Price:** $49 one-time founding license via a live Stripe payment link on
the homepage. Risk-reversed by design: the full 30-city ranking tool is
already free to use — $49 locks in founding pricing, it isn't a paywall.

No unresolved pricing tension in the docs today. The real gap is
conversion, not price: **zero verified stranger sales logged as of
2026-08-09** (`EVIDENCE.md`) — the checkout works, nobody's bought yet.

## 🧭 The discipline

- **One knob file.** Every weight, threshold, and curve constant lives in
  `lib/policy.ts`. `lib/score.ts` stays pure and reads only from policy —
  never hardcode a tunable elsewhere.
- **Honesty is non-negotiable.** Every seeded person is `verified:false`
  and shown with an unverified badge. "Proximity isn't access" appears on
  every city card, the detail view, and the homepage. Never fabricate a
  person or a location, ever.
- **Constraints filter, they don't punish.** Visa/climate/language/timezone
  failures sink and expose — never a silent score penalty.
- **No database, ever.** All data is static TypeScript/JSON. Adding a city
  means editing a file, not standing up infrastructure.
- **Sovereign, not shared.** portal.voyage (WHERE) shares an idea-level
  kinship with pokedex.life (WHO) and optimism.fun (WHAT) — rank entities
  by weighted fit — but zero shared code exists between them
  (`ECOSYSTEM.md`). Don't go looking for, or try to force, a shared
  ranking engine across the three.

## 🚫 Not

- Not a travel-booking or itinerary app — no flights, hotels, logistics.
- Not an immigration lawyer or visa filer — flags feasibility, doesn't
  file paperwork.
- Not a real-estate or job-listing marketplace.
- Not a live-updating dataset — city data is curated, static, hand-
  refreshed, and the site says so.

## 📍 Where things stand (2026-08-09)

- Core loop, 30-city dataset with real Unsplash photos, the pokedex.life
  import + live-fetch pathway, the Three.js globe, "Find me" geolocation,
  and the $49 Stripe checkout are all live in production.
- Progress ladder (`NORTH_STAR.md`): **4/6** — payable and tracked, but
  not yet instrumented with named funnel events, and no verified stranger
  sale.
- The one gap between here and the next rung: put the already-working $49
  link in front of real buyers.

## 📡 Reality check

This session's work (globe canvas-sizing fix, "Find me" feature) is real
mechanism polish and serves the thesis directly. But the thesis's actual
bottleneck right now is distribution, not more product surface — stage 5
on the ladder ("a verified stranger sale") hasn't moved. Worth naming so
the next session doesn't keep improving the tool instead of putting the
link in front of people.

---

Next natural handoff: `/cofounder` to find and act on the one constraint
(distribution, per the ladder) — or `/north-star` to re-quantify progress
once that's moved.
