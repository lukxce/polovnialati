'use client'

import Link from 'next/link'
import { useState } from 'react'
import s from './poruke.module.css'

type Props = {
  oglasId: string
  naslov: string
  prijavljen: boolean
}

/**
 * Prvi kontakt kupca sa prodavcem. Ako korisnik nije prijavljen, umesto forme
 * stoji link ka prijavi — poruka se ne pokušava slati bez sesije.
 */
export function PosaljiPoruku({ oglasId, naslov, prijavljen }: Props) {
  const [tekst, setTekst] = useState(`Poštovanje, da li je „${naslov}“ još uvek dostupno?`)
  const [saljem, setSaljem] = useState(false)
  const [greska, setGreska] = useState<string>()
  const [poslato, setPoslato] = useState<string | null>(null) // razgovorId po uspehu

  if (!prijavljen) {
    return (
      <div className={s.kontaktKartica}>
        <p className="micro">Kontakt</p>
        <p className={s.kontaktTekst}>Prijavi se da bi poslao poruku prodavcu.</p>
        <Link
          href={`/prijava?odakle=${encodeURIComponent(`/oglas/id/${oglasId}`)}`}
          className="btn btn-primary btn-puni"
        >
          Prijava
        </Link>
      </div>
    )
  }

  if (poslato) {
    return (
      <div className={s.kontaktKartica}>
        <p className="micro">Kontakt</p>
        <p className={s.kontaktTekst}>Poruka je poslata.</p>
        <Link href={`/poruke/${poslato}`} className="btn btn-primary btn-puni">
          Idi na razgovor
        </Link>
      </div>
    )
  }

  async function posalji(e: React.FormEvent) {
    e.preventDefault()
    if (!tekst.trim()) return
    setSaljem(true)
    setGreska(undefined)
    try {
      const res = await fetch('/api/razgovori', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oglasId, tekst: tekst.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setGreska(data.greska || 'Greška pri slanju poruke.')
        return
      }
      setPoslato(data.razgovorId)
    } catch {
      setGreska('Greška pri povezivanju sa serverom.')
    } finally {
      setSaljem(false)
    }
  }

  return (
    <form className={s.kontaktKartica} onSubmit={posalji}>
      <p className="micro">Kontakt</p>
      <label className="polje-oznaka" htmlFor="poruka-tekst">
        Poruka prodavcu
      </label>
      <textarea
        id="poruka-tekst"
        className={['polje', s.tekst].join(' ')}
        rows={4}
        value={tekst}
        onChange={(e) => setTekst(e.target.value)}
        maxLength={2000}
      />
      {greska ? <p className={s.greska}>{greska}</p> : null}
      <button type="submit" className="btn btn-primary btn-puni" disabled={saljem || !tekst.trim()}>
        {saljem ? 'Slanje…' : 'Pošalji poruku'}
      </button>
    </form>
  )
}

export default PosaljiPoruku
