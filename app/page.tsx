import type { Metadata } from 'next'
import Link from 'next/link'
import MrezaOglasa from '@/components/browse/MrezaOglasa'
import PoljeZaPretragu from '@/components/browse/PoljeZaPretragu'
import { Ikona } from '@/components/Ikone'
import Sekcija from '@/components/Sekcija'
import { brojSr, STANJA, stanjeDefinicija, stanjeLabela } from '@/lib/format'
import {
  brojeviFiltera,
  filtrirajOglase,
  stabloKategorija,
  sviBrendovi,
  sviOglasi,
  sviProdavci,
} from '@/lib/queries'
import s from './page.module.css'

export const metadata: Metadata = {
  title: 'Alatnica, nov i polovan alat, sa pravim opisom stanja',
  description:
    'Elektroalat, akumulatorski sistemi, ručni alat i sitna mehanizacija. Pet objavljenih ocena stanja umesto slobodnog teksta, filter po akumulatorskom sistemu i prodavac koji se zna po imenu.',
  alternates: { canonical: '/' },
}

/** Kratki, konkretni ulazi — svaki vodi na već filtriran pregled. */
const BRZI_ULAZI: { naziv: string; href: string; opis: string }[] = [
  { naziv: 'Novo', href: '/oglasi?stanje=novo', opis: 'neotpakovano, sa računom' },
  {
    naziv: 'Polovno',
    href: '/oglasi?stanje=kao-novo,koristeno-ispravno,vidljivo-koristeno',
    opis: 'tri ocene, sve definisane',
  },
  { naziv: 'Do 10.000 din', href: '/oglasi?cenaDo=10000', opis: 'sitnina i potrošni materijal' },
  { naziv: 'Sa garancijom', href: '/oglasi?garancija=1', opis: 'ostatak fabričke garancije' },
  {
    naziv: 'Akumulatorski setovi',
    href: '/oglasi?kategorija=setovi',
    opis: 'mašina, baterije i punjač',
  },
]

/** Dopunska rečenica uz svaku ocenu — kada ta ocena ima smisla za kupca. */
const KADA_IMA_SMISLA: Record<string, string> = {
  novo: 'Kad alat radi svaki dan i hoćeš servis bez rasprave o tome ko je šta pokvario.',
  'kao-novo':
    'Najbolji odnos cene i rizika: obično 20–30% ispod nove cene, a mašina je praktično nekorišćena.',
  'koristeno-ispravno':
    'Standard za profesionalan polovan alat. Traži servisni nalaz i probu pod opterećenjem.',
  'vidljivo-koristeno':
    'Ima smisla za jedan konkretan posao ili ako tačno znaš koji deo ćeš zameniti.',
  'za-delove': 'Samo ako ti treba kućište, motor, prihvat ili baterija. Ne očekuj da radi.',
}

