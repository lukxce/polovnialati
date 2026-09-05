'use client'

import { useEffect, useRef, useState } from 'react'
import { Ikona } from '@/components/Ikone'
import s from './Sadrzaj.module.css'

type Stavka = { id: string; tekst: string }

/**
 * Sadržaj članka. Na telefonu je sklopljen iza prekidača, na ekranu ≥1024px
 * je lepljiva bočna kolona. Aktivna sekcija se prati IntersectionObserver-om.
 */
export function Sadrzaj({ stavke }: { stavke: Stavka[] }) {
  const [otvoren, setOtvoren] = useState(false)
  const [aktivan, setAktivan] = useState<string>(stavke[0]?.id ?? '')
  const vidljivi = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return

    const ciljevi = stavke
      .map((st) => document.getElementById(st.id))
      .filter((el): el is HTMLElement => el !== null)
    if (ciljevi.length === 0) return

    const posmatrac = new IntersectionObserver(
      (unosi) => {
        for (const u of unosi) {
          if (u.isIntersecting) vidljivi.current.add(u.target.id)
          else vidljivi.current.delete(u.target.id)
        }
        const prvi = stavke.find((st) => vidljivi.current.has(st.id))
        if (prvi) setAktivan(prvi.id)
      },
      { rootMargin: '-96px 0px -62% 0px', threshold: 0 },
    )

    for (const el of ciljevi) posmatrac.observe(el)
    return () => posmatrac.disconnect()
  }, [stavke])

  if (stavke.length === 0) return null

  return (
    <nav className={s.omot} aria-label="Sadržaj vodiča">
      <p className={`micro ${s.naslovKolone}`}>U ovom vodiču</p>

      <button
        type="button"
        className={s.prekidac}
        aria-expanded={otvoren}
        aria-controls="sadrzaj-vodica"
        onClick={() => setOtvoren((v) => !v)}
      >
        <span className={s.prekidacOznaka}>
          U ovom vodiču
          <span className={s.brojac}>{stavke.length}</span>
        </span>
        <span className={otvoren ? `${s.strelica} ${s.strelicaOtvorena}` : s.strelica}>
          <Ikona ime="sort" velicina={18} />
        </span>
      </button>

      <ol
        id="sadrzaj-vodica"
        className={otvoren ? `${s.lista} ${s.listaOtvorena}` : s.lista}
      >
        {stavke.map((st, i) => (
          <li key={st.id} className={s.stavka}>
            <a
              href={`#${st.id}`}
              className={s.veza}
              aria-current={st.id === aktivan ? 'true' : undefined}
              onClick={() => setOtvoren(false)}
            >
              <span className={s.redniBroj}>{String(i + 1).padStart(2, '0')}</span>
              {st.tekst}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Sadrzaj
