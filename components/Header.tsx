import HeaderNav from '@/components/HeaderNav'
import { stabloKategorija } from '@/lib/queries'

/**
 * Server omotač: taksonomija se izračunava na serveru i prosleđuje kao
 * običan podatak, da klijentski bundle ne povuče celu bazu oglasa.
 *
 * Sesija se namerno NE čita ovde. Header je deo deljenog layout-a, pa bi
 * cookies() na ovom nivou naterao svaku stranicu sajta na dinamičko
 * renderovanje (nema cacheComponents u next.config, pa je granica statično/
 * dinamično i dalje na nivou cele rute, ne komponente). HeaderNav umesto
 * toga učitava sesiju na klijentu preko /api/auth/sesija — isti obrazac kao
 * useSacuvani() za broj sačuvanih oglasa.
 */
export function Header() {
  const stablo = stabloKategorija().map(({ kategorija, deca }) => ({
    slug: kategorija.slug,
    naziv: kategorija.naziv,
    ikona: kategorija.ikona,
    opis: kategorija.opis,
    deca: deca.map((d) => ({ slug: d.slug, naziv: d.naziv })),
  }))

  return <HeaderNav stablo={stablo} />
}

export default Header
