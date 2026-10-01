'use client'

import { useEffect, useMemo, useState } from 'react'
import OglasKartica from '@/components/OglasKartica'
import Prazno from '@/components/Prazno'
import SacuvajDugme, { useSacuvani } from '@/components/SacuvajDugme'
import { obrisiSve } from '@/components/sacuvano/skladiste'
import { pluralSr } from '@/lib/format'
import type { Oglas } from '@/lib/types'
import s from './SacuvanaLista.module.css'

type Props = {
  /** Ulazi u kategorije za prazno stanje — dolaze sa servera. */
  predlozi: { tekst: string; href: string }[]
}

/**
 * Sačuvani oglasi žive u localStorage-u, pa se lista može sastaviti tek u
 * pregledaču: traže se samo ti slugovi (/api/oglasi/kartice). Oglas koji je
 * u međuvremenu prodat ili obrisan se jednostavno ne vraća.
 */
export function SacuvanaLista({ predlozi }: Props) {
  const sacuvani = useSacuvani()
  const [oglasi, setOglasi] = useState<Map<string, Oglas> | null>(null)
  const [potvrda, setPotvrda] = useState(false)

  const kljuc = [...sacuvani].sort().join(',')
  useEffect(() => {
    let otkazano = false
    if (!kljuc) {
      setOglasi(new Map())
      return
    }
    fetch(`/api/oglasi/kartice?slug=${encodeURIComponent(kljuc)}`)
      .then((r) => r.json())
      .then((d: { oglasi: Oglas[] }) => {
        if (!otkazano) setOglasi(new Map(d.oglasi.map((o) => [o.slug, o])))
      })
      .catch(() => {
        if (!otkazano) setOglasi(new Map())
      })
    return () => {
      otkazano = true
    }
  }, [kljuc])

  const ucitano = oglasi !== null

  // Redosled iz localStorage-a je „poslednje sačuvano prvo" — zadržava se.
  const prikazani = useMemo(
    () => (oglasi ? sacuvani.filter((slug) => oglasi.has(slug)) : []),
    [sacuvani, oglasi],
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
            čuva u ovom pregledaču, bez prijave.
          </>
        }
        predlozi={predlozi}
        akcijaHref="/oglasi"
        akcijaTekst="Pregledaj oglase"
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
            <OglasKartica oglas={oglasi!.get(slug)!} kompaktno />
            <SacuvajDugme slug={slug} varijanta="dugme" className={s.ukloni} />
          </li>
        ))}
      </ul>
    </>
  )
}

export default SacuvanaLista
