import type { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import SacuvanaLista from '@/components/sacuvano/SacuvanaLista'
import { stabloKategorija } from '@/lib/taksonomija'
import s from './stranica.module.css'

export const metadata: Metadata = {
  title: 'Sačuvani oglasi',
  description:
    'Oglasi koje si sačuvao srcem na kartici, da u miru uporediš cenu, ocenu stanja i prodavca pre nego što nekog pozoveš.',
  alternates: { canonical: '/sacuvano' },
  robots: { index: false, follow: true },
}

export default function SacuvanoStranica() {
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
          pogledu uporedio cenu, ocenu stanja i prodavca. Lista živi u ovom pregledaču, bez
          prijave, pa nestaje ako obrišeš podatke sajta ili pređeš na drugi uređaj.
        </p>
      </header>

      <SacuvanaLista predlozi={predlozi} />
    </div>
  )
}
