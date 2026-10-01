import 'server-only'
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { db } from '@/lib/db'
import { uOglas, uProdavca } from '@/lib/oglasi'
import {
  brendBySlug,
  kategorijaBySlug,
  kategorijaISveDeca,
  putanjaKategorije,
  sveKategorije,
  sviBrendovi,
  stabloKategorija,
} from '@/lib/taksonomija'
import type { Brend, Kategorija, Oglas, Prodavac, Stanje } from '@/lib/types'
import { brojAktivnihFiltera, filteriUQuery, type Filteri } from '@/lib/filteri'

/* Oblik filtera i čiste funkcije nad njim žive u `lib/filteri.ts`, a
   taksonomija u `lib/taksonomija.ts` — oba su bezbedna za klijent.
   Reeksportuju se ovde da serverski pozivaoci i dalje imaju jedno mesto. */
export { brojAktivnihFiltera, filteriUQuery }
export type { Filteri }
export {
  brendBySlug,
  kategorijaBySlug,
  putanjaKategorije,
  sveKategorije,
  sviBrendovi,
  stabloKategorija,
}

/* ────────────────────────────────────────────────────────────────
   Keš kataloga

   Svi aktivni oglasi se čitaju jednim upitom i filtriraju u memoriji — ista
   logika faseta kao ranije, bez desetak GROUP BY upita po stranici. Rezultat
   se kešira (Next data cache) pod tagom KATALOG_TAG; svaka izmena oglasa ili
   naloga zove osveziKatalog() iz lib/osvezavanje.ts.

   U kešu kataloga je opis skraćen (za pretragu je dovoljan početak), pa je
   keš mali i za par hiljada oglasa. Stranica oglasa čita pun red posebno.
   Kad aktivnih oglasa bude više od ~2.000, filtriranje treba preseliti u SQL.
   ──────────────────────────────────────────────────────────────── */

export const KATALOG_TAG = 'katalog'

/**
 * Next data cache na Vercel-u preživljava deploy. Bez ID-a deploy-a u ključu,
 * novi kod bi posle deploy-a do sat vremena čitao keš koji je napravio stari
 * kod (stari oblik podataka, ili stanje baze menjano mimo aplikacije).
 */
const VERZIJA = process.env.VERCEL_DEPLOYMENT_ID ?? process.env.VERCEL_GIT_COMMIT_SHA ?? 'lokalno'

/** Sigurnosna mreža: i bez taga, keš nije stariji od 10 minuta (npr. broj pregleda). */
const OSVEZI_SEKUNDI = 600

const OPIS_U_KATALOGU = 400

type Katalog = { oglasi: Oglas[]; prodavci: Prodavac[] }

const ucitajKatalog = unstable_cache(
  async (): Promise<Katalog> => {
    const redovi = await db.oglas.findMany({
      where: { aktivan: true, user: { blokiran: false } },
      include: { user: { select: { id: true, slug: true, tip: true } } },
      orderBy: { createdAt: 'desc' },
    })
    const oglasi = redovi.map((r) => {
      const o = uOglas(r)
      return o.opis.length > OPIS_U_KATALOGU ? { ...o, opis: o.opis.slice(0, OPIS_U_KATALOGU) } : o
    })

    const brojPoProdavcu = new Map<string, number>()
    for (const o of oglasi) brojPoProdavcu.set(o.vlasnikId, (brojPoProdavcu.get(o.vlasnikId) ?? 0) + 1)

    const korisnici = await db.user.findMany({
      where: { id: { in: [...brojPoProdavcu.keys()] }, blokiran: false },
    })
    const prodavci = korisnici.map((u) => uProdavca(u, brojPoProdavcu.get(u.id) ?? 0))

    return { oglasi, prodavci }
  },
  ['katalog-v1', VERZIJA],
  { tags: [KATALOG_TAG], revalidate: OSVEZI_SEKUNDI },
)

/** Jedan upit po zahtevu, bez obzira koliko komponenti traži katalog. */
const katalog = cache(ucitajKatalog)

/* ────────────────────────────────────────────────────────────────
   Osnovni pristup podacima
   ──────────────────────────────────────────────────────────────── */

export async function sviOglasi(): Promise<Oglas[]> {
  return (await katalog()).oglasi
}

const ucitajOglas = unstable_cache(
  async (slug: string): Promise<Oglas | null> => {
    const red = await db.oglas.findUnique({
      where: { slug },
      include: { user: { select: { id: true, slug: true, tip: true, blokiran: true } } },
    })
    if (!red || !red.aktivan || red.user.blokiran) return null
    return uOglas(red)
  },
  ['oglas-v1', VERZIJA],
  { tags: [KATALOG_TAG], revalidate: OSVEZI_SEKUNDI },
)

/** Pun oglas (ceo opis) — samo aktivni oglasi neblokiranih prodavaca. */
export const oglasBySlug = cache(async (slug: string): Promise<Oglas | undefined> => {
  return (await ucitajOglas(slug)) ?? undefined
})

const ucitajProdavca = unstable_cache(
  async (slug: string): Promise<Prodavac | null> => {
    const u = await db.user.findUnique({ where: { slug } })
    if (!u || u.blokiran) return null
    const broj = await db.oglas.count({ where: { userId: u.id, aktivan: true } })
    // Admin nalog nema javni profil dok ne objavi nešto.
    if (u.uloga === 'ADMIN' && broj === 0) return null
    return uProdavca(u, broj)
  },
  ['prodavac-v1', VERZIJA],
  { tags: [KATALOG_TAG], revalidate: OSVEZI_SEKUNDI },
)

