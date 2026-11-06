'use client'

import Link from 'next/link'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Ikona } from '@/components/Ikone'
import SacuvajDugme from '@/components/SacuvajDugme'
import { useSesija } from '@/components/useSesija'
import s from './KontaktAkcije.module.css'

type Props = {
  oglasId: string
  slug: string
  naslov: string
  /** User.id vlasnika — vlasnik umesto forme vidi napomenu i link ka nalogu */
  vlasnikId: string
  prodavacNaziv: string
  imaTelefon: boolean
  odgovaraZa?: string
}

type Panel = 'nema' | 'poruka' | 'telefon'

/**
 * Kontakt sa prodavcem + lepljiva traka na telefonu.
 *
 * Stranica oglasa je statična, pa se sve što zavisi od posetioca rešava
 * ovde: da li je prijavljen (forma ili link ka prijavi), da li je vlasnik
 * (napomena umesto forme). Broj telefona se ne nalazi u HTML-u — učitava se
 * tek na klik „Pozovi".
 */
export function KontaktAkcije({
  oglasId,
  slug,
  naslov,
  vlasnikId,
  prodavacNaziv,
  imaTelefon,
  odgovaraZa,
}: Props) {
  const sesija = useSesija()
  const [panel, setPanel] = useState<Panel>('nema')
  const [uzPodnozje, setUzPodnozje] = useState(false)
  const blok = useRef<HTMLDivElement>(null)
  const idTeksta = useId()

  const [tekst, setTekst] = useState(`Poštovanje, da li je „${naslov}“ još uvek dostupno?`)
  const [saljem, setSaljem] = useState(false)
  const [greska, setGreska] = useState<string>()
  const [razgovorId, setRazgovorId] = useState<string | null>(null)

  const [telefon, setTelefon] = useState<string | null | undefined>(undefined)
  const [greskaTelefona, setGreskaTelefona] = useState<string>()

  const jeVlasnik = !!sesija && sesija.id === vlasnikId
  const odakle = `/oglas/${slug}`

  /* Jedan pregled po kartici pregledača — server dodatno broji jednom na sat po IP adresi. */
  useEffect(() => {
    const kljuc = `alatnica:pregled:${oglasId}`
    try {
      if (sessionStorage.getItem(kljuc)) return
      sessionStorage.setItem(kljuc, '1')
    } catch {
      /* privatni režim — brojimo svejedno */
    }
    fetch(`/api/oglasi/${oglasId}/pregled`, { method: 'POST', keepalive: true }).catch(() => {})
  }, [oglasId])

  /**
   * Kad podnožje uđe u vidno polje, traka se sklanja — inače bi na dnu
   * stranice pokrila poslednji red podnožja. Akcije i dalje stoje u bloku iznad.
   */
  useEffect(() => {
    const podnozje = document.querySelector('footer')
    if (!podnozje) return

    const izmeri = () =>
      setUzPodnozje(podnozje.getBoundingClientRect().top < window.innerHeight)

    izmeri()
    window.addEventListener('scroll', izmeri, { passive: true })
    window.addEventListener('resize', izmeri)
    return () => {
      window.removeEventListener('scroll', izmeri)
      window.removeEventListener('resize', izmeri)
    }
  }, [])

  const otvoriPoruku = useCallback(() => {
    setPanel((p) => (p === 'poruka' ? 'nema' : 'poruka'))
    blok.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [])

  const otvoriTelefon = useCallback(async () => {
    setPanel((p) => (p === 'telefon' ? 'nema' : 'telefon'))
    blok.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    if (telefon !== undefined || !imaTelefon) return
    try {
      const res = await fetch(`/api/oglasi/${oglasId}/telefon`)
      const data = await res.json().catch(() => ({}))
      if (!res.ok) setGreskaTelefona(data.greska || 'Broj trenutno nije dostupan.')
      else setTelefon(data.telefon ?? null)
    } catch {
      setGreskaTelefona('Greška pri povezivanju sa serverom.')
    }
  }, [imaTelefon, oglasId, telefon])

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
      setRazgovorId(data.razgovorId)
    } catch {
      setGreska('Greška pri povezivanju sa serverom.')
    } finally {
      setSaljem(false)
    }
  }

  if (jeVlasnik) {
    return (
      <div className={s.blok} id="kontakt">
        <div className={s.panel} role="status">
          <p className={s.panelNaslov}>Ovo je tvoj oglas</p>
          <p className={s.panelTekst}>
            Kupci ti pišu odavde, a poruke stižu u tvoje sanduče. Cenu menjaš i oglas sklanjaš u
            svom nalogu.
          </p>
          <div className={s.panelDugmad}>
            <Link href="/nalog" className="btn btn-secondary">
              Moj nalog
            </Link>
            <Link href="/poruke" className="btn btn-ghost">
              Poruke
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={s.blok} ref={blok} id="kontakt">
        <div className={s.dugmad}>
          <button
            type="button"
            className="btn btn-primary btn-veliki btn-puni"
            onClick={otvoriPoruku}
            aria-expanded={panel === 'poruka'}
            aria-controls="kontakt-panel"
          >
            Pošalji poruku
          </button>

          <div className={s.sporedne}>
            {imaTelefon ? (
              <button
                type="button"
                className={['btn', 'btn-tertiary', s.pozovi].join(' ')}
                onClick={otvoriTelefon}
                aria-expanded={panel === 'telefon'}
                aria-controls="kontakt-panel"
              >
                Pozovi
              </button>
            ) : null}
            <SacuvajDugme slug={slug} varijanta="dugme" className={s.sacuvaj} />
          </div>
        </div>

        {odgovaraZa ? (
          <p className={s.odgovor}>
            <Ikona ime="sat" velicina={15} />
            {prodavacNaziv} odgovara {odgovaraZa}
          </p>
        ) : null}

        <div id="kontakt-panel">
          {panel === 'poruka' && sesija === null ? (
            <div className={s.panel}>
              <p className={s.panelNaslov}>Prijavi se da pišeš prodavcu</p>
              <p className={s.panelTekst}>
                Poruke idu preko Alatnice, pa ne moraš nikome da daješ broj ili email dok se ne
                dogovorite. Nalog je besplatan.
              </p>
              <div className={s.panelDugmad}>
                <Link
                  href={`/prijava?odakle=${encodeURIComponent(odakle)}`}
                  className="btn btn-secondary"
                >
                  Prijava
                </Link>
                <Link
                  href={`/registracija?odakle=${encodeURIComponent(odakle)}`}
                  className="btn btn-ghost"
                >
                  Napravi nalog
                </Link>
              </div>
            </div>
          ) : null}

          {panel === 'poruka' && sesija && !razgovorId ? (
            <form className={s.panel} onSubmit={posalji}>
              <label className="polje-oznaka" htmlFor={idTeksta}>
                Poruka prodavcu
              </label>
              <textarea
                id={idTeksta}
                className={['polje', s.tekst].join(' ')}
                rows={4}
                maxLength={2000}
                value={tekst}
                onChange={(e) => setTekst(e.target.value)}
              />
              {greska ? (
                <p className={s.greska} role="alert">
                  {greska}
                </p>
              ) : null}
              <div className={s.panelDugmad}>
                <button type="submit" className="btn btn-secondary" disabled={saljem || !tekst.trim()}>
                  {saljem ? 'Slanje…' : 'Pošalji'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setPanel('nema')}>
                  Odustani
                </button>
              </div>
            </form>
          ) : null}

          {panel === 'poruka' && sesija === undefined ? (
            <div className={s.panel} aria-busy="true">
              <p className={s.panelTekst}>Učitavanje…</p>
            </div>
          ) : null}

          {panel === 'poruka' && razgovorId ? (
            <div className={s.panel} role="status">
              <p className={s.panelNaslov}>Poruka je poslata</p>
              <p className={s.panelTekst}>
                {prodavacNaziv} je dobija u svoje sanduče. Odgovor ćeš videti u porukama, uz
                značku u navigaciji.
              </p>
              <div className={s.panelDugmad}>
                <Link href={`/poruke/${razgovorId}`} className="btn btn-secondary">
                  Idi na razgovor
                </Link>
              </div>
            </div>
          ) : null}

          {panel === 'telefon' ? (
            <div className={s.panel} role="status">
              {telefon ? (
                <>
                  <p className={s.panelNaslov}>
                    <a
                      href={`tel:${telefon.replace(/[^\d+]/g, '')}`}
                      onClick={() => navigator.sendBeacon?.(`/api/oglasi/${oglasId}/poziv`)}
                    >
                      {telefon}
                    </a>
                  </p>
                  <p className={s.panelTekst}>
                    Pre plaćanja alat pogledaj i probaj uživo. Ne šalji kaparu nepoznatom
                    prodavcu.
                  </p>
                </>
              ) : greskaTelefona ? (
                <p className={s.panelTekst}>{greskaTelefona}</p>
              ) : telefon === null ? (
                <p className={s.panelTekst}>Prodavac nije ostavio broj. Pošalji mu poruku.</p>
              ) : (
                <p className={s.panelTekst}>Učitavanje broja…</p>
              )}
              <button type="button" className="btn btn-ghost" onClick={() => setPanel('nema')}>
                Zatvori
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Lepljiva traka — samo telefon. Stranica ispod ima rezervisan prostor. */}
      <div
        className={[s.traka, uzPodnozje ? s.trakaSklonjena : ''].filter(Boolean).join(' ')}
        inert={uzPodnozje}
      >
        <button type="button" className="btn btn-primary" onClick={otvoriPoruku}>
          Pošalji poruku
        </button>
        {imaTelefon ? (
          <button type="button" className="btn btn-tertiary" onClick={otvoriTelefon}>
            Pozovi
          </button>
        ) : null}
        <span className={s.srce}>
          <SacuvajDugme slug={slug} />
        </span>
      </div>
    </>
  )
}

export default KontaktAkcije
