import type { Oglas as OglasRow, User } from '@prisma/client'
import { brendBySlug, jeListKategorija } from './taksonomija'
import { STANJA } from './format'
import type {
  ChecklistStavka,
  Dostava,
  Oglas,
  Prodavac,
  Specifikacija,
  Stanje,
  TipProdavca,
} from './types'

/**
 * Jedino mesto koje zna kako red iz baze postaje `Oglas`/`Prodavac` koji UI
 * prikazuje, i kako telo zahteva iz /prodaj postaje red za upis.
 */

/* ── Slugovi ───────────────────────────────────────────────────── */

/** ASCII slug bez dijakritike: „Bušilica Makita 18V" → „busilica-makita-18v". */
export function uSlug(tekst: string, maks = 70): string {
  const s = tekst
    .toLowerCase()
    .replace(/đ/g, 'dj')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maks)
    .replace(/-+$/g, '')
  return s || 'oglas'
}

/** Kratak nasumičan sufiks — slug ostaje jedinstven i kad dva oglasa imaju isti naslov. */
export function sufiks(duzina = 6): string {
  const znaci = 'abcdefghijkmnpqrstuvwxyz23456789'
  let s = ''
  for (let i = 0; i < duzina; i++) s += znaci[Math.floor(Math.random() * znaci.length)]
  return s
}

export function slugOglasa(naslov: string): string {
  return `${uSlug(naslov)}-${sufiks()}`
}

/* ── Red iz baze → UI tip ──────────────────────────────────────── */

type OglasSaVlasnikom = OglasRow & { user: Pick<User, 'id' | 'slug' | 'tip'> }

export function uOglas(red: OglasSaVlasnikom): Oglas {
  return {
    id: red.id,
    slug: red.slug,
    naslov: red.naslov,
    kategorija: red.kategorija,
    brend: red.brend,
    model: red.model,
    stanje: red.stanje as Stanje,
    cena: red.cena,
    cenaDogovor: red.cenaDogovor,
    staraCena: red.staraCena ?? undefined,
    opis: red.opis,
    slike: red.slike,
    specifikacije: (red.specifikacije as Specifikacija[] | null) ?? [],
    uPakovanju: red.uPakovanju,
    stanjeChecklist: (red.stanjeChecklist as ChecklistStavka[] | null) ?? [],
    godiste: red.godiste ?? undefined,
    satiRada: red.satiRada ?? undefined,
    garancija: red.garancija ?? undefined,
    akuSistem: red.akuSistem ?? undefined,
    lokacija: red.lokacija,
    dostava: red.dostava as Dostava[],
    prodavacId: red.user.slug,
    prodavacTip: red.user.tip as TipProdavca,
    vlasnikId: red.user.id,
    objavljeno: red.createdAt.toISOString(),
    pregleda: red.pregleda,
    provereno: red.provereno,
    istaknuto: red.istaknuto,
  }
}

export function uProdavca(u: User, brojOglasa: number): Prodavac {
  const oznake: string[] = []
  if (u.verifikovan && u.pib && u.tip !== 'privatno-lice') oznake.push('PIB verifikovan')
  return {
    id: u.id,
    slug: u.slug,
    naziv: u.naziv,
    tip: u.tip as TipProdavca,
    grad: u.grad,
    clanOd: u.createdAt.toISOString(),
    brojOcena: 0,
    brojOglasa,
    verifikovan: u.verifikovan,
    opis: u.opis ?? undefined,
    oznake,
    imaTelefon: !!u.telefon,
  }
}

/* ── Telo zahteva → red za upis ────────────────────────────────── */

const DOSTAVE = new Set<string>(['licno', 'kurirska', 'besplatna', 'pouzece'])

export const OGRANICENJA = {
  naslov: 90,
  model: 60,
  opis: 5000,
  minOpis: 20,
  slike: 12,
  specifikacije: 15,
  uPakovanju: 20,
  stavka: 120,
  cena: 50_000_000,
}

export type NoviOglas = {
  naslov: string
  kategorija: string
  brend: string
  model: string
  stanje: Stanje
  cena: number
  cenaDogovor: boolean
  staraCena: number | null
  opis: string
  slike: string[]
  specifikacije: Specifikacija[]
  uPakovanju: string[]
  stanjeChecklist: ChecklistStavka[]
  godiste: number | null
  satiRada: number | null
  garancija: number | null
  akuSistem: string | null
  lokacija: string
  dostava: Dostava[]
}

function tekst(v: unknown, maks: number): string {
  return typeof v === 'string' ? v.trim().slice(0, maks) : ''
}

function ceoBroj(v: unknown, min: number, maks: number): number | null {
  const n = typeof v === 'number' ? v : typeof v === 'string' && v.trim() ? Number(v) : NaN
  if (!Number.isFinite(n)) return null
  const r = Math.round(n)
  return r < min || r > maks ? null : r
}

/**
 * Proverava telo iz /prodaj i vraća ili čist oglas ili poruku greške.
 * Klijent već validira svaki korak, ali server ne veruje klijentu.
 * `dozvoljeneSlike` je prefiks pod kojim moraju biti URL-ovi fotografija —
 * ne prihvataju se tuđi URL-ovi ni data: URL-ovi.
 */
