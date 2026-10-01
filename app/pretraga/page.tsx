import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Ikona } from '@/components/Ikone'
import OglasKartica from '@/components/OglasKartica'
import Prazno from '@/components/Prazno'
import PoljeZaPretragu from '@/components/browse/PoljeZaPretragu'
import { brojSr } from '@/lib/format'
import {
  brojeviFiltera,
  pretraga,
  putanjaKategorije,
  stabloKategorija,
  sviBrendovi,
} from '@/lib/queries'
import type { Kategorija } from '@/lib/types'
import s from './stranica.module.css'

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const OSNOVA = '/pretraga'

/** Primeri čestih upita — svaki pogađa bar kategoriju ili brend, i kad je katalog mali. */
const PRIMERI = [
  'SDS bušilica',
  'Makita 18V',
  'ugaona brusilica',
  'laser',
  'agregat',
  'garnitura ključeva',
  'inverter',
]

function upitIz(sp: Record<string, string | string[] | undefined>): string {
  const sirovo = sp.q
  const v = Array.isArray(sirovo) ? sirovo[0] : sirovo
  return (v ?? '').trim()
}

/** `/kategorija/elektroalat/testere` — potkategorija uvek nosi punu putanju. */
function hrefKategorije(k: Kategorija): string {
  const lanac = putanjaKategorije(k.slug)
  return `/kategorija/${lanac.map((x) => x.slug).join('/')}`
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const q = upitIz(await searchParams)

  if (!q) {
    return {
      title: 'Pretraga alata po nazivu, brendu i modelu',
      description:
        'Pretraži Alatnicu odjednom: oglase, kategorije i brendove. Radi i bez dijakritike, a rezultat se dalje filtrira po oceni stanja, ceni, gradu i akumulatorskom sistemu.',
      robots: { index: true, follow: true },
      alternates: { canonical: OSNOVA },
    }
  }

  const r = await pretraga(q)
  const ukupno = r.oglasi.length + r.kategorije.length + r.brendovi.length

  return {
    title: `Pretraga: „${q}"`,
    description: ukupno
      ? `${brojSr(ukupno, ['rezultat', 'rezultata', 'rezultata'])} za „${q}" na Alatnici: ${r.oglasi.length} u oglasima, ${r.kategorije.length} u kategorijama, ${r.brendovi.length} među brendovima.`
      : `Nijedan rezultat za „${q}". Pogledaj kategorije i brendove. U katalogu ima nov i polovan alat sa ocenjenim stanjem.`,
    // Rezultati pretrage prave beskonačan prostor URL-ova i ne indeksiraju se.
    robots: { index: false, follow: true },
    alternates: { canonical: OSNOVA },
  }
}

