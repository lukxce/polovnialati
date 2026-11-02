'use client'

import Link from 'next/link'
import Logo from '@/components/Logo'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Ikona } from '@/components/Ikone'
import { useSacuvani } from '@/components/SacuvajDugme'
import { osveziSesiju, useSesija } from '@/components/useSesija'
import s from './Header.module.css'

export type StabloStavka = {
  slug: string
  naziv: string
  ikona: string
  opis?: string
  deca: { slug: string; naziv: string }[]
}


export function HeaderNav({ stablo }: { stablo: StabloStavka[] }) {
  const putanja = usePathname()
  const sacuvani = useSacuvani()
  const [meni, setMeni] = useState(false)
  const [mega, setMega] = useState(false)
  const sesija = useSesija() ?? null
  const megaRef = useRef<HTMLDivElement>(null)

  // Zatvori sve pri promeni rute. Sesija se osvežava pri ulasku na nalog i
  // poruke — tu se broj nepročitanih najčešće menja.
  useEffect(() => {
    setMeni(false)
    setMega(false)
    if (putanja.startsWith('/poruke') || putanja.startsWith('/nalog')) osveziSesiju()
  }, [putanja])

  // Escape i klik izvan mega-menija
  useEffect(() => {
    const naEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMega(false)
        setMeni(false)
      }
    }
    const naKlik = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMega(false)
    }
    document.addEventListener('keydown', naEsc)
    document.addEventListener('mousedown', naKlik)
    return () => {
      document.removeEventListener('keydown', naEsc)
      document.removeEventListener('mousedown', naKlik)
    }
  }, [])

  // Zaključaj skrol dok je mobilni meni otvoren
  useEffect(() => {
    document.body.style.overflow = meni ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [meni])

  const brojSacuvanih = sacuvani.length

  return (
    <header className={s.header}>
      <a href="#glavni" className="preskoci-link">
        Preskoči na sadržaj
      </a>

      <div className={`container ${s.traka}`}>
        <button
          type="button"
          className={s.meniDugme}
          onClick={() => setMeni(true)}
          aria-label="Otvori meni"
          aria-expanded={meni}
        >
          <Ikona ime="meni" velicina={22} />
        </button>

        <Link href="/" className={s.znak} aria-label="Polovni alati, početna">
          <Logo slozi />
        </Link>

        <div className={s.megaOmot} ref={megaRef}>
          <button
            type="button"
            className={s.megaDugme}
            onClick={() => setMega((v) => !v)}
            aria-expanded={mega}
            aria-haspopup="true"
          >
            Kategorije
            <span className={mega ? s.strelicaGore : s.strelicaDole} aria-hidden="true">
              ▾
            </span>
          </button>

          {mega ? (
            <div className={s.mega}>
              <div className={s.megaMreza}>
                {stablo.map((k) => (
                  <div key={k.slug} className={s.megaKolona}>
                    <Link href={`/kategorija/${k.slug}`} className={s.megaNaslov}>
                      <Ikona ime={k.ikona} velicina={17} />
                      {k.naziv}
                    </Link>
                    <ul className={s.megaLista}>
                      {k.deca.map((d) => (
                        <li key={d.slug}>
                          <Link href={`/kategorija/${k.slug}/${d.slug}`}>{d.naziv}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className={s.megaPodnozje}>
                <Link href="/oglasi" className={s.megaSvi}>
                  Svi oglasi
                  <Ikona ime="strelica" velicina={16} />
                </Link>
                <Link href="/kako-radi" className={s.megaSvi}>
                  Kako radi i ocene stanja
                  <Ikona ime="strelica" velicina={16} />
                </Link>
              </div>
            </div>
          ) : null}
        </div>

        {/* Pretraga je primarna hroma marketplace-a, ne sporedni element */}
        <form className={s.pretraga} action="/pretraga" method="get" role="search">
          <Ikona ime="pretraga" velicina={19} className={s.pretragaIkona} />
          <input
            type="search"
            name="q"
            className={s.pretragaPolje}
            placeholder="Šta tražiš? Npr. SDS bušilica, Makita 18V, inverter…"
            aria-label="Pretraga oglasa"
            autoComplete="off"
          />
          <button type="submit" className={s.pretragaDugme}>
            Traži
          </button>
        </form>

        <nav className={s.desno} aria-label="Glavna navigacija">
          <Link href="/sacuvano" className={s.sacuvano}>
            <Ikona ime={brojSacuvanih > 0 ? 'srce-puno' : 'srce'} velicina={19} />
            <span className={s.sacuvanoTekst}>Sačuvano</span>
            {brojSacuvanih > 0 ? <span className={s.brojac}>{brojSacuvanih}</span> : null}
          </Link>

          {sesija ? (
            <Link href="/poruke" className={s.sacuvano}>
              <Ikona ime="poruka" velicina={19} />
              <span className={s.sacuvanoTekst}>Poruke</span>
              {sesija.neprocitano > 0 ? <span className={s.brojac}>{sesija.neprocitano}</span> : null}
            </Link>
          ) : null}

          {sesija ? (
            <Link href={sesija.uloga === 'ADMIN' ? '/admin' : '/nalog'} className={s.sacuvano}>
              <Ikona ime="osoba" velicina={19} />
              <span className={s.sacuvanoTekst}>{sesija.naziv}</span>
            </Link>
          ) : (
            <Link href="/prijava" className={s.sacuvano}>
              <Ikona ime="osoba" velicina={19} />
              <span className={s.sacuvanoTekst}>Prijava</span>
            </Link>
          )}

          <Link href="/prodaj" className={`btn btn-primary ${s.prodaj}`}>
            Prodaj
          </Link>
        </nav>
      </div>

      {/* ── Mobilni pun ekran ─────────────────────────────────── */}
      {meni ? (
        <div className={s.mobilni} role="dialog" aria-modal="true" aria-label="Meni">
          <div className={`container ${s.mobilniVrh}`}>
            <span className={s.znak}>
              <Logo />
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-mali"
              onClick={() => setMeni(false)}
              aria-label="Zatvori meni"
            >
              <Ikona ime="x" velicina={22} />
            </button>
          </div>

          <div className={`container ${s.mobilniTelo}`}>
            <Link href="/prodaj" className="btn btn-primary btn-puni btn-veliki">
              Prodaj alat
            </Link>

            <ul className={s.mobilnaLista}>
              <li>
                <Link href="/oglasi">
                  <Ikona ime="filter" velicina={19} />
                  Svi oglasi
                </Link>
              </li>
              <li>
                <Link href="/sacuvano">
                  <Ikona ime="srce" velicina={19} />
                  Sačuvano{brojSacuvanih > 0 ? ` (${brojSacuvanih})` : ''}
                </Link>
              </li>
              {sesija ? (
                <li>
                  <Link href="/poruke">
                    <Ikona ime="poruka" velicina={19} />
                    Poruke{sesija.neprocitano > 0 ? ` (${sesija.neprocitano})` : ''}
                  </Link>
                </li>
              ) : null}
              <li>
                {sesija ? (
                  <Link href={sesija.uloga === 'ADMIN' ? '/admin' : '/nalog'}>
                    <Ikona ime="osoba" velicina={19} />
                    {sesija.naziv}
                  </Link>
                ) : (
                  <Link href="/prijava">
                    <Ikona ime="osoba" velicina={19} />
                    Prijava / registracija
                  </Link>
                )}
              </li>
              <li>
                <Link href="/kako-radi">
                  <Ikona ime="stit" velicina={19} />
                  Kako radi
                </Link>
              </li>
              <li>
                <Link href="/vodici">
                  <Ikona ime="oko" velicina={19} />
                  Vodiči
                </Link>
              </li>
            </ul>

            <p className="micro">Kategorije</p>
            <ul className={s.mobilneKategorije}>
              {stablo.map((k) => (
                <li key={k.slug}>
                  <Link href={`/kategorija/${k.slug}`}>
                    <Ikona ime={k.ikona} velicina={18} />
                    {k.naziv}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </header>
  )
}

export default HeaderNav
