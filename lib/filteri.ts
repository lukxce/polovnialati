/**
 * Oblik filtera i čiste funkcije nad njim.
 *
 * Namerno je odvojeno od `lib/queries.ts`: queries na vrhu modula uvlači ceo
 * `data/oglasi.ts`, pa svaka klijentska komponenta koja odatle uzme makar
 * jednu funkciju povuče i ceo katalog u browser bundle. Ovde nema pristupa
 * podacima, pa je bezbedno za `'use client'`.
 *
 * `parseFiltere` ostaje u queries jer proverava sluge kroz podatke i zove se
 * isključivo na serveru.
 */
import type { Prodavac, Stanje } from '@/lib/types'

export type Filteri = {
  kategorija?: string
  brend?: string[]
  stanje?: Stanje[]
  cenaOd?: number
  cenaDo?: number
  grad?: string
  aku?: string[]
  garancija?: boolean
  dostava?: string[]
  tip?: Prodavac['tip'][]
  q?: string
  sort?: 'najnovije' | 'cena-rastuce' | 'cena-opadajuce' | 'najgledanije'
}

/** Serijalizacija filtera u query string. Prazne vrednosti se izostavljaju. */
export function filteriUQuery(f: Filteri): string {
  const usp = new URLSearchParams()

  if (f.kategorija) usp.set('kategorija', f.kategorija)
  if (f.brend?.length) usp.set('brend', f.brend.join(','))
  if (f.stanje?.length) usp.set('stanje', f.stanje.join(','))
  if (f.cenaOd !== undefined) usp.set('cenaOd', String(f.cenaOd))
  if (f.cenaDo !== undefined) usp.set('cenaDo', String(f.cenaDo))
  if (f.grad) usp.set('grad', f.grad)
  if (f.aku?.length) usp.set('aku', f.aku.join(','))
  if (f.garancija) usp.set('garancija', '1')
  if (f.dostava?.length) usp.set('dostava', f.dostava.join(','))
  if (f.tip?.length) usp.set('tip', f.tip.join(','))
  if (f.q) usp.set('q', f.q)
  if (f.sort && f.sort !== 'najnovije') usp.set('sort', f.sort)

  return usp.toString()
}

/** Broj aktivnih filtera — za oznaku „Filteri (n)" na telefonu. */
export function brojAktivnihFiltera(f: Filteri): number {
  let n = 0
  if (f.kategorija) n++
  if (f.brend?.length) n += f.brend.length
  if (f.stanje?.length) n += f.stanje.length
  if (f.cenaOd !== undefined || f.cenaDo !== undefined) n++
  if (f.grad) n++
  if (f.aku?.length) n += f.aku.length
  if (f.garancija) n++
  if (f.dostava?.length) n += f.dostava.length
  if (f.tip?.length) n += f.tip.length
  if (f.q) n++
  return n
}
