# Alatnica — Product Spec

Marketplace za **nov i polovan alat i sitnu građevinsku opremu**. Elektroalat,
akumulatorski sistemi, burgije i potrošni materijal, merni instrumenti, sitna
mehanizacija. **Ne** kamioni, bageri, viljuškari — namerno.
Sve na srpskom (latinica).

---

## 1. The thesis

The competitor is KupujemProdajem: enormous reach, zero structure. A tool
buyer's real questions are *what condition is it actually in*, *is this seller
serious*, and *does this battery fit what I already own*. KP answers none of
them. So the product is built around three things KP cannot do:

1. **A real taxonomy.** Kategorija → potkategorija → brend → akumulatorski
   sistem. A filter that knows an 18V Makita battery is not an 18V Bosch one.
2. **Graded condition, not a free-text lie.** Five defined grades with a
   published definition and a required checklist at listing time.
3. **Seller identity.** Privatno lice vs. prodavnica vs. servis, with response
   time, listing history and verification, shown on every card.

The three load-bearing screens: **`/oglasi` (browse)**, **`/oglas/[slug]`
(listing)**, **`/prodaj` (the sell flow)**. The sell flow is a first-class
product surface, not an afterthought form.

## 2. Entities

```ts
type Stanje = 'novo' | 'kao-novo' | 'koristeno-ispravno' | 'vidljivo-koristeno' | 'za-delove'

type Oglas = {
  id: string; slug: string
  naslov: string
  kategorija: string       // leaf category slug
  brend: string            // brand slug
  model: string
  stanje: Stanje
  cena: number             // RSD
  cenaDogovor: boolean
  staraCena?: number       // for "snizeno"
  opis: string             // 2–5 real paragraphs, seller voice
  slike: string[]
  specifikacije: { naziv: string; vrednost: string }[]   // 4–10 rows
  uPakovanju: string[]     // what's included
  godiste?: number
  satiRada?: number
  garancija?: number       // months remaining, 0 = none
  akuSistem?: string       // '18V Makita LXT' etc — only for cordless
  lokacija: string         // city
  dostava: ('licno' | 'kurirska' | 'besplatna')[]
  prodavacId: string
  objavljeno: string       // ISO date
  pregleda: number
  sacuvano: number
  provereno: boolean       // platform-verified listing
  istaknuto: boolean       // promoted
  stanjeChecklist: { stavka: string; ok: boolean }[]     // required for used items
}

type Prodavac = {
  slug: string
  naziv: string
  tip: 'privatno-lice' | 'prodavnica' | 'servis'
  grad: string
  clanOd: string           // ISO date
  ocena: number; brojOcena: number
  brojOglasa: number
  odgovaraZa: string       // 'obično za 2 sata'
  verifikovan: boolean
  opis?: string
  oznake: string[]         // 'PIB verifikovan' | 'Ovlašćeni servis' | 'Šalje isti dan'
}

type Kategorija = { slug: string; naziv: string; roditelj?: string; ikona: string; opis?: string }
type Brend = { slug: string; naziv: string; opis: string; akuSistemi?: string[] }
```

### Category tree (build all of it)

- **Elektroalat** — bušilice i odvijači · rotacione bušilice (SDS) · ugaone brusilice · testere · rendisaljke · brusilice za drvo · mešalice za malter
- **Akumulatorski sistemi** — akumulatorski alat · baterije · punjači · setovi
- **Ručni alat** — ključevi i garniture · čekići i dleta · klešta · odvijači · stege
- **Merenje i obeležavanje** — laseri · nivelatori · detektori · daljinomeri · metri i libele
- **Burgije, sečiva i potrošni materijal** — SDS burgije · krune · rezni i brusni diskovi · listovi za testere · šrafovi i tiplovi
- **Pneumatika i kompresori** — kompresori · pneumatski alat · creva i priključci
- **Zavarivanje** — inverteri · MIG/MAG · oprema i zaštita
- **Sitna mehanizacija** — vibro nabijači · pumpe za vodu · agregati · mešalice za beton
- **Skele, merdevine i zaštita** — merdevine · skele · lična zaštita
- **Radionica** — kutije i kolica za alat · radni stolovi · usisivači

**Brands:** Hilti, Bosch (Professional/plavi), Makita, DeWalt, Milwaukee,
Metabo, Festool, HiKOKI, Einhell, Ryobi, Stanley, Würth, Flex, Fein, Villager,
Total, Ingco.

**Seed volume:** ~70 listings, ~18 sellers, full category tree, 17 brands.
Listings must be plausibly priced in RSD and spread across condition grades and
cities. At least 12 cordless listings carrying a real `akuSistem` value so the
battery-system filter demonstrably works.

### Condition grades (published, used everywhere)

| Grade | Label | Definition shown to users |
|---|---|---|
| `novo` | Novo | Neotpakovano, sa računom i punom garancijom |
| `kao-novo` | Kao novo | Korišćeno nekoliko puta, bez tragova, sve u pakovanju |
| `koristeno-ispravno` | Korišćeno, ispravno | Vidljivi tragovi rada, tehnički potpuno ispravno |
| `vidljivo-koristeno` | Vidljivo korišćeno | Radi, ali ima ozbiljnije tragove ili nedostaje pribor |
| `za-delove` | Za delove | Ne radi ili radi delimično. Prodaje se kao neispravan |

