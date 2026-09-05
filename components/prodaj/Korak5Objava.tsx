'use client'

import { useId } from 'react'
import { Ikona } from '@/components/Ikone'
import { dostavaLabela, formatCena, garancijaLabela, stanjeLabela } from '@/lib/format'
import type { Dostava } from '@/lib/types'
import KarticaPregled from './KarticaPregled'
import Polje from './Polje'
import { nacrtUOglas, type BrendOpcija, type Greske, type Nacrt } from './model'
import s from './tok.module.css'

type Props = {
  nacrt: Nacrt
  azuriraj: (delta: Partial<Nacrt>) => void
  gradovi: string[]
  brendovi: BrendOpcija[]
  nazivKategorije?: string
  greske: Greske
  dodirnuta: string[]
  dodirni: (kljuc: string) => void
}

const DOSTAVE: { vrednost: Dostava; opis: string }[] = [
  { vrednost: 'licno', opis: 'Kupac dolazi i proba mašinu pre plaćanja. Najčešći izbor za skup alat.' },
  { vrednost: 'kurirska', opis: 'Slanje kurirskom službom, poštarinu plaća kupac.' },
  { vrednost: 'pouzece', opis: 'Kupac plaća kuriru gotovinom kad paket stigne, ne tebi unapred. Manje poverenja treba s obe strane.' },
  { vrednost: 'besplatna', opis: 'Poštarinu snosiš ti. Vidno podiže broj upita na jeftiniji alat.' },
]

