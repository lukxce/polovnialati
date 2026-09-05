'use client'

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Ikona } from '@/components/Ikone'
import { brojSr } from '@/lib/format'
import type { Stanje } from '@/lib/types'
import s from './OglasiProdavca.module.css'

export type StavkaOglasa = {
  id: string
  /** leaf slug kategorije */
  kategorija: string
  stanje: Stanje
  /** Kartica je renderovana na serveru — katalog ne ulazi u klijentski bundle. */
  kartica: ReactNode
}

export type Opcija = { vrednost: string; naziv: string; broj: number }

type Props = {
  stavke: StavkaOglasa[]
  kategorije: Opcija[]
  stanja: Opcija[]
}

/**
 * Lagan filter nad oglasima jednog prodavca. Puni `BrowseLayout` ovde nije
 * potreban — prodavac ima najviše desetak oglasa, pa se sve rešava sa dva reda
 * čipova. Izbor ide u URL da preživi osvežavanje i dugme „nazad".
 */
type Izbor = { kategorija?: string; stanje?: string }

function procitajIzbor(pretraga: string): Izbor {
  const usp = new URLSearchParams(pretraga)
  return {
    kategorija: usp.get('kategorija') ?? undefined,
    stanje: usp.get('stanje') ?? undefined,
  }
}

export function OglasiProdavca({ stavke, kategorije, stanja }: Props) {
  const [izbor, setIzbor] = useState<Izbor>({})

  /* Izbor se drži u URL-u preko native History API-ja. `useSearchParams` bi
     tražio Suspense granicu oko cele mreže, pa oglasi ovog prodavca ne bi bili
     u prerenderovanom HTML-u nego iza skeleta. Početna vrednost se čita tek
     posle montiranja, pa nema neslaganja sa serverskim renderom. */
  useEffect(() => {
    setIzbor(procitajIzbor(window.location.search))
    const naPovratak = () => setIzbor(procitajIzbor(window.location.search))
    window.addEventListener('popstate', naPovratak)
    return () => window.removeEventListener('popstate', naPovratak)
  }, [])

  const vazeciKategorija = kategorije.some((k) => k.vrednost === izbor.kategorija)
    ? izbor.kategorija
    : undefined
  const vazeciStanje = stanja.some((k) => k.vrednost === izbor.stanje) ? izbor.stanje : undefined

  /**
   * Upis u URL ide van `setIzbor` ažurirača: Next.js osluškuje `replaceState`,
   * pa bi poziv unutar ažurirača (koji se izvršava tokom rendera) značio
   * postavljanje stanja rutera usred rendera ove komponente.
   */
  const primeni = useCallback((sledeci: Izbor) => {
    const usp = new URLSearchParams(window.location.search)
    for (const kljuc of ['kategorija', 'stanje'] as const) {
      const v = sledeci[kljuc]
      if (v) usp.set(kljuc, v)
      else usp.delete(kljuc)
    }
    const q = usp.toString()
    window.history.replaceState(null, '', q ? `?${q}` : window.location.pathname)
    setIzbor(sledeci)
  }, [])

  const vidljive = useMemo(
    () =>
      stavke.filter(
        (st) =>
          (!vazeciKategorija || st.kategorija === vazeciKategorija) &&
          (!vazeciStanje || st.stanje === vazeciStanje),
      ),
    [stavke, vazeciKategorija, vazeciStanje],
  )

  const imaFilter = !!vazeciKategorija || !!vazeciStanje

  return (
    <div className={s.blok}>
      <div className={s.filteri}>
        {kategorije.length > 1 ? (
          <div className={s.grupa}>
            <p className="micro" id="filter-kategorija">
              Kategorija
            </p>
            <ul className={['chip-traka', s.traka].join(' ')} aria-labelledby="filter-kategorija">
              <li>
                <button
                  type="button"
                  className="chip"
                  aria-pressed={!vazeciKategorija}
                  onClick={() => primeni({ ...izbor, kategorija: undefined })}
                >
                  Sve
                  <span className="chip-brojac">{stavke.length}</span>
                </button>
              </li>
              {kategorije.map((k) => (
                <li key={k.vrednost}>
                  <button
                    type="button"
                    className="chip"
                    aria-pressed={vazeciKategorija === k.vrednost}
                    onClick={() =>
                      primeni({
                        ...izbor,
                        kategorija: vazeciKategorija === k.vrednost ? undefined : k.vrednost,
                      })
                    }
                  >
                    {k.naziv}
                    <span className="chip-brojac">{k.broj}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {stanja.length > 1 ? (
          <div className={s.grupa}>
            <p className="micro" id="filter-stanje">
              Stanje
            </p>
            <ul className={['chip-traka', s.traka].join(' ')} aria-labelledby="filter-stanje">
              <li>
                <button
                  type="button"
                  className="chip"
                  aria-pressed={!vazeciStanje}
                  onClick={() => primeni({ ...izbor, stanje: undefined })}
                >
                  Sve
                  <span className="chip-brojac">{stavke.length}</span>
                </button>
              </li>
              {stanja.map((k) => (
                <li key={k.vrednost}>
                  <button
                    type="button"
                    className="chip"
                    aria-pressed={vazeciStanje === k.vrednost}
                    onClick={() =>
                      primeni({
                        ...izbor,
                        stanje: vazeciStanje === k.vrednost ? undefined : k.vrednost,
                      })
                    }
                  >
                    {k.naziv}
                    <span className="chip-brojac">{k.broj}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <p className={s.brojac} role="status">
        {brojSr(vidljive.length, ['oglas', 'oglasa', 'oglasa'])}
        {imaFilter ? ` od ukupno ${stavke.length}` : ''}
      </p>

      {vidljive.length === 0 ? (
        <div className={s.prazno}>
          <span className={s.praznoKrug}>
            <Ikona ime="filter" velicina={24} />
          </span>
          <h3 className={s.praznoNaslov}>Nema oglasa za ovaj izbor</h3>
          <p className={s.praznoOpis}>
            Ovaj prodavac ima oglase, ali nijedan ne odgovara kombinaciji kategorije i stanja koju
            si izabrao.
          </p>
          <button type="button" className="btn btn-tertiary" onClick={() => primeni({})}>
            Poništi filter
          </button>
        </div>
      ) : (
        <ul className="mreza">
          {vidljive.map((st) => (
            <li key={st.id} className={s.stavka}>
              {st.kartica}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default OglasiProdavca
