'use client'

import { useEffect, useMemo, useState } from 'react'
import { Ikona } from '@/components/Ikone'
import ProdavacOznaka from '@/components/ProdavacOznaka'
import { STANJA, brojSr, stanjeDefinicija, stanjeLabela } from '@/lib/format'
import type { Filteri } from '@/lib/filteri'
import type { Dostava, Stanje, TipProdavca } from '@/lib/types'
import type { BrowseFasete } from './podaci'
import { prebaciVrednost } from './useFilteri'
import s from './FilterSadrzaj.module.css'

type Props = {
  filteri: Filteri
  fasete: BrowseFasete
  postavi: (delta: Partial<Filteri>) => void
  obrisiSve: () => void
  /** Kategorija zaključana putanjom — stablo se skuplja na njen podskup. */
  zakljucanaKategorija?: string
  /** `rail` = desktop kolona, `list` = mobilni donji list. */
  varijanta: 'rail' | 'list'
}

const BRZI_OPSEZI: { oznaka: string; od?: number; do?: number }[] = [
  { oznaka: 'do 10.000', do: 10000 },
  { oznaka: '10 – 30k', od: 10000, do: 30000 },
  { oznaka: '30 – 80k', od: 30000, do: 80000 },
  { oznaka: '80k i više', od: 80000 },
]

const TIPOVI: TipProdavca[] = ['privatno-lice', 'prodavnica', 'servis']

const DOSTAVE: { vrednost: Dostava; oznaka: string; opis: string }[] = [
  { vrednost: 'kurirska', oznaka: 'Kurirska služba', opis: 'Prodavac šalje kurirom' },
  { vrednost: 'pouzece', oznaka: 'Plaćanje pouzećem', opis: 'Platiš kuriru kad stigne, ne unapred' },
  { vrednost: 'besplatna', oznaka: 'Besplatna dostava', opis: 'Prodavac plaća slanje' },
]

/* ── Sitni gradivni elementi ──────────────────────────────────── */

function Grupa({
  naslov,
  napomena,
  podrazumevanoOtvorena = true,
  akcenat,
  children,
}: {
  naslov: string
  napomena?: string
  podrazumevanoOtvorena?: boolean
  akcenat?: boolean
  children: React.ReactNode
}) {
  const [otvorena, setOtvorena] = useState(podrazumevanoOtvorena)
  const id = useMemo(() => `grupa-${naslov.replace(/\s+/g, '-').toLowerCase()}`, [naslov])

  return (
    <section className={[s.grupa, akcenat ? s.grupaAkcenat : ''].filter(Boolean).join(' ')}>
      <h3 className={s.grupaNaslovOmot}>
        <button
          type="button"
          className={s.grupaNaslov}
          onClick={() => setOtvorena((x) => !x)}
          aria-expanded={otvorena}
          aria-controls={id}
        >
          <span>{naslov}</span>
          <Ikona ime={otvorena ? 'minus' : 'plus'} velicina={17} className={s.grupaZnak} />
        </button>
      </h3>
      <div id={id} hidden={!otvorena} className={s.grupaTelo}>
        {napomena ? <p className={s.napomena}>{napomena}</p> : null}
        {children}
      </div>
    </section>
  )
}

function Broj({ n }: { n: number }) {
  return (
    <span className={s.broj} aria-hidden="true">
      {n}
    </span>
  )
}

function Kvadratic({
  naziv,
  oznaka,
  opis,
  broj,
  cekirano,
  onChange,
  glif,
}: {
  naziv: string
  oznaka: string
  opis?: string
  broj: number
  cekirano: boolean
  onChange: () => void
  glif?: React.ReactNode
}) {
  const onemoguceno = broj === 0 && !cekirano
  return (
    <label
      className={[s.red, onemoguceno ? s.redOnemogucen : '', cekirano ? s.redAktivan : '']
        .filter(Boolean)
        .join(' ')}
    >
      <input
        type="checkbox"
        name={naziv}
        className={s.kvadratic}
        checked={cekirano}
        disabled={onemoguceno}
        onChange={onChange}
      />
      <span className={s.redTekst}>
        <span className={s.redOznaka}>
          {glif}
          {oznaka}
        </span>
        {opis ? <span className={s.redOpis}>{opis}</span> : null}
      </span>
      <Broj n={broj} />
    </label>
  )
}

/* ── Glavni sadržaj ───────────────────────────────────────────── */

