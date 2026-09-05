import { brendovi } from '@/data/brendovi'
import { kategorije } from '@/data/kategorije'
import { oglasi } from '@/data/oglasi'
import { prodavci } from '@/data/prodavci'
import type { Brend, Kategorija, Oglas, Prodavac, Stanje } from '@/lib/types'
import { brojAktivnihFiltera, filteriUQuery, type Filteri } from '@/lib/filteri'

/* Oblik filtera i čiste funkcije nad njim žive u `lib/filteri.ts` da ih
   klijentske komponente mogu uvesti bez povlačenja kataloga u bundle.
   Reeksportuju se ovde da serverski pozivaoci i dalje imaju jedno mesto. */
export { brojAktivnihFiltera, filteriUQuery }
export type { Filteri }

/* ────────────────────────────────────────────────────────────────
   Osnovni pristup podacima
   ──────────────────────────────────────────────────────────────── */

export function sviOglasi(): Oglas[] {
  return oglasi
}

export function oglasBySlug(slug: string): Oglas | undefined {
  return oglasi.find((o) => o.slug === slug)
}

export function sveKategorije(): Kategorija[] {
  return kategorije
}

export function kategorijaBySlug(slug: string): Kategorija | undefined {
  return kategorije.find((k) => k.slug === slug)
}

/** Nadkategorije sa svojom decom, u redosledu iz taksonomije. */
export function stabloKategorija(): { kategorija: Kategorija; deca: Kategorija[] }[] {
  return kategorije
    .filter((k) => !k.roditelj)
    .map((kategorija) => ({
      kategorija,
      deca: kategorije.filter((d) => d.roditelj === kategorija.slug),
    }))
}

/** Lanac za breadcrumb: [nadkategorija, potkategorija] ili [nadkategorija]. */
export function putanjaKategorije(slug: string): Kategorija[] {
  const lanac: Kategorija[] = []
  let trenutna = kategorijaBySlug(slug)
  const vidjeni = new Set<string>()
  while (trenutna && !vidjeni.has(trenutna.slug)) {
    vidjeni.add(trenutna.slug)
    lanac.unshift(trenutna)
    trenutna = trenutna.roditelj ? kategorijaBySlug(trenutna.roditelj) : undefined
  }
  return lanac
}

export function sviBrendovi(): Brend[] {
  return brendovi
}

export function brendBySlug(slug: string): Brend | undefined {
  return brendovi.find((b) => b.slug === slug)
}

/**
 * `brojOglasa` se ne čita iz seed podataka nego se izvodi iz stvarnih oglasa.
 * Ručno upisan broj se pre ili kasnije razmimoiđe sa stanjem, a ovde se broj
 * prikazuje korisniku kao činjenica o prodavcu.
 */
const BROJ_OGLASA_PO_PRODAVCU = oglasi.reduce<Record<string, number>>((acc, o) => {
  acc[o.prodavacId] = (acc[o.prodavacId] ?? 0) + 1
  return acc
}, {})

const PRODAVCI: Prodavac[] = prodavci.map((p) => ({
  ...p,
  brojOglasa: BROJ_OGLASA_PO_PRODAVCU[p.slug] ?? 0,
}))

export function sviProdavci(): Prodavac[] {
  return PRODAVCI
}

export function prodavacBySlug(slug: string): Prodavac | undefined {
  return PRODAVCI.find((p) => p.slug === slug)
}

export function oglasiProdavca(slug: string): Oglas[] {
  return oglasi.filter((o) => o.prodavacId === slug)
}

/* ────────────────────────────────────────────────────────────────
   Pomoćne strukture
   ──────────────────────────────────────────────────────────────── */

const DECA_PO_RODITELJU = new Map<string, string[]>()
for (const k of kategorije) {
  if (!k.roditelj) continue
  const lista = DECA_PO_RODITELJU.get(k.roditelj) ?? []
  lista.push(k.slug)
  DECA_PO_RODITELJU.set(k.roditelj, lista)
}

/** Sam slug + svi listovi ispod njega. Radi i za nadkategoriju i za list. */
function kategorijaISveDeca(slug: string): Set<string> {
  const set = new Set<string>([slug])
  for (const dete of DECA_PO_RODITELJU.get(slug) ?? []) set.add(dete)
  return set
}

const PRODAVCI_MAPA = new Map(prodavci.map((p) => [p.slug, p]))

