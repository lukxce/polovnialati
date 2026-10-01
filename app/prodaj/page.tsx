import type { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Ikona } from '@/components/Ikone'
import ProdajniTok from '@/components/prodaj/ProdajniTok'
import type { BrendOpcija, GrupaKategorija } from '@/components/prodaj/model'
import { GRADOVI } from '@/lib/gradovi'
import { stabloKategorija, sviBrendovi } from '@/lib/taksonomija'
import s from './stranica.module.css'

export const metadata: Metadata = {
  title: 'Prodaj alat: objava oglasa u pet koraka',
  description:
    'Objavi oglas za alat kroz pet koraka: kategorija, detalji mašine, lista provere prilagođena kategoriji, fotografije i cena. Ocena stanja je jedna od pet definisanih, ne slobodan tekst.',
  alternates: { canonical: '/prodaj' },
  // Traži prijavu (proxy.ts preusmerava na /prijava), pa nema šta da se indeksira.
  robots: { index: false, follow: true },
}

export default function ProdajStranica() {
  const stablo: GrupaKategorija[] = stabloKategorija().map(({ kategorija, deca }) => ({
    slug: kategorija.slug,
    naziv: kategorija.naziv,
    ikona: kategorija.ikona,
    opis: kategorija.opis,
    deca: deca.map((d) => ({ slug: d.slug, naziv: d.naziv, ikona: d.ikona })),
  }))

  const brendovi: BrendOpcija[] = sviBrendovi().map((b) => ({
    slug: b.slug,
    naziv: b.naziv,
    akuSistemi: b.akuSistemi ?? [],
  }))

  const gradovi = GRADOVI

  return (
    <div className={['container', s.strana].join(' ')}>
      <Breadcrumbs
        stavke={[{ naziv: 'Početna', href: '/' }, { naziv: 'Prodaj alat' }]}
        className={s.mrvice}
      />

      <header className={s.uvod}>
        <p className="micro">Objava oglasa</p>
        <h1 className={s.naslov}>Prodaj alat</h1>
        <p className={s.lede}>
          Pet koraka, jedan ekran po koraku. Kategorija bira listu provere, ocena stanja se bira iz
          pet definisanih umesto da se opisuje rečima, a pre objave vidiš tačno onu karticu koju će
          kupac videti u pretrazi.
        </p>

        <p className={s.demo}>
          <Ikona ime="stit" velicina={17} />
          <span>
            Oglas je javan odmah po objavi, u pretrazi i u svojoj kategoriji. U{' '}
            <strong>Mom nalogu</strong> menjaš cenu, sklanjaš ga kad prodaš ili ga brišeš.
          </span>
        </p>
      </header>

      <ProdajniTok stablo={stablo} brendovi={brendovi} gradovi={gradovi} />
    </div>
  )
}
