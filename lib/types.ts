/**
 * Alatnica — domenski tipovi.
 * Slugovi su uvek ASCII (bez dijakritike) da bi URL-ovi bili stabilni.
 */

export type Stanje =
  | 'novo'
  | 'kao-novo'
  | 'koristeno-ispravno'
  | 'vidljivo-koristeno'
  | 'za-delove'

export type Dostava = 'licno' | 'kurirska' | 'besplatna' | 'pouzece'

export type TipProdavca = 'privatno-lice' | 'prodavnica' | 'servis'

export type Specifikacija = { naziv: string; vrednost: string }

export type ChecklistStavka = { stavka: string; ok: boolean }

export type Oglas = {
  id: string
  slug: string
  naslov: string
  /** leaf category slug */
  kategorija: string
  /** brand slug */
  brend: string
  model: string
  stanje: Stanje
  /** RSD */
  cena: number
  cenaDogovor: boolean
  /** for "sniženo" */
  staraCena?: number
  /** 2–5 real paragraphs, seller voice */
  opis: string
  slike: string[]
  /** 4–10 rows */
  specifikacije: Specifikacija[]
  /** what's included */
  uPakovanju: string[]
  godiste?: number
  satiRada?: number
  /** months remaining, 0 = none */
  garancija?: number
  /** '18V Makita LXT' etc — only for cordless */
  akuSistem?: string
  /** city */
  lokacija: string
  dostava: Dostava[]
  prodavacId: string
  /** ISO date */
  objavljeno: string
  pregleda: number
  sacuvano: number
  /** platform-verified listing */
  provereno: boolean
  /** promoted */
  istaknuto: boolean
  /** required for used items */
  stanjeChecklist: ChecklistStavka[]
}

export type Prodavac = {
  slug: string
  naziv: string
  tip: TipProdavca
  grad: string
  /** ISO date */
  clanOd: string
  ocena: number
  brojOcena: number
  brojOglasa: number
  /** 'obično za 2 sata' */
  odgovaraZa: string
  verifikovan: boolean
  opis?: string
  /** 'PIB verifikovan' | 'Ovlašćeni servis' | 'Šalje isti dan' */
  oznake: string[]
}

export type Kategorija = {
  slug: string
  naziv: string
  roditelj?: string
  ikona: string
  opis?: string
}

export type Brend = {
  slug: string
  naziv: string
  opis: string
  akuSistemi?: string[]
}
