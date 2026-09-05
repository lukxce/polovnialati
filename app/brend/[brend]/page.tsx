import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Ikona } from '@/components/Ikone'
import OglasKartica from '@/components/OglasKartica'
import BrowseLayout from '@/components/browse/BrowseLayout'
import PraznoRezultati from '@/components/browse/PraznoRezultati'
import { pripremiBrowse, samoFasete } from '@/components/browse/podaci'
import { brojSr, formatCena, pluralSr } from '@/lib/format'
import {
  brendBySlug,
  brojAktivnihFiltera,
  brojeviFiltera,
  filtrirajOglase,
  parseFiltere,
  stabloKategorija,
  sviBrendovi,
  type Filteri,
} from '@/lib/queries'
import type { Brend } from '@/lib/types'
import s from './stranica.module.css'

type Props = {
  params: Promise<{ brend: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export function generateStaticParams(): { brend: string }[] {
  return sviBrendovi().map((b) => ({ brend: b.slug }))
}

/** Prva rečenica opisa — dovoljno za meta description, bez sečenja na pola reči. */
function prvaRecenica(tekst: string): string {
  const tacka = tekst.indexOf('. ')
  return tacka === -1 ? tekst : tekst.slice(0, tacka + 1)
}

/**
 * Brend je zaključan putanjom. Ako upit ipak nosi `brend`, on je merodavan —
 * tako se sa strane brenda može porediti sa još jednim proizvođačem, a čip u
 * traci aktivnih filtera ostaje iskren i uklonjiv.
 */
function parseNaBrend(
  sp: Record<string, string | string[] | undefined>,
  brend: Brend,
): { filteri: Filteri; sirovi: Filteri } {
  const sirovi = parseFiltere(sp)
  return {
    sirovi,
    filteri: { ...sirovi, brend: sirovi.brend?.length ? sirovi.brend : [brend.slug] },
  }
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { brend: slug } = await params
  const b = brendBySlug(slug)
  if (!b) return { title: 'Brend nije pronađen' }

  const broj = filtrirajOglase({ brend: [b.slug] }).length
  const { sirovi } = parseNaBrend(await searchParams, b)
  const filtrirano = brojAktivnihFiltera(sirovi) > 0 || !!sirovi.sort
  const osnova = `/brend/${b.slug}`

  const sistemi = b.akuSistemi?.length
    ? ` Akumulatorski sistemi: ${b.akuSistemi.join(', ')}.`
    : ''

  return {
    title: broj
      ? `${b.naziv}, ${brojSr(broj, ['oglas', 'oglasa', 'oglasa'])}, nov i polovan alat`
      : `${b.naziv}, alat, sistemi i cene`,
    description: `${prvaRecenica(b.opis)} ${brojSr(broj, ['oglas', 'oglasa', 'oglasa'])} na Alatnici, sa ocenom stanja i poznatim prodavcem.${sistemi}`,
    robots: filtrirano ? { index: false, follow: true } : { index: true, follow: true },
    alternates: { canonical: osnova },
    openGraph: {
      type: 'website',
      title: `${b.naziv}, Alatnica`,
      description: prvaRecenica(b.opis),
      url: osnova,
    },
  }
}

type SistemPodaci = {
  naziv: string
  uBrendu: number
  ukupno: number
  deleGa: Brend[]
}

/**
 * Jedna rečenica po sistemu, različita za različit slučaj — deljena baterija,
 * glavna platforma, sporedna platforma i platforma bez aktivnog oglasa.
 * Ista rečenica tri puta ispod tri kartice ne govori ništa.
 */
function notaSistema(
  x: SistemPodaci,
  glavni: SistemPodaci | undefined,
  brend: Brend,
  akuOglasa: number,
): string {
  if (x.deleGa.length > 0) {
    return `Istu bateriju koristi i ${x.deleGa.map((d) => d.naziv).join(', ')}, redak slučaj da alat dva proizvođača deli isti paket.`
  }

  if (x.ukupno === 0) {
    return `Platforma postoji u katalogu proizvođača, ali trenutno nema nijedan aktivan oglas na Alatnici. Vredi pratiti ako već imaš te baterije.`
  }

  if (glavni && x.naziv === glavni.naziv) {
    return akuOglasa > x.uBrendu
      ? `Glavna platforma ovde: ${x.uBrendu} od ${akuOglasa} akumulatorskih oglasa ${brend.naziv} stoji na njoj.`
      : `Glavna platforma ovde: sav akumulatorski alat ${brend.naziv} u ponudi radi na ovim baterijama.`
  }

  return `Odvojen sistem: baterije se ne mešaju sa ${glavni?.naziv ?? 'ostalim serijama'}, ni uz adapter bez gubitka funkcija.`
}

export default async function BrendStranica({ params, searchParams }: Props) {
  const { brend: slug } = await params
  const b = brendBySlug(slug)
  if (!b) notFound()

  const sp = await searchParams
  const { filteri } = parseNaBrend(sp, b)
  const podaci = pripremiBrowse(filteri)
  const fasete = samoFasete(podaci)
  const osnova = `/brend/${b.slug}`

  /* Brojevi za sadržaj strane — vezani za brend, nezavisni od korisnikovih filtera. */
  const oglasiBrenda = filtrirajOglase({ brend: [b.slug] })
  const ukupno = oglasiBrenda.length
  const uBrendu = brojeviFiltera({ brend: [b.slug] })
  const globalniAku = brojeviFiltera({}).aku

  const cene = oglasiBrenda.map((o) => o.cena)
  const najniza = cene.length ? Math.min(...cene) : 0
  const najvisa = cene.length ? Math.max(...cene) : 0
  const novih = oglasiBrenda.filter((o) => o.stanje === 'novo').length

  const razbijanje = stabloKategorija()
    .map(({ kategorija, deca }) => ({
      kategorija,
      broj: uBrendu.kategorija[kategorija.slug] ?? 0,
      deca: deca
        .map((d) => ({ ...d, broj: uBrendu.kategorija[d.slug] ?? 0 }))
        .filter((d) => d.broj > 0)
        .sort((x, y) => y.broj - x.broj),
    }))
    .filter((x) => x.broj > 0)
    .sort((x, y) => y.broj - x.broj)

  const najveca = razbijanje[0]?.broj ?? 1

  const sirovi = (b.akuSistemi ?? []).map((sistem) => ({
    naziv: sistem,
    uBrendu: uBrendu.aku[sistem] ?? 0,
    ukupno: globalniAku[sistem] ?? 0,
    deleGa: sviBrendovi().filter((x) => x.slug !== b.slug && x.akuSistemi?.includes(sistem)),
  }))

  const akuOglasa = oglasiBrenda.filter((o) => o.akuSistem).length
  const glavni = [...sirovi].sort((x, y) => y.uBrendu - x.uBrendu)[0]
  const sistemi = sirovi.map((x) => ({ ...x, nota: notaSistema(x, glavni, b, akuOglasa) }))

  return (
    <div className={['container', s.strana].join(' ')}>
      <Breadcrumbs
        stavke={[
          { naziv: 'Početna', href: '/' },
          { naziv: 'Oglasi', href: '/oglasi' },
          { naziv: b.naziv },
        ]}
        className={s.mrvice}
      />

      {/* ── Zaglavlje: tamna traka sa logotipskim ispisom ───────── */}
      <header className={['tamni-panel', s.zaglavlje].join(' ')}>
        <p className={['micro', s.oznaka].join(' ')}>Brend na Alatnici</p>

        <h1 className={s.zig}>
          <span className={s.zigIme}>{b.naziv}</span>
          <span className={s.zigCrta} aria-hidden="true" />
        </h1>

        <p className={s.opis}>{b.opis}</p>

        <dl className={s.brojke}>
          <div>
            <dt>Oglasa</dt>
            <dd className="broj">{ukupno}</dd>
          </div>
          <div>
            <dt>Kategorija</dt>
            <dd className="broj">{razbijanje.length}</dd>
          </div>
          <div>
            <dt>Novo</dt>
            <dd className="broj">{novih}</dd>
          </div>
          <div>
            <dt>Cene</dt>
            <dd className="broj">
              {ukupno ? `${formatCena(najniza)} – ${formatCena(najvisa)}` : '-'}
            </dd>
          </div>
        </dl>
      </header>

      {/* ── Oglasi ──────────────────────────────────────────────── */}
      <section className={s.sekcija} aria-labelledby="oglasi">
        <h2 id="oglasi" className={s.sekcijaNaslov}>
          Oglasi: {b.naziv}
        </h2>
        <p className={s.podnaslov}>
          Strana je zaključana na {b.naziv}. Ostali filteri rade normalno. Ako hoćeš da uporediš
          ponudu jednu pored druge, u listi brendova dodaj još jednog proizvođača.
        </p>

        <BrowseLayout
          filteri={filteri}
          fasete={fasete}
          osnova={osnova}
          zakljucanBrend={b.slug}
        >
          {podaci.ukupno === 0 ? (
            <PraznoRezultati
              filteri={filteri}
              fasete={fasete}
              osnova={osnova}
              zakljucanBrend={b.slug}
            />
          ) : (
            <ul className="mreza">
              {podaci.rezultati.map((o) => (
                <li key={o.id} className={s.stavka}>
                  <OglasKartica oglas={o} kompaktno />
                </li>
              ))}
            </ul>
          )}
        </BrowseLayout>
      </section>

      {/* ── Akumulatorska platforma ─────────────────────────────── */}
      {sistemi.length > 0 ? (
        <section className={s.sekcija} aria-labelledby="baterije">
          <h2 id="baterije" className={s.sekcijaNaslov}>
            {b.naziv}: platforma je odluka, alat je posledica
          </h2>

          <div className={s.proza}>
            <p>
              Prva {b.naziv} mašina sa baterijom nije kupovina alata: to je ulazak u katalog iz kog
              biraš sledećih pet. {b.naziv} u ponudi na Alatnici drži{' '}
              <strong>
                {sistemi.length}{' '}
                {pluralSr(sistemi.length, ['sistem', 'sistema', 'sistema'])}
              </strong>
              {akuOglasa > 0 ? (
                <> ({brojSr(akuOglasa, ['oglas', 'oglasa', 'oglasa'])} ovog brenda)</>
              ) : null}
              . Filter „Akumulatorski sistem" traži baš po tome: samo mašine za baterije koje već
              imaš.
            </p>
          </div>

          <ul className={s.sistemi}>
            {sistemi.map((x) => (
              <li key={x.naziv} className={['card', 'card-static', s.sistem].join(' ')}>
                <div className={s.sistemVrh}>
                  <span className={s.sistemIkona} aria-hidden="true">
                    <Ikona ime="baterija" velicina={19} />
                  </span>
                  <h3 className={s.sistemIme}>{x.naziv}</h3>
                </div>

                <p className={s.sistemBrojevi}>
                  <strong className="broj">{x.uBrendu}</strong>{' '}
                  {pluralSr(x.uBrendu, ['oglas', 'oglasa', 'oglasa'])} pod {b.naziv}
                  {x.ukupno > x.uBrendu ? (
                    <span className={s.sistemUkupno}>
                      {' '}
                      · {x.ukupno} na sistemu ukupno
                    </span>
                  ) : null}
                </p>

                <p className={s.sistemNota}>{x.nota}</p>

                {x.ukupno > 0 ? (
                  <Link
                    href={`/oglasi?aku=${encodeURIComponent(x.naziv)}`}
                    className={['btn', 'btn-tertiary', 'btn-mali', s.sistemDugme].join(' ')}
                  >
                    Sve na ovom sistemu
                    <Ikona ime="strelica" velicina={16} />
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className={s.sekcija}>
          <p className={s.bezSistema}>
            {b.naziv} nema sopstvenu akumulatorsku platformu u ponudi na Alatnici: težište je na
            mrežnom i ručnom alatu, pa se ovde ne vezuješ ni za čije baterije.{' '}
            <Link href="/kategorija/akumulatorski-sistemi">Akumulatorski sistemi</Link> su zasebna
            kategorija, sa filterom po platformi.
          </p>
        </section>
      )}

      {/* ── Šta ovaj brend pokriva ──────────────────────────────── */}
      {razbijanje.length > 0 ? (
        <section className={s.sekcija} aria-labelledby="kategorije">
          <h2 id="kategorije" className={s.sekcijaNaslov}>
            Šta {b.naziv} pokriva
          </h2>
          <p className={s.podnaslov}>
            Raspodela {brojSr(ukupno, ['oglasa', 'oglasa', 'oglasa'])} po kategorijama. Klik vodi na
            isti pregled, sužen na tu granu.
          </p>

          <ul className={s.razbijanje}>
            {razbijanje.map((x) => (
              <li key={x.kategorija.slug} className={s.grana}>
                <Link href={`${osnova}?kategorija=${x.kategorija.slug}`} className={s.granaLink}>
                  <span className={s.granaIkona} aria-hidden="true">
                    <Ikona ime={x.kategorija.ikona} velicina={18} />
                  </span>
                  <span className={s.granaIme}>{x.kategorija.naziv}</span>
                  <span className={['broj', s.granaBroj].join(' ')}>{x.broj}</span>
                </Link>

                <span
                  className={s.traka}
                  aria-hidden="true"
                  style={{ ['--udeo' as string]: `${Math.round((x.broj / najveca) * 100)}%` }}
                />

                {x.deca.length > 0 ? (
                  <ul className={s.deca}>
                    {x.deca.map((d) => (
                      <li key={d.slug}>
                        <Link href={`${osnova}?kategorija=${d.slug}`} className="chip">
                          {d.naziv}
                          <span className="chip-brojac">{d.broj}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ── Ostali brendovi ─────────────────────────────────────── */}
      <nav className={s.ostali} aria-label="Ostali brendovi">
        <h2 className={s.podnavNaslov}>Uporedi sa drugim brendom</h2>
        <ul className={s.cipovi}>
          {sviBrendovi()
            .filter((x) => x.slug !== b.slug)
            .map((x) => (
              <li key={x.slug}>
                <Link href={`/brend/${x.slug}`} className="chip">
                  {x.naziv}
                </Link>
              </li>
            ))}
        </ul>
      </nav>
    </div>
  )
}
