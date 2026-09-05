'use client'

import { useMemo, useState } from 'react'
import { Ikona } from '@/components/Ikone'
import { brojSr } from '@/lib/format'
import { brojAktivnihFiltera, type Filteri } from '@/lib/filteri'
import DonjiList from './DonjiList'
import FilterSadrzaj from './FilterSadrzaj'
import { aktivneOznake, obrisiSve as bezFiltera } from './oznake'
import type { BrowseFasete } from './podaci'
import { useFilteri } from './useFilteri'
import s from './BrowseLayout.module.css'

export const SORTIRANJA: { vrednost: NonNullable<Filteri['sort']>; oznaka: string; opis: string }[] =
  [
    { vrednost: 'najnovije', oznaka: 'Najnovije', opis: 'Poslednje objavljeno na vrhu' },
    { vrednost: 'cena-rastuce', oznaka: 'Cena rastuće', opis: 'Od najjeftinijeg' },
    { vrednost: 'cena-opadajuce', oznaka: 'Cena opadajuće', opis: 'Od najskupljeg' },
    { vrednost: 'najgledanije', oznaka: 'Najgledanije', opis: 'Najviše pregleda do sada' },
  ]

type Props = {
  filteri: Filteri
  fasete: BrowseFasete
  /** Putanja na koju filteri pišu query, npr. `/oglasi`. */
  osnova: string
  /** Kategorija zaključana putanjom (kategorijska strana). */
  zakljucanaKategorija?: string
  /** Brend zaključan putanjom (`/brend/[brend]`). */
  zakljucanBrend?: string
  /** Rezultati — mreža kartica ili prazno stanje, renderovani na serveru. */
  children: React.ReactNode
}

/**
 * Ljuska pretrage: filter kolona na desktopu, zakucana traka + listovi pune
 * visine na telefonu, traka aktivnih filtera i brojač rezultata. Rezultati
 * stižu kao `children` da bi ostali serverska komponenta.
 */