/** Gradovi koji se stvarno pojavljuju na oglasima, azbučno. */
export function sviGradovi(): string[] {
  return [...new Set(oglasi.map((o) => o.lokacija))].sort((a, b) => a.localeCompare(b, 'sr'))
}

/** Svi akumulatorski sistemi koji uopšte postoje u bazi. */
export function sviAkuSistemi(): string[] {
  return [...new Set(oglasi.map((o) => o.akuSistem).filter((x): x is string => Boolean(x)))].sort(
    (a, b) => a.localeCompare(b, 'sr'),
  )
}

/** Uklanja dijakritiku i spušta na mala slova — za pretragu bez „č/ć" muke. */
function normalizuj(s: string): string {
  return s
    .toLowerCase()
    .replace(/đ/g, 'd')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

/* ────────────────────────────────────────────────────────────────
   Filtriranje
   ──────────────────────────────────────────────────────────────── */


/** Pojedinačni predikati — koriste se i za filtriranje i za facet brojeve. */
const PREDIKATI = {
  kategorija: (o: Oglas, f: Filteri) =>
    !f.kategorija || kategorijaISveDeca(f.kategorija).has(o.kategorija),
  brend: (o: Oglas, f: Filteri) => !f.brend?.length || f.brend.includes(o.brend),
  stanje: (o: Oglas, f: Filteri) => !f.stanje?.length || f.stanje.includes(o.stanje),
  cena: (o: Oglas, f: Filteri) =>
    (f.cenaOd === undefined || o.cena >= f.cenaOd) && (f.cenaDo === undefined || o.cena <= f.cenaDo),
  grad: (o: Oglas, f: Filteri) => !f.grad || o.lokacija === f.grad,
  aku: (o: Oglas, f: Filteri) => !f.aku?.length || (!!o.akuSistem && f.aku.includes(o.akuSistem)),
  garancija: (o: Oglas, f: Filteri) => !f.garancija || (o.garancija ?? 0) > 0,
  dostava: (o: Oglas, f: Filteri) =>
    !f.dostava?.length || f.dostava.some((d) => (o.dostava as string[]).includes(d)),
  tip: (o: Oglas, f: Filteri) => {
    if (!f.tip?.length) return true
    const p = PRODAVCI_MAPA.get(o.prodavacId)
    return !!p && f.tip.includes(p.tip)
  },
  q: (o: Oglas, f: Filteri) => {
    if (!f.q) return true
    const q = normalizuj(f.q)
    if (!q) return true
    const brend = brendBySlug(o.brend)?.naziv ?? o.brend
    const kat = kategorijaBySlug(o.kategorija)?.naziv ?? o.kategorija
    const senoStog = normalizuj(
      [o.naslov, o.model, brend, kat, o.lokacija, o.akuSistem ?? '', o.opis].join(' '),
    )
    return q.split(/\s+/).every((rec) => senoStog.includes(rec))
  },
} as const

type KljucPredikata = keyof typeof PREDIKATI

/** Prolazi sve predikate, opciono preskačući jedan (za facet brojeve). */
function prolazi(o: Oglas, f: Filteri, izuzmi?: KljucPredikata): boolean {
  for (const kljuc of Object.keys(PREDIKATI) as KljucPredikata[]) {
    if (kljuc === izuzmi) continue
    if (!PREDIKATI[kljuc](o, f)) return false
  }
  return true
}

function sortiraj(lista: Oglas[], sort: Filteri['sort']): Oglas[] {
  const kopija = [...lista]
  switch (sort) {
    case 'cena-rastuce':
      kopija.sort((a, b) => a.cena - b.cena)
      break
    case 'cena-opadajuce':
      kopija.sort((a, b) => b.cena - a.cena)
      break
    case 'najgledanije':
      kopija.sort((a, b) => b.pregleda - a.pregleda)
      break
    case 'najnovije':
    default:
      kopija.sort((a, b) => Date.parse(b.objavljeno) - Date.parse(a.objavljeno))
      break
  }
  // Izdvojeni oglasi idu na vrh unutar izabranog redosleda.
  return kopija.sort((a, b) => Number(b.istaknuto) - Number(a.istaknuto))
}

export function filtrirajOglase(f: Filteri): Oglas[] {
  return sortiraj(
    oglasi.filter((o) => prolazi(o, f)),
    f.sort,
  )
}

/**
 * Facet brojevi: za svaku dimenziju se broji sa *ostalim* filterima primenjenim,
 * a bez te dimenzije — tako da isključivanje jedne opcije ne obriše ostale brojeve.
 */
export function brojeviFiltera(f: Filteri): {
  kategorija: Record<string, number>
  brend: Record<string, number>
  stanje: Record<string, number>
  grad: Record<string, number>
  aku: Record<string, number>
} {
  const kategorija: Record<string, number> = {}
  const brend: Record<string, number> = {}
  const stanje: Record<string, number> = {}
  const grad: Record<string, number> = {}
  const aku: Record<string, number> = {}

  for (const k of kategorije) kategorija[k.slug] = 0
  for (const b of brendovi) brend[b.slug] = 0
  for (const s of ['novo', 'kao-novo', 'koristeno-ispravno', 'vidljivo-koristeno', 'za-delove'])
    stanje[s] = 0
  for (const g of sviGradovi()) grad[g] = 0
  for (const a of sviAkuSistemi()) aku[a] = 0

  for (const o of oglasi) {
    if (prolazi(o, f, 'kategorija')) {
      kategorija[o.kategorija] = (kategorija[o.kategorija] ?? 0) + 1
      const nad = kategorijaBySlug(o.kategorija)?.roditelj
      if (nad) kategorija[nad] = (kategorija[nad] ?? 0) + 1
    }
    if (prolazi(o, f, 'brend')) brend[o.brend] = (brend[o.brend] ?? 0) + 1
    if (prolazi(o, f, 'stanje')) stanje[o.stanje] = (stanje[o.stanje] ?? 0) + 1
    if (prolazi(o, f, 'grad')) grad[o.lokacija] = (grad[o.lokacija] ?? 0) + 1
    if (o.akuSistem && prolazi(o, f, 'aku')) aku[o.akuSistem] = (aku[o.akuSistem] ?? 0) + 1
  }

  return { kategorija, brend, stanje, grad, aku }
}

/**
 * Akumulatorski sistemi koji se nude za trenutni izbor.
 * Vraća prazan niz ako aktivna kategorija/brend uopšte ne sadrže akumulatorske
 * oglase — zbog toga se filter „Akumulatorski sistem" i pojavljuje uslovno.
 */
export function dostupniAkuSistemi(f: Filteri): string[] {
  const relevantni = oglasi.filter((o) => !!o.akuSistem && prolazi(o, f, 'aku'))
  if (relevantni.length === 0) return []
  return [...new Set(relevantni.map((o) => o.akuSistem as string))].sort((a, b) =>
    a.localeCompare(b, 'sr'),
  )
}

/* ────────────────────────────────────────────────────────────────
   Slični oglasi i pretraga
   ──────────────────────────────────────────────────────────────── */

/**
 * Ista kategorija, cena u opsegu ±40% (SPEC §5).
 * Ako u leaf kategoriji nema dovoljno, širi se na nadkategoriju, pa na brend —
 * tako se blok „Slični oglasi" nikad ne prikaže poluprazan.
 */
export function sliniOglasi(slug: string, n = 4): Oglas[] {
  const izvor = oglasBySlug(slug)
  if (!izvor) return []

  const nad = kategorijaBySlug(izvor.kategorija)?.roditelj
  const donja = izvor.cena * 0.6
  const gornja = izvor.cena * 1.4
  const uOpsegu = (o: Oglas) => o.cena >= donja && o.cena <= gornja
  const kandidati = oglasi.filter((o) => o.slug !== izvor.slug)

  const poBlizini = (a: Oglas, b: Oglas) =>
    Math.abs(a.cena - izvor.cena) - Math.abs(b.cena - izvor.cena)

  const slojevi: Oglas[][] = [
    // 1. ista potkategorija, u cenovnom opsegu
    kandidati.filter((o) => o.kategorija === izvor.kategorija && uOpsegu(o)).sort(poBlizini),
    // 2. ista potkategorija, van opsega
    kandidati.filter((o) => o.kategorija === izvor.kategorija).sort(poBlizini),
    // 3. ista nadkategorija, u opsegu
    kandidati
      .filter((o) => !!nad && kategorijaBySlug(o.kategorija)?.roditelj === nad && uOpsegu(o))
      .sort(poBlizini),
    // 4. isti brend
    kandidati.filter((o) => o.brend === izvor.brend).sort(poBlizini),
    // 5. isti akumulatorski sistem
    kandidati.filter((o) => !!izvor.akuSistem && o.akuSistem === izvor.akuSistem).sort(poBlizini),
  ]

  const rezultat: Oglas[] = []
  const vidjeni = new Set<string>()
  for (const sloj of slojevi) {
    for (const o of sloj) {
      if (rezultat.length >= n) return rezultat
      if (vidjeni.has(o.slug)) continue
      vidjeni.add(o.slug)
      rezultat.push(o)
    }
  }
  return rezultat
}

export function pretraga(q: string): {
  oglasi: Oglas[]
  kategorije: Kategorija[]
  brendovi: Brend[]
} {
  const upit = normalizuj(q ?? '')
  if (!upit) return { oglasi: [], kategorije: [], brendovi: [] }
  const reci = upit.split(/\s+/)

  const pogodjeni = filtrirajOglase({ q, sort: 'najnovije' })

  const pogodjeneKategorije = kategorije.filter((k) => {
    const t = normalizuj(`${k.naziv} ${k.opis ?? ''}`)
    return reci.every((r) => t.includes(r))
  })

  const pogodjeniBrendovi = brendovi.filter((b) => {
    const t = normalizuj(`${b.naziv} ${(b.akuSistemi ?? []).join(' ')}`)
    return reci.every((r) => t.includes(r))
  })

  return { oglasi: pogodjeni, kategorije: pogodjeneKategorije, brendovi: pogodjeniBrendovi }
}

/* ────────────────────────────────────────────────────────────────
   URL ↔ filteri (URL je jedini izvor istine)
   ──────────────────────────────────────────────────────────────── */

type SearchParams = Record<string, string | string[] | undefined>

function jedan(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0]
  return v
}

