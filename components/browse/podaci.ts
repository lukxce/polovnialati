import {
  brojeviFiltera,
  dostupniAkuSistemi,
  filtrirajOglase,
  stabloKategorija,
  sviBrendovi,
  sviGradovi,
  type Filteri,
} from '@/lib/queries'
import type { Brend, Dostava, Kategorija, Oglas, TipProdavca } from '@/lib/types'

/**
 * Facet brojevi za sve dimenzije filtera.
 *
 * `lib/queries.brojeviFiltera` pokriva pet dimenzija; garancija, dostava i tip
 * prodavca se ovde dobrojavaju istom logikom („svi ostali filteri primenjeni,
 * ova dimenzija isključena"), da nijedna opcija u UI-ju ne ostane bez broja.
 */
export type BrowseBrojevi = {
  kategorija: Record<string, number>
  brend: Record<string, number>
  stanje: Record<string, number>
  grad: Record<string, number>
  aku: Record<string, number>
  tip: Record<TipProdavca, number>
  dostava: Record<Dostava, number>
  garancija: number
}

/** Sve što filter UI treba, a što ne sme da uđe u klijentski bundle kao podaci. */
export type BrowseFasete = {
  brojevi: BrowseBrojevi
  stablo: { kategorija: Kategorija; deca: Kategorija[] }[]
  brendovi: Brend[]
  gradovi: string[]
  /** Prazan niz ⇒ filter „Akumulatorski sistem" se uopšte ne prikazuje. */
  akuSistemi: string[]
  ukupno: number
}

export type BrowsePodaci = BrowseFasete & { rezultati: Oglas[] }

/**
 * Jedan poziv koji vraća i rezultate i sve fasete za dati skup filtera.
 * Koristi ga i `/oglasi` i `/kategorija/[...slug]`.
 */
export async function pripremiBrowse(f: Filteri): Promise<BrowsePodaci> {
  const [rezultati, osnovni, bezTipa, bezDostave, bezGarancije, gradovi, akuSistemi] =
    await Promise.all([
      filtrirajOglase(f),
      brojeviFiltera(f),
      filtrirajOglase({ ...f, tip: undefined }),
      filtrirajOglase({ ...f, dostava: undefined }),
      filtrirajOglase({ ...f, garancija: undefined }),
      sviGradovi(),
      dostupniAkuSistemi(f),
    ])

  const tip: Record<TipProdavca, number> = {
    'privatno-lice': 0,
    prodavnica: 0,
    servis: 0,
  }
  for (const o of bezTipa) tip[o.prodavacTip] += 1

  const dostava: Record<Dostava, number> = { licno: 0, kurirska: 0, besplatna: 0, pouzece: 0 }
  for (const o of bezDostave) {
    for (const d of o.dostava) dostava[d] += 1
  }

  const garancija = bezGarancije.filter((o) => (o.garancija ?? 0) > 0).length

  return {
    rezultati,
    ukupno: rezultati.length,
    brojevi: { ...osnovni, tip, dostava, garancija },
    stablo: stabloKategorija(),
    brendovi: sviBrendovi(),
    gradovi,
    akuSistemi,
  }
}

/** Fasete bez rezultata — tačno ono što `BrowseLayout` prima kao prop. */
export function samoFasete(p: BrowsePodaci): BrowseFasete {
  const { rezultati: _rezultati, ...ostalo } = p
  void _rezultati
  return ostalo
}
