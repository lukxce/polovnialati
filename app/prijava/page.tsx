'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { osveziSesiju } from '@/components/useSesija'
import { bezbednaPutanja } from '@/lib/putanja'
import s from '@/components/auth/auth.module.css'

export default function PrijavaPage() {
  return (
    <Suspense fallback={null}>
      <PrijavaForma />
    </Suspense>
  )
}

function PrijavaForma() {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState('')
  const [lozinka, setLozinka] = useState('')
  const [greska, setGreska] = useState<string | null>(null)
  const [posalje, setPosalje] = useState(false)

  async function posalji(e: React.FormEvent) {
    e.preventDefault()
    setGreska(null)
    setPosalje(true)
    const res = await fetch('/api/auth/prijava', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, lozinka }),
    })
    const data = await res.json().catch(() => ({}))
    setPosalje(false)
    if (!res.ok) {
      setGreska(data.greska || 'Greška pri prijavi.')
      return
    }
    await osveziSesiju()
    router.push(bezbednaPutanja(params.get('odakle'), data.uloga === 'ADMIN' ? '/admin' : '/nalog'))
    router.refresh()
  }

  return (
    <div className={s.omotac}>
      <form onSubmit={posalji} className={s.karta}>
        <h1 className={s.naslov}>Prijava</h1>
        <p className={s.lede}>Uđi u svoj nalog da objaviš oglas ili pratiš postojeće.</p>

        <label className={s['polje-grupa']}>
          <span className={s.oznaka}>Email</span>
          <input
            type="email"
            className="polje"
            required
            autoFocus
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
            autoComplete="current-password"
            value={lozinka}
            onChange={(e) => setLozinka(e.target.value)}
          />
        </label>

        {greska ? (
          <p className={s.greska} role="alert">
            {greska}
          </p>
        ) : null}

        <button type="submit" className="btn btn-primary btn-veliki" style={{ width: '100%' }} disabled={posalje}>
          {posalje ? 'Prijavljivanje…' : 'Prijavi se'}
        </button>

        <p className={s.podnozje}>
          Nemaš nalog?{' '}
          <Link
            href={
              params.get('odakle')
                ? `/registracija?odakle=${encodeURIComponent(bezbednaPutanja(params.get('odakle')))}`
                : '/registracija'
            }
          >
            Registruj se
          </Link>
        </p>
        <p className={s.podnozje}>
          <Link href="/kontakt?tema=lozinka">Zaboravio si lozinku?</Link>
        </p>
      </form>
    </div>
  )
}
