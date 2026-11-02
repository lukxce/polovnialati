import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Ikona } from '@/components/Ikone'
import KontaktForma from '@/components/staticne/KontaktForma'
import s from '@/components/staticne/Stranica.module.css'
import { ili, OPERATER } from '@/lib/site'
import k from './stranica.module.css'

export const metadata: Metadata = {
  title: 'Kontakt',
  description:
    'Pitanja o Alatnici, prijava spornog oglasa, problem sa nalogom ili saradnja. Piši nam preko obrasca ili na email.',
  alternates: { canonical: '/kontakt' },
}

const BRZI = [
  {
    ikona: 'kljuc' as const,
    naslov: 'Kako se prijavljuje sporan oglas',
    tekst:
      'Najbrže je dugme „Prijavi oglas" na samom oglasu, ispod provere stanja: prijava stiže direktno sa linkom i razlogom. Šta je sumnjivo u oglasu, piše na stranici Kako radi.',
    href: '/kako-radi#crvene-zastavice',
    hrefTekst: 'Crvene zastavice u oglasu',
  },
  {
    ikona: 'stit' as const,
    naslov: 'Prevara ili spor sa prodavcem',
    tekst:
      'Sajt ne posreduje u plaćanju i ne može da vrati novac. Pre svake kupovine pročitaj pravila o plaćanju i susretu uživo. Ona su besplatna i jedina stvarna zaštita.',
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
          Pitanje o sajtu, problem sa nalogom, prijava oglasa koji ne pripada ovde ili predlog
          saradnje: piši. Odgovaramo na email, obično u roku od jednog do dva radna dana.
        </p>
      </header>

      <div className={k.raspored}>
        <div className={k.kolonaForma}>
          <h2 className={k.formaNaslov}>Pošalji poruku</h2>
          <p className={k.formaUvod}>
            Zaboravio si lozinku? Izaberi tu temu i navedi email naloga. Javićemo ti se sa
            privremenom lozinkom.
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
            <p className="micro">Operater sajta</p>
            <p className={k.demoTekst}>
              {ili(OPERATER.naziv)}
              <br />
              {OPERATER.adresa ? (
                <>
                  {OPERATER.adresa}
                  <br />
                </>
              ) : null}
              PIB {ili(OPERATER.pib)} · MB {ili(OPERATER.maticniBroj)}
              <br />
              Email:{' '}
              {OPERATER.email ? <a href={`mailto:${OPERATER.email}`}>{OPERATER.email}</a> : ili('')}
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
