import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Ikona, type ImeIkone } from '@/components/Ikone'
import { STANJA, stanjeDefinicija, stanjeLabela } from '@/lib/format'
import type { Stanje } from '@/lib/types'
import s from './stranica.module.css'

export const metadata: Metadata = {
  title: 'Kako radi i sigurna kupovina',
  description:
    'Kako se kupuje i prodaje na Alatnici: pet ocena stanja sa punom definicijom, obavezna lista provere, saveti za plaćanje i pravila za susret uživo kada preuzimaš polovan alat.',
  alternates: { canonical: '/kako-radi' },
  openGraph: {
    type: 'website',
    title: 'Kako Alatnica radi · Sigurna kupovina alata',
    description:
      'Referentna tabela pet ocena stanja, obavezna lista provere, plaćanje i pravila za susret uživo.',
    url: '/kako-radi',
  },
}

/* ── Brza navigacija ──────────────────────────────────────────── */

const NAV = [
  { href: '#kupovina', tekst: 'Kupovina' },
  { href: '#prodaja', tekst: 'Prodaja' },
  { href: '#ocene-stanja', tekst: 'Ocene stanja' },
  { href: '#lista-provere', tekst: 'Lista provere' },
  { href: '#sigurna-kupovina', tekst: 'Sigurna kupovina' },
  { href: '#cesta-pitanja', tekst: 'Česta pitanja' },
]

/* ── Kupovina ─────────────────────────────────────────────────── */

const KUPOVINA = [
  {
    naslov: 'Suzi izbor, ne pretražuj',
    tekst:
      'Počni od kategorije, pa potkategorije, pa brenda. Ako već imaš baterije, prvi filter koji uključuješ je akumulatorski sistem: on odmah skloni sve što ti neće raditi na tvom punjaču, bez obzira što piše isti napon.',
    stavke: [
      'Cena od–do sužava listu brže od bilo kog drugog filtera.',
      'Filter „ima garanciju" izdvaja alat kupljen u poslednje dve godine.',
      'Tip prodavca razdvaja privatnu prodaju od prodavnice i servisa.',
    ],
    href: '/oglasi',
    hrefTekst: 'Otvori sve oglase',
  },
  {
    naslov: 'Pročitaj ocenu, ne opis',
    tekst:
      'Ocena stanja je jedina stvar u oglasu koja znači isto kod svakog prodavca. Opis je prodavčev tekst i tu se veruje na reč; ocena i lista provere su obavezne i uporedive između dva oglasa iste mašine.',
    stavke: [
      'Ocena stoji na kartici, na detalju i u filteru, uvek ista boja.',
      'Za sve što nije novo prodavac je morao da popuni listu provere.',
      'Crveni X na listi provere nije mana oglasa nego poštenje.',
    ],
    href: '#ocene-stanja',
    hrefTekst: 'Tabela ocena stanja',
  },
  {
    naslov: 'Uporedi sa cenom novog',
    tekst:
      'Polovna mašina ima smisla kada je razlika prema novoj veća od cene servisa koji joj eventualno predstoji. Za većinu elektroalata to znači da ispod 25 odsto popusta prema novom retko vredi kupovati polovno.',
    stavke: [
      'Isti model pretraži i u novom stanju da vidiš raspon.',
      'Dodaj cenu potrošnog materijala koji ne ide uz mašinu.',
      'Za akumulatorski alat računaj bateriju posebno: ona je pola cene.',
    ],
    href: '/vodici/polovan-alat-na-sta-obratiti-paznju',
    hrefTekst: 'Vodič o polovnom alatu',
  },
  {
    naslov: 'Pitaj konkretno',
    tekst:
      'Poruka „da li je dostupno" ne donosi nijednu informaciju. Pitanja na koja se ne može odgovoriti sa „jeste" razdvajaju prodavca koji zna mašinu od preprodavca koji je juče preuzeo pet komada.',
    stavke: [
      'Koliko dugo je kod tebe i za šta si je koristio?',
      'Postoji li račun i kada je poslednji put servisirana?',
      'Mogu li da je isprobam pod opterećenjem kod tebe?',
    ],
    href: '#sigurna-kupovina',
    hrefTekst: 'Pravila za dogovor',
  },
  {
    naslov: 'Vidi je uživo i testiraj',
    tekst:
      'Susret na javnom mestu, danju, sa strujom u blizini. Bez struje nema testa pod opterećenjem, a bez tog testa kupuješ fotografiju. Za akumulatorski alat traži da baterija bude napunjena pre dolaska.',
    stavke: [
      'Slušaj mašinu na praznom hodu pre nego što bilo šta pitaš.',
      'Proveri sve režime rada i položaje sklopke.',
      'Uporedi serijski broj sa računom ako račun postoji.',
    ],
    href: '#susret',
    hrefTekst: 'Kako izgleda dobar susret',
  },
  {
    naslov: 'Plati kada mašina radi',
    tekst:
      'Novac se predaje tek kada si je uključio i video da radi ono zbog čega je kupuješ. Kapara pre nego što si mašinu video je najčešći način da se izgubi novac na oglasnicima, i nijedna platforma to ne može da vrati.',
    stavke: [
      'Za kurirsku dostavu koristi otkupninu i pregled pošiljke.',
      'Sačuvaj prepisku i oglas. To je jedini pisani trag o dogovoru.',
      'Traži izjavu o ispravnosti u poruci, ne usmeno.',
    ],
    href: '#placanje',
    hrefTekst: 'Saveti za plaćanje',
  },
]