/** Vrednost može stići i kao ponovljeni parametar i kao lista razdvojena zarezom. */
function lista(v: string | string[] | undefined): string[] {
  const sirovo = Array.isArray(v) ? v : v === undefined ? [] : [v]
  return sirovo
    .flatMap((x) => x.split(','))
    .map((x) => x.trim())
    .filter(Boolean)
}

function broj(v: string | string[] | undefined): number | undefined {
  const s = jedan(v)
  if (s === undefined || s === '') return undefined
  const n = Number(s.replace(/[^\d-]/g, ''))
  return Number.isFinite(n) ? n : undefined
}

const VALIDNA_STANJA = new Set<string>([
  'novo',
  'kao-novo',
  'koristeno-ispravno',
  'vidljivo-koristeno',
  'za-delove',
])
const VALIDNI_TIPOVI = new Set<string>(['privatno-lice', 'prodavnica', 'servis'])
const VALIDNE_DOSTAVE = new Set<string>(['licno', 'kurirska', 'besplatna', 'pouzece'])
const VALIDNI_SORT = new Set<string>([
  'najnovije',
  'cena-rastuce',
  'cena-opadajuce',
  'najgledanije',
])

export function parseFiltere(sp: Record<string, string | string[] | undefined>): Filteri {
  const p = sp as SearchParams
  const f: Filteri = {}

  const kategorija = jedan(p.kategorija)
  if (kategorija && kategorijaBySlug(kategorija)) f.kategorija = kategorija

  const brend = lista(p.brend).filter((b) => !!brendBySlug(b))
  if (brend.length) f.brend = brend

  const stanje = lista(p.stanje).filter((s) => VALIDNA_STANJA.has(s)) as Stanje[]
  if (stanje.length) f.stanje = stanje

  const cenaOd = broj(p.cenaOd)
  if (cenaOd !== undefined) f.cenaOd = cenaOd
  const cenaDo = broj(p.cenaDo)
  if (cenaDo !== undefined) f.cenaDo = cenaDo

  const grad = jedan(p.grad)
  if (grad) f.grad = grad

  const aku = lista(p.aku)
  if (aku.length) f.aku = aku

  if (jedan(p.garancija) === '1' || jedan(p.garancija) === 'true') f.garancija = true

  const dostava = lista(p.dostava).filter((d) => VALIDNE_DOSTAVE.has(d))
  if (dostava.length) f.dostava = dostava

  const tip = lista(p.tip).filter((t) => VALIDNI_TIPOVI.has(t)) as Prodavac['tip'][]
  if (tip.length) f.tip = tip

  const q = jedan(p.q)
  if (q && q.trim()) f.q = q.trim()

  const sort = jedan(p.sort)
  if (sort && VALIDNI_SORT.has(sort)) f.sort = sort as Filteri['sort']

  return f
}


