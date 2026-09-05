'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Ikona } from '@/components/Ikone'
import { STANJA, stanjeDefinicija, stanjeLabela } from '@/lib/format'
import type { Stanje } from '@/lib/types'
import Polje from './Polje'
import {
  MIN_OPIS,
  PREPORUCEN_OPIS,
  normalizuj,
  predloziPakovanja,
  predloziSpecifikacija,
  traziAkuSistem,
  type BrendOpcija,
  type Greske,
  type Nacrt,
} from './model'
import s from './tok.module.css'

type Props = {
  nacrt: Nacrt
  azuriraj: (delta: Partial<Nacrt>) => void
  brendovi: BrendOpcija[]
  koren?: string
  nazivKategorije?: string
  greske: Greske
  dodirnuta: string[]
  dodirni: (kljuc: string) => void
}

export function Korak2Detalji({
  nacrt,
  azuriraj,
  brendovi,
  koren,
  nazivKategorije,
  greske,
  dodirnuta,
  dodirni,
}: Props) {
  const id = useId()
  const [upitBrenda, setUpitBrenda] = useState('')
  const [novaStavka, setNovaStavka] = useState('')

  const g = (kljuc: string) => (dodirnuta.includes(kljuc) ? greske[kljuc] : undefined)

  const izabranBrend = brendovi.find((b) => b.slug === nacrt.brend)
  const prikaziAku = traziAkuSistem(koren, izabranBrend)

  const filtriraniBrendovi = useMemo(() => {
    const q = normalizuj(upitBrenda)
    if (!q) return brendovi
    return brendovi.filter((b) => normalizuj(b.naziv).includes(q))
  }, [brendovi, upitBrenda])

  const predloziSpec = predloziSpecifikacija(koren)
  const predloziPak = predloziPakovanja(koren)
  const duzinaOpisa = nacrt.opis.trim().length

  /**
   * Standardna polja za kategoriju se popunjavaju sama — prodavac ne dodaje
   * nove redove (vidi dole, "Dodaj red" je namerno uklonjen), samo unosi
   * vrednosti ili stavi "X" gde se ne odnosi. Ovo se pokreće pri prvom
   * ulasku u korak i svaki put kad se kategorija stvarno promeni (nazad pa
   * druga kategorija) — ali nikad ako je prodavac već upisao bilo koju
   * vrednost, da mu se ne obriše rad.
   */
  const prethodniKoren = useRef(koren)
  useEffect(() => {
    const promenjenaKategorija = prethodniKoren.current !== koren
    prethodniKoren.current = koren
    const sveVrednostiPrazne = nacrt.specifikacije.every((sp) => !sp.vrednost.trim())
    if (koren && sveVrednostiPrazne && (nacrt.specifikacije.length === 0 || promenjenaKategorija)) {
      azuriraj({ specifikacije: predloziSpecifikacija(koren).map((naziv) => ({ naziv, vrednost: '' })) })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [koren])

  /** Naslov se predlaže dok ga korisnik ne dotakne rukom. */
  function predlozi(brendSlug?: string, model?: string) {
    if (nacrt.naslovRucno) return
    const b = brendovi.find((x) => x.slug === (brendSlug ?? nacrt.brend))
    const m = (model ?? nacrt.model).trim()
    // Naziv kategorije ide neizmenjen — spuštanje na mala slova bi razbilo
    // akronime („SDS" → „sds").
    const osnova = [b?.naziv, m].filter(Boolean).join(' ').trim()
    const delovi = nazivKategorije ? [osnova, nazivKategorije].filter(Boolean).join(', ') : osnova
    if (delovi) azuriraj({ naslov: delovi })
  }

  function postaviSpec(i: number, delta: Partial<{ naziv: string; vrednost: string }>) {
    const kopija = nacrt.specifikacije.map((sp, j) => (i === j ? { ...sp, ...delta } : sp))
    azuriraj({ specifikacije: kopija })
  }

  function dodajStavku() {
    const v = novaStavka.trim()
    if (!v) return
    if (nacrt.uPakovanju.includes(v)) {
      setNovaStavka('')
      return
    }
    azuriraj({ uPakovanju: [...nacrt.uPakovanju, v] })
    setNovaStavka('')
  }

  return (
    <div className={s.korakTelo}>
      {/* ── Brend ───────────────────────────────────────────────── */}
      <fieldset className={s.grupa}>
        <legend className={s.legenda}>
          Brend <span className={s.obavezno}>*</span>
        </legend>
        <p className={s.pomoc}>
          Brend određuje i to koji akumulatorski sistem kupac vidi u filteru. Ako mašina nije ni od
          jednog od ovih proizvođača, ne postoji polje za slobodan unos. To je namerno.
        </p>

        <div className={s.pretragaOkvir}>
          <Ikona ime="pretraga" velicina={18} className={s.pretragaIkona} />
          <input
            type="search"
            className={['polje', s.pretragaPolje].join(' ')}
            placeholder="Pretraži brendove"
            value={upitBrenda}
            onChange={(e) => setUpitBrenda(e.target.value)}
            aria-label="Pretraži brendove"
            autoComplete="off"
          />
        </div>

        {filtriraniBrendovi.length === 0 ? (
          <p className={s.nemaPogodakaMalo}>
            Nema brenda po imenu „{upitBrenda}". Alatnica pokriva 17 proizvođača alata.
          </p>
        ) : (
          <ul className={s.brendovi}>
            {filtriraniBrendovi.map((b) => (
              <li key={b.slug}>
                <button
                  type="button"
                  className={[s.brendDugme, nacrt.brend === b.slug ? s.brendAktivan : '']
                    .filter(Boolean)
                    .join(' ')}
                  aria-pressed={nacrt.brend === b.slug}
                  onClick={() => {
                    const noviAku =
                      b.akuSistemi.includes(nacrt.akuSistem ?? '') ? nacrt.akuSistem : undefined
                    azuriraj({ brend: b.slug, akuSistem: noviAku })
                    dodirni('brend')
                    predlozi(b.slug)
                  }}
                >
                  {b.naziv}
                  {b.akuSistemi.length > 0 ? (
                    <span className={s.brendAku} title="Ima akumulatorski sistem">
                      <Ikona ime="baterija" velicina={14} />
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        )}
        {g('brend') ? (
          <p className={s.greska} role="alert">
            {greske.brend}
          </p>
        ) : null}
      </fieldset>

      {/* ── Model i godište ─────────────────────────────────────── */}
      <div className={s.dvaPolja}>
        <Polje
          id={`${id}-model`}
          oznaka="Model"
          obavezno
          greska={g('model')}
          pomoc="Tačna fabrička oznaka, ne opisno ime."
        >
          <input
            id={`${id}-model`}
            type="text"
            className="polje"
            placeholder="npr. GBH 2-28 F"
            value={nacrt.model}
            aria-describedby={g('model') ? `${id}-model-greska` : undefined}
            onChange={(e) => {
              azuriraj({ model: e.target.value })
              predlozi(undefined, e.target.value)
            }}
            onBlur={() => dodirni('model')}
          />
        </Polje>

        <Polje
          id={`${id}-godiste`}
          oznaka="Godište"
          greska={g('godiste')}
          pomoc="Godina proizvodnje ili kupovine, ako je znaš."
        >
          <input
            id={`${id}-godiste`}
            type="number"
            inputMode="numeric"
            className="polje"
            placeholder="npr. 2019"
            min={1980}
            max={2026}
            value={nacrt.godiste ?? ''}
            aria-describedby={g('godiste') ? `${id}-godiste-greska` : undefined}
            onChange={(e) => {
              const v = e.target.value.trim()
              azuriraj({ godiste: v === '' ? undefined : Number.parseInt(v, 10) })
            }}
            onBlur={() => dodirni('godiste')}
          />
        </Polje>
      </div>

      {/* ── Naslov ──────────────────────────────────────────────── */}
      <Polje
        id={`${id}-naslov`}
        oznaka="Naslov oglasa"
        obavezno
        greska={g('naslov')}
        brojac={`${nacrt.naslov.trim().length}/90`}
        pomoc="Predlog se sastavlja od brenda, modela i kategorije. Slobodno ga prepiši."
      >
        <input
          id={`${id}-naslov`}
          type="text"
          className="polje"
          placeholder="npr. Bosch GBH 2-28 F, rotaciona bušilica"
          value={nacrt.naslov}
          maxLength={120}
          aria-describedby={g('naslov') ? `${id}-naslov-greska` : undefined}
          onChange={(e) => azuriraj({ naslov: e.target.value, naslovRucno: true })}
          onBlur={() => dodirni('naslov')}
        />
      </Polje>

      {/* ── Stanje ──────────────────────────────────────────────── */}
      <fieldset className={s.grupa}>
        <legend className={s.legenda}>
          Ocena stanja <span className={s.obavezno}>*</span>
        </legend>
        <p className={s.pomoc}>
          Pet ocena, iste za sve prodavce. Definicija koju ovde biraš je tačno ona koju kupac vidi
          na oglasu. Zato nema polja za slobodan opis stanja.
        </p>

        <ul className={s.stanjaLista}>
          {STANJA.map((st: Stanje) => (
            <li key={st}>
              <label
                className={[s.stanjeKartica, nacrt.stanje === st ? s.stanjeAktivna : '']
                  .filter(Boolean)
                  .join(' ')}
              >
                <input
                  type="radio"
                  name={`${id}-stanje`}
                  value={st}
                  checked={nacrt.stanje === st}
                  className={s.radio}
                  onChange={() => {
                    azuriraj({ stanje: st })
                    dodirni('stanje')
                  }}
                />
                <span className={s.stanjeTelo}>
                  <span className={`stanje-chip stanje-${st} stanje-chip-veliki`}>
                    {stanjeLabela(st)}
                  </span>
                  <span className={s.stanjeDef}>{stanjeDefinicija(st)}</span>
                </span>
                <span className={s.stanjeKvadrat} aria-hidden="true">
                  {nacrt.stanje === st ? <Ikona ime="cek" velicina={15} /> : null}
                </span>
              </label>
            </li>
          ))}
        </ul>
        {g('stanje') ? (
          <p className={s.greska} role="alert">
            {greske.stanje}
          </p>
        ) : null}
      </fieldset>

      {/* ── Akumulatorski sistem (uslovno) ──────────────────────── */}
      {prikaziAku && izabranBrend ? (
        <Polje
          id={`${id}-aku`}
          oznaka="Akumulatorski sistem"
          pomoc={
            <>
              Prikazuje se jer {izabranBrend.naziv} ima svoje baterijske platforme, a kategorija je
              akumulatorska. Kupci filtriraju upravo po ovome: 18V Makita baterija ne pali Bosch
              mašinu.
            </>
          }
        >
          <select
            id={`${id}-aku`}
            className="polje"
            value={nacrt.akuSistem ?? ''}
            onChange={(e) => azuriraj({ akuSistem: e.target.value || undefined })}
          >
            <option value="">Nije akumulatorska mašina</option>
            {izabranBrend.akuSistemi.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </Polje>
      ) : null}

      {/* ── Specifikacije ───────────────────────────────────────── */}
      <fieldset className={s.grupa}>
        <legend className={s.legenda}>Specifikacije</legend>
        <p className={s.pomoc}>
          Brojevi iz deklaracije. Oglasi sa popunjenom tabelom se otvaraju osetno češće od onih bez
          nje.
        </p>

        {nacrt.specifikacije.length > 0 ? (
          <ul className={s.specLista}>
            {nacrt.specifikacije.map((sp, i) => (
              <li key={i} className={s.specRed}>
                <input
                  type="text"
                  className={['polje', s.specNaziv].join(' ')}
                  placeholder="Naziv"
                  list={`${id}-spec-predlozi`}
                  value={sp.naziv}
                  aria-label={`Naziv specifikacije ${i + 1}`}
                  onChange={(e) => postaviSpec(i, { naziv: e.target.value })}
                  onBlur={() => dodirni('specifikacije')}
                />
                <input
                  type="text"
                  className={['polje', s.specVrednost].join(' ')}
                  placeholder="Vrednost, ili X ako se ne odnosi"
                  value={sp.vrednost}
                  aria-label={`Vrednost specifikacije ${i + 1}`}
                  onChange={(e) => postaviSpec(i, { vrednost: e.target.value })}
                  onBlur={() => dodirni('specifikacije')}
                />
                <button
                  type="button"
                  className={s.ukloniDugme}
                  aria-label={`Ukloni specifikaciju ${sp.naziv || i + 1}`}
                  onClick={() =>
                    azuriraj({ specifikacije: nacrt.specifikacije.filter((_, j) => j !== i) })
                  }
                >
                  <Ikona ime="x" velicina={18} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className={s.nemaStavki}>Nijedna specifikacija još nije dodata.</p>
        )}

        <datalist id={`${id}-spec-predlozi`}>
          {predloziSpec.map((p) => (
            <option key={p} value={p} />
          ))}
        </datalist>

        {g('specifikacije') ? (
          <p className={s.greska} role="alert">
            {greske.specifikacije}
          </p>
        ) : null}
      </fieldset>

      {/* ── Opis ────────────────────────────────────────────────── */}
      <Polje
        id={`${id}-opis`}
        oznaka="Opis"
        obavezno
        greska={g('opis')}
        brojac={
          <span className={duzinaOpisa < MIN_OPIS ? s.brojacSlab : s.brojacDobar}>
            {duzinaOpisa} znakova
            {duzinaOpisa < PREPORUCEN_OPIS ? ` · preporuka ${PREPORUCEN_OPIS}+` : ' · taman'}
          </span>
        }
        pomoc="Napiši kako je mašina korišćena, šta je menjano i zašto je prodaješ. Kupac polovnog alata prvo traži razlog prodaje."
      >
        <textarea
          id={`${id}-opis`}
          className={['polje', s.tekstualno].join(' ')}
          rows={7}
          placeholder="Kupljena 2019. za adaptaciju stana, radila je svega nekoliko vikenda. Četkice su originalne i skoro nove, SDS prihvat drži bez zazora. Prodajem jer sam prešao na akumulatorsku."
          value={nacrt.opis}
          aria-describedby={g('opis') ? `${id}-opis-greska` : undefined}
          onChange={(e) => azuriraj({ opis: e.target.value })}
          onBlur={() => dodirni('opis')}
        />
      </Polje>

      {/* ── U pakovanju ─────────────────────────────────────────── */}
      <fieldset className={s.grupa}>
        <legend className={s.legenda}>U pakovanju</legend>
        <p className={s.pomoc}>
          Šta kupac dobija uz mašinu. Nedostatak kofera ili punjača je najčešći razlog za odustajanje
          posle dolaska na lice mesta.
        </p>

        {nacrt.uPakovanju.length > 0 ? (
          <ul className={s.pakovanjeLista}>
            {nacrt.uPakovanju.map((st) => (
              <li key={st} className={s.pakovanjeStavka}>
                <Ikona ime="cek" velicina={16} className={s.pakovanjeCek} />
                <span>{st}</span>
                <button
                  type="button"
                  className={s.ukloniDugme}
                  aria-label={`Ukloni „${st}" iz pakovanja`}
                  onClick={() =>
                    azuriraj({ uPakovanju: nacrt.uPakovanju.filter((x) => x !== st) })
                  }
                >
                  <Ikona ime="x" velicina={17} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className={s.nemaStavki}>Lista je prazna. Oglas će prikazati samo mašinu.</p>
        )}

        <div className={s.dodajStavkuRed}>
          <input
            type="text"
            className={['polje', s.dodajPolje].join(' ')}
            placeholder="npr. Originalni kofer"
            value={novaStavka}
            aria-label="Nova stavka u pakovanju"
            onChange={(e) => setNovaStavka(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                dodajStavku()
              }
            }}
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={dodajStavku}
            disabled={!novaStavka.trim()}
          >
            Dodaj
          </button>
        </div>

        <ul className={s.predlozi}>
          {predloziPak
            .filter((p) => !nacrt.uPakovanju.includes(p))
            .map((p) => (
              <li key={p}>
                <button
                  type="button"
                  className="chip"
                  onClick={() => azuriraj({ uPakovanju: [...nacrt.uPakovanju, p] })}
                >
                  <Ikona ime="plus" velicina={14} />
                  {p}
                </button>
              </li>
            ))}
        </ul>
      </fieldset>
    </div>
  )
}

export default Korak2Detalji
