import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Ikona } from '@/components/Ikone'
import OglasKartica from '@/components/OglasKartica'
import Prazno from '@/components/Prazno'
import ProdavacOznaka from '@/components/ProdavacOznaka'
import Sekcija from '@/components/Sekcija'
import OglasiProdavca, {
  type Opcija,
  type StavkaOglasa,
} from '@/components/prodavac/OglasiProdavca'
import { brojSr, stanjeLabela, tipProdavcaLabela, tipProdavcaMnozina } from '@/lib/format'
import { kategorijaBySlug, oglasiProdavca, prodavacBySlug } from '@/lib/queries'
import type { Stanje, TipProdavca } from '@/lib/types'
import s from './stranica.module.css'

type Props = { params: Promise<{ slug: string }> }

/** Profili se renderuju pri prvoj poseti i keširaju (ISR), kao i oglasi. */
export async function generateStaticParams() {
  return []
}

/**
 * „Član od **marta** 2021." — genitiv, a ne nominativ iz `formatDatum`.
 * „Član od mart 2021." nije srpski.
 */
const MESECI_GENITIV = [
  'januara',
  'februara',
  'marta',
  'aprila',
  'maja',
  'juna',
  'jula',
  'avgusta',
  'septembra',
  'oktobra',
  'novembra',
  'decembra',
]

