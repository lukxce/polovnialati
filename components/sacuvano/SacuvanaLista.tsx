'use client'

import { type ReactNode, useEffect, useMemo, useState } from 'react'
import Prazno from '@/components/Prazno'
import SacuvajDugme, { useSacuvani } from '@/components/SacuvajDugme'
import { obrisiSve } from '@/components/sacuvano/skladiste'
import { pluralSr } from '@/lib/format'
import s from './SacuvanaLista.module.css'

export type SacuvanaStavka = {
  slug: string
  /** Kartica se renderuje na serveru i ovde se samo bira koja se prikazuje. */
  kartica: ReactNode
}

type Props = {
  stavke: SacuvanaStavka[]
  /** Ulazi u kategorije za prazno stanje — dolaze sa servera. */
  predlozi: { tekst: string; href: string }[]
  /** Ukupno oglasa u katalogu, za tekst praznog stanja. */
  ukupnoOglasa: number
}

/**
 * Sačuvani oglasi žive u localStorage-u, pa se lista može sastaviti tek u
 * pregledaču. Sve kartice stižu sa servera kao gotovi čvorovi; ovde se samo
 * bira koje se montiraju — tako klijent ne dobija bazu oglasa u bundle.
 */
export function SacuvanaLista({ stavke, predlozi, ukupnoOglasa }: Props) {
  const sacuvani = useSacuvani()
  const [ucitano, setUcitano] = useState(false)
  const [potvrda, setPotvrda] = useState(false)

  useEffect(() => setUcitano(true), [])

  const poSlugu = useMemo(
    () => new Map(stavke.map((st) => [st.slug, st.kartica])),
    [stavke],
  )

  // Redosled iz localStorage-a je „poslednje sačuvano prvo" — zadržava se.
  const prikazani = useMemo(
    () => sacuvani.filter((slug) => poSlugu.has(slug)),
    [sacuvani, poSlugu],
  )

  useEffect(() => {
    if (prikazani.length === 0) setPotvrda(false)
  }, [prikazani.length])

  if (!ucitano) {
    return (
      <div aria-busy="true">
        <span className="sr-only">Učitavanje sačuvanih oglasa…</span>
        <ul className="mreza">
          {[0, 1, 2, 3].map((i) => (
            <li key={i} className={s.stavka}>
              <div className={['skeleton', s.skKartica].join(' ')} />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (prikazani.length === 0) {
    return (
      <Prazno
        ikona="srce"
        naslov="Ovde još nema ništa sačuvano"
        opis={
          <>
            Srce u gornjem desnom uglu svake kartice stavlja oglas na ovu listu. Korisno je kada
            porediš tri iste bušilice od tri prodavca, ili kada čekaš da neko spusti cenu. Lista se
            čuva u ovom pregledaču: nema naloga i ništa ne odlazi na server.
          </>
        }
        predlozi={predlozi}
        akcijaHref="/oglasi"
        akcijaTekst={`Pregledaj svih ${ukupnoOglasa} oglasa`}
      />
    )
  }

  return (
    <>
      <div className={s.traka}>
        <p className={s.brojac}>
          <strong className="tabular">{prikazani.length}</strong>{' '}
          {pluralSr(prikazani.length, ['sačuvan oglas', 'sačuvana oglasa', 'sačuvanih oglasa'])}
        </p>

        {potvrda ? (
          <span className={s.potvrda}>
            <span className={s.potvrdaTekst}>Obrisati celu listu?</span>
            <button
              type="button"
              className="btn btn-secondary btn-mali"
              onClick={() => {
                obrisiSve()
                setPotvrda(false)
              }}
            >
              Obriši
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-mali"
              onClick={() => setPotvrda(false)}
            >
              Odustani
            </button>
          </span>
        ) : (
          <button
            type="button"
            className="btn btn-ghost btn-mali"
            onClick={() => setPotvrda(true)}
          >
            Obriši sve
          </button>
        )}
      </div>

      <ul className="mreza">
        {prikazani.map((slug) => (
          <li key={slug} className={s.stavka}>
            {poSlugu.get(slug)}
            <SacuvajDugme slug={slug} varijanta="dugme" className={s.ukloni} />
          </li>
        ))}
      </ul>
    </>
  )
}

export default SacuvanaLista
