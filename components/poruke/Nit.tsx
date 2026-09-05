'use client'

import { useState } from 'react'
import s from './poruke.module.css'

export type PorukaZaPrikaz = { id: string; tekst: string; posiljalacId: string; createdAt: string }

type Props = {
  razgovorId: string
  mojId: string
  pocetnePoruke: PorukaZaPrikaz[]
}

function formatVreme(iso: string) {
  return new Date(iso).toLocaleString('sr-RS', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function Nit({ razgovorId, mojId, pocetnePoruke }: Props) {
  const [poruke, setPoruke] = useState(pocetnePoruke)
  const [tekst, setTekst] = useState('')
  const [saljem, setSaljem] = useState(false)
  const [greska, setGreska] = useState<string>()

  async function posalji(e: React.FormEvent) {
    e.preventDefault()
    const vrednost = tekst.trim()
    if (!vrednost) return
    setSaljem(true)
    setGreska(undefined)
    try {
      const res = await fetch(`/api/razgovori/${razgovorId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tekst: vrednost }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setGreska(data.greska || 'Greška pri slanju poruke.')
        return
      }
      setPoruke((p) => [...p, data])
      setTekst('')
    } catch {
      setGreska('Greška pri povezivanju sa serverom.')
    } finally {
      setSaljem(false)
    }
  }

  return (
    <div>
      <div className={s.nit}>
        {poruke.map((p) => (
          <div key={p.id} className={[s.mehur, p.posiljalacId === mojId ? s.mehurJa : s.mehurOni].join(' ')}>
            {p.tekst}
            <span className={s.mehurVreme}>{formatVreme(p.createdAt)}</span>
          </div>
        ))}
      </div>

      {greska ? <p className={s.greska}>{greska}</p> : null}

      <form className={s.odgovorForma} onSubmit={posalji}>
        <textarea
          className={['polje', s.odgovorPolje].join(' ')}
          rows={2}
          placeholder="Napiši odgovor…"
          value={tekst}
          onChange={(e) => setTekst(e.target.value)}
          maxLength={2000}
        />
        <button type="submit" className="btn btn-primary" disabled={saljem || !tekst.trim()}>
          {saljem ? 'Slanje…' : 'Pošalji'}
        </button>
      </form>
    </div>
  )
}

export default Nit