function mesecIGodina(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${MESECI_GENITIV[d.getUTCMonth()]} ${d.getUTCFullYear()}.`
}

const OPIS_TIPA: Record<TipProdavca, string> = {
  'privatno-lice': 'Privatno lice: prodaje sopstveni alat, bez firme i bez računa.',
  prodavnica: 'Prodavnica: registrovana firma sa fiskalnim računom i garancijom proizvođača.',
  servis: 'Servis: popravlja alat i prodaje mašine kroz koje je prošao radioničarski.',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const prodavac = await prodavacBySlug(slug)
  if (!prodavac) return { title: 'Prodavac nije pronađen' }

  const oglasi = await oglasiProdavca(slug)
  const naslov = `${prodavac.naziv}, ${tipProdavcaLabela(prodavac.tip)}, ${prodavac.grad}`

  return {
    title: naslov,
    description: `${prodavac.naziv}: ${brojSr(oglasi.length, [
      'aktivan oglas',
      'aktivna oglasa',
      'aktivnih oglasa',
    ])} za alat u gradu ${prodavac.grad}. ${tipProdavcaLabela(prodavac.tip)}, na Alatnici od ${mesecIGodina(prodavac.clanOd)}`,
    alternates: { canonical: `/prodavac/${slug}` },
    openGraph: {
      type: 'profile',
      title: naslov,
      description: prodavac.opis ?? `Oglasi prodavca ${prodavac.naziv} na Alatnici.`,
    },
  }
}

export default async function ProdavacStranica({ params }: Props) {
  const { slug } = await params
  const prodavac = await prodavacBySlug(slug)
  if (!prodavac) notFound()

  const oglasi = await oglasiProdavca(slug)

  /* Kartice se renderuju na serveru i prosleđuju klijentskom filteru kao
     gotovi čvorovi — katalog oglasa nikad ne ulazi u bundle pregledača. */
  const stavke: StavkaOglasa[] = oglasi.map((o) => ({
    id: o.id,
    kategorija: o.kategorija,
    stanje: o.stanje,
    kartica: <OglasKartica oglas={o} kompaktno />,
  }))

  const brojPoKategoriji = new Map<string, number>()
  for (const o of oglasi) {
    brojPoKategoriji.set(o.kategorija, (brojPoKategoriji.get(o.kategorija) ?? 0) + 1)
  }
  const kategorijeOpcije: Opcija[] = [...brojPoKategoriji.entries()]
    .map(([vrednost, broj]) => ({
      vrednost,
      naziv: kategorijaBySlug(vrednost)?.naziv ?? vrednost,
      broj,
    }))
    .sort((a, b) => b.broj - a.broj || a.naziv.localeCompare(b.naziv, 'sr'))

  const brojPoStanju = new Map<Stanje, number>()
  for (const o of oglasi) brojPoStanju.set(o.stanje, (brojPoStanju.get(o.stanje) ?? 0) + 1)
  const REDOSLED: Stanje[] = [
    'novo',
    'kao-novo',
    'koristeno-ispravno',
    'vidljivo-koristeno',
    'za-delove',
  ]
  const stanjaOpcije: Opcija[] = REDOSLED.filter((st) => brojPoStanju.has(st)).map((st) => ({
    vrednost: st,
    naziv: stanjeLabela(st),
    broj: brojPoStanju.get(st) ?? 0,
  }))

  const oznake = [
    ...(prodavac.verifikovan ? ['Identitet verifikovan'] : []),
    ...prodavac.oznake,
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': prodavac.tip === 'privatno-lice' ? 'Person' : 'LocalBusiness',
    name: prodavac.naziv,
    address: { '@type': 'PostalAddress', addressLocality: prodavac.grad, addressCountry: 'RS' },
    ...(prodavac.ocena !== undefined && prodavac.brojOcena > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: prodavac.ocena,
            reviewCount: prodavac.brojOcena,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  }

  return (
    <div className={['container', s.strana].join(' ')}>
      <Breadcrumbs
        stavke={[
          { naziv: 'Početna', href: '/' },
          { naziv: 'Oglasi', href: '/oglasi' },
          { naziv: prodavac.naziv },
        ]}
        className={s.mrvice}
      />

      {/* ── Zaglavlje prodavnice ─────────────────────────────────── */}
      <header className={s.zaglavlje}>
        <div className={s.identitet}>
          <span className={[s.grb, s[prodavac.tip]].join(' ')} aria-hidden="true">
            <Ikona
              ime={
                prodavac.tip === 'prodavnica'
                  ? 'prodavnica'
                  : prodavac.tip === 'servis'
                    ? 'kljuc'
                    : 'osoba'
              }
              velicina={30}
            />
          </span>

          <div className={s.identitetTekst}>
            <h1 className={s.naslov}>{prodavac.naziv}</h1>
            <div className={s.podnaslov}>
              <ProdavacOznaka tip={prodavac.tip} velicina="srednje" />
              <span className={s.tacka} aria-hidden="true">
                ·
              </span>
              <span className={s.grad}>
                <Ikona ime="lokacija" velicina={16} />
                {prodavac.grad}
              </span>
              <span className={s.tacka} aria-hidden="true">
                ·
              </span>
              <span className={s.clanOd}>Član od {mesecIGodina(prodavac.clanOd)}</span>
            </div>
          </div>
        </div>

        {oznake.length > 0 ? (
          <ul className={s.oznake}>
            {oznake.map((o) => (
              <li key={o} className={s.oznakaStavka}>
                <span
                  className={['oznaka', o === 'Identitet verifikovan' ? 'oznaka-provereno' : '']
                    .filter(Boolean)
                    .join(' ')}
                >
                  <Ikona ime="cek" velicina={13} />
                  {o}
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        <dl className={s.brojke}>
          <div className={s.brojkaStavka}>
            <dt>Aktivnih oglasa</dt>
            <dd className={s.brojkaVrednost}>{oglasi.length}</dd>
          </div>
          {prodavac.odgovaraZa ? (
            <div className={s.brojkaStavka}>
              <dt>Odgovara</dt>
              <dd className={s.brojkaTekst}>
                <Ikona ime="sat" velicina={16} />
                {prodavac.odgovaraZa}
              </dd>
            </div>
          ) : null}
          <div className={s.brojkaStavka}>
            <dt>Tip naloga</dt>
            <dd className={s.brojkaTekst}>{tipProdavcaLabela(prodavac.tip)}</dd>
          </div>
        </dl>
      </header>

      <div className={s.raspored}>
        <div className={s.glavno}>
          {prodavac.opis ? (
            <section className={s.oProdavcu} aria-labelledby="o-prodavcu">
              <h2 id="o-prodavcu" className={s.podnaslovSekcije}>
                O prodavcu
              </h2>
              <p className={s.opis}>{prodavac.opis}</p>
              <p className={s.opisTip}>{OPIS_TIPA[prodavac.tip]}</p>
            </section>
          ) : null}

          <Sekcija
            nadnaslov="Ponuda"
            naslov={`Oglasi prodavca ${prodavac.naziv}`}
            opis={
              oglasi.length > 0
                ? `${brojSr(oglasi.length, [
                    'aktivan oglas',
                    'aktivna oglasa',
                    'aktivnih oglasa',
                  ])} u ponudi. Filtriraj po kategoriji i oceni stanja.`
                : undefined
            }
          >
            {oglasi.length === 0 ? (
              <Prazno
                ikona="alat"
                naslov="Trenutno nema aktivnih oglasa"
                opis={`${prodavac.naziv} nema nijedan oglas u ovom trenutku. Nalog je aktivan od ${mesecIGodina(
                  prodavac.clanOd,
                )}, pa se ponuda može vratiti. U međuvremenu potraži isti alat kod drugih prodavaca.`}
                predlozi={[
                  { tekst: `Sav alat u gradu ${prodavac.grad}`, href: `/oglasi?grad=${encodeURIComponent(prodavac.grad)}` },
                  { tekst: `Svi ${tipProdavcaLabela(prodavac.tip).toLowerCase()} nalozi`, href: `/oglasi?tip=${prodavac.tip}` },
                ]}
                akcijaHref="/oglasi"
                akcijaTekst="Pogledaj sve oglase"
              />
            ) : (
              <OglasiProdavca stavke={stavke} kategorije={kategorijeOpcije} stanja={stanjaOpcije} />
            )}
          </Sekcija>
        </div>

        <aside className={s.bocno} aria-label="Ocena i provera prodavca">
          <section className={s.provera} aria-labelledby="kako-se-proverava">
            <p className="micro">Iskreno o proveri</p>
            <h2 id="kako-se-proverava" className={s.proveraNaslov}>
              Kako se prodavac proverava
            </h2>

            <ul className={s.proveraLista}>
              <li>
                <strong>Verifikovan nalog.</strong> Oznaku dodeljuje tim Alatnice ručno, posle
                provere podataka naloga. Prodavac je ne može sam sebi dodeliti.
              </li>
              <li>
                <strong>Istorija naloga.</strong> Datum otvaranja i broj aktivnih oglasa ne unosi
                prodavac, nego ih računa sajt.
              </li>
              <li>
                <strong>Prijave.</strong> Svaki oglas može da se prijavi sa svoje stranice. Prodavac
                čiji oglasi ne odgovaraju stvarnosti gubi nalog.
              </li>
            </ul>

            <p className={s.proveraGranica}>
              <strong>Šta ovo ne znači.</strong> Verifikacija govori da nalog pripada onome ko
              tvrdi da mu pripada. Ne govori ništa o konkretnoj mašini. Alatnica nije videla alat
              iz ovog oglasa, ne garantuje da je ispravan i ne posreduje u plaćanju. Lista provere
              u oglasu je izjava prodavca, ne nalaz servisa.
            </p>

            <p className={s.proveraSavet}>
              Zato i dalje važi ono osnovno: mašinu probaj pod opterećenjem pre plaćanja, traži
              fotografiju natpisne pločice i ne šalji kaparu unapred.
            </p>

            <Link href="/kako-radi" className={s.proveraLink}>
              Kako Alatnica radi
              <Ikona ime="strelica" velicina={16} />
            </Link>
          </section>

          <div className={s.veze}>
            <Link
              href={`/oglasi?grad=${encodeURIComponent(prodavac.grad)}`}
              className="btn btn-tertiary btn-puni"
            >
              Sav alat u gradu {prodavac.grad}
            </Link>
            <Link href={`/oglasi?tip=${prodavac.tip}`} className="btn btn-tertiary btn-puni">
              Svi oglasi {tipProdavcaMnozina(prodavac.tip)}
            </Link>
          </div>
        </aside>
      </div>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  )
}