export function Korak5Objava({
  nacrt,
  azuriraj,
  gradovi,
  brendovi,
  nazivKategorije,
  greske,
  dodirnuta,
  dodirni,
}: Props) {
  const id = useId()
  const g = (kljuc: string) => (dodirnuta.includes(kljuc) ? greske[kljuc] : undefined)

  const oglas = nacrtUOglas(nacrt)
  const brendNaziv = brendovi.find((b) => b.slug === nacrt.brend)?.naziv ?? 'Brend'
  const naslovna = nacrt.fotografije[0]?.url

  function prebaciDostavu(d: Dostava) {
    const ima = nacrt.dostava.includes(d)
    azuriraj({
      dostava: ima ? nacrt.dostava.filter((x) => x !== d) : [...nacrt.dostava, d],
    })
    dodirni('dostava')
  }

  return (
    <div className={s.korakTelo}>
      <Polje
        id={`${id}-cena`}
        oznaka="Cena"
        obavezno
        greska={g('cena')}
        pomoc="U dinarima, bez tačaka. Za polovan alat u dobrom stanju realno je 45–65% cene nove mašine."
      >
        <div className={s.cenaUnos}>
          <input
            id={`${id}-cena`}
            type="number"
            inputMode="numeric"
            className={['polje', s.cenaPolje].join(' ')}
            placeholder="0"
            min={0}
            max={9999999}
            value={nacrt.cena ?? ''}
            aria-describedby={g('cena') ? `${id}-cena-greska` : undefined}
            onChange={(e) => {
              const v = e.target.value.trim()
              azuriraj({ cena: v === '' ? undefined : Math.abs(Number.parseInt(v, 10)) })
            }}
            onBlur={() => dodirni('cena')}
          />
          <span className={s.cenaValuta}>din</span>
        </div>

        <p className={s.cenaPregled} aria-live="polite">
          Na oglasu će pisati{' '}
          <strong className="cena">{formatCena(nacrt.cena && nacrt.cena > 0 ? nacrt.cena : 0)}</strong>
          {nacrt.cenaDogovor ? <span className={s.dogovorZnak}>Dogovor</span> : null}
        </p>

        <label className={s.prekidacRed}>
          <input
            type="checkbox"
            className={s.prekidacUnos}
            checked={nacrt.cenaDogovor}
            onChange={(e) => azuriraj({ cenaDogovor: e.target.checked })}
          />
          <span className={s.prekidac} aria-hidden="true" />
          <span className={s.prekidacTekst}>
            <strong>Cena je po dogovoru</strong>
            <span className={s.pomoc}>
              Uz cenu se prikazuje oznaka „Dogovor". Kupci je čitaju kao poziv na pregovor, ne kao
              nepoznatu cenu.
            </span>
          </span>
        </label>
      </Polje>

      <Polje
        id={`${id}-grad`}
        oznaka="Grad"
        obavezno
        greska={g('grad')}
        pomoc="Grad u kome se mašina fizički nalazi i preuzima."
      >
        <select
          id={`${id}-grad`}
          className="polje"
          value={nacrt.grad ?? ''}
          aria-describedby={g('grad') ? `${id}-grad-greska` : undefined}
          onChange={(e) => {
            azuriraj({ grad: e.target.value || undefined })
            dodirni('grad')
          }}
          onBlur={() => dodirni('grad')}
        >
          <option value="">Izaberi grad</option>
          {gradovi.map((grad) => (
            <option key={grad} value={grad}>
              {grad}
            </option>
          ))}
        </select>
      </Polje>

      <fieldset className={s.grupa}>
        <legend className={s.legenda}>
          Preuzimanje i dostava <span className={s.obavezno}>*</span>
        </legend>
        <ul className={s.dostavaLista}>
          {DOSTAVE.map((d) => (
            <li key={d.vrednost}>
              <label
                className={[
                  s.dostavaKartica,
                  nacrt.dostava.includes(d.vrednost) ? s.dostavaAktivna : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <input
                  type="checkbox"
                  className={s.kvadratUnos}
                  checked={nacrt.dostava.includes(d.vrednost)}
                  onChange={() => prebaciDostavu(d.vrednost)}
                />
                <span className={s.kvadrat} aria-hidden="true">
                  <Ikona ime="cek" velicina={14} />
                </span>
                <span className={s.dostavaTekst}>
                  <strong>{dostavaLabela(d.vrednost)}</strong>
                  <span className={s.pomoc}>{d.opis}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
        {g('dostava') ? (
          <p className={s.greska} role="alert">
            {greske.dostava}
          </p>
        ) : null}
      </fieldset>

      {/* ── Živi pregled ─────────────────────────────────────────── */}
      <section className={s.pregled} aria-labelledby={`${id}-pregled`}>
        <div className={s.pregledZaglavlje}>
          <p className="micro">Živi pregled</p>
          <h3 id={`${id}-pregled`} className={s.pregledNaslov}>
            Ovako oglas izgleda u pretrazi
          </h3>
          <p className={s.pomoc}>
            Ista kartica koju kupac vidi u mreži na <code>/oglasi</code>. Menja se dok kucaš.
          </p>
        </div>

        <div className={s.pregledMreza}>
          <KarticaPregled
            oglas={oglas}
            brendNaziv={brendNaziv}
            tipProdavca="privatno-lice"
            naslovnaUrl={naslovna}
          />
        </div>

        <dl className={s.rezime}>
          <div className={s.rezimeRed}>
            <dt>Kategorija</dt>
            <dd>{nazivKategorije ?? '-'}</dd>
          </div>
          <div className={s.rezimeRed}>
            <dt>Ocena stanja</dt>
            <dd>{nacrt.stanje ? stanjeLabela(nacrt.stanje) : '-'}</dd>
          </div>
          <div className={s.rezimeRed}>
            <dt>Garancija</dt>
            <dd>{garancijaLabela(nacrt.garancija)}</dd>
          </div>
          {nacrt.akuSistem ? (
            <div className={s.rezimeRed}>
              <dt>Akumulatorski sistem</dt>
              <dd>{nacrt.akuSistem}</dd>
            </div>
          ) : null}
          <div className={s.rezimeRed}>
            <dt>Specifikacije</dt>
            <dd>{oglas.specifikacije.length > 0 ? `${oglas.specifikacije.length} reda` : '-'}</dd>
          </div>
          <div className={s.rezimeRed}>
            <dt>U pakovanju</dt>
            <dd>{nacrt.uPakovanju.length > 0 ? nacrt.uPakovanju.join(', ') : '-'}</dd>
          </div>
          <div className={s.rezimeRed}>
            <dt>Fotografije</dt>
            <dd>{nacrt.fotografije.length}</dd>
          </div>
          <div className={s.rezimeRed}>
            <dt>Dostava</dt>
            <dd>
              {nacrt.dostava.length > 0 ? nacrt.dostava.map((d) => dostavaLabela(d)).join(', ') : '-'}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  )
}

export default Korak5Objava
