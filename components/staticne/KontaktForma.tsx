'use client'

import { useEffect, useState } from 'react'
import { Ikona } from '@/components/Ikone'
import s from './KontaktForma.module.css'

type Greske = { ime?: string; email?: string; poruka?: string }

const TEME = [
  'Pitanje o sajtu',
  'Prijava spornog oglasa',
  'Zaboravljena lozinka',
  'Problem sa nalogom',
  'Zahtev u vezi sa ličnim podacima',
  'Saradnja i partnerstvo',
  'Greška na sajtu',
  'Nešto drugo',
]

/** `?tema=lozinka` (link sa prijave) unapred bira temu. */
const TEMA_IZ_URLA: Record<string, string> = {
  lozinka: 'Zaboravljena lozinka',
  prijava: 'Prijava spornog oglasa',
  podaci: 'Zahtev u vezi sa ličnim podacima',
}

/** Poruka ide na /api/kontakt i čuva se u bazi; tim je čita u /admin. */
export function KontaktForma() {
  const [greske, setGreske] = useState<Greske>({})
  const [poslato, setPoslato] = useState(false)
  const [salje, setSalje] = useState(false)
  const [greskaSlanja, setGreskaSlanja] = useState<string>()
  const [tema, setTema] = useState(TEME[0])

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('tema')
    if (t && TEMA_IZ_URLA[t]) setTema(TEMA_IZ_URLA[t])
  }, [])

  function proveri(podaci: FormData): Greske {
    const g: Greske = {}
    const ime = String(podaci.get('ime') ?? '').trim()
    const email = String(podaci.get('email') ?? '').trim()
    const poruka = String(podaci.get('poruka') ?? '').trim()

    if (ime.length < 2) g.ime = 'Ime mora imati bar dva slova.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) g.email = 'Adresa nije u ispravnom obliku.'
    if (poruka.length < 20) g.poruka = 'Napiši bar dvadesetak karaktera da se zna o čemu je reč.'
    return g
  }

  return (
    <form
      className={s.forma}
      noValidate
      onSubmit={async (e) => {
        e.preventDefault()
        const forma = e.currentTarget
        const podaci = new FormData(forma)
        const g = proveri(podaci)
        setGreske(g)
        if (Object.keys(g).length) return
        setSalje(true)
        setGreskaSlanja(undefined)
        const res = await fetch('/api/kontakt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ime: podaci.get('ime'),
            email: podaci.get('email'),
            tema,
            tekst: podaci.get('poruka'),
          }),
        }).catch(() => null)
        setSalje(false)
        if (!res?.ok) {
          const data = res ? await res.json().catch(() => ({})) : {}
          setGreskaSlanja(data.greska || 'Poruka nije poslata. Pokušaj ponovo za koji minut.')
          return
        }
        forma.reset()
        setPoslato(true)
      }}
    >
      <div className={s.red}>
        <div className={s.polje}>
          <label className="polje-oznaka" htmlFor="ime">
            Ime i prezime
          </label>
          <input
            id="ime"
            name="ime"
            type="text"
            autoComplete="name"
            className={greske.ime ? `polje ${s.poljeGreska}` : 'polje'}
            placeholder="Npr. Marko Petrović"
            aria-invalid={greske.ime ? true : undefined}
            aria-describedby={greske.ime ? 'ime-greska' : undefined}
          />
          {greske.ime ? (
            <span id="ime-greska" className={s.greska} role="alert">
              {greske.ime}
            </span>
          ) : null}
        </div>

        <div className={s.polje}>
          <label className="polje-oznaka" htmlFor="email">
            Imejl adresa
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={greske.email ? `polje ${s.poljeGreska}` : 'polje'}
            placeholder="ime@primer.rs"
            aria-invalid={greske.email ? true : undefined}
            aria-describedby={greske.email ? 'email-greska' : 'email-pomoc'}
          />
          {greske.email ? (
            <span id="email-greska" className={s.greska} role="alert">
              {greske.email}
            </span>
          ) : (
            <span id="email-pomoc" className={s.pomoc}>
              Na ovu adresu ti odgovaramo. Ne koristi se ni za šta drugo.
            </span>
          )}
        </div>
      </div>

      <div className={s.polje}>
        <label className="polje-oznaka" htmlFor="tema">
          Tema
        </label>
        <select
          id="tema"
          name="tema"
          className="polje"
          value={tema}
          onChange={(e) => setTema(e.target.value)}
        >
          {TEME.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className={s.polje}>
        <label className="polje-oznaka" htmlFor="poruka">
          Poruka
        </label>
        <textarea
          id="poruka"
          name="poruka"
          className={greske.poruka ? `polje ${s.tekst} ${s.poljeGreska}` : `polje ${s.tekst}`}
          maxLength={5000}
          placeholder="Napiši o čemu je reč. Ako prijavljuješ oglas, dodaj link. Za zaboravljenu lozinku navedi email naloga."
          aria-invalid={greske.poruka ? true : undefined}
          aria-describedby={greske.poruka ? 'poruka-greska' : undefined}
        />
        {greske.poruka ? (
          <span id="poruka-greska" className={s.greska} role="alert">
            {greske.poruka}
          </span>
        ) : null}
      </div>

      <div className={s.dno}>
        <p className={s.napomena}>
          Slanjem pristaješ da tvoje ime, email i poruku sačuvamo da bismo ti odgovorili. Više u{' '}
          <a href="/privatnost">politici privatnosti</a>.
        </p>
        <button type="submit" className="btn btn-primary" disabled={salje}>
          {salje ? 'Slanje…' : 'Pošalji poruku'}
        </button>
      </div>

      <div aria-live="polite">
        {greskaSlanja ? (
          <p className={s.greska} role="alert">
            {greskaSlanja}
          </p>
        ) : null}
        {poslato ? (
          <div className={s.ishod}>
            <span className={s.ishodIkona}>
              <Ikona ime="cek" velicina={16} />
            </span>
            <p>
              <strong className={s.ishodNaslov}>Poruka je poslata.</strong>
              Stigla je do nas na temu „{tema}". Odgovaramo na email koji si upisao, obično u roku
              od jednog do dva radna dana.
            </p>
          </div>
        ) : null}
      </div>
    </form>
  )
}

export default KontaktForma