export const prodavacBySlug = cache(async (slug: string): Promise<Prodavac | undefined> => {
  return (await ucitajProdavca(slug)) ?? undefined
})

/** Prodavci sa bar jednim aktivnim oglasom. */
export async function sviProdavci(): Promise<Prodavac[]> {
  return (await katalog()).prodavci
}

export async function oglasiProdavca(slug: string): Promise<Oglas[]> {
  return (await katalog()).oglasi.filter((o) => o.prodavacId === slug)
}

/** Gradovi koji se stvarno pojavljuju na oglasima, azbučno. */
export async function sviGradovi(): Promise<string[]> {
  return gradoviIz((await katalog()).oglasi)
}

function gradoviIz(oglasi: Oglas[]): string[] {
  return [...new Set(oglasi.map((o) => o.lokacija))].sort((a, b) => a.localeCompare(b, 'sr'))
}

function akuSistemiIz(oglasi: Oglas[]): string[] {
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
    .replace(/[̀-ͯ]/g, '')
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
  tip: (o: Oglas, f: Filteri) => !f.tip?.length || f.tip.includes(o.prodavacTip),
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

function filtriraj(oglasi: Oglas[], f: Filteri): Oglas[] {
  return sortiraj(
    oglasi.filter((o) => prolazi(o, f)),
    f.sort,
  )
}

export async function filtrirajOglase(f: Filteri): Promise<Oglas[]> {
  return filtriraj((await katalog()).oglasi, f)
}

export type BrojeviFiltera = {
  kategorija: Record<string, number>
  brend: Record<string, number>
  stanje: Record<string, number>
  grad: Record<string, number>
  aku: Record<string, number>
}

/**
 * Facet brojevi: za svaku dimenziju se broji sa *ostalim* filterima primenjenim,
 * a bez te dimenzije — tako da isključivanje jedne opcije ne obriše ostale brojeve.
 */
export async function brojeviFiltera(f: Filteri): Promise<BrojeviFiltera> {
  const oglasi = (await katalog()).oglasi
  const kategorija: Record<string, number> = {}
  const brend: Record<string, number> = {}
  const stanje: Record<string, number> = {}
  const grad: Record<string, number> = {}
  const aku: Record<string, number> = {}

  for (const k of sveKategorije()) kategorija[k.slug] = 0
  for (const b of sviBrendovi()) brend[b.slug] = 0
  for (const s of ['novo', 'kao-novo', 'koristeno-ispravno', 'vidljivo-koristeno', 'za-delove'])
    stanje[s] = 0
  for (const g of gradoviIz(oglasi)) grad[g] = 0
  for (const a of akuSistemiIz(oglasi)) aku[a] = 0

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
export async function dostupniAkuSistemi(f: Filteri): Promise<string[]> {
  const relevantni = (await katalog()).oglasi.filter((o) => !!o.akuSistem && prolazi(o, f, 'aku'))
  return akuSistemiIz(relevantni)
}

/* ────────────────────────────────────────────────────────────────
   Slični oglasi i pretraga
   ──────────────────────────────────────────────────────────────── */

/**
 * Ista kategorija, cena u opsegu ±40% (SPEC §5).
 * Ako u leaf kategoriji nema dovoljno, širi se na nadkategoriju, pa na brend —
 * tako se blok „Slični oglasi" nikad ne prikaže poluprazan.
 */
export async function sliniOglasi(izvor: Oglas, n = 4): Promise<Oglas[]> {
  const oglasi = (await katalog()).oglasi

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

export async function pretraga(q: string): Promise<{
  oglasi: Oglas[]
  kategorije: Kategorija[]
  brendovi: Brend[]
}> {
  const upit = normalizuj(q ?? '')
  if (!upit) return { oglasi: [], kategorije: [], brendovi: [] }
  const reci = upit.split(/\s+/)

  const pogodjeni = await filtrirajOglase({ q, sort: 'najnovije' })

  const pogodjeneKategorije = sveKategorije().filter((k) => {
    const t = normalizuj(`${k.naziv} ${k.opis ?? ''}`)
    return reci.every((r) => t.includes(r))
  })

  const pogodjeniBrendovi = sviBrendovi().filter((b) => {
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
  if (grad) f.grad = grad.slice(0, 60)

  const aku = lista(p.aku).map((a) => a.slice(0, 60))
  if (aku.length) f.aku = aku.slice(0, 10)

  if (jedan(p.garancija) === '1' || jedan(p.garancija) === 'true') f.garancija = true

  const dostava = lista(p.dostava).filter((d) => VALIDNE_DOSTAVE.has(d))
  if (dostava.length) f.dostava = dostava

  const tip = lista(p.tip).filter((t) => VALIDNI_TIPOVI.has(t)) as Prodavac['tip'][]
  if (tip.length) f.tip = tip

  const q = jedan(p.q)
  if (q && q.trim()) f.q = q.trim().slice(0, 100)

  const sort = jedan(p.sort)
  if (sort && VALIDNI_SORT.has(sort)) f.sort = sort as Filteri['sort']

  return f
}
