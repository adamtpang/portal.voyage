# North star — the platonic ideal version of portal.voyage

One sentence: when it's perfect, portal.voyage is the one tool a person opens before the biggest location decision of their life — type your build (passport, field, budget, who you admire) and get an honest, re-rankable map of the whole world, backed by a founding license people actually pay for.

## The offer
- Who it's for: people choosing where to live next — remote workers, founders, and anyone facing a passport/career/budget tradeoff — who want data instead of vibes-driven blog posts.
- What they get: a live, interactive ranking of 30 cities across three weighted axes (cost of living, career upside, people/Schelling-point), personalized to their own inputs and re-sorting as they move the sliders, unlocked permanently by the founding license.
- What it costs: $49 one-time founding license, sold through a live Stripe payment link on the homepage.

## What this is NOT (scope guard)
- Not a travel-booking or itinerary app — no flights, hotels, or logistics
- Not an immigration lawyer or visa filing service — it flags feasibility, it doesn't file paperwork
- Not a real-estate or job-listing marketplace
- Not a live-updating dataset — city data is curated and static, refreshed by hand, and the site says so

## Progress ladder (fact-based, not vibes)
- [x] 0. Core loop works — the actual product function runs end to end for a real user
- [x] 1. Discoverable — sitemap, robots, meta description
- [x] 2. Tracked — analytics wired in code AND confirmed live
- [ ] 3. Instrumented — named funnel events beyond raw pageviews
- [x] 4. Payable — real automated checkout, not mailto or invoice-only
- [ ] 5. Converted — at least one verified stranger sale

**Progress: 4/6 (67%)**

Verification notes (2026-08-08): stage 0 confirmed — the decision tool is static client-side data, no backend dependency, nothing to break. Stage 4 corrects the earlier audit: `app/page.tsx` has a live "Founding license · $49" button linking to `https://buy.stripe.com/8x25kD93454xeUM6KtaMU0z`, which returns HTTP 200 and is a real Stripe Payment Link — this is automated checkout, not invoice/mailto. `OFFER.md` is stale (still says "Price: TBD") and should be updated to match the live page. Stage 5 stays unchecked: `EVIDENCE.md` has no logged sale.

## Next milestone
Get the first verified stranger sale through the already-working $49 Stripe link and log it in EVIDENCE.md — the checkout is built, so the only thing standing between here and stage 5 is putting the link in front of real buyers.
