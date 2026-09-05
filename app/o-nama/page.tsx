import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Ikona } from '@/components/Ikone'
import s from '@/components/staticne/Stranica.module.css'
import { sveKategorije, sviBrendovi, sviOglasi, sviProdavci } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'O nama',
  description:
    'Alatnica je marketplace za nov i polovan alat sa pravom taksonomijom, pet ocena stanja i poznatim prodavcem. Zašto postoji, šta radi drugačije i zašto je ovo demonstracija.',
  alternates: { canonical: '/o-nama' },
}

export default function ONamaStranica() {
  const brojke = [
    { vrednost: String(sviOglasi().length), oznaka: 'oglasa u demonstraciji' },
    { vrednost: String(sveKategorije().length), oznaka: 'kategorija i potkategorija' },
    { vrednost: String(sviBrendovi().length), oznaka: 'brendova sa svojom stranicom' },
    { vrednost: String(sviProdavci().length), oznaka: 'prodavaca sa profilom' },
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

      <div className={s.napomena}>
        <span className={s.napomenaIkona}>
          <Ikona ime="stit" velicina={16} />
        </span>
        <p>
          <strong className={s.napomenaNaslov}>Ovo je demonstracija, ne pravi oglasnik.</strong>
          Svi oglasi, prodavci, ocene, cene i recenzije su izmišljeni. Nijedna poruka se ne šalje,
          nijedan oglas se ne objavljuje, nijedna transakcija nije moguća, i nijedan prodavac sa
          ovog sajta ne postoji. Slike alata su generisane ilustracije, ne fotografije.
        </p>
      </div>

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
            KupujemProdajem ima sve. Ako u Srbiji neko prodaje ugaonu brusilicu, ona je tamo. Ali
            pretraga za „brusilica" vraća i akumulatorsku i mrežnu, i za drvo i za metal, i novu i
            onu koja ne radi, i to na način koji se ne može suziti. Kategorija „Alat i mašine" ima
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
            Privatno lice, prodavnica ili servis: sa vremenom odgovora, brojem oglasa, ocenom i
            oznakama, na svakoj kartici. Ne zato da bi se privatna prodaja obeshrabrila, nego zato
            što se od servisa traži račun i garancija, a od komšije se traži da uključi mašinu u
            struju dok gledaš.
          </p>
        </section>

        <section aria-labelledby="zasto-demo">
          <h2 id="zasto-demo" className={s.h2}>
            Zašto je ovo demonstracija
          </h2>
          <p className={s.p}>
            Alatnica je napravljena da pokaže kako bi izgledao vertikalni marketplace za alat kada
            bi se strukturi pristupilo ozbiljno. Podaci su izmišljeni jer je poenta u proizvodu:
            u tome kako se filtrira, kako se čita ocena stanja, kako izgleda oglas koji odgovara na
            pitanja pre nego što ih neko postavi.
          </p>
          <p className={s.p}>
            Sve što vidiš je funkcionalno na strani prikaza: filteri stvarno filtriraju, pretraga
            stvarno pretražuje, sačuvani oglasi ostaju u tvom pregledaču. Ono što ne postoji su
            poruke, nalozi i plaćanje, jer bi za to trebao pravi sistem sa pravim korisnicima, a to
            nije ono što se ovde pokazuje.
          </p>
          <p className={s.p}>
            Ono što jeste stvarno su vodiči i saveti o kupovini. Tekstovi o SDS prihvatima, pregledu
            polovnog alata, akumulatorskim sistemima i razlikama među brendovima su tačni i
            primenjivi na bilo kom oglasniku, uključujući onaj na kome ćeš zaista kupovati.
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
              sortiranju. Oznaka „Izdvojeno" postoji da bi se video prikaz istaknutog oglasa.
            </li>
            <li>
              <strong>Slobodnog opisa stanja.</strong> Opis postoji, ali ne može da zameni ocenu.
              Prodavac piše o mašini, ne o tome koliko je očuvana.
            </li>
            <li>
              <strong>Stock fotografija.</strong> Ilustracije su generisane i namerno izgledaju kao
              katalog, da bi bilo jasno da nisu fotografija konkretne mašine.
            </li>
          </ul>
        </section>
      </div>

      <section className={`tamni-panel ${s.traka}`} aria-labelledby="dalje">
        <p className="micro">Kreni odavde</p>
        <h2 id="dalje" className={s.trakaNaslov}>
          Najbrži način da vidiš <span className="akcenat">šta je poenta</span>
        </h2>
        <p className={s.trakaTekst}>
          Otvori oglase, uključi filter po akumulatorskom sistemu i pogledaj kako se lista skupi na
          ono što ti stvarno radi na punjaču koji imaš. Ili pročitaj referentnu tabelu ocena stanja.
          To je ceo proizvod u jednoj tabeli.
        </p>
        <div className={s.trakaAkcije}>
          <Link href="/oglasi" className="btn btn-primary">
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
