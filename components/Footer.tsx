import Link from 'next/link'
import { Ikona } from '@/components/Ikone'
import Logo from '@/components/Logo'
import { ili, OPERATER } from '@/lib/site'
import { stabloKategorija } from '@/lib/taksonomija'
import s from './Footer.module.css'

const KOLONE = [
  {
    naslov: 'Kupovina',
    linkovi: [
      { tekst: 'Svi oglasi', href: '/oglasi' },
      { tekst: 'Sačuvani oglasi', href: '/sacuvano' },
      { tekst: 'Kako radi', href: '/kako-radi' },
      { tekst: 'Vodiči za kupovinu', href: '/vodici' },
    ],
  },
  {
    naslov: 'Prodaja',
    linkovi: [
      { tekst: 'Postavi oglas', href: '/prodaj' },
      { tekst: 'Ocene stanja', href: '/kako-radi#ocene-stanja' },
      { tekst: 'Saveti za dobar oglas', href: '/vodici/polovan-alat-na-sta-obratiti-paznju' },
    ],
  },
  {
    naslov: 'Polovni alati',
    linkovi: [
      { tekst: 'O nama', href: '/o-nama' },
      { tekst: 'Kontakt', href: '/kontakt' },
      { tekst: 'Uslovi korišćenja', href: '/uslovi' },
      { tekst: 'Privatnost', href: '/privatnost' },
    ],
  },
]

export function Footer() {
  const nadkategorije = stabloKategorija().map(({ kategorija }) => kategorija)

  return (
    <footer className={`tamni-panel-pun ${s.footer}`}>
      <div className="container">
        <div className={s.vrh}>
          <div className={s.znakBlok}>
            <p className={s.znak}>
              <Logo />
            </p>
            <p className={s.slogan}>
              Marketplace za nov i polovan alat. Prava taksonomija, ocenjeno stanje i prodavac koji
              se zna, umesto pretrage kroz hiljadu neopisanih oglasa.
            </p>
            <Link href="/prodaj" className="btn btn-primary">
              Prodaj alat
            </Link>
          </div>

          <div className={s.kolone}>
            {KOLONE.map((k) => (
              <nav key={k.naslov} className={s.kolona} aria-label={k.naslov}>
                <p className={s.kolonaNaslov}>{k.naslov}</p>
                <ul>
                  {k.linkovi.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href}>{l.tekst}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <nav className={s.kategorije} aria-label="Kategorije">
          <p className={s.kolonaNaslov}>Kategorije</p>
          <ul className={s.kategorijeLista}>
            {nadkategorije.map((k) => (
              <li key={k.slug}>
                <Link href={`/kategorija/${k.slug}`}>{k.naziv}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={s.napomena}>
          <span className={s.napomenaIkona}>
            <Ikona ime="stit" velicina={18} />
          </span>
          <p>
            <strong>Polovni alati su oglasnik, ne prodavac.</strong> Kupovina se dogovara i plaća
            direktno između kupca i prodavca. Alat pogledaj i probaj pre plaćanja, i nikad ne šalji
            kaparu nepoznatom prodavcu.
          </p>
        </div>

        <div className={s.dno}>
          <p className="micro">
            © {new Date().getFullYear()} {ili(OPERATER.naziv)}
            {OPERATER.pib ? ` · PIB ${OPERATER.pib}` : ''}
            {OPERATER.maticniBroj ? ` · MB ${OPERATER.maticniBroj}` : ''}
          </p>
          {OPERATER.adresa ? <p className="micro">{OPERATER.adresa}</p> : null}
        </div>
      </div>
    </footer>
  )
}

export default Footer
