'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Ikona } from '@/components/Ikone'
import s from './Galerija.module.css'

type Props = {
  /** Gotove putanje slika — server ih izvodi iz `oglas.slike` / `slikaZaOglas`. */
  slike: string[]
  /** Alternativni tekst; indeks slike se dodaje automatski. */
  alt: string
}

/**
 * Jedna traka slika za oba raspona:
 *  · telefon — vodoravni snap-scroll + tačkice
 *  · desktop — ista traka, ali se pomera klikom na sličicu
 * Fotografije prodavca (Vercel Blob) ili SVG ilustracije iz `/public/slike` — običan `<img>`.
 */
export function Galerija({ slike, alt }: Props) {
  const traka = useRef<HTMLDivElement>(null)
  const [aktivna, setAktivna] = useState(0)
  const [uvecana, setUvecana] = useState(false)
  const visestruka = slike.length > 1

  const naScroll = useCallback(() => {
    const el = traka.current
    if (!el || el.clientWidth === 0) return
    const i = Math.round(el.scrollLeft / el.clientWidth)
    setAktivna((prethodna) => (prethodna === i ? prethodna : Math.min(Math.max(i, 0), slike.length - 1)))
  }, [slike.length])

  const idiNa = useCallback((i: number) => {
    const el = traka.current
    if (!el) return
    const smanjenPokret =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ left: i * el.clientWidth, behavior: smanjenPokret ? 'auto' : 'smooth' })
    setAktivna(i)
  }, [])

  useEffect(() => {
    if (!uvecana) return
    const naTaster = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setUvecana(false)
    }
    document.addEventListener('keydown', naTaster)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', naTaster)
      document.body.style.overflow = ''
    }
  }, [uvecana])

  return (
    <div className={s.galerija}>
      <div className={s.okvir}>
        <div
          className={s.traka}
          ref={traka}
          onScroll={naScroll}
          role="group"
          aria-roledescription="galerija"
          aria-label={`Slike oglasa (${slike.length})`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') idiNa(Math.min(aktivna + 1, slike.length - 1))
            if (e.key === 'ArrowLeft') idiNa(Math.max(aktivna - 1, 0))
          }}
        >
          {slike.map((izvor, i) => (
            <div className={s.slajd} key={izvor}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={izvor}
                alt={i === 0 ? alt : `${alt}, prikaz ${i + 1}`}
                width={1000}
                height={750}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding={i === 0 ? 'sync' : 'async'}
                fetchPriority={i === 0 ? 'high' : 'auto'}
              />
            </div>
          ))}
        </div>

        {visestruka ? (
          <span className={s.brojac} aria-hidden="true">
            {aktivna + 1} / {slike.length}
          </span>
        ) : null}

        <button
          type="button"
          className={s.uvecaj}
          onClick={() => setUvecana(true)}
          aria-label="Prikaži sliku uvećano"
        >
          <Ikona ime="pretraga" velicina={18} />
          Uvećaj
        </button>
      </div>

      {visestruka ? (
        <>
          <div className={s.tacke} role="tablist" aria-label="Izbor slike">
            {slike.map((izvor, i) => (
              <button
                key={izvor}
                type="button"
                role="tab"
                aria-selected={i === aktivna}
                aria-label={`Slika ${i + 1}`}
                className={i === aktivna ? s.tackaAktivna : s.tacka}
                onClick={() => idiNa(i)}
              >
                <span aria-hidden="true" />
              </button>
            ))}
          </div>

          <div className={s.slicice}>
            {slike.map((izvor, i) => (
              <button
                key={izvor}
                type="button"
                className={i === aktivna ? s.sliciicaAktivna : s.slicica}
                onClick={() => idiNa(i)}
                aria-label={`Prikaži sliku ${i + 1}`}
                aria-current={i === aktivna ? 'true' : undefined}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={izvor} alt="" width={200} height={150} loading="lazy" />
              </button>
            ))}
          </div>
        </>
      ) : null}

      {uvecana ? (
        <div
          className={s.zastor}
          role="dialog"
          aria-modal="true"
          aria-label="Uvećana slika"
          onClick={() => setUvecana(false)}
        >
          <button
            type="button"
            className={s.zatvori}
            onClick={() => setUvecana(false)}
            aria-label="Zatvori uvećani prikaz"
          >
            <Ikona ime="x" velicina={20} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slike[aktivna]}
            alt={`${alt}, uvećan prikaz ${aktivna + 1}`}
            className={s.velika}
            width={1400}
            height={1050}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  )
}

export default Galerija