/* ── Prodaja ──────────────────────────────────────────────────── */

const PRODAJA = [
  {
    naslov: 'Kategorija',
    tekst:
      'Biraš list u stablu, ne široku grupu. „Ugaone brusilice" umesto „elektroalat" znači da te vidi kupac koji već zna šta traži, i da tvoj oglas uđe u sve unakrsne linkove sa brendova i vodiča.',
  },
  {
    naslov: 'Detalji',
    tekst:
      'Brend, model, godište, specifikacije i opis svojim rečima. Model se upisuje tačno, sa oznakom: GBH 2-26 DFR, ne „bosch čekić". Za akumulatorski alat obavezno biraš sistem, jer se po njemu filtrira.',
  },
  {
    naslov: 'Ocena stanja i lista provere',
    tekst:
      'Biraš jednu od pet ocena i, za sve što nije novo, popunjavaš listu provere. Iskreno popunjena lista sa dva minusa prodaje bolje od prazne liste sa pet plusa. Kupci prepoznaju razliku i ne dolaze da se cenkaju na licu mesta.',
  },
  {
    naslov: 'Fotografije',
    tekst:
      'Pet fotografija koje rešavaju devedeset posto poruka: cela mašina na neutralnoj podlozi, pločica sa modelom i serijskim brojem, prihvat ili glava izbliza, kabl i sklopka, i sve što ide uz mašinu poređano zajedno.',
  },
  {
    naslov: 'Cena, lokacija i objava',
    tekst:
      'Cena sa oznakom da li je fiksna ili se pregovara, grad i način isporuke. Oglas se pojavljuje u svim kategorijama i filterima u koje po podacima spada. Nema dodatnog razvrstavanja, ni skrivenih pozicija koje se plaćaju.',
  },
]

/* ── Ocene stanja — referentna tabela ─────────────────────────── */