export default function Pocetna() {
  const stablo = stabloKategorija()
  const brojevi = brojeviFiltera({})
  const oglasi = sviOglasi()

  const istaknuti = oglasi.filter((o) => o.istaknuto)
  const najnoviji = filtrirajOglase({ sort: 'najnovije' })
  const brendovi = sviBrendovi()
    .map((b) => ({ ...b, broj: brojevi.brend[b.slug] ?? 0 }))
    .filter((b) => b.broj > 0)
    .sort((a, b) => b.broj - a.broj || a.naziv.localeCompare(b.naziv, 'sr'))

  const brojProdavaca = sviProdavci().length
  const brojLeafKategorija = stablo.reduce((n, x) => n + x.deca.length, 0)

  return (
    <>
      {/* ── 1. Hero ─────────────────────────────────────────────── */}
      <section className={s.hero}>
        <div className={`container ${s.heroUnutra}`}>
          <p className={`micro ${s.heroOznaka}`}>
            Nov i polovan alat · {brojSr(oglasi.length, ['oglas', 'oglasa', 'oglasa'])} u ponudi
          </p>

          <h1 className={s.heroNaslov}>
            Alat koji piše <span className={s.podvuceno}>šta mu stvarno fali</span>
          </h1>

          <p className={s.heroTekst}>
            Elektroalat, akumulatorski sistemi, merni instrumenti i sitna mehanizacija: novo i
            polovno na istom mestu. Svaki oglas nosi jednu od pet ocena stanja sa objavljenom
            definicijom, i prodavca koji se zna po imenu.
          </p>

          <div className={s.heroPretraga}>
            <PoljeZaPretragu veliko />
          </div>

          <ul className={s.heroCipovi}>
            <li>
              <Link href="/oglasi?kategorija=rotacione-busilice-sds" className="chip">
                SDS bušilice
              </Link>
            </li>
            <li>
              <Link href="/oglasi?aku=18V%20Makita%20LXT" className="chip">
                18V Makita LXT
              </Link>
            </li>
            <li>
              <Link href="/oglasi?kategorija=laseri" className="chip">
                Laseri
              </Link>
            </li>
            <li>
              <Link href="/oglasi?kategorija=agregati" className="chip">
                Agregati
              </Link>
            </li>
            <li>
              <Link href="/oglasi?tip=servis" className="chip">
                Prodaju servisi
              </Link>
            </li>
          </ul>

          <dl className={s.heroBrojke}>
            <div>
              <dt>Kategorija</dt>
              <dd>{stablo.length + brojLeafKategorija}</dd>
            </div>
            <div>
              <dt>Brendova</dt>
              <dd>{sviBrendovi().length}</dd>
            </div>
            <div>
              <dt>Prodavaca</dt>
              <dd>{brojProdavaca}</dd>
            </div>
            <div>
              <dt>Ocena stanja</dt>
              <dd>5</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ── 2. Kategorije ───────────────────────────────────────── */}
      <div className="container">
        <Sekcija
          nadnaslov="Taksonomija, ne gomila"
          naslov="Kategorije"
          opis="Deset nadkategorija i njihove potkategorije. Klikom ulaziš u pregled sa filterima koji već znaju šta se u toj kategoriji uopšte pita."
        >
          <ul className={s.kategorije}>
            {stablo.map(({ kategorija, deca }) => (
              <li key={kategorija.slug}>
                <Link href={`/kategorija/${kategorija.slug}`} className={`card ${s.plocica}`}>
                  <span className={s.plocicaIkona} aria-hidden="true">
                    <Ikona ime={kategorija.ikona} velicina={26} />
                  </span>
                  <span className={s.plocicaNaziv}>{kategorija.naziv}</span>
                  <span className={s.plocicaBroj}>
                    {brojSr(brojevi.kategorija[kategorija.slug] ?? 0, [
                      'oglas',
                      'oglasa',
                      'oglasa',
                    ])}
                    <span className={s.plocicaPod}>
                      {' · '}
                      {brojSr(deca.length, ['potkategorija', 'potkategorije', 'potkategorija'])}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Sekcija>

        {/* ── 3. Brzi ulazi ─────────────────────────────────────── */}
        <Sekcija
          nadnaslov="Brzi ulazi"
          naslov="Kad već znaš šta tražiš"
          bezRazmaka
          className={s.brziSekcija}
        >
          <ul className={s.brzi}>
            {BRZI_ULAZI.map((u) => (
              <li key={u.href}>
                <Link href={u.href} className={s.brzaKarta}>
                  <span className={s.brzaNaziv}>{u.naziv}</span>
                  <span className={s.brzaOpis}>{u.opis}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Sekcija>

        {/* ── 4. Izdvojeni oglasi ───────────────────────────────── */}
        <Sekcija
          nadnaslov="Izdvojeno"
          naslov="Promovisani oglasi"
          opis="Plaćena pozicija, i to piše na kartici. Ocena stanja i podaci o prodavcu su isti kao svuda."
          akcijaHref="/oglasi"
          akcijaTekst="Svi oglasi"
        >
          <MrezaOglasa oglasi={istaknuti} limit={8} />
        </Sekcija>
      </div>

      {/* ── 5. Tamna traka: ocene stanja ────────────────────────── */}
      <section className={`tamni-panel-pun ${s.ocene}`}>
        <div className="container">
          <div className={s.oceneZaglavlje}>
            <div>
              <p className="micro">Zašto ovde a ne na oglasniku</p>
              <h2 className={s.oceneNaslov}>Pet ocena stanja. Nijedna se ne piše slobodnim tekstom.</h2>
              <p className={s.oceneUvod}>
                „Malo korišćeno, kao novo, bez ijedne greške" ne znači ništa i ne obavezuje nikoga.
                Zato ovde postoji pet ocena sa objavljenom definicijom. Prodavac bira ocenu i
                popunjava obaveznu listu provere; kupac zna šta kupuje pre nego što krene po grad.
              </p>
            </div>

            <Link href="/kako-radi" className={`btn btn-primary ${s.oceneDugme}`}>
              Kako Alatnica radi
            </Link>
          </div>

          <div className={s.tabelaOkvir}>
            <table className={s.tabela}>
              <caption className="sr-only">
                Pet ocena stanja, njihove definicije i kada ima smisla kupiti takav alat
              </caption>
              <thead>
                <tr>
                  <th scope="col">Ocena</th>
                  <th scope="col">Definicija</th>
                  <th scope="col" className={s.kolonaBroj}>
                    Oglasa
                  </th>
                </tr>
              </thead>
              <tbody>
                {STANJA.map((g) => (
                  <tr key={g}>
                    <th scope="row">
                      <span className={`stanje-chip stanje-${g}`}>{stanjeLabela(g)}</span>
                    </th>
                    <td>
                      <span className={s.definicija}>{stanjeDefinicija(g)}</span>
                      <span className={s.savet}>{KADA_IMA_SMISLA[g]}</span>
                    </td>
                    <td className={s.kolonaBroj}>
                      <Link href={`/oglasi?stanje=${g}`} className={s.brojLink}>
                        {brojevi.stanje[g] ?? 0}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className={s.garancije}>
            <li>
              <Ikona ime="cek" velicina={18} />
              Obavezna lista provere za sve što nije novo
            </li>
            <li>
              <Ikona ime="osoba" velicina={18} />
              Privatno lice, prodavnica ili servis: piše na svakoj kartici
            </li>
            <li>
              <Ikona ime="baterija" velicina={18} />
              Filter zna da 18V Makita nije 18V Bosch
            </li>
          </ul>
        </div>
      </section>

      {/* ── 6. Najnovije ────────────────────────────────────────── */}
      <div className="container">
        <Sekcija
          nadnaslov="Sveže objavljeno"
          naslov="Najnovije"
          akcijaHref="/oglasi"
          akcijaTekst="Vidi sve"
        >
          <MrezaOglasa oglasi={najnoviji} limit={8} />
        </Sekcija>

        {/* ── 7. Brendovi ─────────────────────────────────────────── */}
        <Sekcija
          nadnaslov="Po proizvođaču"
          naslov="Popularni brendovi"
          opis="Svaka stranica brenda ima iskreno pozicioniranje i objašnjenje njegovog akumulatorskog sistema, jer baterija odlučuje o sledećih pet kupovina."
        >
          <ul className={s.brendovi}>
            {brendovi.map((b) => (
              <li key={b.slug}>
                <Link href={`/brend/${b.slug}`} className={s.brend}>
                  <span className={s.brendIme}>{b.naziv}</span>
                  <span className={s.brendBroj}>{b.broj}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Sekcija>
      </div>

      {/* ── 8. Prodaj CTA ───────────────────────────────────────── */}
      <section className={s.prodaj}>
        <div className="container">
          <div className={`tamni-panel ${s.prodajPanel}`}>
            <div>
              <p className="micro">Prodaješ</p>
              <h2 className={s.prodajNaslov}>
                Postavi oglas za pet minuta i <span className="akcenat">ne odgovaraj</span> deset
                puta na isto pitanje
              </h2>
              <p className={s.prodajTekst}>
                Vodimo te kroz pet koraka: kategorija, detalji, lista provere stanja, fotografije i
                cena. Sve što kupci obično pitaju u porukama već stoji u oglasu.
              </p>
            </div>

            <div className={s.prodajAkcije}>
              <Link href="/prodaj" className="btn btn-primary btn-veliki">
                Postavi oglas
              </Link>
              <Link href="/kako-radi" className={s.prodajLink}>
                Kako izgleda proces
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
