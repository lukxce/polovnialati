'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { Ikona } from '@/components/Ikone'
import { stanjeDefinicija } from '@/lib/format'
import type { Stanje } from '@/lib/types'
import s from './Filteri.module.css'
import { BRZI_OPSEZI, DOSTAVE, SORTIRANJA, TIPOVI_PRODAVCA, type FilterPodaci } from './tipovi'

/* ──────────────────────────────────────────────────────────────
   Rad sa URL-om — URL je jedini izvor istine za filtere
   ────────────────────────────────────────────────────────────── */

function useUrlFilteri() {
  const sp = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const upisi = useCallback(
    (izmene: Record<string, string | null>) => {
      const usp = new URLSearchParams(sp.toString())
      for (const [kljuc, vrednost] of Object.entries(izmene)) {
        if (vrednost === null || vrednost === '') usp.delete(kljuc)
        else usp.set(kljuc, vrednost)
      }
      const upit = usp.toString()
      router.push(upit ? `${pathname}?${upit}` : pathname, { scroll: false })
    },
    [pathname, router, sp],
  )

  const lista = useCallback(
    (kljuc: string) => (sp.get(kljuc) ?? '').split(',').filter(Boolean),
    [sp],
  )

  const prebaci = useCallback(
    (kljuc: string, vrednost: string) => {
      const trenutne = lista(kljuc)
      const nove = trenutne.includes(vrednost)
        ? trenutne.filter((x) => x !== vrednost)
        : [...trenutne, vrednost]
      upisi({ [kljuc]: nove.join(',') || null })
    },
    [lista, upisi],
  )

  return { sp, pathname, upisi, lista, prebaci }
}

/* ──────────────────────────────────────────────────────────────
   Sitni gradivni elementi
   ────────────────────────────────────────────────────────────── */

function Grupa({
  naslov,
  otvorena = true,
  children,
}: {
  naslov: string
  otvorena?: boolean
  children: React.ReactNode
}) {
  return (
    <details className={s.grupa} open={otvorena}>
      <summary className={s.grupaNaslov}>
        <span>{naslov}</span>
        <span className={s.strelica} aria-hidden="true">
          <Ikona ime="plus" velicina={16} className={s.plus} />
          <Ikona ime="minus" velicina={16} className={s.minus} />
        </span>
      </summary>
      <div className={s.grupaTelo}>{children}</div>
    </details>
  )
}

function Kvadratic({
  oznaceno,
  onChange,
  naziv,
  broj,
  opis,
}: {
  oznaceno: boolean
  onChange: () => void
  naziv: string
  broj?: number
  opis?: string
}) {
  const onemoguceno = broj === 0 && !oznaceno
  return (
    <label className={onemoguceno ? s.redOnemogucen : s.red}>
      <input type="checkbox" checked={oznaceno} onChange={onChange} disabled={onemoguceno} />
      <span className={s.redTekst}>
        <span className={s.redNaziv}>{naziv}</span>
        {opis ? <span className={s.redOpis}>{opis}</span> : null}
      </span>
      {broj !== undefined ? <span className={s.redBroj}>{broj}</span> : null}
    </label>
  )
}

/* ──────────────────────────────────────────────────────────────
   Sadržaj filtera — isti u desktop rail-u i u mobilnom listu
   ────────────────────────────────────────────────────────────── */