const PRAKSA: Record<Stanje, { uzivo: string; traziti: string }> = {
  novo: {
    uzivo:
      'Fabrički zapakovano, folija na kućištu, pribor u originalnim kesicama. Ako je kutija otvarana, to više nije novo nego kao novo.',
    traziti: 'Fiskalni račun ili otpremnicu i datum kupovine. Od njega teče garancija.',
  },
  'kao-novo': {
    uzivo:
      'Nekoliko sati rada, bez ogrebotina na kućištu i bez tragova na prihvatu. Sav pribor i kofer su tu, ugljene četkice su praktično netaknute.',
    traziti: 'Razlog prodaje i račun. Najčešći iskren odgovor je „kupljena za jedan posao".',
  },
  'koristeno-ispravno': {
    uzivo:
      'Vidljivi tragovi rada na kućištu i koferu, mašina radi bez zastoja i bez neobičnih zvukova. Ovo je najveći deo ponude polovnog alata i po pravilu najbolja kupovina.',
    traziti: 'Test pod opterećenjem i podatak da li je i kada menjana četkica ili ležaj.',
  },
  'vidljivo-koristeno': {
    uzivo:
      'Radi, ali nedostaje pribor, kofer ili štitnik, ili je kućište ozbiljno oštećeno. Često znači i kabl koji je negde skraćivan ili menjan.',
    traziti: 'Šta tačno nedostaje i koliko košta da se to nadoknadi. To je stvarna cena mašine.',
  },
  'za-delove': {
    uzivo:
      'Ne radi ili radi delimično i tako se i prodaje. Kupuje se zbog kućišta, statora, prenosa ili prihvata, nikada zbog nade da će proraditi.',
    traziti: 'Precizan opis kvara i izričitu potvrdu u poruci da se prodaje kao neispravna.',
  },
}

/* ── Lista provere ────────────────────────────────────────────── */

const PROVERA: { ok: boolean; tekst: string }[] = [
  { ok: true, tekst: 'Mašina se uključuje i drži obrtaje na pola gasa' },
  { ok: true, tekst: 'Prihvat drži alat bez rotacionog zazora' },
  { ok: true, tekst: 'Kabl i sklopka bez oštećenja i bez izolir-trake' },
  { ok: true, tekst: 'Svi režimi rada se prebacuju i drže pod opterećenjem' },
  { ok: false, tekst: 'Originalni kofer: nedostaje' },
  { ok: false, tekst: 'Bočna ručka i graničnik dubine: nedostaju' },
]

/* ── Sigurna kupovina ─────────────────────────────────────────── */

type Pravilo = { ikona: ImeIkone; naslov: string; tekst: string; vrsta?: 'amber' | 'crvena' }

const PLACANJE: Pravilo[] = [
  {
    ikona: 'cek',
    naslov: 'Gotovina uz mašinu, u ruci',
    tekst:
      'Najsigurniji način plaćanja polovnog alata je i najstariji: novac i mašina menjaju vlasnika u istom trenutku, posle testa. Bez međukoraka nema ni mesta gde se nešto može izgubiti.',
  },
  {
    ikona: 'kamion',
    naslov: 'Kurirska dostava: uvek otkupnina',
    tekst:
      'Ako se šalje kurirom, plaća se pouzećem i traži se pregled pošiljke pre plaćanja. Kurirske službe u Srbiji tu uslugu imaju; prodavac koji je odbija, odbija je s razlogom.',
  },
  {
    ikona: 'x',
    naslov: 'Nikad kapara unapred',
    tekst:
      'Rezervacija uplatom na račun ili preko brzog transfera je najčešća prevara na oglasnicima. Alatnica nema sistem rezervacije i nikada neće tražiti da uplatiš bilo šta platformi.',
    vrsta: 'crvena',
  },
  {
    ikona: 'prodavnica',
    naslov: 'Od prodavnice i servisa traži račun',
    tekst:
      'Pravno lice mora da izda fiskalni račun i on je jedini dokaz za garanciju. Kod polovnog alata prodatog uz račun garancija je po zakonu najmanje šest meseci, i to se ne dogovara usmeno.',
  },
]

const SUSRET: Pravilo[] = [
  {
    ikona: 'lokacija',
    naslov: 'Javno mesto, danju, sa strujom',
    tekst:
      'Parking tržnog centra, benzinska stanica ili radionica: mesto gde ima ljudi i gde ima utičnice. Test pod opterećenjem nije moguć na trotoaru, a bez njega se kupuje fotografija.',
    vrsta: 'amber',
  },
  {
    ikona: 'osoba',
    naslov: 'Idi sa još nekim',
    tekst:
      'Drugi par ruku pomaže i tehnički: dok ti držiš mašinu pod opterećenjem, neko drugi sluša i gleda dim ili varnice na kolektoru. Za skuplje mašine to je pola pregleda.',
  },
  {
    ikona: 'baterija',
    naslov: 'Baterije napunjene pre dolaska',
    tekst:
      'Dogovori se da akumulatori budu puni. Baterija koja pokazuje pun indikator a padne posle trideset sekundi rezanja je istrošena, i to se vidi jedino pod opterećenjem.',
  },
  {
    ikona: 'oko',
    naslov: 'Uporedi serijski broj sa računom',
    tekst:
      'Ako uz mašinu ide račun, broj sa pločice mora da se poklopi. Nepoklapanje ne znači automatski da je nešto sporno, ali znači da račun ne važi kao dokaz o poreklu te mašine.',
  },
]

