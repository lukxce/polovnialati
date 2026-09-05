'use client'

import { useState } from 'react'
import { Ikona } from '@/components/Ikone'
import s from './KontaktForma.module.css'

type Greske = { ime?: string; email?: string; poruka?: string }

const TEME = [
  'Pitanje o proizvodu',
  'Prijava spornog oglasa',
  'Saradnja i partnerstvo',
  'Greška na sajtu',
  'Nešto drugo',
]

/**
 * Obrazac je namerno nefunkcionalan: validacija radi, slanje ne postoji.
 * „Pošalji" prikazuje šta bi se desilo u pravoj verziji, i to piše u obrascu.
 */
export function KontaktForma() {
  const [greske, setGreske] = useState<Greske>({})
  const [poslato, setPoslato] = useState(false)
  const [tema, setTema] = useState(TEME[0])

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
      onSubmit={(e) => {
        e.preventDefault()
        const podaci = new FormData(e.currentTarget)
        const g = proveri(podaci)
        setGreske(g)
        setPoslato(Object.keys(g).length === 0)
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
              Ne čuva se nigde: obrazac ništa ne šalje.
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
          placeholder="Napiši o čemu je reč. Ako prijavljuješ oglas, dodaj link."
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
          Obrazac je deo demonstracije. Provera unosa radi, slanje ne postoji i nijedan podatak ne
          napušta tvoj pregledač.
        </p>
        <button type="submit" className="btn btn-primary">
          Pošalji poruku
        </button>
      </div>

      <div aria-live="polite">
        {poslato ? (
          <div className={s.ishod}>
            <span className={s.ishodIkona}>
              <Ikona ime="cek" velicina={16} />
            </span>
            <p>
              <strong className={s.ishodNaslov}>Poruka nije poslata. To je očekivano.</strong>
              Unos je ispravan, pa bi u pravoj verziji Alatnice poruka na temu „{tema}" u ovom
              trenutku otišla na sanduče podrške i dobio bi potvrdu na imejl. Ovde nema servera koji
              je prima, pa se ništa nije desilo.
            </p>
          </div>
        ) : null}
      </div>
    </form>
  )
}

export default KontaktForma