export function FilterSadrzaj({
  filteri,
  fasete,
  postavi,
  obrisiSve,
  zakljucanaKategorija,
  varijanta,
}: Props) {
  const { brojevi, stablo, brendovi, gradovi, akuSistemi } = fasete

  /* Kategorija ------------------------------------------------- */
  const koren = useMemo(() => {
    if (!filteri.kategorija) return undefined
    const kaoNad = stablo.find((g) => g.kategorija.slug === filteri.kategorija)
    if (kaoNad) return kaoNad.kategorija.slug
    return stablo.find((g) => g.deca.some((d) => d.slug === filteri.kategorija))?.kategorija.slug
  }, [filteri.kategorija, stablo])

  const [razgranato, setRazgranato] = useState<string[]>(() =>
    [koren, zakljucanaKategorija].filter((x): x is string => Boolean(x)),
  )

  useEffect(() => {
    if (koren) setRazgranato((prev) => (prev.includes(koren) ? prev : [...prev, koren]))
  }, [koren])

  const vidljivoStablo = zakljucanaKategorija
    ? stablo.filter(
        (g) =>
          g.kategorija.slug === zakljucanaKategorija ||
          g.deca.some((d) => d.slug === zakljucanaKategorija),
      )
    : stablo

  /* Cena ------------------------------------------------------- */
  const [od, setOd] = useState(filteri.cenaOd !== undefined ? String(filteri.cenaOd) : '')
  const [doo, setDoo] = useState(filteri.cenaDo !== undefined ? String(filteri.cenaDo) : '')

  useEffect(() => {
    setOd(filteri.cenaOd !== undefined ? String(filteri.cenaOd) : '')
    setDoo(filteri.cenaDo !== undefined ? String(filteri.cenaDo) : '')
  }, [filteri.cenaOd, filteri.cenaDo])

  const primeniCenu = () => {
    const a = od.trim() === '' ? undefined : Number(od.replace(/\D/g, ''))
    const b = doo.trim() === '' ? undefined : Number(doo.replace(/\D/g, ''))
    if (a === filteri.cenaOd && b === filteri.cenaDo) return
    postavi({
      cenaOd: Number.isFinite(a as number) ? a : undefined,
      cenaDo: Number.isFinite(b as number) ? b : undefined,
    })
  }

  /* Brend ------------------------------------------------------ */
  const [upitBrenda, setUpitBrenda] = useState('')
  const filtriraniBrendovi = useMemo(() => {
    const q = upitBrenda.trim().toLowerCase()
    const lista = q ? brendovi.filter((b) => b.naziv.toLowerCase().includes(q)) : brendovi
    return [...lista].sort((a, b) => {
      const izabranA = filteri.brend?.includes(a.slug) ? 0 : 1
      const izabranB = filteri.brend?.includes(b.slug) ? 0 : 1
      if (izabranA !== izabranB) return izabranA - izabranB
      return (brojevi.brend[b.slug] ?? 0) - (brojevi.brend[a.slug] ?? 0)
    })
  }, [brendovi, upitBrenda, filteri.brend, brojevi.brend])

  const ukupnoSve = stablo.reduce((zbir, g) => zbir + (brojevi.kategorija[g.kategorija.slug] ?? 0), 0)

  return (
    <div className={[s.omot, varijanta === 'list' ? s.uListu : s.uRailu].join(' ')}>
      <div className={s.zaglavlje}>
        <p className="micro">Suzi izbor</p>
        <button type="button" className={s.obrisi} onClick={obrisiSve}>
          Obriši sve
        </button>
      </div>

      {/* 1. Kategorija */}
      <Grupa naslov="Kategorija">
        <ul className={s.stablo}>
          {!zakljucanaKategorija ? (
            <li>
              <button
                type="button"
                className={[s.katRed, !filteri.kategorija ? s.katAktivna : ''].join(' ')}
                onClick={() => postavi({ kategorija: undefined })}
                aria-pressed={!filteri.kategorija}
              >
                <span className={s.katIme}>Sve kategorije</span>
                <Broj n={ukupnoSve} />
              </button>
            </li>
          ) : null}

          {vidljivoStablo.map(({ kategorija, deca }) => {
            const otvoren = razgranato.includes(kategorija.slug)
            const broj = brojevi.kategorija[kategorija.slug] ?? 0
            const aktivna = filteri.kategorija === kategorija.slug
            return (
              <li key={kategorija.slug} className={s.katGrana}>
                <div className={s.katRedOmot}>
                  <button
                    type="button"
                    className={s.katStrelica}
                    aria-expanded={otvoren}
                    aria-label={`${otvoren ? 'Skupi' : 'Razgranaj'} ${kategorija.naziv}`}
                    onClick={() =>
                      setRazgranato((prev) =>
                        prev.includes(kategorija.slug)
                          ? prev.filter((x) => x !== kategorija.slug)
                          : [...prev, kategorija.slug],
                      )
                    }
                  >
                    <span className={otvoren ? s.strelicaDole : s.strelicaDesno} aria-hidden="true">
                      ›
                    </span>
                  </button>

                  <button
                    type="button"
                    className={[s.katRed, aktivna ? s.katAktivna : ''].join(' ')}
                    disabled={broj === 0 && !aktivna}
                    aria-pressed={aktivna}
                    onClick={() =>
                      postavi({ kategorija: aktivna ? zakljucanaKategorija : kategorija.slug })
                    }
                  >
                    <span className={s.katIme}>{kategorija.naziv}</span>
                    <Broj n={broj} />
                  </button>
                </div>

                {otvoren ? (
                  <ul className={s.katDeca}>
                    {deca.map((d) => {
                      const b = brojevi.kategorija[d.slug] ?? 0
                      const a = filteri.kategorija === d.slug
                      return (
                        <li key={d.slug}>
                          <button
                            type="button"
                            className={[s.katRed, s.katDete, a ? s.katAktivna : ''].join(' ')}
                            disabled={b === 0 && !a}
                            aria-pressed={a}
                            onClick={() =>
                              postavi({ kategorija: a ? kategorija.slug : d.slug })
                            }
                          >
                            <span className={s.katIme}>{d.naziv}</span>
                            <Broj n={b} />
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                ) : null}
              </li>
            )
          })}
        </ul>
      </Grupa>

      {/* 2. Stanje */}
      <Grupa naslov="Stanje" napomena="Pet ocena sa istom definicijom za sve prodavce.">
        <div className={s.lista}>
          {STANJA.map((g: Stanje) => (
            <Kvadratic
              key={g}
              naziv="stanje"
              oznaka={stanjeLabela(g)}
              opis={stanjeDefinicija(g)}
              broj={brojevi.stanje[g] ?? 0}
              cekirano={!!filteri.stanje?.includes(g)}
              onChange={() => postavi({ stanje: prebaciVrednost<Stanje>(filteri.stanje, g) })}
            />
          ))}
        </div>
      </Grupa>

      {/* 3. Cena */}
      <Grupa naslov="Cena">
        <div className={s.cenaPolja}>
          <label className={s.cenaPolje}>
            <span className="polje-oznaka">Od (din)</span>
            <input
              type="text"
              inputMode="numeric"
              className="polje"
              placeholder="0"
              value={od}
              onChange={(e) => setOd(e.target.value)}
              onBlur={primeniCenu}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  primeniCenu()
                }
              }}
            />
          </label>
          <label className={s.cenaPolje}>
            <span className="polje-oznaka">Do (din)</span>
            <input
              type="text"
              inputMode="numeric"
              className="polje"
              placeholder="bez granice"
              value={doo}
              onChange={(e) => setDoo(e.target.value)}
              onBlur={primeniCenu}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  primeniCenu()
                }
              }}
            />
          </label>
        </div>

        <div className={s.opsezi}>
          {BRZI_OPSEZI.map((o) => {
            const aktivan = filteri.cenaOd === o.od && filteri.cenaDo === o.do
            return (
              <button
                key={o.oznaka}
                type="button"
                className="chip"
                aria-pressed={aktivan}
                onClick={() =>
                  postavi(
                    aktivan
                      ? { cenaOd: undefined, cenaDo: undefined }
                      : { cenaOd: o.od, cenaDo: o.do },
                  )
                }
              >
                {o.oznaka}
              </button>
            )
          })}
        </div>
      </Grupa>

      {/* 4. Brend */}
      <Grupa naslov="Brend">
        <div className={s.pretragaOmot}>
          <Ikona ime="pretraga" velicina={17} className={s.pretragaIkona} />
          <input
            type="search"
            className={['polje', s.pretragaPolje].join(' ')}
            placeholder="Pronađi brend"
            aria-label="Pretraži brendove"
            value={upitBrenda}
            onChange={(e) => setUpitBrenda(e.target.value)}
          />
        </div>

        <div className={[s.lista, s.listaSkrol].join(' ')}>
          {filtriraniBrendovi.map((b) => (
            <Kvadratic
              key={b.slug}
              naziv="brend"
              oznaka={b.naziv}
              broj={brojevi.brend[b.slug] ?? 0}
              cekirano={!!filteri.brend?.includes(b.slug)}
              onChange={() => postavi({ brend: prebaciVrednost(filteri.brend, b.slug) })}
            />
          ))}
          {filtriraniBrendovi.length === 0 ? (
            <p className={s.nemaPogodaka}>Nema brenda sa tim imenom.</p>
          ) : null}
        </div>
      </Grupa>

      {/* 5. Akumulatorski sistem — samo kada u izboru uopšte ima aku alata */}
      {akuSistemi.length > 0 ? (
        <Grupa
          naslov="Akumulatorski sistem"
          akcenat
          napomena="Baterija od 18 V jednog proizvođača ne ulazi u mašinu drugog. Ako već imaš baterije, filtriraj po svom sistemu i kupuj samo golu mašinu."
        >
          <div className={s.lista}>
            {akuSistemi.map((a) => (
              <Kvadratic
                key={a}
                naziv="aku"
                oznaka={a}
                broj={brojevi.aku[a] ?? 0}
                cekirano={!!filteri.aku?.includes(a)}
                glif={<Ikona ime="baterija" velicina={16} className={s.glif} />}
                onChange={() => postavi({ aku: prebaciVrednost(filteri.aku, a) })}
              />
            ))}
          </div>
        </Grupa>
      ) : null}

      {/* 6. Lokacija */}
      <Grupa naslov="Lokacija" podrazumevanoOtvorena={!!filteri.grad}>
        <label className={s.selectOmot}>
          <span className="sr-only">Grad</span>
          <select
            className="polje"
            value={filteri.grad ?? ''}
            onChange={(e) => postavi({ grad: e.target.value || undefined })}
          >
            <option value="">Cela Srbija ({brojSr(ukupnoSve, ['oglas', 'oglasa', 'oglasa'])})</option>
            {gradovi.map((g) => (
              <option key={g} value={g} disabled={(brojevi.grad[g] ?? 0) === 0 && filteri.grad !== g}>
                {g} ({brojevi.grad[g] ?? 0})
              </option>
            ))}
          </select>
        </label>
      </Grupa>

      {/* 7. Garancija */}
      <Grupa naslov="Garancija" podrazumevanoOtvorena={!!filteri.garancija}>
        <div className={s.lista}>
          <Kvadratic
            naziv="garancija"
            oznaka="Ima garanciju"
            opis="Preostalo bar mesec dana garancije"
            broj={brojevi.garancija}
            cekirano={!!filteri.garancija}
            onChange={() => postavi({ garancija: filteri.garancija ? undefined : true })}
          />
        </div>
      </Grupa>

      {/* 8. Dostava */}
      <Grupa naslov="Dostava" podrazumevanoOtvorena={!!filteri.dostava?.length}>
        <div className={s.lista}>
          {DOSTAVE.map((d) => (
            <Kvadratic
              key={d.vrednost}
              naziv="dostava"
              oznaka={d.oznaka}
              opis={d.opis}
              broj={brojevi.dostava[d.vrednost]}
              cekirano={!!filteri.dostava?.includes(d.vrednost)}
              glif={<Ikona ime="kamion" velicina={16} className={s.glif} />}
              onChange={() => postavi({ dostava: prebaciVrednost(filteri.dostava, d.vrednost) })}
            />
          ))}
        </div>
      </Grupa>

      {/* 9. Tip prodavca */}
      <Grupa naslov="Tip prodavca" podrazumevanoOtvorena={!!filteri.tip?.length}>
        <div className={s.lista}>
          {TIPOVI.map((t) => (
            <label
              key={t}
              className={[
                s.red,
                brojevi.tip[t] === 0 && !filteri.tip?.includes(t) ? s.redOnemogucen : '',
                filteri.tip?.includes(t) ? s.redAktivan : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <input
                type="checkbox"
                name="tip"
                className={s.kvadratic}
                checked={!!filteri.tip?.includes(t)}
                disabled={brojevi.tip[t] === 0 && !filteri.tip?.includes(t)}
                onChange={() => postavi({ tip: prebaciVrednost<TipProdavca>(filteri.tip, t) })}
              />
              <span className={s.redTekst}>
                <ProdavacOznaka tip={t} />
              </span>
              <Broj n={brojevi.tip[t]} />
            </label>
          ))}
        </div>
      </Grupa>

      <p className={s.fusnota}>
        Brojevi pored opcija pokazuju koliko oglasa ostaje ako dodaš baš tu opciju, uz sve ostale
        filtere koje si već postavio. Opcija bez ijednog rezultata je isključena, a ne sakrivena:
        da se vidi šta tržište trenutno nema.
      </p>
    </div>
  )
}

export default FilterSadrzaj