const ZASTAVICE: Pravilo[] = [
  {
    ikona: 'x',
    naslov: 'Slika skinuta sa sajta proizvođača',
    tekst:
      'Katalog-fotografija za polovnu mašinu znači da mašinu ili nemaš pred sobom, ili ne želiš da je pokažeš. Traži fotografiju iz ugla koji ti sam odrediš.',
    vrsta: 'crvena',
  },
  {
    ikona: 'x',
    naslov: 'Cena znatno ispod tržišne',
    tekst:
      'Ako je isti model svuda 40.000 a ovde je 18.000, to nije prilika nego signal. Najčešće znači ukradenu mašinu, kopiju ili kvar koji nije upisan u ocenu stanja.',
    vrsta: 'crvena',
  },
  {
    ikona: 'x',
    naslov: 'Žurba i pritisak da se rezerviše',
    tekst:
      '„Imam još dvojicu zainteresovanih, pošalji kaparu" je rečenica koja ne postoji u poštenoj prodaji. Ozbiljan prodavac će sačekati da dođeš i pogledaš.',
    vrsta: 'crvena',
  },
  {
    ikona: 'x',
    naslov: 'Razgovor beži sa platforme',
    tekst:
      'Insistiranje da se odmah pređe na aplikaciju za poruke, pa slanje linka za „bezbedno plaćanje", je klasičan obrazac. Zadrži dogovor tamo gde ostaje pisani trag.',
    vrsta: 'crvena',
  },
]

/* ── Česta pitanja ────────────────────────────────────────────── */

const PITANJA = [
  {
    p: 'Da li Alatnica naplaćuje objavu oglasa?',
    o: 'Ne. Objava je besplatna i nema plaćenih pozicija u rezultatima. Oglasi označeni sa „Izdvojeno" u ovoj demonstraciji postoje da bi se video prikaz istaknutog oglasa, a ne zato što je neko nešto platio.',
  },
  {
    p: 'Ko proverava oglase označene sa „Provereno"?',
    o: 'Oznaka znači da su podaci iz oglasa upoređeni sa fotografijama i sa serijskim brojem sa pločice. Ona ne garantuje ispravnost mašine. Ispravnost potvrđuje jedino tvoj test uživo.',
  },
  {
    p: 'Šta ako mašina posle kupovine ne radi?',
    o: 'Kod kupovine od privatnog lica važi ono što ste se dogovorili u prepisci, zato se dogovor piše, a ne izgovara. Kod prodavnice i servisa važi zakonska garancija na polovnu robu, najmanje šest meseci, uz račun.',
  },
  {
    p: 'Zašto se stanje ne piše slobodnim tekstom?',
    o: 'Zato što „kao novo, bez ijedne greške" ne znači ništa i ne obavezuje nikoga. Pet ocena sa objavljenom definicijom je jedini način da dva oglasa za istu mašinu budu uporediva.',
  },
  {
    p: 'Kako filter po akumulatorskom sistemu zna šta je kompatibilno?',
    o: 'Svaki akumulatorski oglas nosi oznaku sistema, na primer 18V Makita LXT, a ne samo napon. Osamnaest volti kod Makite i osamnaest volti kod Boscha su dva različita sistema i filter ih tretira odvojeno.',
  },
  {
    p: 'Da li mogu da prodam alat koji ne radi?',
    o: 'Možeš, uz ocenu „Za delove" i opis konkretnog kvara. To je legitimna kategorija ponude: servisi i majstori redovno kupuju neispravne mašine zbog kućišta, prenosa i prihvata.',
  },
]

