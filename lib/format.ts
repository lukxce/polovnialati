import { kategorije } from '@/data/kategorije'
import type { Oglas, Stanje } from '@/lib/types'

/* ────────────────────────────────────────────────────────────────
   Cene
   ──────────────────────────────────────────────────────────────── */

/** 45000 → "45.000 din" */
export function formatCena(n: number): string {
  const zaokruzeno = Math.round(n)
  const znak = zaokruzeno < 0 ? '-' : ''
  const cifre = Math.abs(zaokruzeno)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${znak}${cifre} din`
}

/** Kompaktan zapis za uske kartice: 45000 → "45k din", 1250000 → "1,3M din" */
export function formatCenaKratko(n: number): string {
  const zaokruzeno = Math.round(Math.abs(n))
  const znak = n < 0 ? '-' : ''
  if (zaokruzeno >= 1_000_000) {
    return `${znak}${skrati(zaokruzeno / 1_000_000)}M din`
  }
  if (zaokruzeno >= 10_000) {
    return `${znak}${skrati(zaokruzeno / 1000)}k din`
  }
  return formatCena(n)
}

function skrati(x: number): string {
  const jedna = Math.round(x * 10) / 10
  return (Number.isInteger(jedna) ? String(jedna) : jedna.toFixed(1)).replace('.', ',')
}

/* ────────────────────────────────────────────────────────────────
   Datumi i vreme
   ──────────────────────────────────────────────────────────────── */

const MESECI = [
  'januar',
  'februar',
  'mart',
  'april',
  'maj',
  'jun',
  'jul',
  'avgust',
  'septembar',
  'oktobar',
  'novembar',
  'decembar',
]

/** ISO datum → "12. mart 2026." */
export function formatDatum(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getUTCDate()}. ${MESECI[d.getUTCMonth()]} ${d.getUTCFullYear()}.`
}

/** ISO datum → "pre 3 dana". Referentno vreme se može prosleđivati radi testiranja. */
export function relativnoVreme(iso: string, sada: Date = new Date()): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const sek = Math.max(0, Math.floor((sada.getTime() - d.getTime()) / 1000))

  if (sek < 60) return 'upravo sada'

  const min = Math.floor(sek / 60)
  if (min < 60) return `pre ${min} ${pluralSr(min, ['minut', 'minuta', 'minuta'])}`

  const sati = Math.floor(min / 60)
  if (sati < 24) return `pre ${sati} ${pluralSr(sati, ['sat', 'sata', 'sati'])}`

  const dana = Math.floor(sati / 24)
  if (dana === 1) return 'juče'
  if (dana < 30) return `pre ${dana} ${pluralSr(dana, ['dan', 'dana', 'dana'])}`

  const meseci = Math.floor(dana / 30)
  if (meseci < 12) return `pre ${meseci} ${pluralSr(meseci, ['mesec', 'meseca', 'meseci'])}`

  const godina = Math.floor(dana / 365)
  return `pre ${godina} ${pluralSr(godina, ['godine', 'godine', 'godina'])}`
}

/* ────────────────────────────────────────────────────────────────
   Srpska množina
   ──────────────────────────────────────────────────────────────── */

/**
 * Srpski ima tri oblika:
 *   1, 21, 101   → jedan   ("1 oglas")
 *   2–4, 22–24   → dva     ("3 oglasa")
 *   0, 5–20, 25… → pet     ("7 oglasa")
 * Izuzetak su 11–14, koji uvek idu u treći oblik.
 */
export function pluralSr(n: number, oblici: [string, string, string]): string {
  const a = Math.abs(Math.trunc(n))
  const zadnja = a % 10
  const zadnjeDve = a % 100
  if (zadnjeDve >= 11 && zadnjeDve <= 14) return oblici[2]
  if (zadnja === 1) return oblici[0]
  if (zadnja >= 2 && zadnja <= 4) return oblici[1]
  return oblici[2]
}

/** "3 oglasa" — broj + ispravan oblik. */
export function brojSr(n: number, oblici: [string, string, string]): string {
  return `${n} ${pluralSr(n, oblici)}`
}

/* ────────────────────────────────────────────────────────────────
   Stanje (ocene stanja)
   ──────────────────────────────────────────────────────────────── */

