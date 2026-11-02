/**
 * Podaci o sajtu i operateru — jedno mesto za domen, ime i pravni identitet.
 *
 * Domen: NEXT_PUBLIC_SITE_URL (npr. https://polovnialati.rs). Dok domen nije
 * podešen, na Vercel-u se koristi produkcijska vercel.app adresa.
 *
 * Operater: pravno lice ili preduzetnik koji vodi sajt. Ove vrednosti se
 * prikazuju u podnožju, na /kontakt, /uslovi i /privatnost. Dok su prazne,
 * stranice prikazuju „[popuniti]" i /admin prikazuje upozorenje — sajt ne
 * sme javno da radi bez njih (Zakon o elektronskoj trgovini, ZZPL).
 */

function adresaSajta(): string {
  const izEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (izEnv) return izEnv.replace(/\/+$/, '')
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercel) return `https://${vercel}`
  return 'http://localhost:3102'
}

export const SITE_URL = adresaSajta()

export const IME_SAJTA = 'Polovni alati'

export const OPERATER = {
  /** Puno poslovno ime, npr. „Preduzetnik Petar Petrović PR, Agencija XY, Beograd" */
  naziv: process.env.NEXT_PUBLIC_OPERATER_NAZIV ?? '',
  /** Sedište: ulica i broj, poštanski broj, mesto. Neobavezno: ako je prazno, ne prikazuje se. */
  adresa: process.env.NEXT_PUBLIC_OPERATER_ADRESA ?? '',
  pib: process.env.NEXT_PUBLIC_OPERATER_PIB ?? '',
  maticniBroj: process.env.NEXT_PUBLIC_OPERATER_MB ?? '',
  /** Email za podršku i za zahteve u vezi sa podacima o ličnosti */
  email: process.env.NEXT_PUBLIC_KONTAKT_EMAIL ?? '',
}

export const NEDOSTAJE = '[popuniti]'

/** Vrednost ili jasno vidljiv znak da nije uneta. */
export function ili(vrednost: string): string {
  return vrednost.trim() || NEDOSTAJE
}

export function operaterPopunjen(): boolean {
  return !!(OPERATER.naziv && OPERATER.pib && OPERATER.maticniBroj && OPERATER.email)
}

/** Apsolutni URL za OG slike, JSON-LD i sitemap. */
export function apsolutno(putanja: string): string {
  if (/^https?:\/\//.test(putanja)) return putanja
  return `${SITE_URL}${putanja.startsWith('/') ? '' : '/'}${putanja}`
}
