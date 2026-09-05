/**
 * Zajednički oblici podataka za pregled sa filterima.
 * Sve je obično serijalizovano — klijentski filter ne sme da povuče bazu oglasa.
 */

export type Opcija = {
  vrednost: string
  naziv: string
  broj: number
}

export type PotkategorijaVeza = {
  slug: string
  naziv: string
  broj: number
  href: string
}

export type FilterPodaci = {
  /** Nadkategorije sa decom — samo kada kategorija nije zaključana. */
  kategorije: { slug: string; naziv: string; broj: number; deca: Opcija[] }[]
  /** Zaključana kategorija (stranica kategorije): filter se ne može menjati. */
  zakljucana?: { naziv: string; potkategorije: PotkategorijaVeza[]; nazadHref?: string }
  stanja: Opcija[]
  brendovi: Opcija[]
  gradovi: Opcija[]
  akuSistemi: Opcija[]
  /** Zaključan brend (stranica brenda). */
  zakljucanBrend?: string
}

export const BRZI_OPSEZI: { naziv: string; cenaOd?: number; cenaDo?: number }[] = [
  { naziv: 'do 10.000', cenaDo: 10000 },
  { naziv: '10–30.000', cenaOd: 10000, cenaDo: 30000 },
  { naziv: '30–80.000', cenaOd: 30000, cenaDo: 80000 },
  { naziv: '80.000+', cenaOd: 80000 },
]

export const SORTIRANJA: { vrednost: string; naziv: string }[] = [
  { vrednost: 'najnovije', naziv: 'Najnovije' },
  { vrednost: 'cena-rastuce', naziv: 'Cena: rastuće' },
  { vrednost: 'cena-opadajuce', naziv: 'Cena: opadajuće' },
  { vrednost: 'najgledanije', naziv: 'Najgledanije' },
]

export const DOSTAVE: { vrednost: string; naziv: string }[] = [
  { vrednost: 'kurirska', naziv: 'Kurirska služba' },
  { vrednost: 'pouzece', naziv: 'Plaćanje pouzećem' },
  { vrednost: 'besplatna', naziv: 'Besplatna dostava' },
]

export const TIPOVI_PRODAVCA: { vrednost: string; naziv: string }[] = [
  { vrednost: 'privatno-lice', naziv: 'Privatno lice' },
  { vrednost: 'prodavnica', naziv: 'Prodavnica' },
  { vrednost: 'servis', naziv: 'Servis' },
]
