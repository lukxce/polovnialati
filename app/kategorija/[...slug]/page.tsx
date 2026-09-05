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
  brojAktivnihFiltera,
  brojeviFiltera,
  filtrirajOglase,
  kategorijaBySlug,
  parseFiltere,
  putanjaKategorije,
  stabloKategorija,
  sveKategorije,
  sviBrendovi,
  type Filteri,
} from '@/lib/queries'
import type { Kategorija } from '@/lib/types'
import { SAVETI, UVODI } from './uvodi'
import s from './stranica.module.css'

type Props = {
  params: Promise<{ slug: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

type Razresena = {
  /** Kategorija na koju putanja pokazuje — nadkategorija ili list. */
  kategorija: Kategorija
  /** Nadkategorija, kada je putanja dvonivoska. */
  nad?: Kategorija
  /** Čista putanja bez upita. */
  osnova: string
}

/**
 * Prihvata tačno dva oblika: `/kategorija/<nadkategorija>` i
 * `/kategorija/<nadkategorija>/<potkategorija>`. Sve ostalo je 404 —
 * dubina i redosled segmenata moraju da odgovaraju taksonomiji, inače bi
 * ista strana bila dostupna na neograničeno mnogo putanja.
 */
function razresi(slug: string[]): Razresena | null {
  if (slug.length === 1) {
    const k = kategorijaBySlug(slug[0])
    if (!k || k.roditelj) return null
    return { kategorija: k, osnova: `/kategorija/${k.slug}` }
  }

  if (slug.length === 2) {
    const nad = kategorijaBySlug(slug[0])
    const k = kategorijaBySlug(slug[1])
    if (!nad || nad.roditelj || !k || k.roditelj !== nad.slug) return null
    return { kategorija: k, nad, osnova: `/kategorija/${nad.slug}/${k.slug}` }
  }

  return null
}

/** Sve nadkategorije i svi listovi — obe dubine se generišu unapred. */
export function generateStaticParams(): { slug: string[] }[] {
  return stabloKategorija().flatMap(({ kategorija, deca }) => [
    { slug: [kategorija.slug] },
    ...deca.map((d) => ({ slug: [kategorija.slug, d.slug] })),
  ])
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params
  const cilj = razresi(slug)
  if (!cilj) return { title: 'Kategorija nije pronađena' }

  const { kategorija, nad, osnova } = cilj
  const broj = filtrirajOglase({ kategorija: kategorija.slug }).length
  const f = parseNaKategoriju(await searchParams, cilj)
  const filtrirano = brojAktivnihFiltera(f) > 1 || !!f.sort

  const opis = nad
    ? `${brojSr(broj, ['oglas', 'oglasa', 'oglasa'])} u potkategoriji ${kategorija.naziv} (${nad.naziv}). ${SAVETI[kategorija.slug] ?? ''}`
    : `${kategorija.opis ?? ''} Trenutno ${brojSr(broj, ['oglas', 'oglasa', 'oglasa'])}, svaki sa jednom od pet ocena stanja i poznatim prodavcem.`

  return {
    title: nad ? `${kategorija.naziv}, ${nad.naziv}` : `${kategorija.naziv}, nov i polovan alat`,
    description: opis.trim(),
    // Kombinacije filtera prave beskonačan prostor URL-ova; indeksira se samo čista putanja.
    robots: filtrirano ? { index: false, follow: true } : { index: true, follow: true },
    alternates: { canonical: osnova },
    openGraph: {
      type: 'website',
      title: `${kategorija.naziv}, Alatnica`,
      description: opis.trim(),
      url: osnova,
    },
  }
}

/**
 * Filteri iz upita, ali kategorija je zaključana putanjom: prihvata se samo
 * ona ili njeno dete, da strana nikad ne prikaže sadržaj druge grane.
 */
function parseNaKategoriju(
  sp: Record<string, string | string[] | undefined>,
  cilj: Razresena,
): Filteri {
  const sirovi = parseFiltere(sp)
  const trazena = sirovi.kategorija
  const dozvoljena =
    trazena === cilj.kategorija.slug ||
    (!!trazena && kategorijaBySlug(trazena)?.roditelj === cilj.kategorija.slug)

  return { ...sirovi, kategorija: dozvoljena ? trazena : cilj.kategorija.slug }
}

export default async function KategorijaStranica({ params, searchParams }: Props) {
  const { slug } = await params
  const cilj = razresi(slug)
  if (!cilj) notFound()

  const { kategorija, nad, osnova } = cilj
  const sp = await searchParams
  const filteri = parseNaKategoriju(sp, cilj)
  const podaci = pripremiBrowse(filteri)
  const fasete = samoFasete(podaci)

  /* Brojevi za navigaciju (čipovi, brendovi) — nezavisni od korisnikovih filtera. */
  const globalni = brojeviFiltera({})
  const uKategoriji = filtrirajOglase({ kategorija: kategorija.slug })
  const ukupno = uKategoriji.length
  const cene = uKategoriji.map((o) => o.cena)
  const najniza = cene.length ? Math.min(...cene) : 0
  const najvisa = cene.length ? Math.max(...cene) : 0
  const novih = uKategoriji.filter((o) => o.stanje === 'novo').length
  const polovnih = ukupno - novih

  const potkategorije = nad
    ? []
    : sveKategorije()
        .filter((k) => k.roditelj === kategorija.slug)
        .map((k) => ({ ...k, broj: globalni.kategorija[k.slug] ?? 0 }))

  const brendoviUKategoriji = brojeviFiltera({ kategorija: kategorija.slug }).brend
  const brendovi = sviBrendovi()
    .map((b) => ({ ...b, broj: brendoviUKategoriji[b.slug] ?? 0 }))
    .filter((b) => b.broj > 0)
    .sort((a, b) => b.broj - a.broj || a.naziv.localeCompare(b.naziv, 'sr'))
    .slice(0, 8)

  const lanac = putanjaKategorije(kategorija.slug)
  const mrvice = [
    { naziv: 'Početna', href: '/' },
    { naziv: 'Oglasi', href: '/oglasi' },
    ...lanac.map((k, i) => ({
      naziv: k.naziv,
      href: i === 0 ? `/kategorija/${k.slug}` : `/kategorija/${lanac[0].slug}/${k.slug}`,
    })),
  ]

  const uvod = nad ? uvodPotkategorije(kategorija, ukupno, novih, polovnih) : (UVODI[kategorija.slug] ?? [])

  return (
    <div className={['container', s.strana].join(' ')}>
      <Breadcrumbs stavke={mrvice} className={s.mrvice} />

      <header className={s.uvod}>
        <p className="micro">
          {nad ? (
            <>
              Potkategorija ·{' '}
              <Link href={`/kategorija/${nad.slug}`} className={s.nadLink}>
                {nad.naziv}
              </Link>
            </>
          ) : (
            'Kategorija'
          )}
        </p>

        <h1 className={s.naslov}>
          <span className={s.naslovIkona} aria-hidden="true">
            <Ikona ime={kategorija.ikona} velicina={30} />
          </span>
          {kategorija.naziv}
        </h1>

        <div className={s.tekst}>
          {uvod.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>

        {ukupno > 0 ? (
          <dl className={s.cinjenice}>
            <div>
              <dt>U ponudi</dt>
              <dd className="broj">{ukupno}</dd>
            </div>
            <div>
              <dt>Novo</dt>
              <dd className="broj">{novih}</dd>
            </div>
            <div>
              <dt>Polovno</dt>
              <dd className="broj">{polovnih}</dd>
            </div>
            <div>
              <dt>Raspon cena</dt>
              <dd className="broj">
                {formatCena(najniza)} – {formatCena(najvisa)}
              </dd>
            </div>
          </dl>
        ) : null}
      </header>

      {potkategorije.length > 0 ? (
        <nav className={s.podnav} aria-label="Potkategorije">
          <h2 className={s.podnavNaslov}>
            {potkategorije.length}{' '}
            {pluralSr(potkategorije.length, ['potkategorija', 'potkategorije', 'potkategorija'])}
          </h2>
          <ul className={s.cipovi}>
            {potkategorije.map((k) => (
              <li key={k.slug}>
                <Link href={`/kategorija/${kategorija.slug}/${k.slug}`} className="chip">
                  <Ikona ime={k.ikona} velicina={16} />
                  {k.naziv}
                  <span className="chip-brojac">{k.broj}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      {brendovi.length > 0 ? (
        <nav className={s.podnav} aria-label="Brendovi u ovoj kategoriji">
          <h2 className={s.podnavNaslov}>Brendovi ovde</h2>
          <ul className={s.cipovi}>
            {brendovi.map((b) => (
              <li key={b.slug}>
                <Link href={`${osnova}?brend=${b.slug}`} className="chip">
                  {b.naziv}
                  <span className="chip-brojac">{b.broj}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link href="/oglasi" className={['chip', s.cipTih].join(' ')}>
                Svi brendovi
                <Ikona ime="strelica" velicina={15} />
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}

      <BrowseLayout
        filteri={filteri}
        fasete={fasete}
        osnova={osnova}
        zakljucanaKategorija={kategorija.slug}
      >
        {podaci.ukupno === 0 ? (
          <PraznoRezultati
            filteri={filteri}
            fasete={fasete}
            osnova={osnova}
            zakljucanaKategorija={kategorija.slug}
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
    </div>
  )
}

/**
 * Potkategorije dobijaju lakši obrazac: jedna rečenica izvedena iz stvarnih
 * brojeva + konkretan savet iz `SAVETI`. Bez toga bi četrdeset listova imalo
 * isti generički tekst, što ne pomaže ni kupcu ni pretrazi.
 */
function uvodPotkategorije(
  kategorija: Kategorija,
  ukupno: number,
  novih: number,
  polovnih: number,
): string[] {
  const savet = SAVETI[kategorija.slug]

  if (ukupno === 0) {
    return [
      `U potkategoriji ${kategorija.naziv} trenutno nema nijednog aktivnog oglasa. Dešava se, jer se ovde alat proda brzo.`,
      savet ?? '',
    ].filter(Boolean)
  }

  const podela =
    novih > 0 && polovnih > 0
      ? `${novih} ${pluralSr(novih, ['nov', 'nova', 'novih'])} i ${polovnih} ${pluralSr(polovnih, ['polovan', 'polovna', 'polovnih'])}`
      : novih > 0
        ? 'sve novo, neotpakovano'
        : 'sve polovno, sa ocenjenim stanjem'

  return [
    `${brojSr(ukupno, ['oglas', 'oglasa', 'oglasa'])} u potkategoriji ${kategorija.naziv}: ${podela}. Ocena stanja stoji na svakoj kartici, sa istom definicijom za sve prodavce.`,
    savet ?? '',
  ].filter(Boolean)
}
