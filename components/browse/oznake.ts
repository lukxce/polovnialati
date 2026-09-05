import { dostavaLabela, formatCena, stanjeLabela, tipProdavcaLabela } from '@/lib/format'
import type { Filteri } from '@/lib/filteri'
import type { Dostava, Stanje, TipProdavca } from '@/lib/types'

/**
 * Jedan aktivan filter, spreman za čip: šta piše i koji skup filtera ostaje
 * kada se skine. Namerno je čista funkcija bez pristupa `data/` —
 * imena kategorija i brendova stižu kao mapa, pa je isti kod upotrebljiv
 * i na serveru (prazno stanje) i u klijentu (traka čipova).
 */
export type AktivnaOznaka = {
  id: string
  /** Naziv dimenzije, npr. „Brend". */
  grupa: string
  /** Vrednost, npr. „Makita". */
  tekst: string
  /** Filteri nakon uklanjanja ove stavke. */
  bezNje: Filteri
}

export type ImenaFiltera = {
  kategorije: Record<string, string>
  brendovi: Record<string, string>
}

function bezIzListe<T extends string>(lista: T[] | undefined, v: T): T[] | undefined {
  const novo = (lista ?? []).filter((x) => x !== v)
  return novo.length ? novo : undefined
}

export function aktivneOznake(
  f: Filteri,
  imena: ImenaFiltera,
  zakljucanaKategorija?: string,
  zakljucanBrend?: string,
): AktivnaOznaka[] {
  const lista: AktivnaOznaka[] = []

  if (f.q) {
    lista.push({ id: 'q', grupa: 'Pretraga', tekst: `„${f.q}"`, bezNje: { ...f, q: undefined } })
  }

  if (f.kategorija && f.kategorija !== zakljucanaKategorija) {
    lista.push({
      id: `kategorija:${f.kategorija}`,
      grupa: 'Kategorija',
      tekst: imena.kategorije[f.kategorija] ?? f.kategorija,
      bezNje: { ...f, kategorija: zakljucanaKategorija },
    })
  }

  for (const s of f.stanje ?? []) {
    lista.push({
      id: `stanje:${s}`,
      grupa: 'Stanje',
      tekst: stanjeLabela(s),
      bezNje: { ...f, stanje: bezIzListe<Stanje>(f.stanje, s) },
    })
  }

  if (f.cenaOd !== undefined || f.cenaDo !== undefined) {
    const tekst =
      f.cenaOd !== undefined && f.cenaDo !== undefined
        ? `${formatCena(f.cenaOd)} – ${formatCena(f.cenaDo)}`
        : f.cenaOd !== undefined
          ? `od ${formatCena(f.cenaOd)}`
          : `do ${formatCena(f.cenaDo as number)}`
    lista.push({
      id: 'cena',
      grupa: 'Cena',
      tekst,
      bezNje: { ...f, cenaOd: undefined, cenaDo: undefined },
    })
  }

  for (const b of f.brend ?? []) {
    // Brend strane drži putanja, pa se ne nudi kao čip koji se skida —
    // njegov ✕ ionako ne bi imao gde da odvede.
    if (b === zakljucanBrend) continue
    lista.push({
      id: `brend:${b}`,
      grupa: 'Brend',
      tekst: imena.brendovi[b] ?? b,
      bezNje: { ...f, brend: bezIzListe(f.brend, b) },
    })
  }

  for (const a of f.aku ?? []) {
    lista.push({
      id: `aku:${a}`,
      grupa: 'Baterija',
      tekst: a,
      bezNje: { ...f, aku: bezIzListe(f.aku, a) },
    })
  }

  if (f.grad) {
    lista.push({
      id: 'grad',
      grupa: 'Grad',
      tekst: f.grad,
      bezNje: { ...f, grad: undefined },
    })
  }

  if (f.garancija) {
    lista.push({
      id: 'garancija',
      grupa: 'Garancija',
      tekst: 'Ima garanciju',
      bezNje: { ...f, garancija: undefined },
    })
  }

  for (const d of f.dostava ?? []) {
    lista.push({
      id: `dostava:${d}`,
      grupa: 'Dostava',
      tekst: dostavaLabela(d as Dostava),
      bezNje: { ...f, dostava: bezIzListe(f.dostava, d) },
    })
  }

  for (const t of f.tip ?? []) {
    lista.push({
      id: `tip:${t}`,
      grupa: 'Prodavac',
      tekst: tipProdavcaLabela(t as TipProdavca),
      bezNje: { ...f, tip: bezIzListe(f.tip, t) },
    })
  }

  return lista
}

/** Prazni filteri, uz čuvanje sortiranja, pretrage i onoga što drži putanja. */
export function obrisiSve(f: Filteri, zakljucanaKategorija?: string, zakljucanBrend?: string): Filteri {
  return {
    sort: f.sort,
    q: f.q,
    kategorija: zakljucanaKategorija,
    brend: zakljucanBrend ? [zakljucanBrend] : undefined,
  }
}
