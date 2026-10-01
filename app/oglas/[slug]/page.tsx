import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Breadcrumbs, { type Mrvica } from '@/components/Breadcrumbs'
import { Ikona } from '@/components/Ikone'
import OglasKartica from '@/components/OglasKartica'
import ProdavacOznaka from '@/components/ProdavacOznaka'
import Sekcija from '@/components/Sekcija'
import StanjeChip from '@/components/StanjeChip'
import Galerija from '@/components/oglas/Galerija'
import KontaktAkcije from '@/components/oglas/KontaktAkcije'
import PrijaviOglas from '@/components/oglas/PrijaviOglas'
import {
  brojSr,
  dostavaLabela,
  formatCena,
  formatDatum,
  garancijaLabela,
  putanjeSlika,
  relativnoVreme,
  stanjeDefinicija,
  stanjeLabela,
} from '@/lib/format'
import {
  brendBySlug,
  kategorijaBySlug,
  oglasBySlug,
  prodavacBySlug,
  putanjaKategorije,
  sliniOglasi,
} from '@/lib/queries'
import { apsolutno } from '@/lib/site'
import type { Oglas, Stanje } from '@/lib/types'
import s from './stranica.module.css'

type Props = { params: Promise<{ slug: string }> }

/**
 * Ništa se ne prerenderuje pri build-u: svaki oglas se renderuje pri prvoj
 * poseti i zatim služi iz keša (ISR) dok se katalog ne promeni — vidi
 * KATALOG_TAG u lib/queries.ts. Sve što zavisi od posetioca (da li je
 * vlasnik, da li je prijavljen) radi se u pregledaču, u KontaktAkcije.
 */
export async function generateStaticParams() {
  return []
}

/** Schema.org OfferItemCondition po našoj petostepenoj skali. */
const SCHEMA_STANJE: Record<Stanje, string> = {
  novo: 'https://schema.org/NewCondition',
  'kao-novo': 'https://schema.org/UsedCondition',
  'koristeno-ispravno': 'https://schema.org/UsedCondition',
  'vidljivo-koristeno': 'https://schema.org/UsedCondition',
  'za-delove': 'https://schema.org/DamagedCondition',
}

function paragrafi(tekst: string): string[] {
  return tekst
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
}

function slikeOglasa(oglas: Oglas): string[] {
  const iz = oglas.slike?.length ? oglas.slike : putanjeSlika(oglas.kategorija, oglas.brend)
  return [...new Set(iz)]
}

/** Samo prave fotografije idu u OG/JSON-LD — mreže ne prikazuju SVG ilustracije. */
function fotografije(oglas: Oglas): string[] {
  return oglas.slike.filter((u) => !u.endsWith('.svg')).map(apsolutno)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const oglas = await oglasBySlug(slug)
  if (!oglas) return { title: 'Oglas nije pronađen' }

  const brend = brendBySlug(oglas.brend)?.naziv ?? oglas.brend
  const cena = oglas.cenaDogovor
    ? `${formatCena(oglas.cena)} (dogovor)`
    : formatCena(oglas.cena)

  return {
    title: `${oglas.naslov}, ${cena}`,
    description: `${brend} ${oglas.model}, ${cena}, ocena stanja: ${stanjeLabela(
      oglas.stanje,
    ).toLowerCase()}, ${stanjeDefinicija(oglas.stanje).toLowerCase()}. ${
      oglas.lokacija
    }, ${garancijaLabela(oglas.garancija).toLowerCase()}. Puna lista specifikacija i prodavčeva provera stanja.`,
    alternates: { canonical: `/oglas/${oglas.slug}` },
    openGraph: {
      type: 'website',
      title: `${oglas.naslov}, ${cena}`,
      description: `${stanjeLabela(oglas.stanje)} · ${oglas.lokacija} · ${brend} ${oglas.model}`,
      url: apsolutno(`/oglas/${oglas.slug}`),
      ...(fotografije(oglas).length ? { images: fotografije(oglas).slice(0, 4) } : {}),
    },
  }
}