export default function KakoRadiStranica() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: PITANJA.map((q) => ({
      '@type': 'Question',
      name: q.p,
      acceptedAnswer: { '@type': 'Answer', text: q.o },
    })),
  }

  return (
    <div className={`container ${s.strana}`}>
      <Breadcrumbs
        stavke={[{ naziv: 'Početna', href: '/' }, { naziv: 'Kako radi' }]}
        className={s.mrvice}
      />

      <header className={s.uvod}>
        <p className="micro">Pravila platforme</p>
        <h1 className={s.naslov}>Kako Alatnica radi</h1>
        <p className={s.lede}>
          Alatnica ne posreduje u plaćanju, ne drži robu i ne garantuje za mašine. Ono što radi je
          da svaki oglas natera u istu strukturu: prava kategorija, jedna od pet ocena stanja sa
          objavljenom definicijom, obavezna lista provere i prodavac koji ima ime, tip i istoriju.
          Ova stranica je referenca za sve to, plus ono što nijedna platforma ne može da uradi
          umesto tebe: pregled i plaćanje.
        </p>
      </header>

      <nav className={`chip-traka ${s.brzaNav}`} aria-label="Sadržaj stranice">
        {NAV.map((n) => (
          <a key={n.href} href={n.href} className="chip">
            {n.tekst}
          </a>
        ))}
      </nav>

      {/* ── Kupovina ──────────────────────────────────────────── */}
      <section id="kupovina" className={s.sekcija} aria-labelledby="kupovina-naslov">
        <p className="micro">Kupovina, korak po korak</p>
        <h2 id="kupovina-naslov" className={s.sekcijaNaslov}>
          Kako se kupuje
        </h2>
        <p className={s.sekcijaUvod}>
          Šest koraka od pretrage do plaćanja. Prva tri se rade iz fotelje i sužavaju izbor na dve
          do tri mašine; poslednja tri se rade uživo i tu se odlučuje da li si dobro kupio.
        </p>

        <ol className={s.koraci}>
          {KUPOVINA.map((k, i) => (
            <li key={k.naslov} className={`card ${s.korak}`}>
              <span className={s.korakBroj} aria-hidden="true">
                {i + 1}
              </span>
              <h3 className={s.korakNaslov}>{k.naslov}</h3>
              <p className={s.korakTekst}>{k.tekst}</p>
              <ul className={s.korakLista}>
                {k.stavke.map((st) => (
                  <li key={st}>{st}</li>
                ))}
              </ul>
              <p className={s.korakVeza}>
                <Link href={k.href}>{k.hrefTekst}</Link>
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Prodaja ───────────────────────────────────────────── */}
      <section id="prodaja" className={s.sekcija} aria-labelledby="prodaja-naslov">
        <p className="micro">Prodaja, korak po korak</p>
        <h2 id="prodaja-naslov" className={s.sekcijaNaslov}>
          Kako se prodaje
        </h2>
        <p className={s.sekcijaUvod}>
          Pet koraka u obrascu za oglas. Traže više podataka nego što si navikao na oglasnicima, i
          to je namerno: sve što upišeš jednom je pitanje na koje ne moraš deset puta da odgovaraš u
          porukama.
        </p>

        <ol className={s.koraci}>
          {PRODAJA.map((k, i) => (
            <li key={k.naslov} className={`card ${s.korak}`}>
              <span className={`${s.korakBroj} ${s.korakBrojAmber}`} aria-hidden="true">
                {i + 1}
              </span>
              <h3 className={s.korakNaslov}>{k.naslov}</h3>
              <p className={s.korakTekst}>{k.tekst}</p>
            </li>
          ))}
        </ol>

        <p className={s.korakVeza}>
          <Link href="/prodaj">Postavi oglas</Link>
        </p>
      </section>

      {/* ── Ocene stanja ──────────────────────────────────────── */}
      <section id="ocene-stanja" className={s.sekcija} aria-labelledby="ocene-naslov">
        <p className="micro">Rečnik Alatnice</p>
        <h2 id="ocene-naslov" className={s.sekcijaNaslov}>
          Pet ocena stanja
        </h2>
        <p className={s.sekcijaUvod}>
          Ovo je referentna tabela. Definicija u srednjoj koloni je ista na kartici oglasa, u
          filteru, u obrascu za prodaju i u svakom vodiču. Prodavac bira ocenu, ali je ne piše i ne
          menja svojim rečima.
        </p>

        <div className={s.tabelaOkvir}>
          <table className={s.tabela}>
            <caption>Ocene stanja i šta znače u praksi</caption>
            <thead>
              <tr>
                <th scope="col">Ocena</th>
                <th scope="col">Definicija</th>
                <th scope="col">Šta to znači kada dođeš po nju</th>
                <th scope="col">Traži od prodavca</th>
              </tr>
            </thead>
            <tbody>
              {STANJA.map((g) => (
                <tr key={g}>
                  <th scope="row">
                    <span className={`stanje-chip stanje-${g} ${s.oznakaOcene}`}>
                      {stanjeLabela(g)}
                    </span>
                  </th>
                  <td data-oznaka="Definicija">{stanjeDefinicija(g)}</td>
                  <td data-oznaka="U praksi">{PRAKSA[g].uzivo}</td>
                  <td data-oznaka="Traži">{PRAKSA[g].traziti}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Lista provere ─────────────────────────────────────── */}
      <section id="lista-provere" className={s.sekcija} aria-labelledby="provera-naslov">
        <p className="micro">Obavezno za sve što nije novo</p>
        <h2 id="provera-naslov" className={s.sekcijaNaslov}>
          Lista provere
        </h2>
        <p className={s.sekcijaUvod}>
          Uz ocenu stanja, prodavac popunjava listu stavki koje se mogu proveriti za minut. Lista se
          prikazuje na oglasu onakva kakva je, sa kvačicama i sa iksevima. Ovako izgleda popunjena
          lista za jednu rotacionu bušilicu ocenjenu kao „Vidljivo korišćeno":
        </p>

        <ul className={s.provera}>
          {PROVERA.map((p) => (
            <li key={p.tekst} className={s.proveraStavka}>
              <span className={p.ok ? s.proveraDa : `${s.proveraDa} ${s.proveraNe}`}>
                <Ikona ime={p.ok ? 'cek' : 'x'} velicina={15} />
                <span className="sr-only">{p.ok ? 'Ispunjeno' : 'Nije ispunjeno'}</span>
              </span>
              {p.tekst}
            </li>
          ))}
        </ul>

        <div className={s.pod}>
          <h3 className={s.podNaslov}>Zašto se isplati biti iskren</h3>
          <p className={s.podTekst}>
            Oglas sa dva iksa na listi dobija manje poruka, ali dobija ozbiljne. Prazna lista sa svih
            pet kvačica na mašini iz 2016. godine ne uverava nikoga i završava se cenkanjem na licu
            mesta, kada su obojica već potrošili sat vremena. Kupci koji dolaze na oglas sa poštenom
            listom znaju šta kupuju i retko odustaju.
          </p>
        </div>
      </section>

      {/* ── Sigurna kupovina ──────────────────────────────────── */}
      <section id="sigurna-kupovina" className={s.sekcija} aria-labelledby="sigurno-naslov">
        <p className="micro">Ono što platforma ne može umesto tebe</p>
        <h2 id="sigurno-naslov" className={s.sekcijaNaslov}>
          Sigurna kupovina
        </h2>
        <p className={s.sekcijaUvod}>
          Alatnica ne drži novac u depozitu i ne posreduje u plaćanju. To znači da pravila ispod
          nisu preporuka nego jedina zaštita koju stvarno imaš, i sva su besplatna.
        </p>

        <div id="placanje" className={s.pod}>
          <h3 className={s.podNaslov}>Plaćanje</h3>
          <p className={s.podTekst}>
            Pravilo je jedno: novac se predaje tek kada mašina radi pred tobom. Sve ostalo su
            varijacije na tu temu.
          </p>
          <ul className={s.pravila}>
            {PLACANJE.map((p) => (
              <li key={p.naslov} className={`card ${s.pravilo}`}>
                <span
                  className={[
                    s.pravilolkona,
                    p.vrsta === 'crvena' ? s.pravilolkonaCrvena : '',
                    p.vrsta === 'amber' ? s.pravilolkonaAmber : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <Ikona ime={p.ikona} velicina={17} />
                </span>
                <div>
                  <h4 className={s.pravilNaslov}>{p.naslov}</h4>
                  <p className={s.pravilTekst}>{p.tekst}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div id="susret" className={s.pod}>
          <h3 className={s.podNaslov}>Susret uživo</h3>
          <p className={s.podTekst}>
            Pregled alata traje deset minuta i zahteva utičnicu. Dogovori susret tako da to bude
            moguće, jer ako nije, nema šta da se pregleda.
          </p>
          <ul className={s.pravila}>
            {SUSRET.map((p) => (
              <li key={p.naslov} className={`card ${s.pravilo}`}>
                <span
                  className={[
                    s.pravilolkona,
                    p.vrsta === 'amber' ? s.pravilolkonaAmber : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <Ikona ime={p.ikona} velicina={17} />
                </span>
                <div>
                  <h4 className={s.pravilNaslov}>{p.naslov}</h4>
                  <p className={s.pravilTekst}>{p.tekst}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div id="crvene-zastavice" className={s.pod}>
          <h3 className={s.podNaslov}>Crvene zastavice u oglasu i prepisci</h3>
          <p className={s.podTekst}>
            Nijedna od ovih stvari sama po sebi ne znači prevaru. Dve zajedno u istom oglasu znače da
            ne treba da ideš.
          </p>
          <ul className={s.pravila}>
            {ZASTAVICE.map((p) => (
              <li key={p.naslov} className={`card ${s.pravilo}`}>
                <span className={`${s.pravilolkona} ${s.pravilolkonaCrvena}`}>
                  <Ikona ime={p.ikona} velicina={17} />
                </span>
                <div>
                  <h4 className={s.pravilNaslov}>{p.naslov}</h4>
                  <p className={s.pravilTekst}>{p.tekst}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Česta pitanja ─────────────────────────────────────── */}
      <section id="cesta-pitanja" className={s.sekcija} aria-labelledby="pitanja-naslov">
        <p className="micro">Česta pitanja</p>
        <h2 id="pitanja-naslov" className={s.sekcijaNaslov}>
          Ono što se najčešće pita
        </h2>

        <div className={s.pitanja}>
          {PITANJA.map((q) => (
            <div key={q.p} className={s.pitanje}>
              <h3 className={s.pitanjeNaslov}>{q.p}</h3>
              <p className={s.pitanjeOdgovor}>{q.o}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tamna traka ───────────────────────────────────────── */}
      <section className={`tamni-panel ${s.traka}`} aria-labelledby="demo-naslov">
        <p className="micro">Budi svestan</p>
        <h2 id="demo-naslov" className={s.trakaNaslov}>
          Ovo je <span className="akcenat">demonstracija proizvoda</span>
        </h2>
        <p className={s.trakaTekst}>
          Svi oglasi, prodavci, ocene, cene i recenzije na Alatnici su izmišljeni radi prikaza kako
          proizvod radi. Nijedna poruka se ne šalje, nijedan oglas se ne objavljuje i nijedna
          transakcija nije moguća. Slike alata su generisane ilustracije, ne fotografije.
        </p>
        <p className={s.trakaTekst}>
          Saveti o pregledu alata, plaćanju i susretu uživo na ovoj stranici su, međutim, stvarni i
          primenjivi na bilo kom oglasniku. Zato i stoje ovde.
        </p>
        <div className={s.trakaAkcije}>
          <Link href="/oglasi" className="btn btn-primary">
            Pogledaj oglase
          </Link>
          <Link href="/vodici" className="btn btn-tertiary">
            Vodiči za kupovinu
          </Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  )
}