export const STANJA: Stanje[] = [
  'novo',
  'kao-novo',
  'koristeno-ispravno',
  'vidljivo-koristeno',
  'za-delove',
]

const STANJE_LABELE: Record<Stanje, string> = {
  novo: 'Novo',
  'kao-novo': 'Kao novo',
  'koristeno-ispravno': 'Korišćeno, ispravno',
  'vidljivo-koristeno': 'Vidljivo korišćeno',
  'za-delove': 'Za delove',
}

const STANJE_DEFINICIJE: Record<Stanje, string> = {
  novo: 'Neotpakovano, sa računom i punom garancijom',
  'kao-novo': 'Korišćeno nekoliko puta, bez tragova, sve u pakovanju',
  'koristeno-ispravno': 'Vidljivi tragovi rada, tehnički potpuno ispravno',
  'vidljivo-koristeno': 'Radi, ali ima ozbiljnije tragove ili nedostaje pribor',
  'za-delove': 'Ne radi ili radi delimično. Prodaje se kao neispravan',
}

export function stanjeLabela(s: Stanje): string {
  return STANJE_LABELE[s] ?? s
}

export function stanjeDefinicija(s: Stanje): string {
  return STANJE_DEFINICIJE[s] ?? ''
}

/* ────────────────────────────────────────────────────────────────
   Ostale sitne pomoćne funkcije
   ──────────────────────────────────────────────────────────────── */

const TIP_LABELE = {
  'privatno-lice': 'Privatno lice',
  prodavnica: 'Prodavnica',
  servis: 'Servis',
} as const

export function tipProdavcaLabela(tip: keyof typeof TIP_LABELE): string {
  return TIP_LABELE[tip] ?? tip
}

/** Genitiv množine, za rečenice tipa „Svi oglasi {genitiv}" — ne isto što i
 * TIP_LABELE (nominativ jednine), koje ne rade u toj konstrukciji. */
const TIP_GENITIV_MNOZINE = {
  'privatno-lice': 'privatnih lica',
  prodavnica: 'prodavnica',
  servis: 'servisa',
} as const

export function tipProdavcaMnozina(tip: keyof typeof TIP_GENITIV_MNOZINE): string {
  return TIP_GENITIV_MNOZINE[tip] ?? tip
}

const DOSTAVA_LABELE = {
  licno: 'Lično preuzimanje',
  kurirska: 'Kurirska služba',
  besplatna: 'Besplatna dostava',
  pouzece: 'Plaćanje pouzećem',
} as const

export function dostavaLabela(d: keyof typeof DOSTAVA_LABELE): string {
  return DOSTAVA_LABELE[d] ?? d
}

/** "24 meseca garancije" / "Bez garancije" */
export function garancijaLabela(meseci?: number): string {
  if (!meseci) return 'Bez garancije'
  return `${meseci} ${pluralSr(meseci, ['mesec', 'meseca', 'meseci'])} garancije`
}

/* ────────────────────────────────────────────────────────────────
   Slike — deterministička katalog-ilustracija
   ──────────────────────────────────────────────────────────────── */

/** leaf slug → slug nadkategorije (ili sam sebi, ako je već nadkategorija) */
const NAD_MAPA: Record<string, string> = Object.fromEntries(
  kategorije.map((k) => [k.slug, k.roditelj ?? k.slug]),
)

/** Nadkategorija koja nosi ilustraciju za dati (obično leaf) slug. */
export function korenKategorije(slug: string): string {
  return NAD_MAPA[slug] ?? 'elektroalat'
}

/** Stabilan mali hash — isti ulaz uvek daje istu varijantu. */
function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

/**
 * Tri putanje do generisanih SVG ilustracija za dati oglas,
 * poređane tako da je prva ona koju bira `slikaZaOglas`.
 */
export function putanjeSlika(kategorija: string, brend: string): string[] {
  const koren = korenKategorije(kategorija)
  const start = (hash(`${koren}|${brend}`) % 3) + 1
  return [0, 1, 2].map((i) => `/slike/${koren}-${((start - 1 + i) % 3) + 1}.svg`)
}

/** Naslovna ilustracija oglasa. */
export function slikaZaOglas(oglas: Oglas): string {
  if (oglas.slike && oglas.slike.length > 0) return oglas.slike[0]
  return putanjeSlika(oglas.kategorija, oglas.brend)[0]
}
