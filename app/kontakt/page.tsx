import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Ikona } from '@/components/Ikone'
import KontaktForma from '@/components/staticne/KontaktForma'
import s from '@/components/staticne/Stranica.module.css'
import k from './stranica.module.css'

export const metadata: Metadata = {
  title: 'Kontakt',
  description:
    'Pitanja o Alatnici, prijava spornog oglasa ili saradnja. Obrazac je deo demonstracije i ništa ne šalje. Piše šta bi se u pravoj verziji desilo.',
  alternates: { canonical: '/kontakt' },
}

const BRZI = [
  {
    ikona: 'kljuc' as const,
    naslov: 'Kako se prijavljuje sporan oglas',
    tekst:
      'U pravoj verziji svaki oglas ima dugme za prijavu, a prijava ide sa linkom i razlogom. Ovde ta veza ne postoji, ali se sumnjivi obrasci prepoznaju po istim znacima.',
    href: '/kako-radi#crvene-zastavice',
    hrefTekst: 'Crvene zastavice u oglasu',
  },
  {
    ikona: 'stit' as const,
    naslov: 'Prevara ili spor sa prodavcem',
    tekst:
      'Alatnica ne posreduje u plaćanju i ne može da vrati novac. Pre svake kupovine pročitaj pravila o plaćanju i susretu uživo. Ona su besplatna i jedina stvarna zaštita.',
    href: '/kako-radi#sigurna-kupovina',
    hrefTekst: 'Sigurna kupovina',
  },
  {
    ikona: 'alat' as const,
    naslov: 'Ne znaš šta da kupiš',
    tekst:
      'Za to ne treba podrška nego pola sata čitanja. Četiri vodiča pokrivaju izbor bušilice, pregled polovnog alata, akumulatorske sisteme i razlike među brendovima.',
    href: '/vodici',
    hrefTekst: 'Vodiči za kupovinu',
  },
]

export default function KontaktStranica() {
  return (
    <div className={`container ${s.strana}`}>
      <Breadcrumbs
        stavke={[{ naziv: 'Početna', href: '/' }, { naziv: 'Kontakt' }]}
        className={s.mrvice}
      />

      <header className={s.uvod}>
        <p className="micro">Javi se</p>
        <h1 className={s.naslov}>Kontakt</h1>
        <p className={s.lede}>
          Pitanje o proizvodu, prijava oglasa koji ne pripada ovde ili predlog saradnje: piši. Odmah
          da bude jasno: obrazac ispod je deo demonstracije, ništa ne šalje i nijedan podatak ne
          napušta tvoj pregledač.
        </p>
      </header>

      <div className={k.raspored}>
        <div className={k.kolonaForma}>
          <h2 className={k.formaNaslov}>Pošalji poruku</h2>
          <p className={k.formaUvod}>
            Provera unosa je stvarna: polja se proveravaju kao u pravoj verziji. Slanje nije, i
            posle klika na „Pošalji" piše tačno šta bi se desilo da server postoji.
          </p>
          <KontaktForma />
        </div>

        <aside className={k.kolonaBocna} aria-labelledby="brzi-naslov">
          <h2 id="brzi-naslov" className={k.bocniNaslov}>
            Možda ti ne treba poruka
          </h2>
          <ul className={k.brzi}>
            {BRZI.map((b) => (
              <li key={b.naslov} className={k.brz}>
                <span className={k.brzIkona}>
                  <Ikona ime={b.ikona} velicina={17} />
                </span>
                <div>
                  <h3 className={k.brzNaslov}>{b.naslov}</h3>
                  <p className={k.brzTekst}>{b.tekst}</p>
                  <p className={k.brzVeza}>
                    <Link href={b.href}>{b.hrefTekst}</Link>
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className={k.demoBlok}>
            <p className="micro">Za pravu verziju</p>
            <p className={k.demoTekst}>
              U produkciji bi ovde stajala adresa podrške, vreme odgovora i obrazac koji zaista
              stiže do nekoga. Pošto Alatnica nije živ servis, izmišljena adresa i izmišljeni broj
              telefona bi bili gori od ove rečenice.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
