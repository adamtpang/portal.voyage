# Interneta Design System

> Optimistic. Civic. Plural. The visual language of a federation that brings together every internet city-state.

---

## 1. The Federation Palette (7 Colors)

Olympic rings symbolize the bringing together of nations. Interneta uses seven colors that bring together the archetypes of internet city-states. Every member state is invited to claim one (or invent another).

| # | Color | Hex | CSS var | Archetype | Examples |
|---|-------|------|---------|-----------|----------|
| I | Cyan | `#06b6d4` | `--iw-cyan` | The Network (cloud, connection) | Bitcoin City, Solarpunk |
| II | Magenta | `#d946ef` | `--iw-magenta` | The Culture (art, identity) | Afropolitan, Cabin |
| III | Gold | `#eab308` | `--iw-gold` | The Treasury (money, BTC, capital) | Próspera, Bitcoin maximalists |
| IV | Green | `#16a34a` | `--iw-green` | The Frontier (growth, new land) | Cabin, Praxis, Telosa |
| V | Red | `#dc2626` | `--iw-red` | The Action (community, mobilization) | Network School, popups |
| VI | Indigo | `#4f46e5` | `--iw-indigo` | The Sovereignty (governance, law) | technodemocracy, ZuConnect |
| VII | Orange | `#ea580c` | `--iw-orange` | The Founder (energy, startup heat) | Edge Esmeralda, Vitalia |

### Usage

- **Wordmark.** The `INTERNETA` wordmark cycles through the palette letter by letter. The cycle repeats on the eighth letter (T). It is the brand's primary expression of plurality.
- **Footer band.** A row of 7 colored bars at the top of the footer. Always present. Always all seven.
- **Page accents.** Each top-level page may adopt one accent color drawn from the palette. Never use more than two on a single page.
- **Member-state colors.** Every member state of Interneta is assigned (or claims) one palette color as its own.

---

## 2. Typography

- **Primary face: `font-mono`** (Geist Mono). Hero, headings, nav, CTAs, section markers, anything brand-bearing. Mono signals "civic document," "code," "constitution."
- **Body face: `font-sans`** (Geist Sans). Long-form prose only. Used inside articles when readability beats brand.
- **Weights: 400, 700.** No light, no italic except for citations.
- **Tracking.** Headings: tight (`tracking-tight` to `-0.02em`). Section markers: wide (`tracking-[0.3em]`). Body: default.

### Type scale

| Token | Use |
|-------|-----|
| `text-xs` (12px) | section markers, footer copy |
| `text-sm` (14px) | nav, captions, footnotes |
| `text-base` (16px) | body |
| `text-lg / xl` | subheads |
| `text-2xl / 3xl` | article titles |
| `text-4xl / 5xl` | section heads |
| `text-6xl–8xl` | hero |

---

## 3. Section Markers

The civic-document pattern. Always uppercase, letter-spaced, muted.

```
::: PREAMBLE :::
::: ENLIST :::
::: CITIZEN REGISTRY :::
::: PHYSICAL ↔ DIGITAL :::
::: NATIONAL ANTHEM :::
::: DRAFT v0 ::: COMMIT 0x000001 :::
```

Pattern: `::: WORDS :::` with three colons, three spaces, words, three spaces, three colons. Render with `tracking-[0.3em] text-muted-foreground text-xs`.

---

## 4. Article Numbering

Roman numerals only. I, II, III, IV, V, VI, VII for the original Constitution. VIII through XIV for the Network State Provisions. I through X for the Bill of Rights (Amendments).

Roman numerals because: (a) they evoke 1789, (b) they survive translation, (c) they read well at large sizes.

---

## 5. Borders, Shadows, Components

Brutalist baseline. Inherited from the nsnodes fork. Keep:

- **Border.** Always `border-2 border-border`. Never thin, never dashed.
- **Shadow.** Three sizes: `shadow-brutal-sm`, `shadow-brutal-md`, `shadow-brutal-lg`. CSS-var driven. Always solid offset, no blur.
- **Hover.** Buttons translate `+2px / +2px` and lose their shadow. Conveys press. Never use ring or glow.
- **Radius.** `rounded-md` or none. Never `rounded-full` except for the wordmark dots.

### Component patterns

- **CTA tile.** Border, brutal-md shadow, mono bold label, label on the left, kbd-style indicator on the right.
- **Article card.** Left border (`border-l-4`) instead of full border, used for long lists of articles.
- **Stat card.** Border-2 + brutal-sm shadow + tabular-nums + section marker label.
- **Section divider.** Full-width `border-b-2`. No fancy dividers.

---

## 6. Color Modes

- **Dark mode is default.** It signals "console," "deep web," "after hours." Most citizens of the internet read at night.
- **Light mode is supported and beautiful.** Toggle in the nav. The federation palette is identical across modes.

---

## 7. Voice & Tone

- **Optimistic.** We are the optimists. Not edgy, not doomer, not nostalgic.
- **Civic.** Constitution, citizen, federation, archipelago, member state. Never "user," never "member" (without "state"). Citizens.
- **Concrete.** "3 million people in 1789," not "vague vibes about freedom." Numbers, dates, names.
- **Reverent of America without being nostalgic.** America was the world's greatest startup. Interneta is the sequel. A successor substrate, not a replacement.
- **No em dashes.** Use periods, commas, colons, parentheses, or center dots (`·`). Em dashes feel hurried; civic documents are not hurried.
- **Plural by design.** Interneta itself has no One Commandment. Member states do. The federation hosts, never adjudicates.

### Words we use
federation, citizen, member state, archipelago, census, ratification, charter, recognition, frontier, founder, treasury, civic, polity, signature

### Words we avoid
user, customer, client, member (without "state"), platform, ecosystem, decentralized (without specifics), web3 (as adjective), revolutionary, disruptive

---

## 8. Wordmark

The `INTERNETA` wordmark is the brand's primary expression. Each letter cycles through the federation palette:

```
I  N  T  E  R  N  E  T  A
1  2  3  4  5  6  7  1  2
cy mg gd gn rd in or cy mg
```

Component: `<LogoImage size="sm | md | lg" />`. Available in three sizes. Always mono, always bold, tight tracking.

---

## 9. Visual Motifs

- **Seven colored bars.** A horizontal stripe of 7 palette colors. Used at the top of the footer, optionally at the top of every page.
- **Roman numeral plus title.** Article cards always lead with `I.`, `II.`, etc., set in muted color, large.
- **Tabular numbers.** All numeric content uses `tabular-nums` so columns align.
- **Center dots.** `·` separates inline metadata. Substitute for the forbidden em dash.

---

## 10. What we never do

- Em dashes
- Stock photography
- Gradients (except subtle in palette demos)
- Drop shadows (only brutal offset shadows)
- Decorative borders, scrollbars, or animations
- Glassmorphism, frosted glass, or skeumorphic effects
- Comic Sans, even ironically
