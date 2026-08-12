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

**Correction (2026-08-12):** the 2026-08-08 "verified live" note above was a false positive — it only checked for HTTP 200, and Stripe returns 200 on the "This link is no longer active" page too. A real browser check found the link genuinely dead: both the underlying Stripe Product (`prod_Us03e25MmtBPm6`) and its Price (`price_1TsG2xFL7C10dNyGuq1tcOIQ`) had been archived, which also blocks the Payment Link itself from being marked active. Fixed by reactivating all three (product → price → link) via the Stripe API, then re-verified with a real browser render of the checkout page (email, card fields, "portal.voyage founding lifetime license," $49.00, Pay button — not an error page). Stage 4 is genuinely true now; it was accidentally true-on-paper, false-in-reality between 2026-08-08 and 2026-08-12. Lesson: an HTTP status check is not proof of a working checkout — always render the actual page.

## Next milestone
Get the first verified stranger sale through the now-genuinely-working $49 Stripe link and log it in EVIDENCE.md — the checkout is real and confirmed rendering as of 2026-08-12, so the only thing standing between here and stage 5 is putting the link in front of real buyers.