## 3. Routes

| Route | What it is |
|---|---|
| `/` | Home: search, category grid, condition/brand entries, featured + newest listings, sell CTA |
| `/oglasi` | Master browse (`?kategorija=&brend=&stanje=&cenaOd=&cenaDo=&grad=&aku=&garancija=&dostava=&tip=&sort=`) |
| `/kategorija/[...slug]` | Category browse, 1–2 levels deep. Own H1, intro, subcategory chips, brand shortcuts |
| `/brend/[brend]` | Brand page: about, battery systems, category breakdown, listings |
| `/oglas/[slug]` | Listing detail |
| `/prodavac/[slug]` | Seller storefront: header, stats, badges, their listings, reviews |
| `/prodaj` | **Sell flow** — 5 steps |
| `/sacuvano` | Saved listings (slugs in localStorage, cards fetched by slug) |
| `/pretraga?q=` | Search results across listings + categories + brands |
| `/kako-radi` | How it works + safety: condition grades table, payment advice, meetup advice |
| `/vodici` `/vodici/[slug]` | Buying guides (4 real ones, SEO) |
| `/o-nama` `/kontakt` `/uslovi` `/privatnost` | Static |

## 4. Browse screen

**Desktop:** 288px sticky filter rail + responsive card grid (3 cols @1280, 2 @1024).
**Mobile:** 2-col grid of compact cards. Sticky bottom bar → `Filteri (n)` and
`Sortiraj` open full-height sheets. Active filters as a scrollable chip row.

**Filters, in decision order:**
1. Kategorija (collapsible tree, counts per node)
2. Stanje (5 checkboxes, each with its one-line definition on hover/tap)
3. Cena od–do (two number inputs + quick ranges: do 10k, 10–30k, 30–80k, 80k+)
4. Brend (searchable list with counts)
5. Akumulatorski sistem (only appears when a cordless category/brand is active — this is the smart bit)
6. Lokacija (city select)
7. Garancija (ima garanciju)
8. Dostava (kurirska / besplatna)
9. Tip prodavca (privatno lice / prodavnica / servis)

**Sort:** Najnovije (default) · Cena rastuće · Cena opadajuće · Najgledanije

**Listing card:** photo 4:3 with condition chip top-left and save-heart
top-right · brand + model line · title (2 lines max) · **price, large** ·
old price struck through if `staraCena` · location · seller-type icon+label ·
`Provereno` tick if verified. Promoted listings get a thin accent top border,
labeled `Izdvojeno` — never a garish background.

URL is the only source of filter truth.

## 5. Listing detail

1. Breadcrumb: Kategorija › Potkategorija › Brend
2. **Gallery** — big image + thumb strip, swipeable on mobile, lightbox on desktop
3. **Price block** — price, `Dogovor` pill, condition grade with its definition
   inline, warranty months, posted date, views
4. **Actions** — `Pošalji poruku` (primary), `Pozovi`, `Sačuvaj`. Sticky bottom bar on mobile.
5. **Specifikacije** — 2-col table
6. **Opis** — seller's own text
7. **U pakovanju** — checklist
8. **Stanje** — the seller's condition checklist rendered as ✓/✗ rows. This is
   the trust feature; give it real space.
9. **Prodavac** — card: name, type, rating, member since, response time, badges,
   `Svi oglasi (n)` link
10. **Sigurna kupovina** — 4 short safety rules
11. **Slični oglasi** — 4 cards (same category, ±40% price)

Desktop: 7/5 split, right column = price + actions + seller, sticky.

## 6. Sell flow (`/prodaj`)

Five steps, one screen each, progress bar on top, state in URL (`?korak=2`),
`Nazad`/`Dalje` bottom bar (sticky on mobile). Step 5 shows a real preview of
the card; `Objavi` uploads the photos (resized in the browser, stored in
Vercel Blob) and publishes the listing to the database — it is public
immediately. Requires a signed-in account (`proxy.ts`).

1. **Kategorija** — searchable category picker, big tappable tiles
2. **Detalji** — brend, model, godište, stanje (radio cards with definitions),
   akumulatorski sistem (conditional), specifikacije rows, opis, u pakovanju
3. **Stanje i provera** — the condition checklist (checkbox list, required for
   anything not `novo`) + warranty months
4. **Fotografije** — drag/drop dropzone, reorder, cover marker (client-side
   object URLs until `Objavi`)
5. **Cena, lokacija i objava** — price, dogovor toggle, city, delivery options,
   then a live preview + `Objavi`

Validation is inline and per-step; `Dalje` is disabled with a reason, never a
silent no-op.

## 7. Guides to write (real content, not lorem)

- `kako-izabrati-rotacionu-busilicu` — SDS-plus vs SDS-max, joules, when a
  cheap one is fine
- `polovan-alat-na-sta-obratiti-paznju` — how to inspect a used tool, what the
  grades mean, red flags in listings
- `akumulatorski-sistemi-objasnjeni` — why the battery platform matters more
  than the tool, comparison of the main systems
- `hilti-vs-bosch-vs-makita` — honest positioning per brand and buyer
</content>
