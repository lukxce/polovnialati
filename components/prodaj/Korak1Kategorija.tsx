'use client'

import { useId, useMemo, useState } from 'react'
import { Ikona } from '@/components/Ikone'
import { brojSr } from '@/lib/format'
import { normalizuj, type GrupaKategorija } from './model'
import s from './tok.module.css'

type Props = {
  stablo: GrupaKategorija[]
  /** Izabrana potkategorija (list). */
  izabrana?: string
  /** Nadkategorija u koju je korisnik ušao — živi u URL-u (`?grupa=`). */
  grupa?: string
  naGrupu: (slug?: string) => void
  naIzbor: (slug: string) => void
}

type Pogodak = { slug: string; naziv: string; ikona: string; nad: string; nadNaziv: string }

export function Korak1Kategorija({ stablo, izabrana, grupa, naGrupu, naIzbor }: Props) {
  const [upit, setUpit] = useState('')
  const idPretrage = useId()

  const svePotkategorije = useMemo<Pogodak[]>(
    () =>
      stablo.flatMap((g) =>
        g.deca.map((d) => ({
          slug: d.slug,
          naziv: d.naziv,
          ikona: d.ikona,
          nad: g.slug,
          nadNaziv: g.naziv,
        })),
      ),
    [stablo],
  )

  const pogoci = useMemo(() => {
    const q = normalizuj(upit)
    if (q.length < 2) return null
    const reci = q.split(/\s+/)
    return svePotkategorije.filter((p) => {
      const seno = normalizuj(`${p.naziv} ${p.nadNaziv}`)
      return reci.every((r) => seno.includes(r))
    })
  }, [upit, svePotkategorije])

  const otvorena = grupa ? stablo.find((g) => g.slug === grupa) : undefined
  const izabranPogodak = izabrana ? svePotkategorije.find((p) => p.slug === izabrana) : undefined

  return (
    <div className={s.korakTelo}>
      <div className={s.poljeGrupa}>
        <label className="polje-oznaka" htmlFor={idPretrage}>
          Pretraži kategorije
        </label>
        <div className={s.pretragaOkvir}>
          <Ikona ime="pretraga" velicina={18} className={s.pretragaIkona} />
          <input
            id={idPretrage}
            type="search"
            className={['polje', s.pretragaPolje].join(' ')}
            placeholder="npr. brusilica, laser, agregat"
            value={upit}
            onChange={(e) => setUpit(e.target.value)}
            autoComplete="off"
          />
          {upit ? (
            <button
              type="button"
              className={s.pretragaCisti}
              onClick={() => setUpit('')}
              aria-label="Obriši pretragu"
            >
              <Ikona ime="x" velicina={17} />
            </button>
          ) : null}
        </div>
      </div>

      {izabranPogodak ? (
        <div className={s.izborTraka}>
          <div className={s.izborPutanja}>
            <span className="micro">Izabrano</span>
            <p className={s.izborTekst}>
              {izabranPogodak.nadNaziv}
              <span aria-hidden="true"> › </span>
              <strong>{izabranPogodak.naziv}</strong>
            </p>
          </div>
          <button
            type="button"
            className="btn btn-tertiary btn-mali"
            onClick={() => {
              naGrupu(izabranPogodak.nad)
              setUpit('')
            }}
          >
            Promeni
          </button>
        </div>
      ) : null}

      {pogoci ? (
        pogoci.length === 0 ? (
          <div className={s.nemaPogodaka}>
            <p>
              Nema kategorije koja odgovara upitu <strong>„{upit}"</strong>.
            </p>
            <p className={s.pomoc}>
              Namerno ne pokrivamo kamione, bagere i viljuškare. Ako prodaješ elektroalat,
              probaj naziv mašine: „bušilica", „inverter", „agregat".
            </p>
            <button type="button" className="btn btn-tertiary" onClick={() => setUpit('')}>
              Prikaži sve kategorije
            </button>
          </div>
        ) : (
          <>
            <p className={s.rezultatBroj} role="status">
              {brojSr(pogoci.length, ['kategorija', 'kategorije', 'kategorija'])} odgovara upitu
            </p>
            <ul className={s.plocice}>
              {pogoci.map((p) => (
                <li key={p.slug}>
                  <button
                    type="button"
                    className={[s.plocica, izabrana === p.slug ? s.plocicaAktivna : '']
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => {
                      naIzbor(p.slug)
                      naGrupu(p.nad)
                      setUpit('')
                    }}
                    aria-pressed={izabrana === p.slug}
                  >
                    <span className={s.plocicaIkona}>
                      <Ikona ime={p.ikona} velicina={24} />
                    </span>
                    <span className={s.plocicaTekst}>
                      <span className={s.plocicaNaziv}>{p.naziv}</span>
                      <span className={s.plocicaNad}>{p.nadNaziv}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )
      ) : otvorena ? (
        <>
          <div className={s.nazadRed}>
            <button type="button" className={s.nazadLink} onClick={() => naGrupu(undefined)}>
              <Ikona ime="strelica" velicina={17} className={s.strelicaNazad} />
              Sve kategorije
            </button>
            <h3 className={s.grupaNaslov}>{otvorena.naziv}</h3>
          </div>
          {otvorena.opis ? <p className={s.grupaOpis}>{otvorena.opis}</p> : null}

          <ul className={s.plocice}>
            {otvorena.deca.map((d) => (
              <li key={d.slug}>
                <button
                  type="button"
                  className={[s.plocica, izabrana === d.slug ? s.plocicaAktivna : '']
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => naIzbor(d.slug)}
                  aria-pressed={izabrana === d.slug}
                >
                  <span className={s.plocicaIkona}>
                    <Ikona ime={d.ikona} velicina={24} />
                  </span>
                  <span className={s.plocicaTekst}>
                    <span className={s.plocicaNaziv}>{d.naziv}</span>
                  </span>
                  {izabrana === d.slug ? (
                    <span className={s.plocicaCek}>
                      <Ikona ime="cek" velicina={16} />
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <ul className={s.plocice}>
          {stablo.map((g) => (
            <li key={g.slug}>
              <button
                type="button"
                className={[s.plocica, s.plocicaGrupa, grupa === g.slug ? s.plocicaAktivna : '']
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => naGrupu(g.slug)}
              >
                <span className={s.plocicaIkona}>
                  <Ikona ime={g.ikona} velicina={26} />
                </span>
                <span className={s.plocicaTekst}>
                  <span className={s.plocicaNaziv}>{g.naziv}</span>
                  <span className={s.plocicaNad}>
                    {brojSr(g.deca.length, ['potkategorija', 'potkategorije', 'potkategorija'])}
                  </span>
                </span>
                <span className={s.plocicaStrelica} aria-hidden="true">
                  ›
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Korak1Kategorija
