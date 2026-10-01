import { brendovi } from '@/data/brendovi'
import { kategorije } from '@/data/kategorije'
import type { Brend, Kategorija } from '@/lib/types'

/**
 * Taksonomija (kategorije i brendovi) je fiksna i živi u kodu, ne u bazi.
 * Ovaj modul nema pristup bazi, pa je bezbedan i za klijentske komponente.
 */

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

/** Samo listovi stabla — jedine kategorije u koje oglas sme da se upiše. */
export function jeListKategorija(slug: string): boolean {
  const k = kategorijaBySlug(slug)
  return !!k?.roditelj
}

const DECA_PO_RODITELJU = new Map<string, string[]>()
for (const k of kategorije) {
  if (!k.roditelj) continue
  const lista = DECA_PO_RODITELJU.get(k.roditelj) ?? []
  lista.push(k.slug)
  DECA_PO_RODITELJU.set(k.roditelj, lista)
}

/** Sam slug + svi listovi ispod njega. Radi i za nadkategoriju i za list. */
export function kategorijaISveDeca(slug: string): Set<string> {
  const set = new Set<string>([slug])
  for (const dete of DECA_PO_RODITELJU.get(slug) ?? []) set.add(dete)
  return set
}

export function sviBrendovi(): Brend[] {
  return brendovi
}

export function brendBySlug(slug: string): Brend | undefined {
  return brendovi.find((b) => b.slug === slug)
}
