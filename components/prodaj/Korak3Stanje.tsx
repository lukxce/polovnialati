'use client'

import { useId } from 'react'
import { Ikona } from '@/components/Ikone'
import { pluralSr, stanjeDefinicija, stanjeLabela } from '@/lib/format'
import Polje from './Polje'
import { proveraZaKoren, type Greske, type Nacrt } from './model'
import s from './tok.module.css'

type Props = {
  nacrt: Nacrt
  azuriraj: (delta: Partial<Nacrt>) => void
  koren?: string
  nazivKategorije?: string
  greske: Greske
  dodirnuta: string[]
  dodirni: (kljuc: string) => void
}

const BRZA_GARANCIJA = [0, 6, 12, 24, 36]

export function Korak3Stanje({
  nacrt,
  azuriraj,
  koren,
  nazivKategorije,
  greske,
  dodirnuta,
  dodirni,
}: Props) {
  const id = useId()
  const stavke = proveraZaKoren(koren)
  const novo = nacrt.stanje === 'novo'
  const odgovoreno = stavke.filter((st) => nacrt.provera[st] !== undefined).length
  const potvrdjeno = stavke.filter((st) => nacrt.provera[st] === true).length

  function postavi(stavka: string, ok: boolean) {
    const kopija = { ...nacrt.provera }
    if (kopija[stavka] === ok) delete kopija[stavka]
    else kopija[stavka] = ok
    azuriraj({ provera: kopija })
    dodirni('provera')
  }

  function sveOk() {
    const kopija: Record<string, boolean> = { ...nacrt.provera }
    for (const st of stavke) kopija[st] = true
    azuriraj({ provera: kopija })
    dodirni('provera')
  }

  return (
    <div className={s.korakTelo}>
      {nacrt.stanje ? (
        <div className={s.podsetnik}>
          <span className={`stanje-chip stanje-${nacrt.stanje} stanje-chip-veliki`}>
            {stanjeLabela(nacrt.stanje)}
          </span>
          <p className={s.podsetnikTekst}>{stanjeDefinicija(nacrt.stanje)}</p>
        </div>
      ) : null}

      <fieldset className={s.grupa}>
        <legend className={s.legenda}>
          Lista provere{novo ? '' : <span className={s.obavezno}> *</span>}
        </legend>
        <p className={s.pomoc}>
          {novo ? (
            <>
              Mašina je neotpakovana, pa lista provere nije obavezna. Ako si je ipak uključivao,
              popuni je. Proveren nov alat se brže prodaje.
            </>
          ) : (
            <>
              Stavke su prilagođene kategoriji
              {nazivKategorije ? <strong> {nazivKategorije}</strong> : null}. Odgovori na svaku
              iskreno: „nije u redu" ne obara oglas, ali prećutan kvar obara poverenje i vraća
              kupca.
            </>
          )}
        </p>

        <div className={s.proveraStatus} role="status">
          <span className={s.proveraBrojka}>
            {odgovoreno}/{stavke.length}
          </span>
          <span className={s.proveraTekst}>
            odgovoreno{odgovoreno > 0 ? ` · ${potvrdjeno} potvrđeno` : ''}
          </span>
          {odgovoreno < stavke.length ? (
            <button type="button" className="btn btn-ghost btn-mali" onClick={sveOk}>
              Sve je u redu
            </button>
          ) : null}
        </div>

        <ul className={s.proveraLista}>
          {stavke.map((st, i) => {
            const vrednost = nacrt.provera[st]
            return (
              <li
                key={st}
                className={[s.proveraRed, vrednost === false ? s.proveraNije : '']
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className={s.proveraNaziv} id={`${id}-stavka-${i}`}>
                  {st}
                </span>
                <span
                  className={s.proveraDugmad}
                  role="group"
                  aria-labelledby={`${id}-stavka-${i}`}
                >
                  <button
                    type="button"
                    className={[s.proveraDugme, vrednost === true ? s.proveraDugmeOk : '']
                      .filter(Boolean)
                      .join(' ')}
                    aria-pressed={vrednost === true}
                    onClick={() => postavi(st, true)}
                  >
                    <Ikona ime="cek" velicina={16} />
                    U redu
                  </button>
                  <button
                    type="button"
                    className={[s.proveraDugme, vrednost === false ? s.proveraDugmeNije : '']
                      .filter(Boolean)
                      .join(' ')}
                    aria-pressed={vrednost === false}
                    onClick={() => postavi(st, false)}
                  >
                    <Ikona ime="x" velicina={16} />
                    Nije
                  </button>
                </span>
              </li>
            )
          })}
        </ul>

        {dodirnuta.includes('provera') && greske.provera ? (
          <p className={s.greska} role="alert">
            {greske.provera}
          </p>
        ) : null}
      </fieldset>

      <Polje
        id={`${id}-garancija`}
        oznaka="Garancija"
        obavezno={novo}
        greska={dodirnuta.includes('garancija') ? greske.garancija : undefined}
        pomoc="Koliko meseci garancije prelazi na kupca. Nula znači bez garancije i tako se i prikazuje na oglasu."
      >
        <div className={s.garancijaRed}>
          <input
            id={`${id}-garancija`}
            type="number"
            inputMode="numeric"
            className={['polje', s.garancijaPolje].join(' ')}
            min={0}
            max={120}
            value={nacrt.garancija}
            aria-describedby={
              dodirnuta.includes('garancija') && greske.garancija
                ? `${id}-garancija-greska`
                : undefined
            }
            onChange={(e) => {
              const v = Number.parseInt(e.target.value, 10)
              azuriraj({ garancija: Number.isFinite(v) ? v : 0 })
            }}
            onBlur={() => dodirni('garancija')}
          />
          <span className={s.garancijaJedinica}>meseci</span>
        </div>

        <ul className={s.predlozi}>
          {BRZA_GARANCIJA.map((m) => (
            <li key={m}>
              <button
                type="button"
                className="chip"
                aria-pressed={nacrt.garancija === m}
                onClick={() => {
                  azuriraj({ garancija: m })
                  dodirni('garancija')
                }}
              >
                {m === 0 ? 'Bez garancije' : `${m} ${pluralSr(m, ['mesec', 'meseca', 'meseci'])}`}
              </button>
            </li>
          ))}
        </ul>
      </Polje>
    </div>
  )
}

export default Korak3Stanje
