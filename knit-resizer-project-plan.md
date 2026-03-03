# F My Gauge — A Pattern Math Tool for Knitters

## The Problem

Knitters constantly run into situations where the math doesn't line up:

- **Their gauge doesn't match the pattern's gauge** — they love the fabric they're getting but it's a different density than the pattern assumes
- **They're between sizes** — their body measurements fall between the sizes a pattern offers
- **They want to substitute a different yarn weight** — they found the perfect DK yarn but the pattern calls for worsted
- **They need to calculate evenly spaced shaping** — increasing from 80 to 110 stitches over 40 rows without it looking uneven
- **Stitch pattern repeats complicate everything** — the adjusted stitch count needs to be a multiple of 8 for the cable pattern to work

Every one of these scenarios requires proportional math with constraints, and knitters either dread it, get it wrong, or abandon the project entirely. The existing tools (Gaugefy, basic gauge calculators) handle individual conversions but don't walk you through reworking an entire garment's numbers.

## The Opportunity

Build a **free, mobile-friendly web app** that acts as a "knitting math co-pilot." It doesn't replace pattern-reading apps (KnitCompanion, Row Counter) — it sits alongside them and handles the calculations those apps don't touch.

## Proposed Name: **F My Gauge**

(As in: shift your pattern to fit your gauge, your yarn, your body.)

---

## Core Features (MVP)

### 1. Gauge Translator
**Input:** Pattern gauge (e.g., 20 sts / 28 rows per 4") + Your gauge (e.g., 24 sts / 32 rows per 4")
**Output:** For any stitch count or measurement in the pattern, the adjusted number

Example: Pattern says cast on 180 sts for the body → at your gauge, you'd need 216 sts for the same width. Or alternatively, those 180 sts will only give you X inches instead of Y.

### 2. "What Size Should I Knit?" Calculator
When your gauge is off and you don't want to re-swatch, this tells you which pattern size to knit so the finished piece comes out closest to your target measurements.

**Input:** Your gauge, pattern gauge, your target bust measurement, available pattern sizes
**Output:** "Knit size L — at your gauge, it will measure 40.5" instead of the pattern's 44""

### 3. Evenly Spaced Shaping Calculator
The classic knitting math problem: "Increase 30 stitches evenly over 60 rows."

**Input:** Starting stitch count, ending stitch count, number of rows available
**Output:** A plain-English shaping schedule like: "Increase 1 st each side every 4th row 15 times" — with a note if the spacing doesn't divide evenly and how to handle the remainder.

### 4. Stitch Multiple Adjuster
When your calculated stitch count doesn't work with your stitch pattern repeat.

**Input:** Target stitch count, stitch pattern multiple (e.g., must be a multiple of 6 + 2)
**Output:** Nearest valid stitch counts above and below, with the width difference in inches

### 5. Yarn Quantity Estimator
When substituting yarn weights, estimate how much of the new yarn you'll need.

**Input:** Original yarn yardage, original gauge, your gauge
**Output:** Estimated yardage needed for the new yarn

### 6. Quick Reference
Built-in reference tables that knitters constantly look up:
- Needle size conversions (US / Metric / UK)
- Standard yarn weight categories with typical gauge ranges
- Standard body measurement charts by size
- Ease recommendations by garment type

---

## Stretch Features (Post-MVP)

- **Full garment re-grader**: Input all key measurements of a pattern (bust, waist, hip, armhole depth, sleeve length) and get a complete set of recalculated numbers
- **Save & revisit projects**: Store gauge profiles and project calculations
- **PDF pattern annotation**: Highlight a number in a PDF pattern and get the adjusted number overlaid
- **Swatch photo gauge measurement**: Use the phone camera to measure gauge from a swatch photo (using a reference object for scale)

---

## Technical Approach

