'use client'

import { useEffect, useState } from 'react'
import { Ikona } from '@/components/Ikone'
import { STANJA, stanjeDefinicija, stanjeLabela } from '@/lib/format'
import type { Stanje } from '@/lib/types'
import s from './StanjeChip.module.css'

type Props = {
  stanje: Stanje
  /** Veći čip za stranicu oglasa. */
  veliki?: boolean
  /** Prikaži definiciju odmah pored labele (detalj oglasa). */
  saDefinicijom?: boolean
  className?: string
}

/**
 * Čip ocene stanja. Tap na bilo koji čip otvara list sa svih pet definicija —
 * pet ocena je rečnik proizvoda i uči se na jednom mestu.
 */
export function StanjeChip({ stanje, veliki, saDefinicijom, className }: Props) {
  const [otvoren, setOtvoren] = useState(false)

  useEffect(() => {
    if (!otvoren) return
    const naEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOtvoren(false)
    }
    document.addEventListener('keydown', naEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', naEsc)
      document.body.style.overflow = ''
    }
  }, [otvoren])

  return (
    <>
      <button
        type="button"
        className={[
          'stanje-chip',
          `stanje-${stanje}`,
          veliki ? 'stanje-chip-veliki' : '',
          s.chip,
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOtvoren(true)
        }}
        aria-haspopup="dialog"
        title="Objašnjenje ocena stanja"
      >
        {stanjeLabela(stanje)}
        {saDefinicijom ? <span className={s.uzDefiniciju}>{stanjeDefinicija(stanje)}</span> : null}
      </button>

      {otvoren ? (
        <div
          className={s.zastor}
          role="dialog"
          aria-modal="true"
          aria-label="Ocene stanja"
          onClick={() => setOtvoren(false)}
        >
          <div className={s.list} onClick={(e) => e.stopPropagation()}>
            <div className={s.zaglavlje}>
              <div>
                <p className="micro">Rečnik Alatnice</p>
                <h3>Ocene stanja</h3>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-mali"
                onClick={() => setOtvoren(false)}
                aria-label="Zatvori"
              >
                <Ikona ime="x" velicina={18} />
              </button>
            </div>

            <p className={s.uvod}>
              Svaki oglas nosi jednu od pet ocena. Definicije su iste za sve prodavce i ne mogu se
              menjati slobodnim tekstom.
            </p>

            <ul className={s.lista}>
              {STANJA.map((g) => (
                <li key={g} className={g === stanje ? s.stavkaAktivna : s.stavka}>
                  <span className={`stanje-chip stanje-${g}`}>{stanjeLabela(g)}</span>
                  <p>{stanjeDefinicija(g)}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default StanjeChip
