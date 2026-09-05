'use client'

import { useCallback, useEffect, useState } from 'react'
import { Ikona } from '@/components/Ikone'
import s from './SacuvajDugme.module.css'

const KLJUC = 'alatnica:sacuvano'

/** Pročitaj listu sačuvanih slugova iz localStorage. */
export function procitajSacuvane(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const sirovo = window.localStorage.getItem(KLJUC)
    const parsirano: unknown = sirovo ? JSON.parse(sirovo) : []
    return Array.isArray(parsirano) ? parsirano.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

function upisi(lista: string[]) {
  try {
    window.localStorage.setItem(KLJUC, JSON.stringify(lista))
  } catch {
    /* privatni režim — tiho odustani */
  }
  window.dispatchEvent(new CustomEvent('alatnica:sacuvano-promena', { detail: lista }))
}

/** Hook za brojač u zaglavlju i za stranicu /sacuvano. */
export function useSacuvani(): string[] {
  const [lista, setLista] = useState<string[]>([])

  useEffect(() => {
    setLista(procitajSacuvane())
    const osvezi = () => setLista(procitajSacuvane())
    window.addEventListener('alatnica:sacuvano-promena', osvezi)
    window.addEventListener('storage', osvezi)
    return () => {
      window.removeEventListener('alatnica:sacuvano-promena', osvezi)
      window.removeEventListener('storage', osvezi)
    }
  }, [])

  return lista
}

type Props = {
  slug: string
  /** Varijanta: `plutajuce` je krug preko slike na kartici. */
  varijanta?: 'plutajuce' | 'dugme'
  className?: string
}

export function SacuvajDugme({ slug, varijanta = 'plutajuce', className }: Props) {
  const [sacuvan, setSacuvan] = useState(false)
  const [pop, setPop] = useState(false)

  useEffect(() => {
    setSacuvan(procitajSacuvane().includes(slug))
    const osvezi = () => setSacuvan(procitajSacuvane().includes(slug))
    window.addEventListener('alatnica:sacuvano-promena', osvezi)
    window.addEventListener('storage', osvezi)
    return () => {
      window.removeEventListener('alatnica:sacuvano-promena', osvezi)
      window.removeEventListener('storage', osvezi)
    }
  }, [slug])

  const prebaci = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const trenutno = procitajSacuvane()
      const ima = trenutno.includes(slug)
      const novo = ima ? trenutno.filter((x) => x !== slug) : [slug, ...trenutno]
      upisi(novo)
      setSacuvan(!ima)
      if (!ima) {
        setPop(true)
        window.setTimeout(() => setPop(false), 200)
      }
    },
    [slug],
  )

  const klase = [
    varijanta === 'plutajuce' ? s.plutajuce : s.dugme,
    sacuvan ? s.aktivno : '',
    pop ? s.pop : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={klase}
      onClick={prebaci}
      aria-pressed={sacuvan}
      aria-label={sacuvan ? 'Ukloni iz sačuvanih' : 'Sačuvaj oglas'}
      title={sacuvan ? 'Ukloni iz sačuvanih' : 'Sačuvaj oglas'}
    >
      <Ikona ime={sacuvan ? 'srce-puno' : 'srce'} velicina={varijanta === 'dugme' ? 20 : 19} />
      {varijanta === 'dugme' ? <span>{sacuvan ? 'Sačuvano' : 'Sačuvaj'}</span> : null}
    </button>
  )
}

export default SacuvajDugme
