'use client'

import { useId, useState } from 'react'
import { RAZLOZI_PRIJAVE } from '@/lib/prijave'
import s from './KontaktAkcije.module.css'

/** „Prijavi oglas" — ide adminu na pregled (/admin), radi i bez naloga. */
export function PrijaviOglas({ oglasId }: { oglasId: string }) {
  const [otvoreno, setOtvoreno] = useState(false)
  const [razlog, setRazlog] = useState('')
  const [tekst, setTekst] = useState('')
  const [stanje, setStanje] = useState<'unos' | 'salje' | 'poslato'>('unos')
  const [greska, setGreska] = useState<string>()
  const id = useId()

  async function posalji(e: React.FormEvent) {
    e.preventDefault()
    setStanje('salje')
    setGreska(undefined)
    const res = await fetch(`/api/oglasi/${oglasId}/prijava`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ razlog, tekst }),
    }).catch(() => null)
    const data = res ? await res.json().catch(() => ({})) : {}
    if (!res?.ok) {
      setGreska(data.greska || 'Prijava nije poslata. Pokušaj ponovo.')
      setStanje('unos')
      return
    }
    setStanje('poslato')
  }

  if (stanje === 'poslato') {
    return (
      <p className={s.prijavaPoslata} role="status">
        Hvala, prijava je poslata. Pregledamo je i, ako treba, skidamo oglas.
      </p>
    )
  }

  if (!otvoreno) {
    return (
      <button type="button" className={['btn', 'btn-ghost', s.prijavaDugme].join(' ')} onClick={() => setOtvoreno(true)}>
        Prijavi oglas
      </button>
    )
  }

  return (
    <form className={s.panel} onSubmit={posalji}>
      <p className={s.panelNaslov}>Prijavi oglas</p>
      <label className="polje-oznaka" htmlFor={`${id}-razlog`}>
        Razlog
      </label>
      <select
        id={`${id}-razlog`}
        className="polje"
        required
        value={razlog}
        onChange={(e) => setRazlog(e.target.value)}
      >
        <option value="" disabled>
          Izaberi…
        </option>
        {Object.entries(RAZLOZI_PRIJAVE).map(([k, v]) => (
          <option key={k} value={k}>
            {v}
          </option>
        ))}
      </select>
      <label className="polje-oznaka" htmlFor={`${id}-tekst`}>
        Šta nije u redu? (opciono)
      </label>
      <textarea
        id={`${id}-tekst`}
        className={['polje', s.tekst].join(' ')}
        rows={3}
        maxLength={1000}
        value={tekst}
        onChange={(e) => setTekst(e.target.value)}
      />
      {greska ? (
        <p className={s.greska} role="alert">
          {greska}
        </p>
      ) : null}
      <div className={s.panelDugmad}>
        <button type="submit" className="btn btn-secondary" disabled={!razlog || stanje === 'salje'}>
          {stanje === 'salje' ? 'Slanje…' : 'Pošalji prijavu'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => setOtvoreno(false)}>
          Odustani
        </button>
      </div>
    </form>
  )
}

export default PrijaviOglas
