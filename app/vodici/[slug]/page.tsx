import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Ikona } from '@/components/Ikone'
import Blokovi from '@/components/vodici/Blokovi'
import Sadrzaj from '@/components/vodici/Sadrzaj'
import { bezLinkova } from '@/components/vodici/Tekst'
import VodicKartica from '@/components/vodici/VodicKartica'
import { formatDatum } from '@/lib/format'
import { ostaliVodici, sadrzaj, sviVodici, vodicBySlug, vremeCitanja } from '@/lib/vodici'
import s from './clanak.module.css'
import { SITE_URL } from '@/lib/site'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return sviVodici().map((v) => ({ slug: v.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const vodic = vodicBySlug(slug)
  if (!vodic) return { title: 'Vodič nije pronađen' }

  return {
    title: vodic.naslov,
    description: vodic.opis,
    alternates: { canonical: `/vodici/${vodic.slug}` },
    openGraph: {
      type: 'article',
      title: `${vodic.naslov} · Polovni alati`,
      description: vodic.opis,
      url: `/vodici/${vodic.slug}`,
      publishedTime: vodic.datum,
    },
  }
}

export default async function VodicStranica({ params }: Props) {
  const { slug } = await params
  const vodic = vodicBySlug(slug)
  if (!vodic) notFound()

  const stavkeSadrzaja = sadrzaj(vodic)
  const ostali = ostaliVodici(vodic.slug)
  const minuta = vremeCitanja(vodic)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: vodic.naslov,
    description: vodic.opis,
    datePublished: vodic.datum,
    dateModified: vodic.datum,
    inLanguage: 'sr-Latn-RS',
    articleSection: vodic.tema,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/vodici/${vodic.slug}`,
    },
    author: { '@type': 'Organization', name: 'Polovni alati' },
    publisher: { '@type': 'Organization', name: 'Polovni alati' },
    articleBody: vodic.blokovi
      .map((b) => {
        switch (b.tip) {
          case 'p':
          case 'h2':
          case 'h3':
            return bezLinkova(b.tekst)
          case 'lista':
          case 'koraci':
            return b.stavke.map(bezLinkova).join(' ')
          case 'tabela':
            return b.redovi.map((r) => r.map(bezLinkova).join(', ')).join(' ')
          case 'napomena':
            return `${b.naslov}. ${bezLinkova(b.tekst)}`
        }
      })
      .join('\n\n'),
  }

  return (
    <div className={`container ${s.strana}`}>
      <Breadcrumbs
        stavke={[
          { naziv: 'Početna', href: '/' },
          { naziv: 'Vodiči', href: '/vodici' },
          { naziv: vodic.naslov },
        ]}
        className={s.mrvice}
      />

      <article>
        <header className={s.zaglavlje}>
          <p className={`micro ${s.meta}`}>
            <span>{vodic.tema}</span>
            <span className={s.tacka} aria-hidden="true">
              ·
            </span>
            <span>{minuta} min čitanja</span>
            <span className={s.tacka} aria-hidden="true">
              ·
            </span>
            <time dateTime={vodic.datum}>{formatDatum(vodic.datum)}</time>
          </p>

          <h1 className={s.naslov}>{vodic.naslov}</h1>
          <p className={s.podnaslov}>{vodic.podnaslov}</p>
        </header>

        <div className={s.raspored}>
          <aside className={s.bocna}>
            <Sadrzaj stavke={stavkeSadrzaja} />
          </aside>

          <div className={s.telo}>
            <section className={s.kljucno} aria-labelledby="kljucno-naslov">
              <p className="micro">Ako čitaš samo jedno</p>
              <h2 id="kljucno-naslov" className={s.kljucnoNaslov}>
                Ključno
              </h2>
              <ul className={s.kljucnoLista}>
                {vodic.kljucno.map((k) => (
                  <li key={k}>{k}</li>
                ))}
              </ul>
            </section>

            <Blokovi blokovi={vodic.blokovi} />

            {vodic.veze.length > 0 ? (
              <section className={s.veze} aria-labelledby="veze-naslov">
                <p className="micro">Iz ovog vodiča vodi dalje</p>
                <h2 id="veze-naslov" className={s.vezeNaslov}>
                  Gde da tražiš dalje
                </h2>
                <p className={s.vezeUvod}>
                  Sve što je gore opisano ima svoju stranicu u katalogu: kategorija sa filterima,
                  brend sa objašnjenjem sistema ili pravila platforme.
                </p>
                <ul className={s.vezeLista}>
                  {vodic.veze.map((v) => (
                    <li key={v.href} className="card">
                      <div className={s.veza}>
                        <span className={s.vezaIkona}>
                          <Ikona ime="strelica" velicina={17} />
                        </span>
                        <div>
                          <p className={s.vezaNaziv}>
                            <Link href={v.href} className={s.vezaLink}>
                              {v.naziv}
                            </Link>
                          </p>
                          <p className={s.vezaOpis}>{v.opis}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        </div>
      </article>

      {ostali.length > 0 ? (
        <section className={s.ostali} aria-labelledby="ostali-naslov">
          <p className="micro">Nastavi da čitaš</p>
          <h2 id="ostali-naslov" className={s.ostaliNaslov}>
            Ostali vodiči
          </h2>
          <ul className={s.ostaliLista}>
            {ostali.map((v) => (
              <li key={v.slug} className={s.ostaliStavka}>
                <VodicKartica vodic={v} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  )
}