function SadrzajFiltera({ podaci }: { podaci: FilterPodaci }) {
  const { sp, upisi, lista, prebaci } = useUrlFilteri()
  const idOd = useId()
  const idDo = useId()
  const idGrad = useId()

  const cenaOdUrl = sp.get('cenaOd') ?? ''
  const cenaDoUrl = sp.get('cenaDo') ?? ''
  const [cenaOd, setCenaOd] = useState(cenaOdUrl)
  const [cenaDo, setCenaDo] = useState(cenaDoUrl)
  const [trazenBrend, setTrazenBrend] = useState('')

  useEffect(() => setCenaOd(cenaOdUrl), [cenaOdUrl])
  useEffect(() => setCenaDo(cenaDoUrl), [cenaDoUrl])

  const primeniCenu = () =>
    upisi({
      cenaOd: cenaOd.replace(/\D/g, '') || null,
      cenaDo: cenaDo.replace(/\D/g, '') || null,
    })

  const brendovi = useMemo(() => {
    const t = trazenBrend.trim().toLowerCase()
    const vidljivi = t
      ? podaci.brendovi.filter((b) => b.naziv.toLowerCase().includes(t))
      : podaci.brendovi
    return vidljivi
  }, [podaci.brendovi, trazenBrend])

  const izabraniBrendovi = lista('brend')
  const izabranaStanja = lista('stanje')
  const izabranAku = lista('aku')
  const izabranaDostava = lista('dostava')
  const izabranTip = lista('tip')
  const izabranaKategorija = sp.get('kategorija') ?? ''

  return (
    <div className={s.sadrzaj}>
      {/* 1. Kategorija */}
      {podaci.zakljucana ? (
        <div className={s.zakljucana}>
          <p className="micro">Kategorija</p>
          <p className={s.zakljucanaNaziv}>{podaci.zakljucana.naziv}</p>
          {podaci.zakljucana.potkategorije.length > 0 ? (
            <ul className={s.podLista}>
              {podaci.zakljucana.potkategorije.map((p) => (
                <li key={p.slug}>
                  <Link href={p.href} className={s.podLink}>
                    <span>{p.naziv}</span>
                    <span className={s.redBroj}>{p.broj}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          {podaci.zakljucana.nazadHref ? (
            <Link href={podaci.zakljucana.nazadHref} className={s.nazad}>
              <Ikona ime="strelica" velicina={15} />
              Nazad na nadkategoriju
            </Link>
          ) : null}
        </div>
      ) : (
        <Grupa naslov="Kategorija">
          <ul className={s.stablo}>
            {podaci.kategorije.map((k) => (
              <li key={k.slug}>
                <button
                  type="button"
                  className={izabranaKategorija === k.slug ? s.granaAktivna : s.grana}
                  onClick={() =>
                    upisi({ kategorija: izabranaKategorija === k.slug ? null : k.slug })
                  }
                  aria-pressed={izabranaKategorija === k.slug}
                >
                  <span>{k.naziv}</span>
                  <span className={s.redBroj}>{k.broj}</span>
                </button>

                {izabranaKategorija === k.slug ||
                k.deca.some((d) => d.vrednost === izabranaKategorija) ? (
                  <ul className={s.grancice}>
                    {k.deca.map((d) => (
                      <li key={d.vrednost}>
                        <button
                          type="button"
                          className={
                            izabranaKategorija === d.vrednost ? s.grancicaAktivna : s.grancica
                          }
                          onClick={() =>
                            upisi({
                              kategorija: izabranaKategorija === d.vrednost ? k.slug : d.vrednost,
                            })
                          }
                          aria-pressed={izabranaKategorija === d.vrednost}
                        >
                          <span>{d.naziv}</span>
                          <span className={s.redBroj}>{d.broj}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </Grupa>
      )}

      {/* 2. Stanje */}
      <Grupa naslov="Stanje">
        <div className={s.lista}>
          {podaci.stanja.map((o) => (
            <Kvadratic
              key={o.vrednost}
              naziv={o.naziv}
              broj={o.broj}
              opis={stanjeDefinicija(o.vrednost as Stanje)}
              oznaceno={izabranaStanja.includes(o.vrednost)}
              onChange={() => prebaci('stanje', o.vrednost)}
            />
          ))}
        </div>
      </Grupa>

      {/* 3. Cena */}
      <Grupa naslov="Cena">
        <div className={s.cenaPolja}>
          <div>
            <label htmlFor={idOd} className="polje-oznaka">
              Od (din)
            </label>
            <input
              id={idOd}
              className="polje"
              inputMode="numeric"
              value={cenaOd}
              onChange={(e) => setCenaOd(e.target.value)}
              onBlur={primeniCenu}
              onKeyDown={(e) => {
                if (e.key === 'Enter') primeniCenu()
              }}
              placeholder="0"
            />
          </div>
          <div>
            <label htmlFor={idDo} className="polje-oznaka">
              Do (din)
            </label>
            <input
              id={idDo}
              className="polje"
              inputMode="numeric"
              value={cenaDo}
              onChange={(e) => setCenaDo(e.target.value)}
              onBlur={primeniCenu}
              onKeyDown={(e) => {
                if (e.key === 'Enter') primeniCenu()
              }}
              placeholder="bez granice"
            />
          </div>
        </div>

        <div className={s.brziOpsezi}>
          {BRZI_OPSEZI.map((o) => {
            const aktivan =
              String(o.cenaOd ?? '') === cenaOdUrl && String(o.cenaDo ?? '') === cenaDoUrl
            return (
              <button
                key={o.naziv}
                type="button"
                className={aktivan ? 'chip chip-active' : 'chip'}
                onClick={() =>
                  upisi({
                    cenaOd: aktivan ? null : o.cenaOd ? String(o.cenaOd) : null,
                    cenaDo: aktivan ? null : o.cenaDo ? String(o.cenaDo) : null,
                  })
                }
                aria-pressed={aktivan}
              >
                {o.naziv}
              </button>
            )
          })}
        </div>
      </Grupa>

      {/* 4. Brend */}
      {podaci.zakljucanBrend ? null : (
        <Grupa naslov="Brend">
          <input
            className={`polje ${s.trazi}`}
            type="search"
            value={trazenBrend}
            onChange={(e) => setTrazenBrend(e.target.value)}
            placeholder="Nađi brend…"
            aria-label="Pretraga brendova"
          />
          <div className={`${s.lista} ${s.listaSkrol}`}>
            {brendovi.map((b) => (
              <Kvadratic
                key={b.vrednost}
                naziv={b.naziv}
                broj={b.broj}
                oznaceno={izabraniBrendovi.includes(b.vrednost)}
                onChange={() => prebaci('brend', b.vrednost)}
              />
            ))}
            {brendovi.length === 0 ? <p className={s.nemaPogodaka}>Nema takvog brenda.</p> : null}
          </div>
        </Grupa>
      )}

      {/* 5. Akumulatorski sistem — pojavljuje se samo kada ima smisla */}
      {podaci.akuSistemi.length > 0 ? (
        <Grupa naslov="Akumulatorski sistem">
          <p className={s.napomena}>
            Baterija od 18 V nije univerzalna. Svaki proizvođač ima svoj prihvat. Filtriraj po
            sistemu koji već imaš.
          </p>
          <div className={s.lista}>
            {podaci.akuSistemi.map((a) => (
              <Kvadratic
                key={a.vrednost}
                naziv={a.naziv}
                broj={a.broj}
                oznaceno={izabranAku.includes(a.vrednost)}
                onChange={() => prebaci('aku', a.vrednost)}
              />
            ))}
          </div>
        </Grupa>
      ) : null}

      {/* 6. Lokacija */}
      <Grupa naslov="Lokacija" otvorena={false}>
        <label htmlFor={idGrad} className="sr-only">
          Grad
        </label>
        <select
          id={idGrad}
          className="polje"
          value={sp.get('grad') ?? ''}
          onChange={(e) => upisi({ grad: e.target.value || null })}
        >
          <option value="">Cela Srbija</option>
          {podaci.gradovi.map((g) => (
            <option key={g.vrednost} value={g.vrednost}>
              {g.naziv} ({g.broj})
            </option>
          ))}
        </select>
      </Grupa>

      {/* 7–9. Garancija, dostava, tip prodavca */}
      <Grupa naslov="Garancija i dostava" otvorena={false}>
        <div className={s.lista}>
          <Kvadratic
            naziv="Ima garanciju"
            oznaceno={sp.get('garancija') === '1'}
            onChange={() => upisi({ garancija: sp.get('garancija') === '1' ? null : '1' })}
          />
          {DOSTAVE.map((d) => (
            <Kvadratic
              key={d.vrednost}
              naziv={d.naziv}
              oznaceno={izabranaDostava.includes(d.vrednost)}
              onChange={() => prebaci('dostava', d.vrednost)}
            />
          ))}
        </div>
      </Grupa>

      <Grupa naslov="Tip prodavca" otvorena={false}>
        <div className={s.lista}>
          {TIPOVI_PRODAVCA.map((t) => (
            <Kvadratic
              key={t.vrednost}
              naziv={t.naziv}
              oznaceno={izabranTip.includes(t.vrednost)}
              onChange={() => prebaci('tip', t.vrednost)}
            />
          ))}
        </div>
      </Grupa>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   Aktivni filteri — traka čipova iznad rezultata
   ────────────────────────────────────────────────────────────── */

export function AktivniFilteri({ podaci }: { podaci: FilterPodaci }) {
  const { sp, pathname, upisi, lista } = useUrlFilteri()
  const router = useRouter()

  const nazivOpcije = (opcije: { vrednost: string; naziv: string }[], v: string) =>
    opcije.find((o) => o.vrednost === v)?.naziv ?? v

  const cipovi: { kljuc: string; tekst: string; ukloni: () => void }[] = []

  for (const v of lista('stanje'))
    cipovi.push({
      kljuc: `stanje-${v}`,
      tekst: nazivOpcije(podaci.stanja, v),
      ukloni: () => upisi({ stanje: lista('stanje').filter((x) => x !== v).join(',') || null }),
    })

  for (const v of lista('brend'))
    cipovi.push({
      kljuc: `brend-${v}`,
      tekst: nazivOpcije(podaci.brendovi, v),
      ukloni: () => upisi({ brend: lista('brend').filter((x) => x !== v).join(',') || null }),
    })

  for (const v of lista('aku'))
    cipovi.push({
      kljuc: `aku-${v}`,
      tekst: v,
      ukloni: () => upisi({ aku: lista('aku').filter((x) => x !== v).join(',') || null }),
    })

  const kat = sp.get('kategorija')
  if (kat && !podaci.zakljucana) {
    const nad = podaci.kategorije.find((k) => k.slug === kat)
    const dete = podaci.kategorije.flatMap((k) => k.deca).find((d) => d.vrednost === kat)
    cipovi.push({
      kljuc: 'kategorija',
      tekst: nad?.naziv ?? dete?.naziv ?? kat,
      ukloni: () => upisi({ kategorija: null }),
    })
  }

  if (sp.get('cenaOd') || sp.get('cenaDo')) {
    const od = sp.get('cenaOd')
    const doo = sp.get('cenaDo')
    cipovi.push({
      kljuc: 'cena',
      tekst: od && doo ? `${od}–${doo} din` : od ? `od ${od} din` : `do ${doo} din`,
      ukloni: () => upisi({ cenaOd: null, cenaDo: null }),
    })
  }

  const grad = sp.get('grad')
  if (grad) cipovi.push({ kljuc: 'grad', tekst: grad, ukloni: () => upisi({ grad: null }) })

  if (sp.get('garancija') === '1')
    cipovi.push({
      kljuc: 'garancija',
      tekst: 'Sa garancijom',
      ukloni: () => upisi({ garancija: null }),
    })

  for (const v of lista('dostava'))
    cipovi.push({
      kljuc: `dostava-${v}`,
      tekst: nazivOpcije(DOSTAVE, v),
      ukloni: () => upisi({ dostava: lista('dostava').filter((x) => x !== v).join(',') || null }),
    })

  for (const v of lista('tip'))
    cipovi.push({
      kljuc: `tip-${v}`,
      tekst: nazivOpcije(TIPOVI_PRODAVCA, v),
      ukloni: () => upisi({ tip: lista('tip').filter((x) => x !== v).join(',') || null }),
    })

  const q = sp.get('q')
  if (q) cipovi.push({ kljuc: 'q', tekst: `„${q}"`, ukloni: () => upisi({ q: null }) })

  if (cipovi.length === 0) return null

  return (
    <div className={s.aktivni}>
      <div className="chip-traka">
        {cipovi.map((c) => (
          <button key={c.kljuc} type="button" className={s.aktivniCip} onClick={c.ukloni}>
            {c.tekst}
            <Ikona ime="x" velicina={14} />
            <span className="sr-only">, ukloni filter</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        className={s.ocisti}
        onClick={() => router.push(pathname, { scroll: false })}
      >
        Očisti sve
      </button>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   Sortiranje
   ────────────────────────────────────────────────────────────── */

export function SortSelect() {
  const { sp, upisi } = useUrlFilteri()
  const id = useId()
  return (
    <div className={s.sort}>
      <label htmlFor={id} className={s.sortOznaka}>
        <Ikona ime="sort" velicina={16} />
        Sortiraj
      </label>
      <select
        id={id}
        className={s.sortPolje}
        value={sp.get('sort') ?? 'najnovije'}
        onChange={(e) => upisi({ sort: e.target.value === 'najnovije' ? null : e.target.value })}
      >
        {SORTIRANJA.map((o) => (
          <option key={o.vrednost} value={o.vrednost}>
            {o.naziv}
          </option>
        ))}
      </select>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   Glavna komponenta: rail na desktopu + donja traka i listovi na telefonu
   ────────────────────────────────────────────────────────────── */

type Props = {
  podaci: FilterPodaci
  brojFiltera: number
  brojRezultata: number
}

export function Filteri({ podaci, brojFiltera, brojRezultata }: Props) {
  const { pathname, sp, upisi } = useUrlFilteri()
  const router = useRouter()
  const [list, setList] = useState<'filteri' | 'sort' | null>(null)

  useEffect(() => {
    if (!list) return
    const naEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setList(null)
    }
    document.addEventListener('keydown', naEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', naEsc)
      document.body.style.overflow = ''
    }
  }, [list])

  return (
    <>
      <aside className={s.rail} aria-label="Filteri">
        <div className={s.railZaglavlje}>
          <h2 className={s.railNaslov}>Filteri</h2>
          {brojFiltera > 0 ? (
            <button
              type="button"
              className={s.ocisti}
              onClick={() => router.push(pathname, { scroll: false })}
            >
              Očisti ({brojFiltera})
            </button>
          ) : null}
        </div>
        <SadrzajFiltera podaci={podaci} />
      </aside>

      <div className={s.donjaTraka}>
        <button type="button" className={s.donjeDugme} onClick={() => setList('filteri')}>
          <Ikona ime="filter" velicina={18} />
          Filteri
          {brojFiltera > 0 ? <span className={s.brojac}>{brojFiltera}</span> : null}
        </button>
        <button type="button" className={s.donjeDugme} onClick={() => setList('sort')}>
          <Ikona ime="sort" velicina={18} />
          Sortiraj
        </button>
      </div>

      {list ? (
        <div className={s.zastor} onClick={() => setList(null)}>
          <div
            className={s.list}
            role="dialog"
            aria-modal="true"
            aria-label={list === 'filteri' ? 'Filteri' : 'Sortiranje'}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={s.listZaglavlje}>
              <h2 className={s.listNaslov}>{list === 'filteri' ? 'Filteri' : 'Sortiraj'}</h2>
              <button
                type="button"
                className="btn btn-ghost btn-mali"
                onClick={() => setList(null)}
                aria-label="Zatvori"
              >
                <Ikona ime="x" velicina={20} />
              </button>
            </div>

            <div className={s.listTelo}>
              {list === 'filteri' ? (
                <SadrzajFiltera podaci={podaci} />
              ) : (
                <ul className={s.sortLista}>
                  {SORTIRANJA.map((o) => {
                    const aktivan = (sp.get('sort') ?? 'najnovije') === o.vrednost
                    return (
                      <li key={o.vrednost}>
                        <button
                          type="button"
                          className={aktivan ? s.sortStavkaAktivna : s.sortStavka}
                          onClick={() => {
                            upisi({ sort: o.vrednost === 'najnovije' ? null : o.vrednost })
                            setList(null)
                          }}
                          aria-current={aktivan ? 'true' : undefined}
                        >
                          {o.naziv}
                          {aktivan ? <Ikona ime="cek" velicina={18} /> : null}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {list === 'filteri' ? (
              <div className={s.listPodnozje}>
                <button
                  type="button"
                  className="btn btn-tertiary"
                  onClick={() => {
                    router.push(pathname, { scroll: false })
                    setList(null)
                  }}
                >
                  Očisti
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-puni"
                  onClick={() => setList(null)}
                >
                  Prikaži {brojRezultata}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  )
}

export default Filteri