export function proveriOglas(
  telo: unknown,
  dozvoljenaSlika: (url: string) => boolean,
): { ok: true; oglas: NoviOglas } | { ok: false; greska: string } {
  if (!telo || typeof telo !== 'object') return { ok: false, greska: 'Neispravan zahtev.' }
  const t = telo as Record<string, unknown>

  const naslov = tekst(t.naslov, OGRANICENJA.naslov)
  const model = tekst(t.model, OGRANICENJA.model)
  const kategorija = tekst(t.kategorija, 80)
  const brend = tekst(t.brend, 80)
  const stanje = tekst(t.stanje, 40) as Stanje
  const opis = tekst(t.opis, OGRANICENJA.opis)
  const lokacija = tekst(t.lokacija, 60)

  if (!naslov || naslov.length < 5) return { ok: false, greska: 'Naslov je prekratak.' }
  if (!model) return { ok: false, greska: 'Model je obavezan.' }
  if (!jeListKategorija(kategorija)) return { ok: false, greska: 'Nepoznata kategorija.' }
  const brendPodaci = brendBySlug(brend)
  if (!brendPodaci) return { ok: false, greska: 'Nepoznat brend.' }
  if (!STANJA.includes(stanje)) return { ok: false, greska: 'Nepoznata ocena stanja.' }
  if (opis.length < OGRANICENJA.minOpis) return { ok: false, greska: 'Opis je prekratak.' }
  if (!lokacija) return { ok: false, greska: 'Grad je obavezan.' }

  const cena = ceoBroj(t.cena, 1, OGRANICENJA.cena)
  if (!cena) return { ok: false, greska: 'Cena mora biti veća od nule.' }
  const staraCena = ceoBroj(t.staraCena, cena + 1, OGRANICENJA.cena)

  const slike = Array.isArray(t.slike)
    ? t.slike.filter((u): u is string => typeof u === 'string' && dozvoljenaSlika(u))
    : []
  if (Array.isArray(t.slike) && slike.length !== t.slike.length) {
    return { ok: false, greska: 'Neka fotografija nije ispravno otpremljena. Dodaj je ponovo.' }
  }
  if (slike.length === 0) return { ok: false, greska: 'Dodaj bar jednu fotografiju.' }
  if (slike.length > OGRANICENJA.slike) {
    return { ok: false, greska: `Najviše ${OGRANICENJA.slike} fotografija.` }
  }

  const specifikacije: Specifikacija[] = Array.isArray(t.specifikacije)
    ? t.specifikacije
        .map((x) => ({
          naziv: tekst((x as Specifikacija)?.naziv, 60),
          vrednost: tekst((x as Specifikacija)?.vrednost, 120),
        }))
        .filter((x) => x.naziv && x.vrednost)
        .slice(0, OGRANICENJA.specifikacije)
    : []

  const uPakovanju: string[] = Array.isArray(t.uPakovanju)
    ? t.uPakovanju
        .map((x) => tekst(x, OGRANICENJA.stavka))
        .filter(Boolean)
        .slice(0, OGRANICENJA.uPakovanju)
    : []

  const stanjeChecklist: ChecklistStavka[] = Array.isArray(t.stanjeChecklist)
    ? t.stanjeChecklist
        .map((x) => ({
          stavka: tekst((x as ChecklistStavka)?.stavka, OGRANICENJA.stavka),
          ok: (x as ChecklistStavka)?.ok === true,
        }))
        .filter((x) => x.stavka)
        .slice(0, 30)
    : []
  if (stanje !== 'novo' && stanjeChecklist.length === 0) {
    return { ok: false, greska: 'Lista provere stanja je obavezna za polovan alat.' }
  }

  const dostava = Array.isArray(t.dostava)
    ? ([...new Set(t.dostava)].filter((d) => typeof d === 'string' && DOSTAVE.has(d)) as Dostava[])
    : []
  if (dostava.length === 0) return { ok: false, greska: 'Izaberi bar jedan način preuzimanja.' }

  const akuSistemSirovo = tekst(t.akuSistem, 60)
  const akuSistem =
    akuSistemSirovo && (brendPodaci.akuSistemi ?? []).includes(akuSistemSirovo)
      ? akuSistemSirovo
      : null

  const ovaGodina = new Date().getFullYear()

  return {
    ok: true,
    oglas: {
      naslov,
      kategorija,
      brend,
      model,
      stanje,
      cena,
      cenaDogovor: t.cenaDogovor === true,
      staraCena,
      opis,
      slike,
      specifikacije,
      uPakovanju,
      stanjeChecklist: stanje === 'novo' ? [] : stanjeChecklist,
      godiste: ceoBroj(t.godiste, 1950, ovaGodina),
      satiRada: ceoBroj(t.satiRada, 0, 100_000),
      garancija: ceoBroj(t.garancija, 0, 120),
      akuSistem,
      lokacija,
      dostava,
    },
  }
}
