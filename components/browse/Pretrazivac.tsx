import { Suspense } from 'react'
import { pluralSr, STANJA, stanjeLabela } from '@/lib/format'
import {
  brojAktivnihFiltera,
  brojeviFiltera,
  dostupniAkuSistemi,
  filtrirajOglase,
  kategorijaBySlug,
  stabloKategorija,
  sviBrendovi,
  sviGradovi,
  type Filteri as TipFilteri,
} from '@/lib/queries'
import type { Kategorija } from '@/lib/types'
import { AktivniFilteri, Filteri, SortSelect } from './Filteri'
import MrezaOglasa from './MrezaOglasa'
import s from './Pretrazivac.module.css'
import type { FilterPodaci } from './tipovi'

type Props = {
  filteri: TipFilteri
  /** Kategorija je fiksirana (stranica kategorije) — ne prikazuje se kao izmenljiv filter. */
  zakljucanaKategorija?: Kategorija
  /** Brend je fiksiran (stranica brenda). */
  zakljucanBrend?: string
  /** Putanja bez upita — koristi se u praznom stanju. */
  osnovniHref: string
}

/**
 * Zajednički pregled: rail sa filterima + mreža kartica.
 * Isti doživljaj se koristi na `/oglasi`, na stranici kategorije i na stranici brenda —
 * jedina razlika je koji je filter zaključan.
 */
export function Pretrazivac({
  filteri,
  zakljucanaKategorija,
  zakljucanBrend,
  osnovniHref,
}: Props) {
  const oglasi = filtrirajOglase(filteri)
  const brojevi = brojeviFiltera(filteri)
  const aku = dostupniAkuSistemi(filteri)

  const stablo = stabloKategorija()

  const podaci: FilterPodaci = {
    kategorije: stablo.map(({ kategorija, deca }) => ({
      slug: kategorija.slug,
      naziv: kategorija.naziv,
      broj: brojevi.kategorija[kategorija.slug] ?? 0,
      deca: deca.map((d) => ({
        vrednost: d.slug,
        naziv: d.naziv,
        broj: brojevi.kategorija[d.slug] ?? 0,
      })),
    })),
    stanja: STANJA.map((g) => ({
      vrednost: g,
      naziv: stanjeLabela(g),
      broj: brojevi.stanje[g] ?? 0,
    })),
    brendovi: sviBrendovi()
      .map((b) => ({ vrednost: b.slug, naziv: b.naziv, broj: brojevi.brend[b.slug] ?? 0 }))
      .sort((a, b) => b.broj - a.broj || a.naziv.localeCompare(b.naziv, 'sr')),
    gradovi: sviGradovi().map((g) => ({ vrednost: g, naziv: g, broj: brojevi.grad[g] ?? 0 })),
    akuSistemi: aku.map((a) => ({ vrednost: a, naziv: a, broj: brojevi.aku[a] ?? 0 })),
    zakljucanBrend,
  }

  if (zakljucanaKategorija) {
    const roditelj = zakljucanaKategorija.roditelj
    const deca = stablo.find((x) => x.kategorija.slug === zakljucanaKategorija.slug)?.deca ?? []
    const koren = roditelj ?? zakljucanaKategorija.slug
    podaci.zakljucana = {
      naziv: zakljucanaKategorija.naziv,
      potkategorije: deca.map((d) => ({
        slug: d.slug,
        naziv: d.naziv,
        broj: brojevi.kategorija[d.slug] ?? 0,
        href: `/kategorija/${koren}/${d.slug}`,
      })),
      nazadHref: roditelj ? `/kategorija/${roditelj}` : undefined,
    }
  }

  // Broj aktivnih filtera bez onog koji je zaključan — zaključan se ne skida.
  const zaBrojanje: TipFilteri = { ...filteri }
  if (zakljucanaKategorija) delete zaBrojanje.kategorija
  if (zakljucanBrend) delete zaBrojanje.brend
  const brojFiltera = brojAktivnihFiltera(zaBrojanje)

  const predlozi = [
    { tekst: 'Skini sve filtere', href: osnovniHref },
    ...(zakljucanaKategorija?.roditelj
      ? [
          {
            tekst: `Cela kategorija ${kategorijaBySlug(zakljucanaKategorija.roditelj)?.naziv ?? ''}`,
            href: `/kategorija/${zakljucanaKategorija.roditelj}`,
          },
        ]
      : []),
    { tekst: 'Svi oglasi', href: '/oglasi' },
  ]

  return (
    <div className={s.raspored}>
      <Suspense fallback={<div className={s.railRezerva} aria-hidden="true" />}>
        <Filteri podaci={podaci} brojFiltera={brojFiltera} brojRezultata={oglasi.length} />
      </Suspense>

      <div className={s.rezultati}>
        <div className={s.traka}>
          <p className={s.brojRezultata}>
            <strong>{oglasi.length}</strong>{' '}
            {pluralSr(oglasi.length, ['oglas', 'oglasa', 'oglasa'])}
          </p>
          <Suspense fallback={null}>
            <SortSelect />
          </Suspense>
        </div>

        <Suspense fallback={null}>
          <AktivniFilteri podaci={podaci} />
        </Suspense>

        <MrezaOglasa oglasi={oglasi} praznoPredlozi={predlozi} />
      </div>
    </div>
  )
}

export default Pretrazivac
