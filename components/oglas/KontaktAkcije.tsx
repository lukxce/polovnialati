'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Ikona } from '@/components/Ikone'
import SacuvajDugme from '@/components/SacuvajDugme'
import s from './KontaktAkcije.module.css'

type Props = {
  slug: string
  naslov: string
  prodavacNaziv: string
  odgovaraZa: string
}

type Panel = 'nema' | 'poruka' | 'poslato' | 'telefon'

/**
 * Kontakt sa prodavcem + lepljiva traka na telefonu.
 *
 * Alatnica je prototip: nema naloga, nema servera za poruke i nema telefonskih
 * brojeva prodavaca. Umesto lažne potvrde, UI to kaže naglas na svakom koraku.
 */
export function KontaktAkcije({ slug, naslov, prodavacNaziv, odgovaraZa }: Props) {
  const [panel, setPanel] = useState<Panel>('nema')
  const [uzPodnozje, setUzPodnozje] = useState(false)
  const blok = useRef<HTMLDivElement>(null)

  /**
   * Kad podnožje uđe u vidno polje, traka se sklanja — inače bi na dnu
   * stranice pokrila poslednji red podnožja. Akcije i dalje stoje u bloku iznad.
   */
  useEffect(() => {
    const podnozje = document.querySelector('footer')
    if (!podnozje) return

    // Samo čitanje jedne pozicije po događaju — bez izazivanja preloma.
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

  const otvoriTelefon = useCallback(() => {
    setPanel((p) => (p === 'telefon' ? 'nema' : 'telefon'))
    blok.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [])

  return (
    <>
      <div className={s.blok} ref={blok} id="kontakt">
        <div className={s.dugmad}>
          <button
            type="button"
            className="btn btn-primary btn-veliki btn-puni"
            onClick={otvoriPoruku}
            aria-expanded={panel === 'poruka' || panel === 'poslato'}
            aria-controls="kontakt-panel"
          >
            Pošalji poruku
          </button>

          <div className={s.sporedne}>
            <button
              type="button"
              className={['btn', 'btn-tertiary', s.pozovi].join(' ')}
              onClick={otvoriTelefon}
              aria-expanded={panel === 'telefon'}
              aria-controls="kontakt-panel"
            >
              Pozovi
            </button>
            <SacuvajDugme slug={slug} varijanta="dugme" className={s.sacuvaj} />
          </div>
        </div>

        <p className={s.odgovor}>
          <Ikona ime="sat" velicina={15} />
          {prodavacNaziv} odgovara {odgovaraZa}
        </p>

        <div id="kontakt-panel">
          {panel === 'poruka' ? (
            <form
              className={s.panel}
              onSubmit={(e) => {
                e.preventDefault()
                setPanel('poslato')
              }}
            >
              <label className="polje-oznaka" htmlFor="poruka-tekst">
                Poruka prodavcu
              </label>
              <textarea
                id="poruka-tekst"
                className={['polje', s.tekst].join(' ')}
                rows={4}
                defaultValue={`Poštovanje, da li je „${naslov}“ još uvek dostupno? Zanima me proba pod opterećenjem pre kupovine. Hvala.`}
              />
              <p className={s.napomenaMala}>
                Ovo je demo prototip: poruka se ne šalje nigde i prodavac je ne prima.
              </p>
              <div className={s.panelDugmad}>
                <button type="submit" className="btn btn-secondary">
                  Pošalji
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setPanel('nema')}>
                  Odustani
                </button>
              </div>
            </form>
          ) : null}

          {panel === 'poslato' ? (
            <div className={s.panel} role="status">
              <p className={s.panelNaslov}>Poruka nije poslata</p>
              <p className={s.panelTekst}>
                Alatnica je prototip: nema naloga, servera ni sandučeta za poruke, pa nema kome da
                stigne. U pravoj verziji poruka bi otišla prodavcu {prodavacNaziv}, a odgovor bi
                stizao {odgovaraZa}.
              </p>
              <button type="button" className="btn btn-ghost" onClick={() => setPanel('nema')}>
                Zatvori
              </button>
            </div>
          ) : null}

          {panel === 'telefon' ? (
            <div className={s.panel} role="status">
              <p className={s.panelNaslov}>Broj telefona se ne prikazuje</p>
              <p className={s.panelTekst}>
                U demou nema pravih naloga prodavaca, pa nema ni pravih brojeva. U pravoj verziji bi
                se broj otkrivao ovde, uz podsetnik da se alat gleda i proba uživo pre plaćanja.
              </p>
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
        <button type="button" className="btn btn-tertiary" onClick={otvoriTelefon}>
          Pozovi
        </button>
        <span className={s.srce}>
          <SacuvajDugme slug={slug} />
        </span>
      </div>
    </>
  )
}

export default KontaktAkcije
