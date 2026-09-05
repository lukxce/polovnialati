import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Ikona } from '@/components/Ikone'
import s from '@/components/staticne/Stranica.module.css'

export const metadata: Metadata = {
  title: 'Uslovi korišćenja',
  description:
    'Uslovi korišćenja Alatnice, napisani običnim jezikom. Alatnica je demonstracioni projekat: nema naloga, nema transakcija i nema pravnog odnosa između tebe i sajta.',
  alternates: { canonical: '/uslovi' },
}

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
          Pisano običnim jezikom, jer duži tekst ovde ne bi značio više prava ni za koga. Ovo nije
          ugovor sastavljen od advokata i ne treba da se čita kao pravni savet.
        </p>
      </header>

      <div className={s.napomena}>
        <span className={s.napomenaIkona}>
          <Ikona ime="stit" velicina={16} />
        </span>
        <p>
          <strong className={s.napomenaNaslov}>Alatnica je demonstracioni projekat.</strong>
          Ne postoje nalozi, ne postoji objavljivanje oglasa, ne postoje poruke i ne postoji
          plaćanje. Svi oglasi i prodavci su izmišljeni. Zbog toga između tebe i ovog sajta ne
          nastaje nikakav poslovni odnos, i nema šta da se raskine ni otkaže.
        </p>
      </div>

      <div className={s.proza}>
        <section aria-labelledby="ukratko">
          <h2 id="ukratko" className={`${s.h2} ${s.h2Prvi}`}>
            Ukratko
          </h2>
          <ul className={s.lista}>
            <li>Sajt možeš da razgledaš slobodno, bez naloga i bez registracije.</li>
            <li>Sadržaj oglasa je izmišljen i ne sme se koristiti kao stvarna ponuda.</li>
            <li>Tekstovi vodiča su autorski; možeš ih čitati i citirati uz navođenje izvora.</li>
            <li>Sajt se nudi takav kakav jeste, bez garancije da radi bez greške.</li>
            <li>Ako nešto ne radi ili deluje pogrešno, javi se preko <Link href="/kontakt">kontakta</Link>.</li>
          </ul>
        </section>

        <section aria-labelledby="sta-je">
          <h2 id="sta-je" className={s.h2}>
            Šta je ovaj sajt
          </h2>
          <p className={s.p}>
            Alatnica je prikaz kako bi izgledao oglasnik posvećen samo alatu i sitnoj građevinskoj
            opremi. Napravljen je da pokaže taksonomiju, ocene stanja i filtriranje na stvarnom
            obimu podataka, pa su podaci morali da izgledaju uverljivo. To što izgledaju uverljivo
            ne znači da su stvarni.
          </p>
          <p className={s.p}>
            Nijedan oglas ne odgovara stvarnoj mašini koja se prodaje. Nijedan prodavac ne postoji.
            Nijedna cena nije ponuda. Nijedna ocena i recenzija nije napisao stvaran kupac.
          </p>
        </section>

        <section aria-labelledby="koriscenje">
          <h2 id="koriscenje" className={s.h2}>
            Šta smeš, a šta ne
          </h2>
          <p className={s.p}>
            Sajt možeš da koristiš za razgledanje, učenje i procenu proizvoda. Vodiče možeš da
            čitaš, štampaš i citiraš, uz navođenje da su sa Alatnice.
          </p>
          <p className={s.p}>Ono što ne bi trebalo da radiš:</p>
          <ul className={s.lista}>
            <li>
              Da predstavljaš izmišljene oglase kao stvarnu ponudu, bilo gde van ovog sajta.
            </li>
            <li>
              Da automatski preuzimaš sadržaj u obimu koji opterećuje sajt ili ga kopira u celini.
            </li>
            <li>
              Da pokušavaš da zaobiđeš ili napadneš tehničku stranu sajta. Nema šta da se nađe:
              nema baze sa korisnicima, nema naloga i nema plaćanja.
            </li>
          </ul>
        </section>

        <section aria-labelledby="odgovornost">
          <h2 id="odgovornost" className={s.h2}>
            Odgovornost
          </h2>
          <p className={s.p}>
            Sajt se nudi takav kakav jeste. Ne garantuje se da će uvek biti dostupan, da neće imati
            grešaka niti da su svi podaci u njemu tačni.
          </p>
          <p className={s.p}>
            Saveti u vodičima i na stranici <Link href="/kako-radi">kako radi</Link> pisani su u
            dobroj nameri i na osnovu prakse, ali su opšti. Odluka o tome da li ćeš kupiti neku
            mašinu, po kojoj ceni i pod kojim uslovima, ostaje tvoja, i za nju ovaj sajt ne
            odgovara.
          </p>
          <p className={s.p}>
            Ako bi Alatnica jednog dana postala pravi servis, uslovi bi morali da budu drugačiji i
            znatno detaljniji: pravila o nalozima, o sadržaju koji korisnici objavljuju, o zabranjenoj
            robi, o postupku prijave i uklanjanja oglasa. To bi tada pisao neko ko se time bavi.
          </p>
        </section>

        <section aria-labelledby="autorstvo">
          <h2 id="autorstvo" className={s.h2}>
            Autorstvo i tuđi znaci
          </h2>
          <p className={s.p}>
            Tekstovi, dizajn i ilustracije na sajtu su autorsko delo autora projekta. Imena brendova
            (Bosch, Makita, Hilti, DeWalt, Milwaukee i ostali) pripadaju njihovim vlasnicima i
            ovde se koriste isključivo da bi se opisala kategorija alata. Alatnica nije povezana ni
            sa jednim od tih proizvođača, niti ih zastupa.
          </p>
        </section>

        <section aria-labelledby="izmene">
          <h2 id="izmene" className={s.h2}>
            Izmene
          </h2>
          <p className={s.p}>
            Ovaj tekst se može promeniti kada se sajt promeni. Pošto nema naloga, nema ni načina da
            se o izmeni pošalje obaveštenje. Datum poslednje izmene stoji na dnu stranice.
          </p>
        </section>
      </div>

      <p className={s.datum}>Poslednja izmena: 20. avgust 2026.</p>
    </div>
  )
}
