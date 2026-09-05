import type { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import OglasKartica from '@/components/OglasKartica'
import SacuvanaLista, { type SacuvanaStavka } from '@/components/sacuvano/SacuvanaLista'
import { stabloKategorija, sviOglasi } from '@/lib/queries'
import s from './stranica.module.css'

export const metadata: Metadata = {
  title: 'Sačuvani oglasi',
  description:
    'Oglasi koje si sačuvao srcem na kartici. Lista se čuva u tvom pregledaču, bez naloga i bez slanja na server, pa možeš u miru da uporediš cenu, ocenu stanja i prodavca pre nego što nekog pozoveš.',
  alternates: { canonical: '/sacuvano' },
}

export default function SacuvanoStranica() {
  const oglasi = sviOglasi()

  /**
   * Kartice se renderuju na serveru i prosleđuju kao gotovi čvorovi. Klijent
   * zna samo slugove iz localStorage-a i bira koje će od njih montirati —
   * `lib/queries` tako nikad ne završi u pregledaču.
   */
  const stavke: SacuvanaStavka[] = oglasi.map((o) => ({
    slug: o.slug,
    kartica: <OglasKartica oglas={o} kompaktno />,
  }))

  const predlozi = stabloKategorija()
    .slice(0, 6)
    .map(({ kategorija }) => ({
      tekst: kategorija.naziv,
      href: `/kategorija/${kategorija.slug}`,
    }))

  return (
    <div className={['container', s.strana].join(' ')}>
      <Breadcrumbs
        stavke={[{ naziv: 'Početna', href: '/' }, { naziv: 'Sačuvani oglasi' }]}
        className={s.mrvice}
      />

      <header className={s.uvod}>
        <p className="micro">Tvoja lista</p>
        <h1 className={s.naslov}>Sačuvani oglasi</h1>
        <p className={s.lede}>
          Alat se retko kupuje iz prve. Ovde stoje oglasi koje si obeležio srcem, da bi u jednom
          pogledu uporedio cenu, ocenu stanja i prodavca. Lista živi u ovom pregledaču (bez naloga,
          bez prijave i bez slanja igde), pa nestaje ako obrišeš podatke sajta ili pređeš na drugi
          uređaj.
        </p>
      </header>

      <SacuvanaLista stavke={stavke} predlozi={predlozi} ukupnoOglasa={oglasi.length} />
    </div>
  )
}
