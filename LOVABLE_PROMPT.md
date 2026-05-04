# Lovable prompt — Peel Car Sales 2.0 (front-end redesign)

> **Paste the section below into [lovable.dev](https://lovable.dev) verbatim.**
> The backend is already wired in this repo (Supabase + Stripe + Plaid +
> embeds + admin). Lovable's job is to make the front-end gorgeous —
> see `FRONTEND_BRIEF.md` for what NOT to touch.

---

## THE PROMPT (copy from here ↓)

You are designing **Peel Car Sales 2.0**, the new website for a real
family-run used-car dealership in the Greater Toronto Area. The current
site is at peelcarsales.com (WordPress, slow, dated). The new site
launches at **peelcarsales.ca** and needs to feel as polished as Carvana,
as confident as Tesla, and as warm as a corner shop your dad sends you to.

### What this dealership actually is

- **150 vehicles in inventory** across two physical lots:
  - **Mississauga** — 2701 Derry Rd East, Mississauga, ON L4T 1A2
  - **Oakville** — 333 Wyecroft Rd, Unit 11, Oakville, ON L6K 2H2
  - One phone for both: **905-678-0048**
  - Hours: Mon–Fri 9 AM – 8 PM · Sat 9 AM – 6 PM · Sun 11 AM – 5 PM
- **OMVIC + UCDA licensed.** AutoTrader Best Priced Dealer **2024 + 2025**.
  CarGurus Top Rated 3 years running. **450+ five-star Google reviews.**
- **Family-run.** Customers buy from named reps — Inder, Mehran, Gurpreet
  (everyone calls him Gurri), and Sami Haq.
- **Customer base** skews South Asian / Punjabi / new-Canadian. Reps
  speak English, Punjabi, Hindi, and Urdu.
- **Financing for every credit situation:** good credit, bad credit, no
  credit, work permit, student permit, newcomer to Canada, bankruptcy,
  consumer proposal. 20+ Canadian lender network.
- **Buyer protection in writing:** 150-point inspection · free Carfax on
  every car · 7-day exchange policy · 30-day / 1500 km warranty ·
  $1,000 reconditioning standard.

### Visual direction — "Premium, but neighbourhood"

Aesthetic references:
- **Carvana** — vehicle photography centered, breathing room, big prices
- **Tesla.com** — confidence, dark/light contrast, no clutter
- **Apple.com** — every section is one idea, executed perfectly
- **AutoTrader.ca** — familiar to GTA buyers, but cleaner
- **Toyota Canada** — automotive trust signals done well

Avoid: stock-photo dealership clichés, "starting from $X*" sleaze,
checkered-flag racing trash, busy gradients, glass morphism for the sake
of it, shimmering CTAs, anything that looks like a 2014 Wix template.

### Design system

**Colors (HSL, kept in `src/app/globals.css` as CSS variables — keep this format):**

```
--primary:       350 78% 42%   /* Crimson — CTAs, key actions */
--secondary:     215 60% 11%   /* Deep navy — header, premium surfaces */
--accent:         38 92% 50%   /* Amber — badges, "Best Priced" callouts, awards */
--background:      0  0% 100%
--foreground:    222 47% 11%
--muted:         220 14% 96%
--border:        220 13% 91%
--ring:          350 78% 42%
--radius:        0.625rem
```

**Typography:**
- **Display:** Manrope (700/800 weight) for headlines, vehicle titles
- **Body:** Inter (400/500/600) for everything else
- Both via `next/font/google`. Keep `--font-sans: Inter` and
  `--font-display: Manrope` exposed as CSS variables.
- Headlines: tight tracking (`-0.02em`), large size jumps (4xl → 6xl on
  hero), text-balance on h1/h2.

**Layout:**
- Container max-width 1400px (Tailwind `container.screens.2xl: 1400px`).
- Generous vertical rhythm — `py-20` between sections, never `py-8`.
- Cards use `rounded-xl` (12px) for primary cards, `rounded-md` (6px)
  for buttons.
- Subtle shadows only — `shadow-sm` default, `shadow-lg` for hero cards.
  No drop-shadow disasters.

### The pages — every one needs to feel intentional

#### `/` — Home (the most important page)

Sections from top to bottom, each visually distinct:

1. **Sticky header** — utility bar (hours · WhatsApp · phone) above main
   nav (logo · Inventory · Financing · Sell or Trade · Why Peel · About ·
   Contact) and right-side **Browse inventory** + **Call 905-678-0048**
   CTAs. On mobile: horizontal-scroll nav. Header is **navy**, white text,
   crimson CTA button stands out.

2. **Hero** (split 50/50 desktop, stacked mobile):
   - Left: small amber pill — "AUTOTRADER BEST PRICED DEALER 2024 + 2025"
   - Headline: "The right car. **The right price.** No surprises."
     Crimson on the middle phrase. Tight tracking, 5xl–6xl.
   - Subhead: "150 vehicles across Mississauga & Oakville. Free Carfax,
     150-point inspection, 7-day exchange, financing for every credit
     situation — including newcomers, work permit, student, bad credit,
     or no credit."
   - Two CTAs: **Browse 150 vehicles** (crimson) · **Get pre-qualified
     in 60s** (outline).
   - 3-stat row: "3 days avg to delivery · 20+ lender network · 450+
     5-star reviews"
   - Right: a **pre-qualification card** — soft-glass on navy, amber
     "60-second" badge, headline "Find out what you can afford",
     placeholder for the AutoVerify SDK widget (don't reimplement —
     use `<AutoVerifyWidget placement="home" />`), bullet list with
     amber checkmarks ("Good credit, bad credit, no credit · Newcomers,
     work permit, student permit · Bankruptcy & consumer proposal").

3. **Featured grid** — eyebrow "JUST ON THE LOT" · h2 "Featured vehicles"
   · 4-column grid (responsive 1/2/3/4) of 8 vehicle cards using
   `<VehicleCard vehicle={...} />`. Each card: photo with badges in
   top-left ("Carfax Clean", "Best Priced", "Just Arrived" — colored
   variants), discount callout in top-right, title (year + make +
   model), trim subtitle, mileage · body · drivetrain · location row,
   then footer with big price + "from $X bi-weekly" estimate. Hover:
   subtle lift (translate-y-0.5) + shadow.

4. **Why Peel** — eyebrow, h2 "Family-run. OMVIC + UCDA licensed.
   Honest pricing — every time." 4-card grid: 150-point inspection,
   free Carfax, 7-day exchange, 30-day warranty. Each card has a
   primary-tinted icon in a rounded square, title, body. Light muted
   background to differentiate from hero.

5. **Trade-in band** — split: left has eyebrow "TRADE IN OR SELL
   OUTRIGHT" + h2 "Real Carfax-backed valuation in 60 seconds." +
   3 amber-dot bullets + dual CTAs ("Get my Carfax valuation" +
   "Or call 905-678-0048"). Right has the embedded
   `<CarfaxTrueTrade variant="banner" />` widget in a rounded card with
   amber gradient halo behind it.

6. **Intent lanes** — 5-card grid of financing situations: Bad credit,
   No credit, Work permit, Student permit, Newcomer. Each card hover:
   border-primary, slight lift, shows a "Get pre-qualified →" link.

7. **Reviews** — navy section, eyebrow "450+ FIVE-STAR REVIEWS" in
   amber, h2 "Customers come back. So do their families." 4-card grid
   of sample reviews on subtle white-on-navy. Each card: amber star
   row, italic quote, author + city + "Worked with [rep name]".

8. **Crimson CTA strip** — full-width primary background, h2 "Ready
   when you are. Two locations across the GTA.", short paragraph, dual
   CTAs (white outline buttons against crimson).

9. **Footer** — navy. 4-column grid (12-col desktop):
   - Brand col (4): logo, tagline, OMVIC/UCDA/AutoTrader pill row.
   - Locations col (4): both addresses with Maps deep-links, big phone,
     hours.
   - Explore col (2): quick links.
   - Financing col (2): all 5 intent landing links.
   - Bottom: copyright + Privacy/Terms/Accessibility.

10. **Floating WhatsApp button** — bottom-right, green (#25D366), with
    WhatsApp glyph + "Chat with us" label. Stays above 1.5x the
    AutoRaptor chatbot when both load.

#### `/inventory` — Listing

- Page header on muted background: eyebrow + h1 (changes with filter:
  "All inventory" or "SUV inventory"), result count, Carfax/inspection
  trust line.
- Two-column body (260px filter rail + content):
  - **Filter rail** (sticky on desktop): search box (placeholder for
    Algolia, currently disabled with "Live search lands in Phase 1"
    note), body-type chips (clickable — these set `?body=` and work
    today), price/make/mileage/year/drivetrain (visual placeholders).
  - **Content:** sort bar (Featured / Newest / Price ↑ / Price ↓ /
    Mileage ↑ — these set `?sort=`), then 3-column responsive grid of
    `<VehicleCard>`. Empty state with crimson phone link.

#### `/inventory/[slug]` — VDP (vehicle detail)

The single most important commerce page on the site. Layout:

- **Breadcrumb** strip on muted background.
- **Two-column** (1fr + 360px desktop):
  - **Left column:**
    1. Header — badge row, h1 (year + make + model + trim), spec line
       (mileage · body · drivetrain · color · stock # · location).
    2. **Photo gallery** — 1 large hero (16:10) + 3 thumbnails in a
       4-column grid that becomes a 4-up grid below md, all rounded-xl.
       Use `<VehicleGallery baseSeed={photoSeed} alt={...} />`.
    3. Mobile-only price strip (lg:hidden) with price + bi-weekly
       estimate + Call/Pre-qualify buttons.
    4. "Vehicle highlights" section — short paragraph from
       `vehicle.description`.
    5. "Specs" section — 2-column dl with year/make/model/trim/body/
       drivetrain/transmission/fuel/mileage/exterior/interior/stock #/
       VIN/location, separator under each row.
    6. "Features & options" section — 2-column ul with primary
       checkmarks.
    7. **TrueTrade embed band** — primary-tinted card asking "Trade
       your current car?" with `<CarfaxTrueTrade variant="banner"
       vin={vehicle.vin} />` mounted inline.
  - **Right column (sticky, hidden on mobile):**
    1. **Price card** — huge price ($24,995), strikethrough was-price +
       "Save $X" callout if discounted, "Plus HST & licensing" small.
       "Estimated payment" sub-card on muted background — bi-weekly +
       monthly + "84mo @ 7.99% APR · sample rate".
    2. CTA stack: "Get pre-qualified in 60s" (primary), "Call 905-678-0048"
       (secondary), `<HoldCarButton vehicleId={...} vehicleLabel={...} />`
       (this is your $500 deposit modal — restyle the trigger button,
       not the modal contents).
    3. Buyer-protection list — 4 amber checkmarks with Carfax / 150-pt
       / 7-day / 30-day reminders.
    4. **Pre-qualify card** below the price card — navy, amber eyebrow
       "SOFT CREDIT CHECK", h3, short paragraph, embedded
       `<AutoVerifyWidget placement="vdp" />` and a primary CTA to
       /financing/apply.
- **Similar vehicles** — bottom strip on muted background, 4-card grid.

#### `/financing` — Financing landing

- Navy hero: amber eyebrow "FINANCING FOR EVERY CREDIT SITUATION", huge
  h1 with crimson emphasis on "No impact" — "Pre-qualify in 60 seconds.
  No impact on your credit score." Subhead explains the 20+ lender
  network. Dual CTAs: "Start pre-qualification" → /financing/apply,
  "Payment calculator" outline.
- 4-step process strip on muted background — numbered crimson circles
  with title + body.
- "Tell us about you" wizard preview — uses `<FinancingWizard />`
  component. Restyle the surrounding chrome only; do not touch the
  multi-step form internals (SIN handling, PIPEDA consent, encrypted
  submit).
- 5 intent lanes (same as home).
- Trust-signal section: 4-item list explaining PIPEDA, encrypted SIN
  (pgsodium envelope), soft credit, audit-logged access. Plain English.

#### `/financing/calculator` — Payment calculator

- Navy hero: "Payment calculator", subhead.
- Two-column body: left card with sliders (vehicle price, down payment,
  term 24–96 months, APR 3–29.95%), right navy card with **live**
  bi-weekly + monthly + total interest + total cost. Already wired —
  use `<Calculator />`, restyle visually.
- Below: primary-tinted card linking to /financing for the real rate.

#### `/financing/apply` — The wizard

- Use `<FinancingWizard />` from `src/components/finance/financing-wizard.tsx`
  unchanged. **The wizard handles SIN, DOB, income — these are
  legally regulated. Don't reimplement.** You can restyle the wrapper
  page only.

#### `/sell-trade` — Trade-in

- Navy hero with split layout. Left: amber eyebrow "SELL OR TRADE ·
  POWERED BY CARFAX TRUETRADE", h1 with crimson emphasis "Real value
  for your car. **In under 60 seconds.**", subhead. Right: white card
  with `<CarfaxTrueTrade variant="iframe" />` embedded for the full
  TrueTrade form.
- "How it works" 4-step strip (numbered crimson circles).
- Why-sell-to-us split: bullet list (left) + sample valuation card (right
  — navy, amber eyebrow, sample VIN, dollar range, wholesale/trade/retail
  breakdown).

#### `/services` — Why Peel

- Navy hero: eyebrow "WHY BUY FROM PEEL", h1 "Buyer protection, in
  writing.", subhead.
- 6 protection cards in a 3-column grid: 150-pt inspection, free Carfax,
  $1k recon standard, 7-day exchange, 30-day warranty, OMVIC + UCDA.
- Inspection breakdown — left column: eyebrow + h2 + paragraph; right:
  2-col grid of 12 inspection categories (rounded muted chips).
- Warranty extension card — full-width navy card with extension copy +
  "Talk to our finance team" CTA.

#### `/about`, `/staff`, `/contact`, `/directions`, `/referral`

Each gets its own polished hero + content. See existing pages for the
copy — restyle them to match the new design system.

- **`/staff`** is special: 4-card grid of named team members (Inder,
  Mehran, Gurri, Sami). Each card needs an aspect-4/5 photo at the top
  (Picsum-seeded for now), then name + role + location, languages line,
  short bio. Photos can be any treatment — but real-feeling, not
  cartoonish.

- **`/contact`** has a sticky form sidebar (currently disabled, marked
  "Phase 3" — keep it disabled, just restyle).

- **`/directions`** embeds two Google Maps iframes (one per lot) with
  landmarks + directions + call CTAs.

#### Intent landing pages (5 of them):

- `/bad-credit-car-loans`
- `/no-credit-car-loans`
- `/work-permit-car-loans`
- `/student-car-loans`
- `/newcomer-car-loans`

Each uses `<IntentLandingTemplate>` — give the template a redesign
that's conversion-focused, not just informational. Sticky CTA card on
desktop, accordion-style FAQ via native `<details>`, "documents you'll
need" as a clean 2-column doc checklist, "what you get" as a list of
amber-dot bulleted cards.

#### Programmatic SEO city pages

- `/[city]/used-cars` for: Mississauga, Oakville, Brampton, Toronto,
  Etobicoke, Hamilton, Burlington, Milton, Vaughan, Markham.
- Each generates from `getCity(slug)` in `src/lib/cities.ts`. Use the
  city's `name`, `region`, `distance`, `hook`, and `nearestLot` fields.
- Layout: navy hero with city-specific hook, 3-paragraph body
  (city-specific opener), inventory grid (sorted to surface
  nearest-lot vehicles first), driving-from-X CTA card, internal-link
  cluster of every other city as rounded chips.

#### `/admin` (visible to staff only after sign-in)

The admin section already exists with a working layout. Style improvements:
- Sidebar feels more modern — less Bootstrap-y. Subtle hover, current
  route highlight in primary tint.
- KPI tiles on dashboard — bigger numbers, subtle gradient backgrounds,
  small spark indicators.
- Tables — better empty states, sort indicators, sticky headers when
  scrolling, hoverable rows.
- Finance applications page keeps the destructive "Read with care"
  callout — that's legally important.

---

### Components you'll be using a lot (already exist — reskin, don't reimplement)

```tsx
import { Button } from "@/components/ui/button";    // 8 variants × 5 sizes
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";      // default, secondary, accent, outline, muted, destructive
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { VehicleCard } from "@/components/site/vehicle-card";
import { VehicleGallery } from "@/components/site/vehicle-gallery";
import { VehiclePhoto } from "@/components/site/vehicle-photo";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { WhatsAppFab } from "@/components/site/whatsapp-fab";
import { PageHero } from "@/components/site/page-hero";
import { Calculator } from "@/components/site/calculator";
import { HoldCarButton } from "@/components/site/hold-car-button";
import { IntentLandingTemplate } from "@/components/site/intent-landing-template";

import { AutoVerifyWidget } from "@/components/embeds/autoverify-widget";
import { CarfaxTrueTrade } from "@/components/embeds/carfax-truetrade";
import { AutoRaptorChatbot } from "@/components/embeds/auto-raptor-chatbot";

import { FinancingWizard } from "@/components/finance/financing-wizard";
```

---

### Hard constraints

1. **Don't break the URL contract.** Same routes, same query-param
   shapes. Sitemap + Search Console + AutoTrader feed depend on them.
2. **Don't touch `src/app/api/**`, `src/lib/supabase/**`, `src/lib/stripe/**`,
   `src/lib/financing/**`, `src/middleware.ts`, `supabase/**`,
   `src/components/embeds/**`, `src/components/finance/**`, or
   `src/components/auth/**`.** These are the backend. Your pages call
   them through stable contracts.
3. **The site must work without any third-party credentials.**
   Supabase / Stripe / Plaid / AutoVerify / TrueTrade / AutoRaptor all
   gracefully no-op when env vars are missing — keep it that way.
4. **Mobile-first.** Every page must look correct at 375px wide.
5. **Server components are the default.** Add `"use client"` only when
   you genuinely need state, refs, or browser APIs (we use it for
   Calculator, HoldCarButton, FinancingWizard, embeds, login form).
6. **A11y is mandatory.** Every interactive element has a focus ring,
   every image has `alt`, every SVG has a `<title>` or `aria-hidden`.
   `pnpm e2e` runs axe-core; don't break it.
7. **Run `pnpm verify` before declaring done.** That's typecheck +
   biome + vitest + build.
8. **No comments in components unless something is non-obvious.**
   Brand voice trumps explainer comments.

---

### What success looks like

A buyer in Brampton hits the site on their phone. The hero loads in
under a second. They see the AutoTrader Best Priced badge, scan the
$19,995 Honda Civic with a "Save $1,500" callout, tap it, see the full
VDP with sticky price card + bi-weekly estimate + working Stripe Hold
button. They tap "Hold this car · $500 refundable", complete the
3-step modal, get a confirmation. 60 seconds later they hit "Get
pre-qualified", complete the wizard, see "Application received" with
a reference ID. They drive to the Mississauga lot. Inder is waiting
with the keys.

That's the bar. Make it feel that way.

---

## END OF PROMPT (paste up to here ↑)
