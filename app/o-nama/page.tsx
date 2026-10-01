import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import s from '@/components/staticne/Stranica.module.css'
import { sveKategorije, sviBrendovi } from '@/lib/taksonomija'

export const metadata: Metadata = {
  title: 'O nama',
  description:
    'Alatnica je marketplace za nov i polovan alat sa pravom taksonomijom, pet ocena stanja i poznatim prodavcem. Zašto postoji i šta radi drugačije od opštih oglasnika.',
  alternates: { canonical: '/o-nama' },
}

export default function ONamaStranica() {
  const brojke = [
    { vrednost: String(sveKategorije().length), oznaka: 'kategorija i potkategorija' },
    { vrednost: String(sviBrendovi().length), oznaka: 'brendova sa svojom stranicom' },
    { vrednost: '5', oznaka: 'ocena stanja sa objavljenom definicijom' },
  ]

  return (
    <div className={`container ${s.strana}`}>
      <Breadcrumbs
        stavke={[{ naziv: 'Početna', href: '/' }, { naziv: 'O nama' }]}
        className={s.mrvice}
      />

      <header className={s.uvod}>
        <p className="micro">O projektu</p>
        <h1 className={s.naslov}>O Alatnici</h1>
        <p className={s.lede}>
          Alatnica je oglasnik za nov i polovan alat i sitnu građevinsku opremu, napravljen oko
          jedne pretpostavke: da kupac alata ima tri konkretna pitanja i da mu nijedan postojeći
          oglasnik u Srbiji na njih ne odgovara.
        </p>
      </header>

      <ul className={s.brojke}>
        {brojke.map((b) => (
          <li key={b.oznaka} className={s.brojka}>
            <span className={s.brojkaVrednost}>{b.vrednost}</span>
            <span className={s.brojkaOznaka}>{b.oznaka}</span>
          </li>
        ))}
      </ul>

      <div className={s.proza}>
        <section aria-labelledby="problem">
          <h2 id="problem" className={`${s.h2} ${s.h2Prvi}`}>
            Problem: ogroman doseg, nula strukture
          </h2>
          <p className={s.p}>
            Opšti oglasnici imaju sve. Ako u Srbiji neko prodaje ugaonu brusilicu, ona je tamo. Ali
            pretraga za „brusilica" vraća i akumulatorsku i mrežnu, i za drvo i za metal, i novu i
            onu koja ne radi, i to na način koji se ne može suziti. Kategorija za alat ima
            desetine hiljada oglasa i jednu ravan.
          </p>
          <p className={s.p}>
            Zatim, stanje. Na oglasnicima stanje piše prodavac svojim rečima, pa je sve „kao novo,
            malo korišćeno, bez ijedne greške". Ta rečenica se pojavljuje i na mašini staroj mesec
            dana i na mašini kojoj je kabl skraćivan dvaput. Ne znači ništa, ne obavezuje nikoga, i
            kupac to saznaje tek kada pređe pola grada.
          </p>
          <p className={s.p}>
            I na kraju, prodavac. Ne znaš da li pišeš čoveku koji prodaje svoju bušilicu ili
            preprodavcu sa pedeset oglasa. Oba su legitimna, ali se sa njima ne razgovara isto i ne
            kupuje isto.
          </p>
        </section>

        <section aria-labelledby="resenje">
          <h2 id="resenje" className={s.h2}>
            Tri stvari koje Alatnica radi drugačije
          </h2>

          <h3 className={s.h3}>1. Taksonomija koja zna razliku</h3>
          <p className={s.p}>
            Kategorija, pa potkategorija, pa brend, pa akumulatorski sistem. Filter zna da 18V
            Makita baterija nije 18V Bosch baterija, iako je broj isti, a to je razlika koja
            određuje da li mašina koju kupuješ radi na punjaču koji već imaš u radionici. Nijedan
            opšti oglasnik nema razloga da tu razliku modeluje. Oglasnik samo za alat ima.
          </p>

          <h3 className={s.h3}>2. Pet ocena stanja umesto slobodnog teksta</h3>
          <p className={s.p}>
            Stanje se bira, ne piše. Pet ocena sa objavljenom definicijom koja je ista za svakog
            prodavca, plus obavezna lista provere za sve što nije novo. Rezultat je da dva oglasa za
            istu mašinu postaju uporediva, i da „vidljivo korišćeno" znači istu stvar u Nišu i u
            Subotici. Cela referenca je na stranici{' '}
            <Link href="/kako-radi#ocene-stanja">kako radi</Link>.
          </p>

          <h3 className={s.h3}>3. Prodavac koji ima identitet</h3>
          <p className={s.p}>
            Privatno lice, prodavnica ili servis piše na svakoj kartici, a profil prodavca pokazuje
            od kada je na sajtu, koliko oglasa ima i da li je nalog verifikovan. Ne zato da bi se
            privatna prodaja obeshrabrila, nego zato
            što se od servisa traži račun i garancija, a od komšije se traži da uključi mašinu u
            struju dok gledaš.
          </p>
        </section>

        <section aria-labelledby="kako-radi">
          <h2 id="kako-radi" className={s.h2}>
            Šta Alatnica jeste, a šta nije
          </h2>
          <p className={s.p}>
            Alatnica je oglasnik: povezuje kupca i prodavca. Objava oglasa i poruke su besplatni.
            Kupovina se dogovara i plaća direktno između vas dvoje. Alatnica nije strana u
            prodaji, ne drži novac i ne šalje robu, pa uvek važi pravilo: alat se gleda i proba
            pre plaćanja.
          </p>
          <p className={s.p}>
            Ono što radimo je da oglas bude uporediv i pošten: ocena stanja iz pet definisanih,
            obavezna lista provere za polovan alat, prave fotografije i prodavac koji se zna po
            imenu. Oglas za koji se pokaže da ne odgovara oceni može da se prijavi, i tada ga
            pregledamo.
          </p>
          <p className={s.p}>
            Vodiči o SDS prihvatima, pregledu polovnog alata, akumulatorskim sistemima i razlikama
            među brendovima su pisani da budu korisni i kada kupuješ negde drugde.
          </p>
        </section>

        <section aria-labelledby="cega-nema">
          <h2 id="cega-nema" className={s.h2}>
            Čega namerno nema
          </h2>
          <ul className={s.lista}>
            <li>
              <strong>Teške mehanizacije.</strong> Bez kamiona, bagera i viljuškara. To je drugo
              tržište, sa drugim kupcem i drugim načinom provere, i ne pripada istoj taksonomiji.
            </li>
            <li>
              <strong>Plaćenih pozicija u rezultatima.</strong> Sortiranje je ono što piše u
              sortiranju. Oznaku „Izdvojeno" dodeljuje tim Alatnice kompletnim, proverenim
              oglasima, i ona uvek piše na kartici.
            </li>
            <li>
              <strong>Slobodnog opisa stanja.</strong> Opis postoji, ali ne može da zameni ocenu.
              Prodavac piše o mašini, ne o tome koliko je očuvana.
            </li>
            <li>
              <strong>Kataloških fotografija.</strong> Uz svaki oglas ide bar jedna fotografija
              konkretne mašine, ne slika sa sajta proizvođača.
            </li>
          </ul>
        </section>
      </div>

      <section className={`tamni-panel ${s.traka}`} aria-labelledby="dalje">
        <p className="micro">Kreni odavde</p>
        <h2 id="dalje" className={s.trakaNaslov}>
          Imaš alat koji ne koristiš? <span className="akcenat">Postavi oglas</span>
        </h2>
        <p className={s.trakaTekst}>
          Pet koraka: kategorija, detalji, provera stanja, fotografije i cena. Ili pogledaj šta je
          u ponudi i uključi filter po akumulatorskom sistemu, da vidiš samo ono što radi na
          baterijama koje već imaš.
        </p>
        <div className={s.trakaAkcije}>
          <Link href="/prodaj" className="btn btn-primary">
            Postavi oglas
          </Link>
          <Link href="/oglasi" className="btn btn-tertiary">
            Pogledaj oglase
          </Link>
          <Link href="/kako-radi" className="btn btn-tertiary">
            Kako radi
          </Link>
          <Link href="/kontakt" className="btn btn-tertiary">
            Kontakt
          </Link>
        </div>
      </section>
    </div>
  )
}
