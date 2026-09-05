'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
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
      body: JSON.stringify({ email, lozinka, naziv, tip, grad, telefon, pib }),
    })
    const data = await res.json().catch(() => ({}))
    setPosalje(false)
    if (!res.ok) {
      setGreska(data.greska || 'Greška pri registraciji.')
      return
    }
    router.push(params.get('odakle') || '/nalog')
    router.refresh()
  }

  return (
    <div className={s.omotac}>
      <form onSubmit={posalji} className={s.karta}>
        <h1 className={s.naslov}>Registracija</h1>
        <p className={s.lede}>Nalog je besplatan. Treba ti da bi objavio oglas i pratio poruke kupaca.</p>

        <div className={s.tipovi}>
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
          <input type="text" className="polje" required value={naziv} onChange={(e) => setNaziv(e.target.value)} />
        </label>

        <div className={s.dva}>
          <label className={s['polje-grupa']}>
            <span className={s.oznaka}>Email</span>
            <input type="email" className="polje" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className={s['polje-grupa']}>
            <span className={s.oznaka}>Lozinka</span>
            <input
              type="password"
              className="polje"
              required
              minLength={8}
              value={lozinka}
              onChange={(e) => setLozinka(e.target.value)}
            />
          </label>
        </div>

        <div className={s.dva}>
          <label className={s['polje-grupa']}>
            <span className={s.oznaka}>Grad</span>
            <input type="text" className="polje" required value={grad} onChange={(e) => setGrad(e.target.value)} />
          </label>
          <label className={s['polje-grupa']}>
            <span className={s.oznaka}>Telefon (opciono)</span>
            <input type="tel" className="polje" value={telefon} onChange={(e) => setTelefon(e.target.value)} />
          </label>
        </div>

        {firma ? (
          <label className={s['polje-grupa']}>
            <span className={s.oznaka}>PIB</span>
            <input type="text" className="polje" value={pib} onChange={(e) => setPib(e.target.value)} />
          </label>
        ) : null}

        {greska ? <p className={s.greska}>{greska}</p> : null}

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