export function BrowseLayout({
  filteri,
  fasete,
  osnova,
  zakljucanaKategorija,
  zakljucanBrend,
  children,
}: Props) {
  const { idi, postavi, uToku } = useFilteri(filteri, osnova, zakljucanaKategorija, zakljucanBrend)
  const [listFiltera, setListFiltera] = useState(false)
  const [listSorta, setListSorta] = useState(false)

  const imena = useMemo(() => {
    const kategorije: Record<string, string> = {}
    for (const g of fasete.stablo) {
      kategorije[g.kategorija.slug] = g.kategorija.naziv
      for (const d of g.deca) kategorije[d.slug] = d.naziv
    }
    const brendovi: Record<string, string> = {}
    for (const b of fasete.brendovi) brendovi[b.slug] = b.naziv
    return { kategorije, brendovi }
  }, [fasete.stablo, fasete.brendovi])

  const oznake = aktivneOznake(filteri, imena, zakljucanaKategorija, zakljucanBrend)
  const brojFiltera =
    brojAktivnihFiltera(filteri) - (zakljucanaKategorija ? 1 : 0) - (zakljucanBrend ? 1 : 0)
  const sort = filteri.sort ?? 'najnovije'
  const sortOznaka = SORTIRANJA.find((x) => x.vrednost === sort)?.oznaka ?? 'Najnovije'
  const rezultati = brojSr(fasete.ukupno, ['oglas', 'oglasa', 'oglasa'])

  const ocisti = () => idi(bezFiltera(filteri, zakljucanaKategorija, zakljucanBrend))

  const filterProps = {
    filteri,
    fasete,
    postavi,
    obrisiSve: ocisti,
    zakljucanaKategorija,
    zakljucanBrend,
  }

  return (
    <div className={s.raspored}>
      <aside className={s.rail} aria-label="Filteri">
        <div className={s.railKlizac}>
          <FilterSadrzaj {...filterProps} varijanta="rail" />
        </div>
      </aside>

      <div className={s.kolona}>
        <div className={s.vrh}>
          <p className={s.brojac} aria-live="polite">
            <strong>{rezultati}</strong>
            {brojFiltera > 0 ? (
              <span className={s.brojacDodatak}>
                {' '}
                uz {brojSr(brojFiltera, ['filter', 'filtera', 'filtera'])}
              </span>
            ) : null}
          </p>

          <label className={s.sortOmot}>
            <span className={s.sortOznaka}>Sortiraj</span>
            <select
              className={s.sortSelect}
              value={sort}
              onChange={(e) => postavi({ sort: e.target.value as Filteri['sort'] })}
            >
              {SORTIRANJA.map((o) => (
                <option key={o.vrednost} value={o.vrednost}>
                  {o.oznaka}
                </option>
              ))}
            </select>
          </label>
        </div>

        {oznake.length > 0 ? (
          <div className={s.cipoviOmot}>
            <ul className={['chip-traka', s.cipovi].join(' ')}>
              {oznake.map((o) => (
                <li key={o.id}>
                  <button
                    type="button"
                    className={['chip', s.cip].join(' ')}
                    onClick={() => idi(o.bezNje)}
                  >
                    <span className={s.cipGrupa}>{o.grupa}</span>
                    <span className={s.cipTekst}>{o.tekst}</span>
                    <Ikona ime="x" velicina={14} className={s.cipX} />
                    <span className="sr-only">, ukloni filter</span>
                  </button>
                </li>
              ))}
              <li>
                <button type="button" className={[s.obrisiSve].join(' ')} onClick={ocisti}>
                  Obriši sve
                </button>
              </li>
            </ul>
          </div>
        ) : null}

        <div className={uToku ? s.uToku : undefined}>{children}</div>
      </div>

      {/* ── Mobilna zakucana traka ─────────────────────────────── */}
      <div className={s.mobTraka}>
        <button type="button" className={s.mobDugme} onClick={() => setListFiltera(true)}>
          <Ikona ime="filter" velicina={19} />
          Filteri
          {brojFiltera > 0 ? <span className={s.mobZnacka}>{brojFiltera}</span> : null}
        </button>
        <span className={s.mobPodela} aria-hidden="true" />
        <button type="button" className={s.mobDugme} onClick={() => setListSorta(true)}>
          <Ikona ime="sort" velicina={19} />
          {sortOznaka}
        </button>
      </div>

      <DonjiList
        otvoren={listFiltera}
        zatvori={() => setListFiltera(false)}
        naslov="Filteri"
        podnaslov={`${rezultati} trenutno odgovara izboru`}
        podnozje={
          <div className={s.listPodnozje}>
            <button type="button" className="btn btn-ghost" onClick={ocisti}>
              Poništi
            </button>
            <button
              type="button"
              className="btn btn-primary btn-veliki btn-puni"
              onClick={() => setListFiltera(false)}
            >
              Prikaži {rezultati}
            </button>
          </div>
        }
      >
        <FilterSadrzaj {...filterProps} varijanta="list" />
      </DonjiList>

      <DonjiList
        otvoren={listSorta}
        zatvori={() => setListSorta(false)}
        naslov="Sortiraj"
        podnaslov="Izdvojeni oglasi ostaju na vrhu u svakom redosledu."
        podnozje={
          <button
            type="button"
            className="btn btn-primary btn-veliki btn-puni"
            onClick={() => setListSorta(false)}
          >
            Prikaži {rezultati}
          </button>
        }
      >
        <ul className={s.sortLista}>
          {SORTIRANJA.map((o) => {
            const izabran = o.vrednost === sort
            return (
              <li key={o.vrednost}>
                <button
                  type="button"
                  className={[s.sortRed, izabran ? s.sortRedAktivan : ''].filter(Boolean).join(' ')}
                  aria-pressed={izabran}
                  onClick={() => {
                    postavi({ sort: o.vrednost })
                    setListSorta(false)
                  }}
                >
                  <span>
                    <span className={s.sortRedIme}>{o.oznaka}</span>
                    <span className={s.sortRedOpis}>{o.opis}</span>
                  </span>
                  {izabran ? <Ikona ime="cek" velicina={19} /> : null}
                </button>
              </li>
            )
          })}
        </ul>
      </DonjiList>
    </div>
  )
}

export default BrowseLayout
