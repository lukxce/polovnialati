import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import s from '@/components/staticne/Stranica.module.css'
import { ili, OPERATER } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Politika privatnosti',
  description:
    'Koje podatke o ličnosti Polovni alati obrađuju, zašto, koliko dugo ih čuvaju, ko još ima pristup i kako ostvaruješ svoja prava po Zakonu o zaštiti podataka o ličnosti.',
  alternates: { canonical: '/privatnost' },
}

/** Menjaj pri svakoj izmeni teksta. */
const VAZI_OD = '1. oktobar 2026.'

export default function PrivatnostStranica() {
  return (
    <div className={`container ${s.strana}`}>
      <Breadcrumbs
        stavke={[{ naziv: 'Početna', href: '/' }, { naziv: 'Politika privatnosti' }]}
        className={s.mrvice}
      />

      <header className={s.uvod}>
        <p className="micro">Privatnost</p>
        <h1 className={s.naslov}>Politika privatnosti</h1>
        <p className={s.lede}>
          Šta znamo o tebi, zašto, koliko dugo i kako to možeš da promeniš. U skladu sa Zakonom o
          zaštiti podataka o ličnosti („ZZPL").
        </p>
      </header>

      <div className={s.proza}>
        <section aria-labelledby="rukovalac">
          <h2 id="rukovalac" className={`${s.h2} ${s.h2Prvi}`}>
            1. Rukovalac
          </h2>
          <p className={s.p}>
            Rukovalac podacima je {ili(OPERATER.naziv)}, {OPERATER.adresa ? `${OPERATER.adresa}, ` : ''}PIB{' '}
            {ili(OPERATER.pib)}, MB {ili(OPERATER.maticniBroj)}. Za sva pitanja o podacima i za
            ostvarivanje prava piši na {ili(OPERATER.email)} ili preko{' '}
            <Link href="/kontakt?tema=podaci">obrasca za kontakt</Link>.
          </p>
        </section>

        <section aria-labelledby="podaci">
          <h2 id="podaci" className={s.h2}>
            2. Koje podatke obrađujemo i zašto
          </h2>
          <ul className={s.lista}>
            <li>
              <strong>Nalog:</strong> email, lozinka (čuvamo samo njen kriptografski otisak, ne samu
              lozinku), ime i prezime ili naziv firme, tip naloga, grad, a opciono telefon, PIB i
              kratak opis. Svrha: otvaranje i vođenje naloga i objava oglasa. Osnov: izvršenje
              ugovora (ovih <Link href="/uslovi">uslova</Link>).
            </li>
            <li>
              <strong>Oglasi i fotografije:</strong> sve što uneseš u oglas. Pri otpremanju iz
              fotografija brišemo prateće podatke (EXIF), uključujući GPS lokaciju. Osnov:
              izvršenje ugovora.
            </li>
            <li>
              <strong>Poruke:</strong> sadržaj razgovora između kupca i prodavca. Svrha: dostava
              poruka. Poruke ne čitamo, osim kad obrađujemo prijavu ili sumnju na prevaru. Osnov:
              izvršenje ugovora i legitimni interes (bezbednost korisnika).
            </li>
            <li>
              <strong>Prijave oglasa i kontakt obrazac:</strong> ime, email i tekst koji pošalješ.
              Svrha: odgovor i obrada prijave. Osnov: legitimni interes.
            </li>
            <li>
              <strong>Tehnički podaci:</strong> IP adresa pri prijavi, registraciji, slanju poruka i
              sličnim radnjama, radi zaštite od pogađanja lozinki, spama i zloupotrebe. Osnov:
              legitimni interes (bezbednost sajta).
            </li>
            <li>
              <strong>Statistika oglasa:</strong> broj pregleda oglasa i klikova na „Pozovi", bez
              podatka o tome ko je kliknuo. Svrha: praćenje rada sajta. Osnov: legitimni interes.
            </li>
          </ul>
          <p className={s.p}>
            Podaci za nalog su neophodni da bi nalog postojao; bez njih ne možeš da objavljuješ ni
            da šalješ poruke. Pregled oglasa ne traži nikakve podatke.
          </p>
        </section>

        <section aria-labelledby="javno">
          <h2 id="javno" className={s.h2}>
            3. Šta je javno vidljivo
          </h2>
          <p className={s.p}>
            Na tvom javnom profilu i oglasima vide se: ime ili naziv firme, tip naloga, grad, opis,
            datum otvaranja naloga i tvoji aktivni oglasi. Broj telefona, ako si ga uneo, prikazuje
            se kupcu kad na tvom oglasu klikne „Pozovi". Email adresu nikad ne prikazujemo.
          </p>
        </section>

        <section aria-labelledby="primaoci">
          <h2 id="primaoci" className={s.h2}>
            4. Ko još obrađuje podatke
          </h2>
          <p className={s.p}>
            Podatke ne prodajemo i ne dajemo trećim licima za reklamiranje. Koristimo pružaoce
            usluga koji podatke obrađuju po našem nalogu (obrađivači):
          </p>
          <ul className={s.lista}>
            <li>Vercel Inc. — hosting sajta i skladište fotografija;</li>
            <li>Neon Inc. — baza podataka.</li>
          </ul>
          <p className={s.p}>
            Serveri ovih pružalaca mogu biti van Srbije, uključujući SAD. Prenos se vrši uz mere
            zaštite koje ZZPL predviđa, kao što su standardne ugovorne klauzule. Podatke možemo
            dostaviti i državnim organima kada to zakon nalaže.
          </p>
        </section>

        <section aria-labelledby="rokovi">
          <h2 id="rokovi" className={s.h2}>
            5. Koliko dugo čuvamo podatke
          </h2>
          <ul className={s.lista}>
            <li>
              Nalog, oglasi i fotografije — dok postoji nalog. Kad obrišeš oglas, brišu se i
              njegove fotografije.
            </li>
            <li>
              Brisanjem naloga trajno se brišu podaci naloga, oglasi, fotografije i razgovori u
              kojima si učestvovao (i za drugu stranu u razgovoru).
            </li>
            <li>Poruke sa kontakt obrasca i prijave — dok je potrebno za obradu, a najduže 12 meseci.</li>
            <li>Zapisi pokušaja sa IP adresom — najduže nekoliko dana.</li>
          </ul>
        </section>

        <section aria-labelledby="kolacici">
          <h2 id="kolacici" className={s.h2}>
            6. Kolačići i lokalno skladište
          </h2>
          <ul className={s.lista}>
            <li>
              <code>nalog</code> — kolačić prijave, postavlja se samo kad se prijaviš i važi 30
              dana. Neophodan je za rad naloga i zato ne traži pristanak.
            </li>
            <li>
              <code>alatnica:sacuvano</code> — lista sačuvanih oglasa, u lokalnom skladištu tvog
              pregledača. Ne šalje se nama dok ne otvoriš stranicu Sačuvani oglasi.
            </li>
            <li>
              Oznaka da je oglas već pregledan u ovoj kartici pregledača (sessionStorage), da se
              pregled ne bi brojao dvaput.
            </li>
          </ul>
          <p className={s.p}>
            Ne koristimo kolačiće za analitiku, praćenje ni reklame.
          </p>
        </section>

        <section aria-labelledby="prava">
          <h2 id="prava" className={s.h2}>
            7. Tvoja prava
          </h2>
          <p className={s.p}>
            Imaš pravo na pristup svojim podacima, njihovu ispravku, brisanje, ograničenje obrade,
            prenosivost i pravo na prigovor na obradu zasnovanu na legitimnom interesu. Većinu
            podataka menjaš sam u <Link href="/nalog">Mom nalogu</Link>, gde možeš i da obrišeš
            nalog. Za ostalo nam piši; odgovaramo bez odlaganja, a najkasnije u roku od 30 dana.
          </p>
          <p className={s.p}>
            Ako smatraš da obrada nije zakonita, imaš pravo da podneseš pritužbu Povereniku za
            informacije od javnog značaja i zaštitu podataka o ličnosti (www.poverenik.rs).
          </p>
        </section>

        <section aria-labelledby="bezbednost">
          <h2 id="bezbednost" className={s.h2}>
            8. Bezbednost
          </h2>
          <p className={s.p}>
            Sajt radi isključivo preko šifrovane veze (HTTPS). Lozinke čuvamo samo kao bcrypt
            otisak, pristup bazi ima samo operater, a pokušaji pogađanja lozinke se automatski
            blokiraju. Nijedan sistem nije potpuno siguran: koristi lozinku koju ne koristiš nigde
            drugde.
          </p>
        </section>

        <section aria-labelledby="izmene">
          <h2 id="izmene" className={s.h2}>
            9. Izmene
          </h2>
          <p className={s.p}>
            Ovu politiku možemo da menjamo; o bitnim izmenama obaveštavamo na sajtu. Datum od kog
            važi trenutna verzija stoji ispod.
          </p>
        </section>
      </div>

      <p className={s.datum}>Važi od: {VAZI_OD}</p>
    </div>
  )
}
