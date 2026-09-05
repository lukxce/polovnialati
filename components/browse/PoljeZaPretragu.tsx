'use client'

import Form from 'next/form'
import { useEffect, useId, useState } from 'react'
import { Ikona } from '@/components/Ikone'
import s from './PoljeZaPretragu.module.css'

type Props = {
  /** Početna vrednost (npr. na stranici rezultata). */
  vrednost?: string
  /** Primeri koji se smenjuju u placeholderu — po kategorijama. */
  primeri?: string[]
  veliko?: boolean
  className?: string
}

const PODRAZUMEVANI_PRIMERI = [
  'SDS bušilica Bosch',
  'Makita 18V set',
  'ugaona brusilica 125',
  'laser za nivelisanje',
  'inverter za varenje',
  'agregat 5 kW',
  'garnitura ključeva',
]

/**
 * Glavno polje za pretragu. Radi i bez JavaScripta — običan GET na `/pretraga`.
 * Placeholder se smenjuje kroz prave primere iz kataloga, da se odmah vidi
 * šta uopšte ima smisla ukucati.
 */
export function PoljeZaPretragu({
  vrednost = '',
  primeri = PODRAZUMEVANI_PRIMERI,
  veliko,
  className,
}: Props) {
  const id = useId()
  const [i, setI] = useState(0)

  useEffect(() => {
    if (primeri.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = window.setInterval(() => setI((x) => (x + 1) % primeri.length), 3200)
    return () => window.clearInterval(t)
  }, [primeri.length])

  return (
    <Form
      action="/pretraga"
      className={[s.forma, veliko ? s.velika : '', className ?? ''].filter(Boolean).join(' ')}
    >
      <label htmlFor={id} className="sr-only">
        Pretraga alata
      </label>
      <span className={s.lupa} aria-hidden="true">
        <Ikona ime="pretraga" velicina={veliko ? 22 : 19} />
      </span>
      <input
        id={id}
        name="q"
        type="search"
        defaultValue={vrednost}
        className={s.polje}
        placeholder={`Traži: ${primeri[i]}`}
        autoComplete="off"
      />
      <button type="submit" className={s.dugme}>
        <span className={s.dugmeTekst}>Traži</span>
        <span className={s.dugmeIkona} aria-hidden="true">
          <Ikona ime="strelica" velicina={20} />
        </span>
      </button>
    </Form>
  )
}

export default PoljeZaPretragu