export default async function OglasStranica({ params }: Props) {
  const { slug } = await params
  const oglas = await oglasBySlug(slug)
  if (!oglas) notFound()

  const brend = brendBySlug(oglas.brend)
  const brendNaziv = brend?.naziv ?? oglas.brend
  const kategorija = kategorijaBySlug(oglas.kategorija)
  const lanac = putanjaKategorije(oglas.kategorija)
  const [prodavac, slicni] = await Promise.all([
    prodavacBySlug(oglas.prodavacId),
    sliniOglasi(oglas, 4),
  ])
  const brojOglasaProdavca = prodavac?.brojOglasa ?? 0
  const slike = slikeOglasa(oglas)
  const praveFotografije = oglas.slike.length > 0 && !oglas.slike[0].endsWith('.svg')

  const checklist = oglas.stanjeChecklist ?? []
  const potvrdjeno = checklist.filter((c) => c.ok).length
  const zamerke = checklist.length - potvrdjeno
  const snizenje =
    oglas.staraCena && oglas.staraCena > oglas.cena
      ? Math.round((1 - oglas.cena / oglas.staraCena) * 100)
      : 0

  const mrvice: Mrvica[] = [
    { naziv: 'Početna', href: '/' },
    { naziv: 'Oglasi', href: '/oglasi' },
    ...lanac.map((k, i) => ({
      naziv: k.naziv,
      href: `/kategorija/${lanac
        .slice(0, i + 1)
        .map((x) => x.slug)
        .join('/')}`,
    })),
    { naziv: brendNaziv, href: `/brend/${oglas.brend}` },
    { naziv: oglas.model },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: oglas.naslov,
    description: paragrafi(oglas.opis)[0] ?? oglas.naslov,
    sku: oglas.id,
    model: oglas.model,
    category: kategorija?.naziv ?? oglas.kategorija,
    brand: { '@type': 'Brand', name: brendNaziv },
    ...(fotografije(oglas).length ? { image: fotografije(oglas) } : {}),
    itemCondition: SCHEMA_STANJE[oglas.stanje],
    offers: {
      '@type': 'Offer',
      url: apsolutno(`/oglas/${oglas.slug}`),
      price: oglas.cena,
      priceCurrency: 'RSD',
      availability: 'https://schema.org/InStock',
      itemCondition: SCHEMA_STANJE[oglas.stanje],
      availableAtOrFrom: { '@type': 'Place', name: oglas.lokacija },
      ...(prodavac
        ? {
            seller: {
              '@type': prodavac.tip === 'privatno-lice' ? 'Person' : 'Organization',
              name: prodavac.naziv,
            },
          }
        : {}),
      ...(oglas.garancija
        ? {
            warranty: {
              '@type': 'WarrantyPromise',
              durationOfWarranty: {
                '@type': 'QuantitativeValue',
                value: oglas.garancija,
                unitCode: 'MON',
              },
            },
          }
        : {}),
    },
  }

  return (
    <div className={['container', s.strana].join(' ')}>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs stavke={mrvice} className={s.mrvice} />

      {/* 1 — zaglavlje: šta je, čije je, otkad stoji */}
      <header className={s.zaglavlje}>
        <p className={s.brendRed}>
          <Link href={`/brend/${oglas.brend}`} className={s.brendLink}>
            {brendNaziv}
          </Link>
          <span aria-hidden="true">·</span>
          <span className={s.model}>{oglas.model}</span>
          {oglas.godiste ? (
            <>
              <span aria-hidden="true">·</span>
              <span className="tabular">godište {oglas.godiste}</span>
            </>
          ) : null}
        </p>

        <h1 className={s.naslov}>{oglas.naslov}</h1>

        <div className={s.meta}>
          <span className={s.metaStavka}>
            <Ikona ime="lokacija" velicina={15} />
            {oglas.lokacija}
          </span>
          <span className={s.metaStavka}>
            <Ikona ime="sat" velicina={15} />
            <time dateTime={oglas.objavljeno}>{relativnoVreme(oglas.objavljeno)}</time>
          </span>
          <span className={[s.metaStavka, 'tabular'].join(' ')}>
            <Ikona ime="oko" velicina={15} />
            {brojSr(oglas.pregleda, ['pregled', 'pregleda', 'pregleda'])}
          </span>
          {oglas.provereno ? (
            <span className="oznaka oznaka-provereno">
              <Ikona ime="cek" velicina={13} />
              Provereno
            </span>
          ) : null}
          {oglas.istaknuto ? <span className="oznaka oznaka-istaknuto">Izdvojeno</span> : null}
        </div>
      </header>

      <div className={s.raspored}>
        {/* 2 — galerija */}
        <div className={s.galerija}>
          <Galerija
            slike={slike}
            alt={praveFotografije ? `${oglas.naslov}, fotografija` : `${oglas.naslov}, ilustracija kategorije`}
          />
        </div>

        <div className={s.bocna}>
          {/* 3 — cena i ocena stanja, 4 — akcije */}
          <div className={['card', 'card-static', s.cenaBlok].join(' ')}>
            <p className="micro">Cena</p>

            <div className={s.cenaRed}>
              <span className="cena-velika">{formatCena(oglas.cena)}</span>
              {oglas.cenaDogovor ? <span className={s.dogovor}>Dogovor</span> : null}
            </div>

            {snizenje > 0 && oglas.staraCena ? (
              <p className={s.snizenje}>
                <span className="stara-cena">{formatCena(oglas.staraCena)}</span>
                <span className="oznaka oznaka-snizeno">−{snizenje}%</span>
              </p>
            ) : null}

            <div className={s.stanjeRed}>
              <StanjeChip stanje={oglas.stanje} veliki />
              <p className={s.stanjeDef}>{stanjeDefinicija(oglas.stanje)}</p>
            </div>

            <dl className={s.podaci}>
              <div className={s.podatak}>
                <dt>Garancija</dt>
                <dd>{garancijaLabela(oglas.garancija)}</dd>
              </div>
              <div className={s.podatak}>
                <dt>Objavljeno</dt>
                <dd>
                  <time dateTime={oglas.objavljeno}>{formatDatum(oglas.objavljeno)}</time>
                </dd>
              </div>
              <div className={s.podatak}>
                {/* Bez `.tabular`: u UI fontu `tnum` razvuče tačku hiljada u
                    širinu cifre, pa usamljen broj izgleda prelomljeno. */}
                <dt>Pregleda</dt>
                <dd>{String(oglas.pregleda).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</dd>
              </div>
              <div className={s.podatak}>
                <dt>Preuzimanje</dt>
                <dd>{oglas.dostava.map((d) => dostavaLabela(d)).join(' · ')}</dd>
              </div>
            </dl>

            <KontaktAkcije
              oglasId={oglas.id}
              slug={oglas.slug}
              naslov={oglas.naslov}
              vlasnikId={oglas.vlasnikId}
              prodavacNaziv={prodavac?.naziv ?? 'Prodavac'}
              imaTelefon={prodavac?.imaTelefon ?? false}
              odgovaraZa={prodavac?.odgovaraZa}
            />
          </div>

          {/* 9 — prodavac */}
          {prodavac ? (
            <section className={['card', 'card-static', s.prodavac].join(' ')} aria-labelledby="prodavac-naslov">
              <p className="micro">Prodavac</p>

              <h2 id="prodavac-naslov" className={s.prodavacIme}>
                <Link href={`/prodavac/${prodavac.slug}`}>{prodavac.naziv}</Link>
              </h2>

              <div className={s.prodavacRed}>
                <ProdavacOznaka tip={prodavac.tip} velicina="srednje" />
                {prodavac.ocena !== undefined && prodavac.brojOcena > 0 ? (
                  <span className={s.ocena}>
                    <Ikona ime="zvezda" velicina={15} />
                    <strong>{prodavac.ocena.toFixed(1).replace('.', ',')}</strong>
                    <span className="muted tabular">
                      ({brojSr(prodavac.brojOcena, ['ocena', 'ocene', 'ocena'])})
                    </span>
                  </span>
                ) : null}
              </div>

              {prodavac.opis ? <p className={s.prodavacOpis}>{prodavac.opis}</p> : null}

              <dl className={s.podaci}>
                <div className={s.podatak}>
                  <dt>Član od</dt>
                  <dd>{formatDatum(prodavac.clanOd)}</dd>
                </div>
                {prodavac.odgovaraZa ? (
                  <div className={s.podatak}>
                    <dt>Odgovara</dt>
                    <dd>{prodavac.odgovaraZa}</dd>
                  </div>
                ) : null}
                <div className={s.podatak}>
                  <dt>Sedište</dt>
                  <dd>{prodavac.grad}</dd>
                </div>
                <div className={s.podatak}>
                  <dt>Aktivnih oglasa</dt>
                  <dd className="tabular">{brojOglasaProdavca}</dd>
                </div>
              </dl>

              {prodavac.verifikovan || prodavac.oznake.length ? (
                <ul className={s.oznake}>
                  {prodavac.verifikovan ? (
                    <li className="oznaka oznaka-provereno">
                      <Ikona ime="cek" velicina={13} />
                      Verifikovan nalog
                    </li>
                  ) : null}
                  {prodavac.oznake.map((o) => (
                    <li key={o} className="oznaka">
                      {o}
                    </li>
                  ))}
                </ul>
              ) : null}

              <Link href={`/prodavac/${prodavac.slug}`} className="btn btn-tertiary btn-puni">
                Svi oglasi ({brojOglasaProdavca})
              </Link>
            </section>
          ) : null}
        </div>

        <div className={s.detalji}>
          {/* 5 — specifikacije */}
          <section className={s.sekcija} aria-labelledby="specifikacije">
            <h2 id="specifikacije" className={s.h2}>
              Specifikacije
            </h2>

            <div className={s.tabela}>
              <table>
                <caption className="sr-only">
                  Tehničke specifikacije za {oglas.naslov}
                </caption>
                <tbody>
                  <tr>
                    <th scope="row">Brend</th>
                    <td>
                      <Link href={`/brend/${oglas.brend}`}>{brendNaziv}</Link>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Model</th>
                    <td>{oglas.model}</td>
                  </tr>
                  <tr>
                    <th scope="row">Kategorija</th>
                    <td>
                      {kategorija ? (
                        <Link
                          href={`/kategorija/${lanac.map((x) => x.slug).join('/')}`}
                        >
                          {kategorija.naziv}
                        </Link>
                      ) : (
                        oglas.kategorija
                      )}
                    </td>
                  </tr>
                  {oglas.akuSistem ? (
                    <tr>
                      <th scope="row">Akumulatorski sistem</th>
                      <td>
                        <Link href={`/oglasi?aku=${encodeURIComponent(oglas.akuSistem)}`}>
                          {oglas.akuSistem}
                        </Link>
                      </td>
                    </tr>
                  ) : null}
                  {oglas.godiste ? (
                    <tr>
                      <th scope="row">Godište</th>
                      <td className="tabular">{oglas.godiste}</td>
                    </tr>
                  ) : null}
                  {oglas.satiRada !== undefined ? (
                    <tr>
                      <th scope="row">Sati rada</th>
                      <td>{brojSr(oglas.satiRada, ['sat', 'sata', 'sati'])}</td>
                    </tr>
                  ) : null}
                  {oglas.specifikacije.map((spec) => (
                    <tr key={spec.naziv}>
                      <th scope="row">{spec.naziv}</th>
                      <td>{spec.vrednost}</td>
                    </tr>
                  ))}
                  <tr>
                    <th scope="row">Garancija</th>
                    <td>{garancijaLabela(oglas.garancija)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 6 — opis */}
          <section className={s.sekcija} aria-labelledby="opis">
            <h2 id="opis" className={s.h2}>
              Opis prodavca
            </h2>
            <div className={s.opis}>
              {paragrafi(oglas.opis).map((p, i) => (
                <p key={`${i}-${p.slice(0, 24)}`}>{p}</p>
              ))}
            </div>
          </section>

          {/* 7 — u pakovanju */}
          {oglas.uPakovanju.length ? (
            <section className={s.sekcija} aria-labelledby="u-pakovanju">
              <h2 id="u-pakovanju" className={s.h2}>
                U pakovanju
              </h2>
              <p className={s.uvodSekcije}>
                Ono što prodavac isporučuje uz mašinu. Sve što nije na spisku, nije uključeno.
              </p>
              <ul className={s.pakovanje}>
                {oglas.uPakovanju.map((stavka) => (
                  <li key={stavka}>
                    <span className={s.cek} aria-hidden="true">
                      <Ikona ime="cek" velicina={14} />
                    </span>
                    {stavka}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* 8 — stanje: razlog zbog kog Alatnica postoji */}
          <section className={s.stanjeSekcija} aria-labelledby="stanje">
            <div className={s.stanjeZaglavlje}>
              <p className="micro">Provera stanja</p>
              <h2 id="stanje" className={s.h2}>
                Stanje: {stanjeLabela(oglas.stanje).toLowerCase()}
              </h2>
              <p className={s.stanjeUvod}>
                {stanjeDefinicija(oglas.stanje)}. Ocena nije slobodan tekst. Pet ocena ima
                objavljenu definiciju koja važi za sve prodavce, a uz nju ide i lista stavki koju je
                prodavac morao da popuni pre objave.
              </p>
            </div>

            {checklist.length ? (
              <>
                <div className={s.rezime}>
                  <p className={s.rezimeBroj}>
                    <span className="cena-velika tabular">{potvrdjeno}</span>
                    <span className={s.rezimeOd}>od {checklist.length}</span>
                  </p>
                  <p className={s.rezimeTekst}>
                    {zamerke === 0
                      ? 'stavki je prodavac označio kao ispravne, bez ijedne zamerke.'
                      : `stavki je označeno kao ispravno. ${brojSr(zamerke, [
                          'stavka',
                          'stavke',
                          'stavki',
                        ])} ${zamerke === 1 ? 'je označena' : 'su označene'} kao nedostatak i ${
                          zamerke === 1 ? 'stoji' : 'stoje'
                        } u listi ispod.`}
                  </p>
                </div>

                <ul className={s.checklist}>
                  {checklist.map((c) => (
                    <li key={c.stavka} className={c.ok ? s.stavkaOk : s.stavkaNe}>
                      <span className={s.znak} aria-hidden="true">
                        <Ikona ime={c.ok ? 'cek' : 'x'} velicina={16} />
                      </span>
                      <span className={s.stavkaIme}>{c.stavka}</span>
                      <span className={s.stavkaStatus}>{c.ok ? 'Ispravno' : 'Nedostatak'}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className={s.rezime}>
                <p className={s.rezimeTekst}>
                  Za neotpakovanu robu lista provere se ne popunjava: mašina je nova, u
                  originalnom pakovanju, sa računom i punom garancijom proizvođača. Listu provere
                  nose svi oglasi koji nisu ocenjeni kao <strong>novo</strong>.
                </p>
              </div>
            )}

            <p className={s.stanjeFus}>
              Sve četiri ocene korišćene robe i njihove definicije stoje na{' '}
              <Link href="/kako-radi#ocene-stanja">stranici Kako radi</Link>. Ako se stanje na
              licu mesta ne poklapa sa ocenom, prijavi oglas: pregledamo ga i prodavac mora da
              ispravi ocenu ili oglas skidamo.
            </p>
            <PrijaviOglas oglasId={oglas.id} />
          </section>
        </div>
      </div>

      {/* 10 — sigurna kupovina */}
      <section className={['tamni-panel', s.sigurnost].join(' ')} aria-labelledby="sigurnost">
        <div className={s.sigurnostZaglavlje}>
          <p className="micro">Sigurna kupovina</p>
          <h2 id="sigurnost" className={s.h2}>
            Četiri pravila koja rešavaju skoro sve
          </h2>
        </div>

        <ol className={s.pravila}>
          <li>
            <span className={s.pravilobroj} aria-hidden="true">
              1
            </span>
            <h3 className={s.pravilonaslov}>Gledaj uživo</h3>
            <p>
              Dogovori preuzimanje na javnom mestu ili u radionici prodavca, danju. Servis i
              prodavnica imaju adresu. Traži da se nađete tamo, a ne na parkingu.
            </p>
          </li>
          <li>
            <span className={s.pravilobroj} aria-hidden="true">
              2
            </span>
            <h3 className={s.pravilonaslov}>Probaj pod opterećenjem</h3>
            <p>
              Mašina koja se samo uključi ništa ne dokazuje. Buši u beton, seci komad daske,
              zategni vijak: greje li se, cvili li ležaj, pada li broj obrtaja.
            </p>
          </li>
          <li>
            <span className={s.pravilobroj} aria-hidden="true">
              3
            </span>
            <h3 className={s.pravilonaslov}>Proveri broj na pločici</h3>
            <p>
              Serijski broj sa pločice mora da se poklopi sa računom ili servisnim nalogom.
              Izbrušena, prefarbana ili nečitka pločica je razlog da odustaneš.
            </p>
          </li>
          <li>
            <span className={s.pravilobroj} aria-hidden="true">
              4
            </span>
            <h3 className={s.pravilonaslov}>Ne plaćaj unapred</h3>
            <p>
              Nepoznatom prodavcu se ne šalje kapara, uplatnica ni „rezervacija“. Plati kad alat
              držiš u ruci, ili preko pouzeća sa pravom otvaranja pošiljke.
            </p>
          </li>
        </ol>

        <p className={s.sigurnostFus}>
          Detaljno o proveri polovnog alata piše u vodiču{' '}
          <Link href="/vodici/polovan-alat-na-sta-obratiti-paznju">
            polovan alat: na šta obratiti pažnju
          </Link>
          .
        </p>
      </section>

      {/* 11 — slični oglasi */}
      {slicni.length ? (
        <Sekcija
          nadnaslov="Slično"
          naslov="Slični oglasi"
          opis="Ista kategorija, cena u sličnom rangu."
          akcijaHref={`/oglasi?kategorija=${oglas.kategorija}`}
          akcijaTekst="Cela kategorija"
        >
          <ul className="mreza">
            {slicni.map((o) => (
              <li key={o.id} className={s.stavkaMreze}>
                <OglasKartica oglas={o} kompaktno />
              </li>
            ))}
          </ul>
        </Sekcija>
      ) : null}
    </div>
  )
}
