import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import s from '@/components/staticne/Stranica.module.css'
import { ili, OPERATER } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Uslovi korišćenja',
  description:
    'Uslovi korišćenja Alatnice: ko vodi sajt, pravila za naloge, oglase i poruke, zabranjena roba, prijava i uklanjanje sadržaja i odgovornost.',
  alternates: { canonical: '/uslovi' },
}

/** Menjaj pri svakoj izmeni teksta. */
const VAZI_OD = '1. novembar 2026.'

export default function UsloviStranica() {
  return (
    <div className={`container ${s.strana}`}>
      <Breadcrumbs
        stavke={[{ naziv: 'Početna', href: '/' }, { naziv: 'Uslovi korišćenja' }]}
        className={s.mrvice}
      />

      <header className={s.uvod}>
        <p className="micro">Pravila</p>
        <h1 className={s.naslov}>Uslovi korišćenja</h1>
        <p className={s.lede}>
          Pisano običnim jezikom. Korišćenjem sajta, a naročito otvaranjem naloga, prihvataš ove
          uslove.
        </p>
      </header>

      <div className={s.proza}>
        <section aria-labelledby="ko">
          <h2 id="ko" className={`${s.h2} ${s.h2Prvi}`}>
            1. Ko vodi Alatnicu
          </h2>
          <p className={s.p}>
            Sajt vodi {ili(OPERATER.naziv)}, sa sedištem na adresi {ili(OPERATER.adresa)}, PIB{' '}
            {ili(OPERATER.pib)}, matični broj {ili(OPERATER.maticniBroj)} (u daljem tekstu:
            „Polovni alati", „mi"). Kontakt: {ili(OPERATER.email)} ili{' '}
            <Link href="/kontakt">obrazac za kontakt</Link>.
          </p>
        </section>

        <section aria-labelledby="sta-je">
          <h2 id="sta-je" className={s.h2}>
            2. Šta Polovni alati jesu, a šta nisu
          </h2>
          <p className={s.p}>
            Polovni alati su oglasnik za nov i polovan alat: prostor na kome prodavci objavljuju oglase,
            a kupci ih pretražuju i kontaktiraju prodavce. Polovni alati nisu prodavac, nisu strana u
            kupoprodaji, ne drže novac, ne šalju robu i ne posreduju u plaćanju.
          </p>
          <p className={s.p}>
            Ugovor o kupoprodaji nastaje isključivo između kupca i prodavca. Za tačnost oglasa,
            stanje i ispravnost alata, isporuku i plaćanje odgovara prodavac, odnosno kupac i
            prodavac međusobno. Oznake „Provereno" i „Verifikovan nalog" znače da je naš tim
            pregledao oglas ili podatke naloga; one nisu garancija za ispravnost konkretne mašine.
          </p>
        </section>

        <section aria-labelledby="nalog">
          <h2 id="nalog" className={s.h2}>
            3. Nalog
          </h2>
          <ul className={s.lista}>
            <li>Nalog mogu da otvore punoletna fizička lica i registrovana pravna lica i preduzetnici.</li>
            <li>
              Podaci u nalogu moraju biti tačni. Tip naloga (privatno lice, prodavnica, servis) mora
              da odgovara stvarnosti: firma ne sme da prodaje kao privatno lice.
            </li>
            <li>
              Za čuvanje lozinke odgovaraš ti. Ako sumnjaš da je neko drugi pristupio nalogu, odmah
              promeni lozinku u <Link href="/nalog">Mom nalogu</Link> i javi nam se.
            </li>
            <li>
              Nalog možeš da obrišeš u svakom trenutku u Mom nalogu. Brisanjem se trajno brišu i
              tvoji oglasi, fotografije i razgovori.
            </li>
            <li>
              Objava oglasa i poruke su besplatni. Ako ikada uvedemo plaćene usluge, biće jasno
              označene i nikad neće biti obavezne za objavu.
            </li>
          </ul>
        </section>

        <section aria-labelledby="oglasi">
          <h2 id="oglasi" className={s.h2}>
            4. Pravila za oglase
          </h2>
          <ul className={s.lista}>
            <li>Oglašavaš samo alat koji je tvoj ili koji imaš pravo da prodaš, i koji stvarno imaš.</li>
            <li>Jedan oglas je jedan predmet ili jedan komplet. Isti predmet se ne objavljuje više puta.</li>
            <li>
              Fotografije moraju biti fotografije konkretnog predmeta, ne slike sa sajta
              proizvođača ili iz tuđih oglasa. Izuzetak: prodavnica koja prodaje nov, neotpakovan
              alat sme da koristi zvanične fotografije proizvođača ili uvoznika, ako ima dozvolu
              da ih koristi.
            </li>
            <li>
              Ocena stanja i lista provere moraju odgovarati stvarnom stanju. Ocene i njihove
              definicije su objavljene na stranici{' '}
              <Link href="/kako-radi#ocene-stanja">Kako radi</Link>.
            </li>
            <li>Cena se navodi u dinarima i mora biti stvarna cena po kojoj prodaješ.</li>
            <li>Kad prodaš alat, skloni oglas u Mom nalogu.</li>
            <li>
              Prodavnice i servisi, kada prodaju potrošačima, dužni su da poštuju Zakon o zaštiti
              potrošača i propise o elektronskoj trgovini: izdaju račun, poštuju garanciju i prava
              kupca, uključujući pravo na odustanak kod prodaje na daljinu.
            </li>
          </ul>

          <h3 className={s.h3}>Zabranjeno je oglašavati</h3>
          <ul className={s.lista}>
            <li>ukradenu robu ili robu nepoznatog porekla, i alat sa izbrisanim ili prepravljenim serijskim brojem;</li>
            <li>falsifikate i kopije robnih marki;</li>
            <li>oružje, municiju, eksplozive, pirotehniku i opremu čija je prodaja zabranjena ili ograničena;</li>
            <li>opasne materije, lekove i bilo šta što nije alat ili oprema iz naših kategorija;</li>
            <li>tešku mehanizaciju i vozila (kamioni, bageri, viljuškari) — to nije ovo tržište;</li>
            <li>usluge, zaposlenje, nekretnine i lažne ili mamac-oglase.</li>
          </ul>
        </section>

        <section aria-labelledby="poruke">
          <h2 id="poruke" className={s.h2}>
            5. Poruke
          </h2>
          <p className={s.p}>
            Poruke služe za dogovor o konkretnom oglasu. Zabranjeno je slanje neželjenih poruka,
            reklama, linkova ka lažnim stranicama za plaćanje ili „dostavu", traženje podataka o
            platnim karticama i bilo kakvo uznemiravanje. Polovni alati nikada neće tražiti da im
            uplatiš novac ili pošalješ podatke kartice.
          </p>
        </section>

        <section aria-labelledby="uklanjanje">
          <h2 id="uklanjanje" className={s.h2}>
            6. Prijave, uklanjanje sadržaja i blokada naloga
          </h2>
          <p className={s.p}>
            Svaki oglas može da se prijavi dugmetom „Prijavi oglas" na njegovoj stranici, a sve
            ostalo preko <Link href="/kontakt">kontakta</Link>. Prijave pregledamo i, ako sadržaj
            krši ove uslove ili zakon, uklanjamo ga.
          </p>
          <p className={s.p}>
            Zadržavamo pravo da bez prethodne najave uklonimo oglas ili blokiramo nalog koji krši
            ove uslove, naročito kod sumnje na prevaru. Blokiran nalog ne može da se prijavi, a
            njegovi oglasi nisu javno vidljivi. Ako misliš da je odluka pogrešna, piši nam.
          </p>
        </section>

        <section aria-labelledby="sadrzaj">
          <h2 id="sadrzaj" className={s.h2}>
            7. Tvoj sadržaj i naša prava
          </h2>
          <p className={s.p}>
            Tekst i fotografije oglasa ostaju tvoji. Objavom nam daješ neisključivo, besplatno pravo
            da ih prikazujemo na sajtu i u njegovoj promociji (npr. pri deljenju linka ka oglasu),
            dok je oglas aktivan. Odgovaraš za to da imaš pravo da objaviš ono što objavljuješ.
          </p>
          <p className={s.p}>
            Tekstovi vodiča, dizajn i ilustracije sajta su naše autorsko delo. Imena brendova
            (Bosch, Makita, Hilti, DeWalt, Milwaukee i ostali) pripadaju njihovim vlasnicima i
            koriste se samo da bi se opisao alat. Polovni alati nisu povezani ni sa jednim od tih
            proizvođača niti ih zastupa.
          </p>
        </section>

        <section aria-labelledby="odgovornost">
          <h2 id="odgovornost" className={s.h2}>
            8. Odgovornost
          </h2>
          <p className={s.p}>
            Trudimo se da sajt radi bez prekida i grešaka, ali to ne možemo da garantujemo. U meri
            u kojoj zakon dozvoljava, ne odgovaramo za štetu nastalu iz kupoprodaje između
            korisnika, iz netačnih oglasa ili iz nedostupnosti sajta. Saveti u vodičima i na
            stranici Kako radi su opšti i pisani u dobroj nameri; odluka o kupovini je tvoja.
          </p>
        </section>

        <section aria-labelledby="izmene">
          <h2 id="izmene" className={s.h2}>
            9. Izmene uslova i merodavno pravo
          </h2>
          <p className={s.p}>
            Uslove možemo da menjamo. O bitnim izmenama obaveštavamo na sajtu najmanje osam dana pre
            nego što počnu da važe; nastavak korišćenja posle toga znači prihvatanje. Na ove uslove
            primenjuje se pravo Republike Srbije. Za sporove je nadležan stvarno nadležan sud
            prema sedištu operatera, osim kada zakon za potrošače predviđa drugačije.
          </p>
          <p className={s.p}>
            Kako obrađujemo podatke o ličnosti, piše u{' '}
            <Link href="/privatnost">politici privatnosti</Link>.
          </p>
        </section>
      </div>

      <p className={s.datum}>Važi od: {VAZI_OD}</p>
    </div>
  )
}
