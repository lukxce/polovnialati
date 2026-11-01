import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import VodicKartica from '@/components/vodici/VodicKartica'
import { brojSr } from '@/lib/format'
import { sviVodici, vremeCitanja } from '@/lib/vodici'
import s from './stranica.module.css'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Vodiči za kupovinu alata',
  description:
    'Četiri duga vodiča bez marketinga: kako se bira rotaciona bušilica, kako se pregleda polovan alat, zašto je akumulatorski sistem važniji od mašine i gde su stvarne razlike između Hiltija, Boscha i Makite.',
  alternates: { canonical: '/vodici' },
  openGraph: {
    type: 'website',
    title: 'Vodiči za kupovinu alata · Polovni alati',
    description:
      'Kako izabrati rotacionu bušilicu, kako pregledati polovan alat, akumulatorski sistemi objašnjeni i pošteno poređenje Hilti / Bosch / Makita.',
    url: '/vodici',
  },
}

export default function VodiciStranica() {
  const vodici = sviVodici()
  const ukupnoMinuta = vodici.reduce((z, v) => z + vremeCitanja(v), 0)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Vodiči za kupovinu alata',
    itemListElement: vodici.map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/vodici/${v.slug}`,
      name: v.naslov,
    })),
  }

  return (
    <div className={`container ${s.strana}`}>
      <Breadcrumbs
        stavke={[{ naziv: 'Početna', href: '/' }, { naziv: 'Vodiči' }]}
        className={s.mrvice}
      />

      <header className={s.uvod}>
        <p className="micro">
          {brojSr(vodici.length, ['vodič', 'vodiča', 'vodiča'])} · {ukupnoMinuta} min čitanja
        </p>
        <h1 className={s.naslov}>Vodiči za kupovinu</h1>
        <p className={s.lede}>
          Nijedan od ovih tekstova ne postoji da bi ti nešto prodao. Napisani su da bi odgovorili na
          pitanja koja se u porukama prodavcima postavljaju svaki dan: koja klasa mašine mi stvarno
          treba, šta se čuje na polovnom alatu pre nego što se plati, i zašto baterija koju već imaš
          određuje sledećih pet kupovina više nego bilo koja marka.
        </p>
      </header>

      <ul className={s.mreza}>
        {vodici.map((v) => (
          <li key={v.slug} className={s.stavka}>
            <VodicKartica vodic={v} saKljucnim nivo="h2" />
          </li>
        ))}
      </ul>

      <section className={`tamni-panel ${s.traka}`}>
        <p className="micro">Rečnik proizvoda</p>
        <h2 className={s.trakaNaslov}>
          Sve u vodičima se oslanja na <span className="akcenat">pet ocena stanja</span>
        </h2>
        <p className={s.trakaTekst}>
          Ocene nisu opisne fraze nego definicije koje su iste za svakog prodavca, uz obaveznu listu
          provere za sve što nije novo. Referentna tabela, saveti za plaćanje i pravila za susret
          uživo stoje na jednom mestu.
        </p>
        <div className={s.trakaAkcije}>
          <Link href="/kako-radi#ocene-stanja" className="btn btn-primary">
            Ocene stanja
          </Link>
          <Link href="/oglasi" className="btn btn-tertiary">
            Pogledaj oglase
          </Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  )
}
