'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { GRADOVI } from '@/lib/gradovi'
import { osveziSesiju } from '@/components/useSesija'
import { bezbednaPutanja } from '@/lib/putanja'
import type { TipProdavca } from '@/lib/types'
import s from '@/components/auth/auth.module.css'

const TIPOVI: { vrednost: TipProdavca; oznaka: string }[] = [
  { vrednost: 'privatno-lice', oznaka: 'Privatno lice' },
  { vrednost: 'servis', oznaka: 'Servis' },
  { vrednost: 'prodavnica', oznaka: 'Prodavnica' },
]

// useSearchParams() traži Suspense granicu — odvojeno od forme da čitanje
// ?odakle= (kuda posle registracije) ne blokira prvi prikaz.
export default function RegistracijaPage() {
  return (
    <Suspense fallback={null}>
      <RegistracijaForma />
    </Suspense>
  )
}

function RegistracijaForma() {
  const router = useRouter()
  const params = useSearchParams()
  const [tip, setTip] = useState<TipProdavca>('privatno-lice')
  const [email, setEmail] = useState('')
  const [lozinka, setLozinka] = useState('')
  const [naziv, setNaziv] = useState('')
  const [grad, setGrad] = useState('')
  const [telefon, setTelefon] = useState('')
  const [pib, setPib] = useState('')
  const [saglasnost, setSaglasnost] = useState(false)
  const [greska, setGreska] = useState<string | null>(null)
  const [posalje, setPosalje] = useState(false)

  const firma = tip !== 'privatno-lice'

  async function posalji(e: React.FormEvent) {
    e.preventDefault()
    setGreska(null)
    setPosalje(true)
    const res = await fetch('/api/auth/registracija', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, lozinka, naziv, tip, grad, telefon, pib, saglasnost }),
    })
    const data = await res.json().catch(() => ({}))
    setPosalje(false)
    if (!res.ok) {
      setGreska(data.greska || 'Greška pri registraciji.')
      return
    }
    await osveziSesiju()
    router.push(bezbednaPutanja(params.get('odakle')))
    router.refresh()
  }

  return (
    <div className={s.omotac}>
      <form onSubmit={posalji} className={s.karta}>
        <h1 className={s.naslov}>Registracija</h1>
        <p className={s.lede}>Nalog je besplatan. Treba ti da bi objavio oglas i pratio poruke kupaca.</p>

        <p className={s.oznaka} id="tip-naloga">
          Prodaješ kao
        </p>
        <div className={s.tipovi} role="group" aria-labelledby="tip-naloga">
          {TIPOVI.map((t) => (
            <button
              key={t.vrednost}
              type="button"
              className={[s.tipDugme, tip === t.vrednost ? s.tipAktivan : ''].filter(Boolean).join(' ')}
              onClick={() => setTip(t.vrednost)}
              aria-pressed={tip === t.vrednost}
            >
              {t.oznaka}
            </button>
          ))}
        </div>

        <label className={s['polje-grupa']}>
          <span className={s.oznaka}>{firma ? 'Naziv firme' : 'Ime i prezime'}</span>
          <input
            type="text"
            className="polje"
            required
            maxLength={80}
            autoComplete={firma ? 'organization' : 'name'}
            value={naziv}
            onChange={(e) => setNaziv(e.target.value)}
          />
        </label>

        <div className={s.dva}>
          <label className={s['polje-grupa']}>
            <span className={s.oznaka}>Email</span>
            <input
              type="email"
              className="polje"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className={s['polje-grupa']}>
            <span className={s.oznaka}>Lozinka</span>
            <input
              type="password"
              className="polje"
              required
              minLength={8}
              autoComplete="new-password"
              value={lozinka}
              onChange={(e) => setLozinka(e.target.value)}
            />
          </label>
        </div>

        <div className={s.dva}>
          <label className={s['polje-grupa']}>
            <span className={s.oznaka}>Grad</span>
            <input
              type="text"
              className="polje"
              required
              list="gradovi-lista"
              autoComplete="address-level2"
              value={grad}
              onChange={(e) => setGrad(e.target.value)}
            />
            <datalist id="gradovi-lista">
              {GRADOVI.map((g) => (
                <option key={g} value={g} />
              ))}
            </datalist>
          </label>
          <label className={s['polje-grupa']}>
            <span className={s.oznaka}>Telefon (opciono)</span>
            <input
              type="tel"
              className="polje"
              autoComplete="tel"
              value={telefon}
              onChange={(e) => setTelefon(e.target.value)}
            />
          </label>
        </div>

        {firma ? (
          <label className={s['polje-grupa']}>
            <span className={s.oznaka}>PIB</span>
            <input type="text" className="polje" value={pib} onChange={(e) => setPib(e.target.value)} />
          </label>
        ) : null}

        {telefon.trim() ? (
          <p className={s.napomena}>
            Broj telefona se kupcima prikazuje na tvojim oglasima kada kliknu „Pozovi".
          </p>
        ) : null}

        <label className={s.saglasnost}>
          <input
            type="checkbox"
            required
            checked={saglasnost}
            onChange={(e) => setSaglasnost(e.target.checked)}
          />
          <span>
            Prihvatam <Link href="/uslovi" target="_blank">uslove korišćenja</Link> i upoznat sam sa{' '}
            <Link href="/privatnost" target="_blank">politikom privatnosti</Link>.
          </span>
        </label>

        {greska ? (
          <p className={s.greska} role="alert">
            {greska}
          </p>
        ) : null}

        <button type="submit" className="btn btn-primary btn-veliki" style={{ width: '100%' }} disabled={posalje}>
          {posalje ? 'Kreiranje naloga…' : 'Napravi nalog'}
        </button>

        <p className={s.podnozje}>
          Već imaš nalog? <Link href="/prijava">Prijavi se</Link>
        </p>
      </form>
    </div>
  )
}