export default async function PretragaStranica({ searchParams }: Props) {
  const sp = await searchParams
  const q = upitIz(sp)
  const [rezultat, globalni] = await Promise.all([
    q ? pretraga(q) : Promise.resolve({ oglasi: [], kategorije: [], brendovi: [] }),
    brojeviFiltera({}),
  ])
  const ukupno = rezultat.oglasi.length + rezultat.kategorije.length + rezultat.brendovi.length

  // Dok je katalog prazan, „najveće" nema smisla — prikazuje se taksonomija bez brojeva.
  const imaOglasa = Object.values(globalni.stanje).some((n) => n > 0)
  const popularneKategorije = stabloKategorija()
    .map(({ kategorija }) => ({ ...kategorija, broj: globalni.kategorija[kategorija.slug] ?? 0 }))
    .filter((k) => !imaOglasa || k.broj > 0)
    .sort((a, b) => b.broj - a.broj)
    .slice(0, 6)

  const popularniBrendovi = sviBrendovi()
    .map((b) => ({ ...b, broj: globalni.brend[b.slug] ?? 0 }))
    .filter((b) => !imaOglasa || b.broj > 0)
    .sort((a, b) => b.broj - a.broj || a.naziv.localeCompare(b.naziv, 'sr'))
    .slice(0, 8)

  return (
    <div className={['container', s.strana].join(' ')}>
      <Breadcrumbs
        stavke={[
          { naziv: 'Početna', href: '/' },
          ...(q
            ? [{ naziv: 'Pretraga', href: OSNOVA }, { naziv: `„${q}"` }]
            : [{ naziv: 'Pretraga' }]),
        ]}
        className={s.mrvice}
      />

      <header className={s.uvod}>
        <p className="micro">{q ? 'Rezultati pretrage' : 'Pretraga'}</p>
        <h1 className={s.naslov}>
          {q ? (
            <>
              „<span className={s.upit}>{q}</span>"
            </>
          ) : (
            'Šta ti treba?'
          )}
        </h1>

        <p className={s.lede} aria-live="polite">
          {q
            ? ukupno > 0
              ? `${brojSr(ukupno, ['rezultat', 'rezultata', 'rezultata'])}. Pretraga ide kroz naslove, modele, brendove, gradove i opise, i radi i kada se izostavi dijakritika.`
              : 'Nijedan pogodak u oglasima, kategorijama ni brendovima.'
            : 'Jedno polje pretražuje oglase, kategorije i brendove odjednom. Radi i bez kvačica: „busilica" i „bušilica" daju isti rezultat.'}
        </p>

        <div className={s.polje}>
          <PoljeZaPretragu vrednost={q} veliko primeri={PRIMERI} />
        </div>

        {q && ukupno > 0 ? (
          <ul className={s.sazetak}>
            {rezultat.oglasi.length > 0 ? (
              <li>
                <a href="#oglasi" className="chip">
                  Oglasi <span className="chip-brojac">{rezultat.oglasi.length}</span>
                </a>
              </li>
            ) : null}
            {rezultat.kategorije.length > 0 ? (
              <li>
                <a href="#kategorije" className="chip">
                  Kategorije <span className="chip-brojac">{rezultat.kategorije.length}</span>
                </a>
              </li>
            ) : null}
            {rezultat.brendovi.length > 0 ? (
              <li>
                <a href="#brendovi" className="chip">
                  Brendovi <span className="chip-brojac">{rezultat.brendovi.length}</span>
                </a>
              </li>
            ) : null}
          </ul>
        ) : null}
      </header>

      {/* ── Prazan upit ─────────────────────────────────────────── */}
      {!q ? (
        <div className={s.predlozi}>
          <section className={s.grupa} aria-labelledby="pocni">
            <h2 id="pocni" className={s.grupaNaslov}>
              Počni odavde
            </h2>
            <ul className={s.cipovi}>
              {PRIMERI.map((p) => (
                <li key={p}>
                  <Link href={`${OSNOVA}?q=${encodeURIComponent(p)}`} className="chip">
                    <Ikona ime="pretraga" velicina={15} />
                    {p}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className={s.grupa} aria-labelledby="kat-predlozi">
            <h2 id="kat-predlozi" className={s.grupaNaslov}>
              {imaOglasa ? 'Najveće kategorije' : 'Kategorije'}
            </h2>
            <ul className={s.kartice}>
              {popularneKategorije.map((k) => (
                <li key={k.slug}>
                  <Link href={`/kategorija/${k.slug}`} className={['card', s.kartica].join(' ')}>
                    <span className={s.karticaIkona} aria-hidden="true">
                      <Ikona ime={k.ikona} velicina={20} />
                    </span>
                    <span className={s.karticaIme}>{k.naziv}</span>
                    {imaOglasa ? (
                      <span className={['broj', s.karticaBroj].join(' ')}>{k.broj}</span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className={s.grupa} aria-labelledby="brend-predlozi">
            <h2 id="brend-predlozi" className={s.grupaNaslov}>
              {imaOglasa ? 'Traženi brendovi' : 'Brendovi'}
            </h2>
            <ul className={s.cipovi}>
              {popularniBrendovi.map((b) => (
                <li key={b.slug}>
                  <Link href={`/brend/${b.slug}`} className="chip">
                    {b.naziv}
                    <span className="chip-brojac">{b.broj}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <p className={s.fusnota}>
            Ako ne znaš tačan naziv, kreni iz{' '}
            <Link href="/oglasi">celog kataloga</Link>. Filteri po oceni stanja, ceni,
            akumulatorskom sistemu i gradu često brže dovedu do mašine nego pogađanje modela.
          </p>
        </div>
      ) : null}

      {/* ── Upit bez ijednog pogotka ────────────────────────────── */}
      {q && ukupno === 0 ? (
        <div className={s.prazno}>
          <Prazno
            ikona="pretraga"
            naslov={`Ništa ne odgovara upitu „${q}"`}
            opis={
              <>
                Katalog je namerno uzak: samo alat i sitna građevinska oprema, bez mašina koje se
                voze na šleperu. Ako tražiš baš to, ovde ga nema. Ako ne, probaj sa manje reči:
                „bušilica" umesto „bosch bušilica 800w sds".
              </>
            }
            predlozi={[
              ...popularneKategorije.slice(0, 3).map((k) => ({
                tekst: k.naziv,
                href: `/kategorija/${k.slug}`,
              })),
              { tekst: 'Ceo katalog', href: '/oglasi' },
            ]}
          />
        </div>
      ) : null}

      {/* ── Grupisani rezultati ─────────────────────────────────── */}
      {q && rezultat.kategorije.length > 0 ? (
        <section className={s.grupa} aria-labelledby="kategorije">
          <h2 id="kategorije" className={s.grupaNaslov}>
            Kategorije <span className={s.brojGrupe}>{rezultat.kategorije.length}</span>
          </h2>
          <ul className={s.kartice}>
            {rezultat.kategorije.map((k) => (
              <li key={k.slug}>
                <Link href={hrefKategorije(k)} className={['card', s.kartica].join(' ')}>
                  <span className={s.karticaIkona} aria-hidden="true">
                    <Ikona ime={k.ikona} velicina={20} />
                  </span>
                  <span className={s.karticaIme}>
                    {k.naziv}
                    {k.roditelj ? (
                      <span className={s.karticaNad}>
                        {putanjaKategorije(k.slug)[0]?.naziv ?? ''}
                      </span>
                    ) : null}
                  </span>
                  <span className={['broj', s.karticaBroj].join(' ')}>
                    {globalni.kategorija[k.slug] ?? 0}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {q && rezultat.brendovi.length > 0 ? (
        <section className={s.grupa} aria-labelledby="brendovi">
          <h2 id="brendovi" className={s.grupaNaslov}>
            Brendovi <span className={s.brojGrupe}>{rezultat.brendovi.length}</span>
          </h2>
          <ul className={s.brendovi}>
            {rezultat.brendovi.map((b) => (
              <li key={b.slug}>
                <Link href={`/brend/${b.slug}`} className={['card', s.brend].join(' ')}>
                  <span className={s.brendVrh}>
                    <span className={s.brendIme}>{b.naziv}</span>
                    <span className={['broj', s.karticaBroj].join(' ')}>
                      {globalni.brend[b.slug] ?? 0}
                    </span>
                  </span>
                  <span className={s.brendOpis}>{b.opis.split('. ')[0]}.</span>
                  {b.akuSistemi?.length ? (
                    <span className={s.brendSistemi}>
                      <Ikona ime="baterija" velicina={14} />
                      {b.akuSistemi.join(' · ')}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {q && rezultat.oglasi.length > 0 ? (
        <section className={s.grupa} aria-labelledby="oglasi">
          <div className={s.grupaVrh}>
            <h2 id="oglasi" className={s.grupaNaslov}>
              Oglasi <span className={s.brojGrupe}>{rezultat.oglasi.length}</span>
            </h2>
            <Link
              href={`/oglasi?q=${encodeURIComponent(q)}`}
              className="btn btn-tertiary btn-mali"
            >
              <Ikona ime="filter" velicina={16} />
              Filtriraj {brojSr(rezultat.oglasi.length, ['rezultat', 'rezultata', 'rezultata'])}
            </Link>
          </div>

          <ul className="mreza">
            {rezultat.oglasi.map((o) => (
              <li key={o.id} className={s.stavka}>
                <OglasKartica oglas={o} kompaktno />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {q && ukupno > 0 && rezultat.oglasi.length === 0 ? (
        <p className={s.fusnota}>
          Nijedan pojedinačan oglas ne nosi taj naziv, ali kategorije i brendovi iznad vode do
          povezane ponude. <Link href="/oglasi">Ceo katalog</Link> je uvek otvoren za filtriranje.
        </p>
      ) : null}
    </div>
  )
}
