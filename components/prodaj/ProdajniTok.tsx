'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Ikona } from '@/components/Ikone'
import Korak1Kategorija from './Korak1Kategorija'
import Korak2Detalji from './Korak2Detalji'
import Korak3Stanje from './Korak3Stanje'
import Korak4Fotografije from './Korak4Fotografije'
import Korak5Objava from './Korak5Objava'
import Uspeh from './Uspeh'
import { smanjiSliku } from './smanjiSliku'
import {
  KORACI,
  POSLEDNJI_KORAK,
  PRAZAN_NACRT,
  greskeKoraka,
  korakValidan,
  najdaljiDozvoljen,
  nacrtUOglas,
  razlogBlokade,
  type BrendOpcija,
  type GrupaKategorija,
  type Nacrt,
} from './model'
import s from './tok.module.css'

type Props = {
  stablo: GrupaKategorija[]
  brendovi: BrendOpcija[]
  gradovi: string[]
}

const OSNOVA = '/prodaj'

type Adresa = { korak: number; grupa?: string; objavljeno: boolean }

/** Čita korak iz stvarnog URL-a i odbija sve što nije broj 1–5. */
function procitajAdresu(pretraga: string): Adresa {
  const usp = new URLSearchParams(pretraga)
  const sirovo = usp.get('korak')
  const broj = sirovo === null ? 1 : Number.parseInt(sirovo, 10)
  const korak = Number.isFinite(broj) ? Math.min(Math.max(broj, 1), POSLEDNJI_KORAK) : 1
  return {
    korak,
    grupa: usp.get('grupa') ?? undefined,
    objavljeno: usp.get('objavljeno') === '1',
  }
}

function upisiAdresu(a: Adresa, zameni: boolean) {
  const usp = new URLSearchParams()
  usp.set('korak', String(a.korak))
  if (a.grupa) usp.set('grupa', a.grupa)
  if (a.objavljeno) usp.set('objavljeno', '1')
  const url = `${OSNOVA}?${usp.toString()}`
  // Native History API — Next.js ga prepoznaje i ne pravi novi zahtev.
  // Alternativa (`useSearchParams`) bi tražila Suspense granicu oko celog
  // toka, pa bi prvi paint bio skelet umesto prvog koraka. Ovako ceo korak 1
  // ide u prerenderovan HTML, a promena koraka je trenutna, bez granice.
  if (zameni) window.history.replaceState(null, '', url)
  else window.history.pushState(null, '', url)
}

