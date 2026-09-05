'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Ikona } from '@/components/Ikone'
import s from './DonjiList.module.css'

type Props = {
  otvoren: boolean
  zatvori: () => void
  naslov: string
  /** Kratko objašnjenje ispod naslova. */
  podnaslov?: string
  /** Sadržaj zakucan uz donju ivicu (npr. „Prikaži 24 rezultata"). */
  podnozje?: React.ReactNode
  children: React.ReactNode
}

/**
 * Mobilni list pune visine: ručka za prevlačenje, telo koje se skroluje i
 * zakucano podnožje. Prevlačenje ručke naniže preko 110 px zatvara list —
 * isto ponašanje kao u nativnoj aplikaciji.
 */
export function DonjiList({ otvoren, zatvori, naslov, podnaslov, podnozje, children }: Props) {
  const naslovId = useId()
  const panel = useRef<HTMLDivElement | null>(null)
  const [pomeraj, setPomeraj] = useState(0)
  const vuce = useRef<{ pocetak: number; id: number } | null>(null)

  useEffect(() => {
    if (!otvoren) {
      setPomeraj(0)
      return
    }
    const naEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') zatvori()
    }
    document.addEventListener('keydown', naEsc)
    const prethodni = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel.current?.focus()
    return () => {
      document.removeEventListener('keydown', naEsc)
      document.body.style.overflow = prethodni
    }
  }, [otvoren, zatvori])

  const pocetakVuce = useCallback((e: React.PointerEvent) => {
    vuce.current = { pocetak: e.clientY, id: e.pointerId }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const tokomVuce = useCallback((e: React.PointerEvent) => {
    if (!vuce.current || vuce.current.id !== e.pointerId) return
    setPomeraj(Math.max(0, e.clientY - vuce.current.pocetak))
  }, [])

  const krajVuce = useCallback(
    (e: React.PointerEvent) => {
      if (!vuce.current || vuce.current.id !== e.pointerId) return
      const predjeno = e.clientY - vuce.current.pocetak
      vuce.current = null
      if (predjeno > 110) zatvori()
      else setPomeraj(0)
    },
    [zatvori],
  )

  if (!otvoren) return null

  return (
    <div className={s.zastor} onClick={zatvori} role="presentation">
      <div
        ref={panel}
        className={s.panel}
        style={pomeraj ? { transform: `translateY(${pomeraj}px)`, transition: 'none' } : undefined}
        role="dialog"
        aria-modal="true"
        aria-labelledby={naslovId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={s.rucka}
          onPointerDown={pocetakVuce}
          onPointerMove={tokomVuce}
          onPointerUp={krajVuce}
          onPointerCancel={krajVuce}
        >
          <span className={s.ruckaTraka} aria-hidden="true" />
        </div>

        <header className={s.zaglavlje}>
          <div>
            <h2 id={naslovId} className={s.naslov}>
              {naslov}
            </h2>
            {podnaslov ? <p className={s.podnaslov}>{podnaslov}</p> : null}
          </div>
          <button type="button" className={s.zatvori} onClick={zatvori} aria-label="Zatvori">
            <Ikona ime="x" velicina={20} />
          </button>
        </header>

        <div className={s.telo}>{children}</div>

        {podnozje ? <div className={s.podnozje}>{podnozje}</div> : null}
      </div>
    </div>
  )
}

export default DonjiList
