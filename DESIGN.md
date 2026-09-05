# Alatnica — Design System

**Feeling:** industrial, confident, high-contrast. This is a tool, and it
should look like one — but a 2026 tool, not a 2009 parts catalogue. Concrete
paper, near-black ink, one loud signal amber, electric blue for anything
clickable. Chunky rounded corners, hard lift, no fuss.

Hard rules: **no grey-on-grey mush, no teal, no soft pastel anything.** Contrast
is the aesthetic.

---

## Tokens (`app/globals.css`, `:root`)

```css
/* ground */
--paper:     #F4F2ED;   /* page background, warm concrete */
--surface:   #FFFFFF;   /* cards */
--surface-2: #EAE7E0;   /* filter rail, table stripes, wells */
--surface-3: #DEDAD1;   /* borders-as-fills, skeletons */
--ink-panel: #171613;   /* dark inversion panels (footer, hero band, CTA) */

/* ink */
--ink:   #171613;       /* near-black, warm */
--ink-2: #48453D;
--ink-3: #7D7970;

/* brand */
--amber:      #FF8A00;  /* PRIMARY signal. price, CTA, condition-new, promoted */
--amber-deep: #E06E00;
--amber-tint: #FFF0DC;
--blue:       #2F5BFF;  /* interactive: links, focus rings, secondary CTA */
--blue-deep:  #1E42D0;
--blue-tint:  #E7ECFF;

/* condition grades — a fixed, learnable scale */
--g-novo:   #1F8A4C;   --g-novo-t:   #E4F4EA;
--g-kaonovo:#3E9E7A;   --g-kaonovo-t:#E6F5F0;
--g-ispravno:#2F5BFF;  --g-ispravno-t:#E7ECFF;
--g-vidljivo:#B47500;  --g-vidljivo-t:#FDF1D9;
--g-delove: #C0392B;   --g-delove-t: #FBEAE7;

/* lines & lift */
--line:   #DDD8CE;
--line-2: #C6C0B4;
--shadow-sm: 0 1px 2px rgba(23,22,19,.07), 0 2px 5px rgba(23,22,19,.05);
--shadow-md: 0 2px 4px rgba(23,22,19,.06), 0 10px 22px rgba(23,22,19,.10);
--shadow-lg: 0 4px 8px rgba(23,22,19,.08), 0 22px 48px rgba(23,22,19,.16);
--shadow-amber: 0 6px 16px rgba(255,138,0,.34);

/* radii — chunky but not pill-soft; this is equipment */
--r-xs: 6px; --r-sm: 10px; --r-md: 14px; --r-lg: 20px; --r-xl: 28px; --r-full: 999px;
```

## Type

```ts
Bricolage Grotesque — display: h1, h2, prices, big numbers. Weights 500/700/800.
Schibsted Grotesk   — UI/body: everything else. Weights 400/500/600/700.
```

- Bricolage has real character (slightly condensed, odd `g`). Use it *only* for
  display and prices — it is the personality, and it stops working if it's
  everywhere.
- **Prices are Bricolage 700, tabular-nums, and larger than you think.** The
  price is the single most-read element on a marketplace. On a card: 22px. On
  the detail page: 40px.
  `font-variant-numeric: tabular-nums` on every price and spec number.
- Scale (desktop → mobile):
  h1 60/40 · h2 40/30 · h3 26/22 · h4 18/17 · body 15.5/15 · small 13.5 · micro 11.5
- Micro-labels: 11.5px, 700, uppercase, `letter-spacing: .09em`, `--ink-3`.
- Line-height 1.08 on display (tight — Bricolage wants it), 1.6 body.

## Surfaces

- Cards: `--surface`, `--r-lg`, `--shadow-sm` at rest → `--shadow-lg` +
  `translateY(-3px)` on hover. **No border.**
- The filter rail and spec tables are `--surface-2`, flat, no shadow.
- **Dark inversion panels** are a signature: full-bleed `--ink-panel` bands with
  cream text and amber accents, used for the home hero band, the sell CTA and
  the footer. Radius `--r-xl` when inset, square when full-bleed.
- Sticky header: `rgba(244,242,237,.85)` + `blur(14px) saturate(150%)` +
  `--line` hairline. The only frosted surface.

## Buttons

| | |
|---|---|
| Primary | `--amber` bg, `--ink` text (**dark text on amber, always**), `--r-md`, `--shadow-amber`, 700 |
| Secondary | `--ink` bg, white text, `--r-md` |
| Tertiary | `--surface` bg, `1px solid var(--line-2)`, `--ink` text, `--r-md` |
| Ghost | transparent, `--ink-2`, hover `--surface-2` |
| Chip | `--surface` + `--line`, `--r-full`, 34px; active = `--ink` bg + white text |

Focus ring everywhere: `0 0 0 3px var(--blue-tint), 0 0 0 1.5px var(--blue)`.
Min tap target 44px.

## Condition chips

The five grades are the product's vocabulary. Same chip, same colour, same
place, on every surface: tinted background + saturated text + 700 weight,
`--r-sm` (not pill — these are labels, not tags). Tapping one anywhere opens the
grade-definition sheet.

## Seller-type marks

`privatno-lice` = person glyph, `--ink-3` · `prodavnica` = storefront glyph,
`--blue` · `servis` = wrench glyph, `--amber-deep`. Always glyph + word, never
glyph alone.

## Layout

- Container: `max-width: 1320px` (marketplaces need grid width), 16px mobile /
  28px desktop padding.
- Card grid: 4 cols ≥1440 · 3 ≥1100 · 2 ≥640 · 2 on mobile (compact variant).
  Two columns on phones, not one — density is the point.
- Section rhythm: 64px desktop, 44px mobile.
- Mobile-first media queries only.

## Motion

- 150ms `cubic-bezier(.2,.8,.3,1)` hovers; 240ms sheets.
- Gallery: horizontal snap scroll on mobile, thumb-click on desktop.
- Save-heart: a 200ms pop on activate. That's the one flourish.
- `prefers-reduced-motion` kills all of it.

## Imagery

No stock photos. Listing images are deterministic generated SVG/CSS
placeholders in `/public/slike/`: a flat two-tone tool silhouette on a tinted
ground, colour picked from the brand, silhouette picked from the category.
They must look like a deliberate catalogue illustration system.

## Don'ts

- ✗ White text on amber (fails contrast; amber carries dark ink).
- ✗ Amber on large fills — it is a signal, not a background. The dark panels
  carry the weight instead.
- ✗ Single-column phone grid.
- ✗ Price rendered at body size.
- ✗ Free-text condition. Everything routes through the five grades.
- ✗ Border + shadow on the same card.
</content>
