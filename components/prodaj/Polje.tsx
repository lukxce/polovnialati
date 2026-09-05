'use client'

import type { ReactNode } from 'react'
import s from './tok.module.css'

type Props = {
  /** `id` kontrole koju oznaka opisuje. */
  id: string
  oznaka: string
  /** Kratko objašnjenje ispod oznake — zašto se polje uopšte traži. */
  pomoc?: ReactNode
  greska?: string
  obavezno?: boolean
  /** Sitan tekst uz desnu ivicu oznake (npr. brojač znakova). */
  brojac?: ReactNode
  children: ReactNode
}

/**
 * Omotač jednog polja: oznaka, pomoć, kontrola, poruka greške.
 * Greška se vezuje preko `aria-describedby` — id je `${id}-greska`.
 */
export function Polje({ id, oznaka, pomoc, greska, obavezno, brojac, children }: Props) {
  return (
    <div className={s.poljeGrupa}>
      <div className={s.oznakaRed}>
        <label className="polje-oznaka" htmlFor={id}>
          {oznaka}
          {obavezno ? (
            <span className={s.obavezno} aria-hidden="true">
              {' '}
              *
            </span>
          ) : null}
        </label>
        {brojac ? <span className={s.brojac}>{brojac}</span> : null}
      </div>

      {pomoc ? <p className={s.pomoc}>{pomoc}</p> : null}

      {children}

      {greska ? (
        <p className={s.greska} id={`${id}-greska`} role="alert">
          {greska}
        </p>
      ) : null}
    </div>
  )
}

export default Polje