export function ProdajniTok({ stablo, brendovi, gradovi }: Props) {
  const [adresa, setAdresa] = useState<Adresa>({ korak: 1, objavljeno: false })
  const [nacrt, setNacrt] = useState<Nacrt>(PRAZAN_NACRT)
  const [dodirnuta, setDodirnuta] = useState<string[]>([])
  const [poruka, setPoruka] = useState<string | undefined>(undefined)
  const [objavljuje, setObjavljuje] = useState(false)
  const [greskaObjave, setGreskaObjave] = useState<string | undefined>(undefined)
  const [objavljenSlug, setObjavljenSlug] = useState<string>()

  /* Svi napravljeni objektni URL-ovi: opoziv drži tok, ne korak sa slikama —
     inače bi prelazak na korak 5 obrisao slike koje pregled još prikazuje. */
  const urlovi = useRef<Set<string>>(new Set())
  useEffect(() => {
    const skup = urlovi.current
    return () => {
      for (const u of skup) URL.revokeObjectURL(u)
      skup.clear()
    }
  }, [])

  /* ── Mape kategorija ─────────────────────────────────────────── */

  const { korenPoListu, nazivPoListu } = useMemo(() => {
    const koren: Record<string, string> = {}
    const naziv: Record<string, string> = {}
    for (const g of stablo) {
      naziv[g.slug] = g.naziv
      koren[g.slug] = g.slug
      for (const d of g.deca) {
        koren[d.slug] = g.slug
        naziv[d.slug] = d.naziv
      }
    }
    return { korenPoListu: koren, nazivPoListu: naziv }
  }, [stablo])

  const koren = nacrt.kategorija ? korenPoListu[nacrt.kategorija] : undefined
  const nazivKategorije = nacrt.kategorija ? nazivPoListu[nacrt.kategorija] : undefined

  /* ── Korak iz URL-a, uz čuvanje od nemogućih vrednosti ───────── */

  const dozvoljen = najdaljiDozvoljen(nacrt, koren)
  const korak = Math.min(adresa.korak, dozvoljen)
  const grupa = adresa.grupa
  const spremanZaObjavu =
    korakValidan(POSLEDNJI_KORAK, nacrt, koren) && dozvoljen === POSLEDNJI_KORAK
  const objavljeno = adresa.objavljeno && spremanZaObjavu

  /* Prvo učitavanje: nacrt je uvek prazan, pa je jedini dostupan korak prvi.
     `?korak=4` iz zabeleške ili osveženja se spušta na 1 uz objašnjenje —
     nikad prazan ili polomljen korak. */
  useEffect(() => {
    const iz = procitajAdresu(window.location.search)
    const dozvoljenNaStartu = najdaljiDozvoljen(PRAZAN_NACRT, undefined)
    const spusten = Math.min(iz.korak, dozvoljenNaStartu)
    // Izmišljena nadkategorija iz ručno kucanog URL-a se odbacuje.
    const grupaIzURLa = stablo.some((g) => g.slug === iz.grupa) ? iz.grupa : undefined
    const pocetna: Adresa = { korak: spusten, grupa: grupaIzURLa, objavljeno: false }

    if (iz.objavljeno) {
      setPoruka(
        'Oglas je objavljen, a nacrt je obrisan osvežavanjem stranice. Objavljene oglase vidiš u Mom nalogu. Za novi oglas kreni od kategorije.',
      )
    } else if (iz.korak > spusten) {
      setPoruka(
        `Korak ${iz.korak} nije dostupan dok prethodni nisu popunjeni. Krećemo od koraka ${spusten}.`,
      )
    }

    setAdresa(pocetna)
    upisiAdresu(pocetna, true)
    // Namerno samo pri montiranju: ovo je čitanje početne adrese, ne sinhronizacija.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Dugme „nazad" u pregledaču vraća korak, ne celu stranicu. */
  useEffect(() => {
    const naPovratak = () => {
      setPoruka(undefined)
      setAdresa(procitajAdresu(window.location.search))
    }
    window.addEventListener('popstate', naPovratak)
    return () => window.removeEventListener('popstate', naPovratak)
  }, [])

  /* ── Navigacija ──────────────────────────────────────────────── */

  const vrh = useRef<HTMLDivElement | null>(null)
  const prethodniKorak = useRef(korak)

  useEffect(() => {
    if (prethodniKorak.current === korak) return
    prethodniKorak.current = korak
    setDodirnuta([])
    const y = vrh.current?.getBoundingClientRect().top ?? 0
    // Zakucano zaglavlje bi inače pojelo naslov koraka.
    const zaglavlje =
      Number.parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-h'),
        10,
      ) || 60
    if (y < zaglavlje || y > 140) {
      window.scrollTo({
        top: Math.max(0, window.scrollY + y - zaglavlje - 12),
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      })
    }
  }, [korak])

  const idiNa = useCallback(
    (k: number) => {
      setPoruka(undefined)
      const sledeca: Adresa = {
        korak: k,
        grupa: k === 1 ? grupa : undefined,
        objavljeno: false,
      }
      setAdresa(sledeca)
      upisiAdresu(sledeca, false)
    },
    [grupa],
  )

  const azuriraj = useCallback((delta: Partial<Nacrt>) => {
    setNacrt((prethodni) => ({ ...prethodni, ...delta }))
  }, [])

  const dodirni = useCallback((kljuc: string) => {
    setDodirnuta((lista) => (lista.includes(kljuc) ? lista : [...lista, kljuc]))
  }, [])

  /* ── Fotografije ─────────────────────────────────────────────── */

  const azurirajFotografije = useCallback(
    (delta: Partial<Nacrt>) => {
      if (delta.fotografije) {
        for (const f of delta.fotografije) urlovi.current.add(f.url)
      }
      azuriraj(delta)
    },
    [azuriraj],
  )

  const ukloniFotografiju = useCallback(
    (id: string) => {
      setNacrt((prethodni) => {
        const meta = prethodni.fotografije.find((f) => f.id === id)
        if (meta) {
          URL.revokeObjectURL(meta.url)
          urlovi.current.delete(meta.url)
        }
        return { ...prethodni, fotografije: prethodni.fotografije.filter((f) => f.id !== id) }
      })
    },
    [],
  )

  /* ── Izbor kategorije ────────────────────────────────────────── */

  const naGrupu = useCallback((slug?: string) => {
    const sledeca: Adresa = { korak: 1, grupa: slug, objavljeno: false }
    setAdresa(sledeca)
    upisiAdresu(sledeca, false)
  }, [])

  const naIzborKategorije = useCallback(
    (slug: string) => {
      setNacrt((prethodni) => {
        if (prethodni.kategorija === slug) return prethodni
        // Promena kategorije menja i listu provere — stari odgovori više ne važe.
        const noviKoren = korenPoListu[slug]
        const stariKoren = prethodni.kategorija ? korenPoListu[prethodni.kategorija] : undefined
        return {
          ...prethodni,
          kategorija: slug,
          provera: noviKoren === stariKoren ? prethodni.provera : {},
        }
      })
      setPoruka(undefined)
    },
    [korenPoListu],
  )

  /* ── Objava ──────────────────────────────────────────────────── */

  /**
   * blob: URL iz koraka 4 → smanjen JPEG → /api/slike → javni URL.
   * Blob je i dalje čitljiv preko fetch() dok se ne opozove (vidi
   * urlovi.current, opoziva se tek pri unmount-u toka). Već otpremljene
   * fotografije se pamte, pa ponovni pokušaj posle greške ne šalje sve iznova.
   */
  const otpremljene = useRef<Map<string, string>>(new Map())
  const [napredak, setNapredak] = useState<string>()

  async function otpremi(blobUrl: string): Promise<string> {
    const vec = otpremljene.current.get(blobUrl)
    if (vec) return vec
    const izvor = await (await fetch(blobUrl)).blob()
    const smanjena = await smanjiSliku(izvor)
    const forma = new FormData()
    forma.append('slika', smanjena, 'slika.jpg')
    const res = await fetch('/api/slike', { method: 'POST', body: forma })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data.url) throw new Error(data.greska || 'Fotografija nije otpremljena.')
    otpremljene.current.set(blobUrl, data.url)
    return data.url
  }

  const objavi = useCallback(async () => {
    setObjavljuje(true)
    setGreskaObjave(undefined)
    try {
      const oglas = nacrtUOglas(nacrt)
      const slike: string[] = []
      for (const [i, f] of nacrt.fotografije.entries()) {
        setNapredak(`Otpremanje fotografija: ${i + 1} od ${nacrt.fotografije.length}`)
        try {
          slike.push(await otpremi(f.url))
        } catch (e) {
          setGreskaObjave(
            `Fotografija ${i + 1} (${f.ime}): ${e instanceof Error ? e.message : 'nije otpremljena.'}`,
          )
          return
        }
      }
      setNapredak('Objavljivanje oglasa…')

      const res = await fetch('/api/oglasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          naslov: oglas.naslov,
          kategorija: oglas.kategorija,
          brend: oglas.brend,
          model: oglas.model,
          stanje: oglas.stanje,
          cena: oglas.cena,
          cenaDogovor: oglas.cenaDogovor,
          opis: oglas.opis,
          slike,
          specifikacije: oglas.specifikacije,
          uPakovanju: oglas.uPakovanju,
          godiste: oglas.godiste,
          garancija: oglas.garancija,
          akuSistem: oglas.akuSistem,
          lokacija: oglas.lokacija,
          dostava: oglas.dostava,
          stanjeChecklist: oglas.stanjeChecklist,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setGreskaObjave(
          res.status === 401
            ? 'Sesija je istekla. Prijavi se ponovo u drugoj kartici pa klikni Objavi još jednom — nacrt ostaje ovde.'
            : data.greska || 'Greška pri objavi oglasa. Pokušaj ponovo.',
        )
        return
      }
      setObjavljenSlug(data.slug)

      const sledeca: Adresa = { korak: POSLEDNJI_KORAK, objavljeno: true }
      setAdresa(sledeca)
      upisiAdresu(sledeca, false)
      window.scrollTo({ top: 0, behavior: 'auto' })
    } catch {
      setGreskaObjave('Greška pri povezivanju sa serverom. Proveri konekciju i pokušaj ponovo.')
    } finally {
      setObjavljuje(false)
      setNapredak(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- otpremi čita samo ref
  }, [nacrt])

  const ponovo = useCallback(() => {
    for (const u of urlovi.current) URL.revokeObjectURL(u)
    urlovi.current.clear()
    otpremljene.current.clear()
    setObjavljenSlug(undefined)
    setNacrt(PRAZAN_NACRT)
    setDodirnuta([])
    setPoruka(undefined)
    const sledeca: Adresa = { korak: 1, objavljeno: false }
    setAdresa(sledeca)
    upisiAdresu(sledeca, false)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  /* ── Render ──────────────────────────────────────────────────── */

  if (objavljeno) {
    return (
      <div ref={vrh}>
        <Uspeh
          nacrt={nacrt}
          slug={objavljenSlug}
          brendovi={brendovi}
          nazivKategorije={nazivKategorije}
          ponovo={ponovo}
        />
      </div>
    )
  }

  const greske = greskeKoraka(korak, nacrt, koren)
  const blokada = razlogBlokade(korak, nacrt, koren)
  const trenutni = KORACI[korak - 1]
  const poslednji = korak === POSLEDNJI_KORAK

  return (
    <div className={s.tok} ref={vrh}>
      {/* ── Napredak ───────────────────────────────────────────── */}
      <nav className={s.napredak} aria-label="Koraci objave oglasa">
        <ol className={s.napredakLista}>
          {KORACI.map((k) => {
            const zavrsen = k.broj < korak
            const aktivan = k.broj === korak
            const dostupan = k.broj <= dozvoljen
            return (
              <li
                key={k.broj}
                className={[
                  s.napredakStavka,
                  aktivan ? s.napredakAktivna : '',
                  zavrsen ? s.napredakZavrsena : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <button
                  type="button"
                  className={s.napredakDugme}
                  onClick={() => idiNa(k.broj)}
                  disabled={!dostupan || aktivan}
                  aria-current={aktivan ? 'step' : undefined}
                >
                  <span className={s.napredakBroj} aria-hidden="true">
                    {zavrsen ? <Ikona ime="cek" velicina={14} /> : k.broj}
                  </span>
                  <span className={s.napredakNaziv}>{k.kratko}</span>
                  <span className="sr-only">
                    {aktivan
                      ? ', trenutni korak'
                      : zavrsen
                        ? ', završen korak'
                        : dostupan
                          ? ''
                          : ', još nije dostupan'}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
        <div className={s.traka} aria-hidden="true">
          <span className={s.trakaPun} style={{ width: `${(korak / POSLEDNJI_KORAK) * 100}%` }} />
        </div>
      </nav>

      {poruka ? (
        <p className={s.poruka} role="status">
          <Ikona ime="stit" velicina={17} />
          {poruka}
        </p>
      ) : null}

      {/* ── Zaglavlje koraka ───────────────────────────────────── */}
      <header className={s.korakZaglavlje}>
        <p className="micro">
          Korak {korak} od {POSLEDNJI_KORAK}
        </p>
        <h2 className={s.korakNaslov}>{trenutni.naziv}</h2>
        <p className={s.korakLede}>{UVODI[korak - 1]}</p>
      </header>

      {/* ── Sadržaj koraka ─────────────────────────────────────── */}
      {korak === 1 ? (
        <Korak1Kategorija
          stablo={stablo}
          izabrana={nacrt.kategorija}
          grupa={grupa}
          naGrupu={naGrupu}
          naIzbor={naIzborKategorije}
        />
      ) : null}

      {korak === 2 ? (
        <Korak2Detalji
          nacrt={nacrt}
          azuriraj={azuriraj}
          brendovi={brendovi}
          koren={koren}
          nazivKategorije={nazivKategorije}
          greske={greske}
          dodirnuta={dodirnuta}
          dodirni={dodirni}
        />
      ) : null}

      {korak === 3 ? (
        <Korak3Stanje
          nacrt={nacrt}
          azuriraj={azuriraj}
          koren={koren}
          nazivKategorije={nazivKategorije}
          greske={greske}
          dodirnuta={dodirnuta}
          dodirni={dodirni}
        />
      ) : null}

      {korak === 4 ? (
        <Korak4Fotografije
          nacrt={nacrt}
          azuriraj={azurirajFotografije}
          ukloniFotografiju={ukloniFotografiju}
          greske={greske}
        />
      ) : null}

      {korak === 5 ? (
        <Korak5Objava
          nacrt={nacrt}
          azuriraj={azuriraj}
          gradovi={gradovi}
          brendovi={brendovi}
          nazivKategorije={nazivKategorije}
          greske={greske}
          dodirnuta={dodirnuta}
          dodirni={dodirni}
        />
      ) : null}

      {/* ── Donja traka ────────────────────────────────────────── */}
      <div className={s.donjaTraka}>
        <div className={s.donjaSadrzaj}>
          {blokada ? (
            <p className={s.razlog} role="status">
              <Ikona ime="minus" velicina={16} className={s.razlogIkona} />
              {blokada}
            </p>
          ) : null}

          {greskaObjave ? (
            <p className={s.razlog} role="alert">
              <Ikona ime="minus" velicina={16} className={s.razlogIkona} />
              {greskaObjave}
            </p>
          ) : null}

          <div className={s.donjaDugmad}>
            <button
              type="button"
              className="btn btn-tertiary"
              onClick={() => idiNa(korak - 1)}
              disabled={korak === 1 || objavljuje}
            >
              Nazad
            </button>

            {poslednji ? (
              <button
                type="button"
                className="btn btn-primary btn-veliki"
                onClick={objavi}
                disabled={!!blokada || objavljuje}
              >
                {objavljuje ? (napredak ?? 'Objavljivanje…') : 'Objavi oglas'}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary btn-veliki"
                onClick={() => idiNa(korak + 1)}
                disabled={!!blokada}
              >
                Dalje
                <Ikona ime="strelica" velicina={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const UVODI = [
  'Kategorija određuje koje se specifikacije traže, koja lista provere se popunjava i gde kupac nalazi oglas. Izaberi potkategoriju, ne samo grupu.',
  'Ono što kupac pročita pre nego što uopšte pogleda cenu: koja je tačno mašina, u kakvom je stanju i šta je sa njom rađeno.',
  'Lista provere je razlog zbog kog sajt postoji. Prolaziš kroz stavke koje su specifične za tvoju kategoriju i odgovaraš na svaku.',
  'Fotografije nose oglas. Prva je naslovna i ona jedina ide na karticu u pretrazi.',
  'Poslednji korak: koliko, gde i kako se preuzima, pa pregled kartice pre objave.',
]

export default ProdajniTok