### Stack
- **Frontend:** React (or Svelte) — single-page app, mobile-first responsive design
- **Hosting:** Static site on Vercel, Netlify, or GitHub Pages — no backend needed for MVP
- **Storage:** LocalStorage or IndexedDB for saving gauge profiles (no accounts needed)
- **PWA:** Make it installable as a Progressive Web App so knitters can use it offline and add it to their home screen

### Why a web app (not native)?
- Cross-platform from day one (iOS + Android + desktop)
- No app store approval process
- Easier to iterate quickly
- Knitters are used to web-based tools (Ravelry itself is a web app)

### Design Principles
- **Big, tappable inputs** — knitters are often using this with yarn in hand
- **Plain-English output** — not just numbers, but "Increase 1 st each side every 4th row, 12 times. Then every 6th row, 3 times."
- **Show your work** — display the formula so knitters can learn and verify
- **Minimal steps** — each calculator should be usable in under 30 seconds
- **Warm, crafty aesthetic** — not sterile/techy. Think soft colors, yarn-inspired palette
- **Visible offline status** — a persistent "Works offline" badge so knitters know the tool is available without internet (yarn shops, travel, poor signal)
- **Visible install prompt** — an "Add to Home Screen" button appears in the nav on Android/desktop when the browser supports it; iOS users see a persistent tip showing how to install via Safari's Share menu; both surfaces make it clear the app can live on their home screen like a native app

---

## Development Roadmap

### Phase 1: Foundation (Weeks 1–2)
- Set up project (React + Vite or Next.js static export)
- Build the Gauge Translator calculator
- Build the Evenly Spaced Shaping calculator
- Mobile-first responsive layout
- Deploy to Vercel/Netlify

### Phase 2: Core Calculators (Weeks 3–4)
- "What Size Should I Knit?" calculator
- Stitch Multiple Adjuster
- Yarn Quantity Estimator
- Quick Reference tables
- PWA setup (offline support, installable)

### Phase 3: Polish & Community (Weeks 5–6)
- User testing with real knitters (Ravelry forums, Reddit r/knitting)
- Refine wording and UX based on feedback
- Add "How this works" explanations for each calculator
- Accessibility pass (screen readers, high contrast)
- Share on knitting communities

### Phase 4: Stretch Goals (Ongoing)
- Saved gauge profiles
- Full garment re-grader
- Swatch photo measurement

---

## Competitive Landscape

| Tool | What It Does | What It Doesn't Do |
|------|-------------|-------------------|
| Gaugefy | Basic gauge calc, stores swatches | No shaping calc, no size recommendation |
| GaugeGuru | Stitch/row conversion | Single conversion only, no garment context |
| KnitCompanion | Pattern reading, row tracking | No gauge math or pattern resizing |
| StashBot | Yarn quantity by project type | No gauge-based yarn substitution calc |
| Stitch Fiddle | Chart design | No calculation tools |
| KnitEvenly | Even increase/decrease | Only does one thing, no broader context |

**F My Gauge's differentiator:** It's the only tool that bundles all of the pattern math a knitter needs in one place, with plain-English output and a mobile-first design. It doesn't try to be a pattern reader or social network — it just does the math really well.

---

## Validation Plan

Before building, consider posting in these communities to validate demand:
- **Reddit:** r/knitting, r/casualknitting
- **Ravelry:** forums like "Techniques" or "Pattern Help"
- **Instagram/TikTok:** knitting communities (#knittok)

Ask: *"When you need to adjust a pattern for a different gauge or size, what do you do? Would a free tool that handles all the math be useful?"*

---

## Summary

**What:** A free, mobile-friendly web app that handles all the math knitters face when adjusting patterns — gauge translation, size selection, shaping schedules, stitch multiples, and yarn substitution.

**Why:** This is the most universally frustrating part of knitting that existing tools don't solve well. The math is well-defined (making it very buildable), but knitters dread doing it by hand.

**How:** React PWA, static hosting, no backend needed. Ship an MVP in 2–4 weeks.

**For whom:** Every knitter who has ever stared at a pattern and thought "but what if my gauge is different?"
