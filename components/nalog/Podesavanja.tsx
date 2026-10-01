'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { GRADOVI } from '@/lib/gradovi'
import s from './nalog.module.css'

type Stanje = { tip: 'ok' | 'greska'; tekst: string } | null

function Poruka({ stanje }: { stanje: Stanje }) {
  if (!stanje) return null
  return (
    <p
      className={[s.poruka, stanje.tip === 'ok' ? s.porukaOk : s.porukaGreska].join(' ')}
      role={stanje.tip === 'greska' ? 'alert' : 'status'}
    >
      {stanje.tekst}
    </p>
  )
}

type Profil = { naziv: string; grad: string; telefon: string; opis: string; pib: string }

export function ProfilForma({ pocetno, firma }: { pocetno: Profil; firma: boolean }) {
  const router = useRouter()
  const [p, setP] = useState(pocetno)
  const [stanje, setStanje] = useState<Stanje>(null)
  const [salje, setSalje] = useState(false)

  const polje = (k: keyof Profil) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setP((x) => ({ ...x, [k]: e.target.value }))

  async function sacuvaj(e: React.FormEvent) {
    e.preventDefault()
    setSalje(true)
    setStanje(null)
    const res = await fetch('/api/nalog', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p),
    })
    const data = await res.json().catch(() => ({}))
    setSalje(false)
    if (!res.ok) return setStanje({ tip: 'greska', tekst: data.greska || 'Čuvanje nije uspelo.' })
    setStanje({ tip: 'ok', tekst: 'Sačuvano.' })
    router.refresh()
  }

  return (
    <form className={[s.karta, s.forma].join(' ')} onSubmit={sacuvaj}>
      <h2>Profil prodavca</h2>
      <label className={s.polje}>
        {firma ? 'Naziv firme' : 'Ime i prezime'}
        <input className="polje" required maxLength={80} value={p.naziv} onChange={polje('naziv')} />
      </label>
      <label className={s.polje}>
        Grad
        <input
          className="polje"
          required
          list="gradovi-nalog"
          maxLength={60}
          value={p.grad}
          onChange={polje('grad')}
        />
        <datalist id="gradovi-nalog">
          {GRADOVI.map((g) => (
            <option key={g} value={g} />
          ))}
        </datalist>
      </label>
      <label className={s.polje}>
        Telefon (kupci ga vide kad kliknu „Pozovi")
        <input className="polje" type="tel" maxLength={30} value={p.telefon} onChange={polje('telefon')} />
      </label>
      {firma ? (
        <label className={s.polje}>
          PIB
          <input className="polje" maxLength={20} value={p.pib} onChange={polje('pib')} />
        </label>
      ) : null}
      <label className={s.polje}>
        O meni / o firmi (prikazuje se na javnom profilu)
        <textarea className="polje" rows={4} maxLength={1000} value={p.opis} onChange={polje('opis')} />
      </label>
      <Poruka stanje={stanje} />
      <div>
        <button type="submit" className="btn btn-primary" disabled={salje}>
          {salje ? 'Čuvanje…' : 'Sačuvaj profil'}
        </button>
      </div>
    </form>
  )
}

export function LozinkaForma() {
  const [trenutna, setTrenutna] = useState('')
  const [nova, setNova] = useState('')
  const [stanje, setStanje] = useState<Stanje>(null)
  const [salje, setSalje] = useState(false)

  async function promeni(e: React.FormEvent) {
    e.preventDefault()
    setSalje(true)
    setStanje(null)
    const res = await fetch('/api/nalog/lozinka', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trenutna, nova }),
    })
    const data = await res.json().catch(() => ({}))
    setSalje(false)
    if (!res.ok) return setStanje({ tip: 'greska', tekst: data.greska || 'Promena nije uspela.' })
    setTrenutna('')
    setNova('')
    setStanje({ tip: 'ok', tekst: 'Lozinka je promenjena.' })
  }

  return (
    <form className={[s.karta, s.forma].join(' ')} onSubmit={promeni}>
      <h2>Lozinka</h2>
      <label className={s.polje}>
        Trenutna lozinka
        <input
          className="polje"
          type="password"
          required
          autoComplete="current-password"
          value={trenutna}
          onChange={(e) => setTrenutna(e.target.value)}
        />
      </label>
      <label className={s.polje}>
        Nova lozinka (bar 8 karaktera)
        <input
          className="polje"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={nova}
          onChange={(e) => setNova(e.target.value)}
        />
      </label>
      <Poruka stanje={stanje} />
      <div>
        <button type="submit" className="btn btn-tertiary" disabled={salje}>
          {salje ? 'Menjanje…' : 'Promeni lozinku'}
        </button>
      </div>
    </form>
  )
}

export function ObrisiNalog() {
  const router = useRouter()
  const [otvoreno, setOtvoreno] = useState(false)
  const [lozinka, setLozinka] = useState('')
  const [stanje, setStanje] = useState<Stanje>(null)

  async function obrisi(e: React.FormEvent) {
    e.preventDefault()
    if (!confirm('Nalog, svi tvoji oglasi, fotografije i poruke biće trajno obrisani. Nastaviti?')) return
    const res = await fetch('/api/nalog', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lozinka }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) return setStanje({ tip: 'greska', tekst: data.greska || 'Brisanje nije uspelo.' })
    router.push('/')
    router.refresh()
  }

  return (
    <form className={[s.karta, s.forma, s.opasno].join(' ')} onSubmit={obrisi}>
      <h2>Brisanje naloga</h2>
      {otvoreno ? (
        <>
          <label className={s.polje}>
            Potvrdi lozinkom
            <input
              className="polje"
              type="password"
              required
              autoComplete="current-password"
              value={lozinka}
              onChange={(e) => setLozinka(e.target.value)}
            />
          </label>
          <Poruka stanje={stanje} />
          <div className={s.akcije}>
            <button type="submit" className="btn btn-secondary">
              Trajno obriši nalog
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setOtvoreno(false)}>
              Odustani
            </button>
          </div>
        </>
      ) : (
        <div>
          <button type="button" className="btn btn-ghost" onClick={() => setOtvoreno(true)}>
            Obriši moj nalog…
          </button>
        </div>
      )}
    </form>
  )
}
