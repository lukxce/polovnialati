/**
 * Alatnica — vodiči za kupovinu (SPEC §7).
 *
 * Sadržaj je strukturiran, ne MDX: blokovi su tipizirani pa se render i
 * JSON-LD grade iz istog izvora. Inline linkovi se pišu kao [tekst](/putanja)
 * i razrešavaju se u `components/vodici/Tekst.tsx`.
 */

export type Blok =
  | { tip: 'p'; tekst: string }
  | { tip: 'h2'; tekst: string; id: string }
  | { tip: 'h3'; tekst: string }
  | { tip: 'lista'; stavke: string[] }
  | { tip: 'koraci'; stavke: string[] }
  | { tip: 'tabela'; zaglavlje: string[]; redovi: string[][] }
  | { tip: 'napomena'; naslov: string; tekst: string }

export type Veza = { naziv: string; href: string; opis: string }

export type Vodic = {
  slug: string
  naslov: string
  /** Kratak podnaslov ispod H1. */
  podnaslov: string
  /** Meta description. */
  opis: string
  /** ISO datum objave. */
  datum: string
  /** Kratka oznaka teme za karticu u listi. */
  tema: string
  /** Ključno u par rečenica — kutija na vrhu članka. */
  kljucno: string[]
  blokovi: Blok[]
  veze: Veza[]
}

export const vodici: Vodic[] = [
  /* ═══════════════════════════════════════════════════════════════
     1. Kako izabrati rotacionu bušilicu
     ═══════════════════════════════════════════════════════════════ */
  {
    slug: 'kako-izabrati-rotacionu-busilicu',
    naslov: 'Kako izabrati rotacionu bušilicu',
    podnaslov:
      'SDS-plus ili SDS-max, koliko džula ti stvarno treba i kada je jeftina mašina sasvim dovoljna.',
    opis:
      'Praktičan vodič za izbor rotacione bušilice: razlika između SDS-plus i SDS-max prihvata, šta znače džuli udarne energije i u kojim slučajevima jeftina mašina radi posao jednako dobro.',
    datum: '2026-05-18',
    tema: 'Elektroalat',
    kljucno: [
      'Prihvat je važniji od marke: SDS-plus za sve do 30 mm, SDS-max od 40 mm naviše.',
      'Džuli udarne energije govore koliko mašina buši. Vati govore samo koliko struje troši.',
      'Za nekoliko rupa godišnje jeftina mašina od 12.000 dinara je racionalan izbor.',
      'Za svakodnevni rad platiti se isplati samo ako mašina ima dostupan servis u Srbiji.',
      'Kod polovne mašine prvo se sluša ležaj, pa gleda SDS prihvat, pa proverava sklopka.',
    ],
    blokovi: [
      {
        tip: 'p',
        tekst:
          'Rotaciona bušilica je mašina koju većina ljudi kupi jednom u deceniji i onda se pola te decenije nervira zbog izbora. Razlog je skoro uvek isti: kupljena je po vatima i po ceni, a ne po prihvatu i po udarnoj energiji. Ovaj tekst je pokušaj da se ta odluka svede na tri pitanja koja stvarno određuju da li ćeš biti zadovoljan.',
      },
      {
        tip: 'p',
        tekst:
          'Ako preskočiš sve ostalo, zapamti ovo: prvo odrediš najveću rupu koju ćeš realno bušiti, iz toga sledi tip prihvata, iz prihvata sledi klasa mašine, i tek onda se gleda cena. Obrnutim redom se dolazi do mašine koja je ili preslaba za ono što radiš, ili preteška da bi je uzeo u ruke za sitnicu.',
      },

      { tip: 'h2', tekst: 'Šta rotaciona bušilica radi drugačije', id: 'sta-radi-drugacije' },
      {
        tip: 'p',
        tekst:
          'Obična udarna bušilica pravi udar tako što dva nazubljena diska preskaču jedan preko drugog dok se glava okreće. Udar je slab, zavisi od toga koliko ti pritiskaš mašinu, i beton se u praksi više struže nego što se razbija. Rotaciona bušilica ima pneumatski udarni mehanizam: klip u cilindru pokreće vazdušni jastuk koji lupa u udarnik, a udarnik u burgiju. Zbog toga mašina od 800 W probije armirani beton lakše nego udarna bušilica od 1100 W, i zbog toga se udarna energija meri u džulima, a ne u vatima.',
      },
      {
        tip: 'p',
        tekst:
          'Praktična posledica: rotacionu bušilicu ne treba gurati. Ako moraš da se naslanjaš na nju da bi ušla u beton, ili je burgija tupa, ili je mehanizam istrošen. To je ujedno i najbrži test polovne mašine.',
      },

      { tip: 'h2', tekst: 'SDS-plus ili SDS-max: to je prva odluka', id: 'sds-plus-ili-max' },
      {
        tip: 'p',
        tekst:
          'SDS je sistem prihvata burgije bez stezne glave: burgija se ubaci, zaključa i ima nekoliko milimetara slobodnog hoda po dužini, što je i poenta. SDS-plus ima drške prečnika 10 mm, SDS-max 18 mm. To nisu dve veličine iste stvari nego dve različite klase mašina, i burgije nisu međusobno zamenjive.',
      },
      {
        tip: 'tabela',
        zaglavlje: ['', 'SDS-plus', 'SDS-max'],
        redovi: [
          ['Prečnik drške', '10 mm', '18 mm'],
          ['Tipična masa mašine', '2,5–4,5 kg', '5,5–12 kg'],
          ['Udarna energija', '1,5–3,5 J', '5–20 J'],
          ['Rupe u betonu', 'do 30 mm', '25–65 mm i krune preko 100 mm'],
          ['Za šta se stvarno koristi', 'Ankeri, tiplovi, instalacije, sitno štemovanje', 'Prodori kroz ploču, rušenje, nabijanje uzemljenja'],
          ['Cena novo', 'od 12.000 do 90.000 din', 'od 45.000 do 300.000 din'],
        ],
      },
      {
        tip: 'p',
        tekst:
          'Devedeset posto kupaca treba SDS-plus. Ako kačiš bojler, bušiš rupe za tiplove, provlačiš instalacije i povremeno oboriš neku pregradu čekić-dletom, SDS-plus mašina od 3 do 3,5 J je gornja granica onoga što će ti ikada trebati. Pogledaj šta se nudi u kategoriji [rotacione bušilice (SDS)](/kategorija/elektroalat/rotacione-busilice-sds) i primetićeš da se ceo raspon cena vrti oko te iste klase.',
      },
      {
        tip: 'p',
        tekst:
          'SDS-max se kupuje kada se rupa meri kroz nosivu ploču, kada se radi sa krunama preko 100 mm, ili kada je posao rušenje. To je mašina koja se drži sa dve ruke i koja te umori za deset minuta. Ako ti treba dva puta godišnje, iznajmi je. Dnevni najam u Srbiji je oko 2.500 do 4.000 dinara, a nova košta koliko i polovan automobil koji ti stvarno treba.',
      },
      {
        tip: 'napomena',
        naslov: 'Ne postoji „SDS" bez sufiksa',
        tekst:
          'Kada u oglasu piše samo „SDS bušilica", to je skoro uvek SDS-plus, ali pitaj. Postoji i stariji SDS-top (14 mm) koji je praktično izumro i za koji je burgije danas teško naći. Ako prodavac ne zna koji prihvat ima, traži fotografiju drške burgije: SDS-plus ima dva izdužena žleba i dva zatvorena, SDS-max ima tri otvorena žleba.',
      },

      { tip: 'h2', tekst: 'Džuli su jedini broj koji stvarno poredi mašine', id: 'dzuli' },
      {
        tip: 'p',
        tekst:
          'Udarna energija u džulima je jedina specifikacija koja se može direktno porediti između proizvođača. Vati mere potrošnju, ne učinak: mašina sa lošijim mehanizmom troši više struje za isti udar. Broj udara u minuti (BPM) je bez konteksta beskoristan: mašina sa 5.000 slabih udara buši sporije od mašine sa 3.000 jakih.',
      },
      {
        tip: 'lista',
        stavke: [
          '1,2–2,0 J: laka klasa. Tiplovi do 10 mm, gips i blok. Za stan sasvim dovoljno.',
          '2,0–3,0 J: najprodavanija klasa. Ankeri do 16 mm, rupe do 24 mm, povremeno štemovanje.',
          '3,0–4,0 J: teža SDS-plus klasa. Svakodnevni rad, krune do 80 mm, armiran beton bez drame.',
          '5–10 J: SDS-max ulazna klasa. Prodori, veće krune, ozbiljno rušenje.',
          '10–20 J: teška SDS-max klasa i mašine za rušenje. Specijalizovan alat, ne prva mašina.',
        ],
      },
      {
        tip: 'p',
        tekst:
          'Jedna zamka: neki proizvođači prijavljuju energiju po EPTA proceduri, a neki „maksimalnu". Ako dve mašine iste mase imaju razliku od 40 posto u deklarisanim džulima, verovatnija je razlika u načinu merenja nego u mehanizmu. Masa mašine je grubi ali pošten kontrolni broj: SDS-plus mašina od 2,6 kg fizički ne može da isporuči 4 J.',
      },

      { tip: 'h2', tekst: 'Kada je jeftina mašina sasvim dovoljna', id: 'kad-je-jeftino-dovoljno' },
      {
        tip: 'p',
        tekst:
          'Postoji uporno uverenje da je jeftin alat uvek bacanje para. Nije tačno. Samo je granica na drugom mestu nego što se misli. Rotaciona bušilica od 12.000 do 18.000 dinara ([Villager](/brend/villager), [Total](/brend/total), [Ingco](/brend/ingco), [Einhell](/brend/einhell)) izbušiće nekoliko stotina rupa bez problema. Ako godišnje izbušiš trideset rupa, ta mašina će te nadživeti u praktičnom smislu.',
      },
      {
        tip: 'p',
        tekst:
          'Ono što se kod jeftinih mašina štedi je uglavnom: kvalitet ležajeva, antivibracioni sistem, elektronska regulacija i dostupnost delova. Prvo se oseti na desetom satu neprekidnog rada, drugo posle pola dana štemovanja, treće nikad ako ne radiš precizne stvari, a četvrto tek kada se nešto pokvari. Za povremenog korisnika sva četiri troška su teorijska.',
      },
      {
        tip: 'p',
        tekst:
          'Granica se prelazi kada mašina zarađuje. Ako te kvar košta izgubljen radni dan, cena mašine više nije relevantna: relevantno je koliko brzo dobiješ zamenu i deo. Tu [Bosch Professional](/brend/bosch-professional) i [Makita](/brend/makita) imaju stvarnu prednost u Srbiji zbog gustine servisa, a [Hilti](/brend/hilti) zbog modela u kome ti daju zamensku mašinu dok je tvoja na popravci.',
      },

      { tip: 'h2', tekst: 'Šta gledati na polovnoj rotacionoj bušilici', id: 'polovna' },
      {
        tip: 'koraci',
        stavke: [
          'Uključi je bez burgije i slušaj. Ravnomerno zujanje je u redu; zveckanje ili grebanje na praznom hodu znači ležaj ili istrošen udarni mehanizam.',
          'Ubaci burgiju i zaključaj je. Mora da ima nekoliko milimetara uzdužnog hoda i nula rotacionog zazora. Ako se burgija okreće u prihvatu, SDS čaura je gotova.',
          'Prebaci sve režime: bušenje, bušenje sa udarom, samo udar. Poluga mora da klikne u svaku poziciju i da tu ostane pod opterećenjem.',
          'Proveri sklopku: mašina mora da drži konstantne obrtaje na pola gasa. Ako varira, elektronika je na izlasku.',
          'Pogledaj kabl po celoj dužini, posebno prvih 30 cm od kućišta. Zamotan izolir-traka je crvena zastavica, ne sitnica.',
          'Traži da probušiš jednu rupu u betonu na licu mesta. Mašina koja ne ulazi u beton pod sopstvenom težinom ide u sledeću ocenu stanja, ma šta pisalo u oglasu.',
        ],
      },
      {
        tip: 'p',
        tekst:
          'Uz mašinu obavezno traži i kofer, dodatnu ručku i graničnik dubine. Zvuči kao sitnica dok ne pokušaš da kupiš originalnu bočnu ručku posebno. Detaljniji postupak pregleda je u vodiču [na šta obratiti pažnju kod polovnog alata](/vodici/polovan-alat-na-sta-obratiti-paznju).',
      },

      { tip: 'h2', tekst: 'Konkretno, po budžetu', id: 'po-budzetu' },
      {
        tip: 'lista',
        stavke: [
          'Do 20.000 din: nova mašina niže klase ili odlično očuvana polovna srednja klasa. Za stan i povremeni rad kupi polovnu srednju klasu, traje duže.',
          '20.000–45.000 din: najbolji odnos. Ovde su polovni Bosch GBH 2-26, Makita HR2470 i slična generacija koja se servisira u svakom većem gradu.',
          '45.000–90.000 din: nova profesionalna SDS-plus mašina sa antivibracijom i punom garancijom, ili polovna SDS-max ulazna klasa.',
          'Preko 90.000 din: ovde ima smisla razgovarati samo ako mašina radi svaki dan ili ako ti treba SDS-max.',
        ],
      },
      {
        tip: 'p',
        tekst:
          'I poslednje: budžet za burgije nije deo budžeta za mašinu. Set kvalitetnih [SDS burgija](/kategorija/burgije-seciva-i-potrosni-materijal/sds-burgije) košta koliko i mali alat, a razlika između dobre i loše burgije u betonu je veća nego razlika između dobre i loše mašine. Tupa burgija na skupoj mašini buši sporije od oštre burgije na jeftinoj.',
      },
    ],
    veze: [
      {
        naziv: 'Rotacione bušilice (SDS)',
        href: '/kategorija/elektroalat/rotacione-busilice-sds',
        opis: 'Svi oglasi u kategoriji, sa filterom po džulima kroz specifikacije.',
      },
      {
        naziv: 'SDS burgije',
        href: '/kategorija/burgije-seciva-i-potrosni-materijal/sds-burgije',
        opis: 'Potrošni materijal koji određuje koliko brzo mašina stvarno buši.',
      },
      {
        naziv: 'Bosch Professional',
        href: '/brend/bosch-professional',
        opis: 'Najgušća servisna mreža u Srbiji i najlakše dostupni delovi.',
      },
      {
        naziv: 'Makita',
        href: '/brend/makita',
        opis: 'Najveći akumulatorski katalog i vrlo tražena polovna oprema.',
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════
     2. Polovan alat: na šta obratiti pažnju
     ═══════════════════════════════════════════════════════════════ */
  {
    slug: 'polovan-alat-na-sta-obratiti-paznju',
    naslov: 'Polovan alat: na šta obratiti pažnju',
    podnaslov:
      'Kako se pregleda mašina pre kupovine, šta tačno znači svaka od pet ocena stanja i koje rečenice u oglasu treba da te zabrinu.',
    opis:
      'Vodič za kupovinu polovnog alata: postupak pregleda mašine, značenje pet ocena stanja na Alatnici i crvene zastavice u oglasima i u komunikaciji sa prodavcem.',
    datum: '2026-06-02',
    tema: 'Kupovina',
    kljucno: [
      'Mašina se uvek isprobava pod opterećenjem, nikad samo na praznom hodu.',
      'Ocena stanja je definisana i ista za sve prodavce. Slobodan tekst nije ocena.',
      'Najskuplji delovi su ležajevi, statorski namotaj i elektronika. Sve ostalo je popravljivo jeftino.',
      'Fotografija bez serijskog broja i bez pribora obično znači da pribora nema.',
      'Ako prodavac odbija lično preuzimanje i insistira na uplati unapred, odustani.',
    ],
    blokovi: [
      {
        tip: 'p',
        tekst:
          'Polovan profesionalni alat je gotovo uvek bolja kupovina od novog hobi alata u istom cenovnom rangu. Mašina koja je projektovana za osam sati dnevno, a korišćena je tri godine povremeno, ima pred sobom više radnog veka nego nova mašina napravljena da izdrži dva vikenda mesečno. Problem je što na fotografiji obe izgledaju isto.',
      },
      {
        tip: 'p',
        tekst:
          'Zato je ceo ovaj tekst zapravo o jednoj stvari: kako da za petnaest minuta razlikuješ mašinu koja je radila od mašine koja je odradila svoje.',
      },

      { tip: 'h2', tekst: 'Pet ocena stanja i šta znače u praksi', id: 'ocene-stanja' },
      {
        tip: 'p',
        tekst:
          'Na Alatnici prodavac ne opisuje stanje svojim rečima. Bira jednu od pet ocena čija je definicija objavljena i ista za sve, i uz nju popunjava obaveznu listu provere za sve što nije novo. Puna referentna tabela je na stranici [kako radi](/kako-radi#ocene-stanja); ovde je prevod na ono što ćeš stvarno videti kada dođeš po mašinu.',
      },
      {
        tip: 'tabela',
        zaglavlje: ['Ocena', 'Šta očekivati uživo', 'Realan popust u odnosu na novo'],
        redovi: [
          ['Novo', 'Neotpakovano, fabrička folija, račun i puna garancija.', '0–15 %'],
          ['Kao novo', 'Nekoliko sati rada, bez ogrebotina, sav pribor u koferu.', '20–35 %'],
          [
            'Korišćeno, ispravno',
            'Vidljivi tragovi, boja izlizana na uglovima, tehnički potpuno ispravno.',
            '40–60 %',
          ],
          [
            'Vidljivo korišćeno',
            'Ozbiljni tragovi, nedostaje deo pribora, možda nema kofera. Radi.',
            '55–75 %',
          ],
          ['Za delove', 'Ne radi ili radi delimično. Kupuje se zbog kućišta, motora ili pribora.', '80–92 %'],
        ],
      },
      {
        tip: 'p',
        tekst:
          'Popusti u trećoj koloni nisu pravilo nego orijentir sa ovog tržišta. Ako je razlika manja, pitaj se šta prodavac zna a ti ne. Ako je znatno veća, isto se pitaj.',
      },

      { tip: 'h2', tekst: 'Pregled mašine, redom', id: 'pregled' },
      {
        tip: 'p',
        tekst:
          'Pregled traje petnaest minuta i ide od najskupljeg kvara ka najjeftinijem. Nema smisla prvo gledati da li ima kofer.',
      },
      { tip: 'h3', tekst: '1. Zvuk na praznom hodu' },
      {
        tip: 'p',
        tekst:
          'Uključi mašinu bez pribora i pusti je deset sekundi. Tražiš ravnomeran ton. Zveckanje, cviljenje ili grebanje znače ležaj, a zamena ležaja u ovlašćenom servisu često košta trećinu cene polovne mašine. Neujednačen ton koji se menja sam od sebe znači istrošene četkice ili problem sa rotorom.',
      },
      { tip: 'h3', tekst: '2. Miris i toplota' },
      {
        tip: 'p',
        tekst:
          'Pusti mašinu minut, pa je pomiriši kod otvora za vazduh. Miris pregorele izolacije je namotaj i tu se priča završava. Kućište koje se posle jednog minuta praznog hoda greje toliko da ne možeš da ga držiš takođe nije normalno.',
      },
      { tip: 'h3', tekst: '3. Test pod opterećenjem' },
      {
        tip: 'p',
        tekst:
          'Ovo je jedini test koji zaista razdvaja ispravnu od poluispravne mašine, i zato je stavka „testiran pod opterećenjem" deo obavezne liste provere na svakom oglasu. Bušilica mora da uđe u beton pod sopstvenom težinom. Brusilica mora da drži obrtaje kada disk zagrizne. Ako se mašina „guši" ili gubi snagu, to je elektronika, četkice ili namotaj. Nijedno nije sitno.',
      },
      { tip: 'h3', tekst: '4. Prihvat, glava, štitnik' },
      {
        tip: 'p',
        tekst:
          'Kod SDS mašina proveri da burgija ima uzdužni hod a nema rotacioni zazor. Kod običnih bušilica stegni burgiju od 6 mm i pokušaj da je pomeriš rukom: ako igra, stezna glava je istrošena. Kod brusilica proveri da štitnik ima sve zavrtnje i da se okreće bez alata samo koliko treba. Detalje po tipu mašine imaš u [kategoriji elektroalata](/kategorija/elektroalat).',
      },
      { tip: 'h3', tekst: '5. Kabl, sklopka i kućište' },
      {
        tip: 'p',
        tekst:
          'Prođi kabl kroz prste celom dužinom, posebno prvih 30 cm. Skraćen kabl ili izolir-traka znače da je već negde pukao. Sklopka mora da drži obrtaje na pola hoda. Kućište gledaš poslednje: pukotina na plastici je kozmetika ako je van ležišta ležaja, a ozbiljna stvar ako je oko prirubnice.',
      },

      { tip: 'h2', tekst: 'Akumulatorski alat ima jedan dodatni test', id: 'aku-test' },
      {
        tip: 'p',
        tekst:
          'Kod akumulatorskih mašina baterija je polovina cene, a stari se i kada se ne koristi. Traži da vidiš mašinu sa punom baterijom i da je opteretiš: ako indikator padne sa četiri crtice na jednu za trideset sekundi rada, ćelije su gotove. Pitaj i za starost baterije: na većini paketa je datum proizvodnje odštampan na nalepnici ili u serijskom broju.',
      },
      {
        tip: 'p',
        tekst:
          'Zbog toga se polovan akumulatorski alat kupuje pametnije bez baterije, ako već imaš isti sistem. Zašto je platforma važnija od same mašine piše u vodiču [akumulatorski sistemi objašnjeni](/vodici/akumulatorski-sistemi-objasnjeni), a paketi i punjači su u [kategoriji baterija](/kategorija/akumulatorski-sistemi/baterije).',
      },

      { tip: 'h2', tekst: 'Crvene zastavice u oglasu', id: 'crvene-zastavice' },
      {
        tip: 'lista',
        stavke: [
          '„Ispravno, nije mnogo korišćeno" bez ijedne konkretne brojke. Sati rada, godište i broj baterija su podaci koje vlasnik zna.',
          'Fotografije samo iz jednog ugla, uvek sa iste strane. Ono što se ne vidi obično ima razlog.',
          'Nema fotografije pribora, a u tekstu piše „sve u koferu".',
          'Cena znatno ispod svih sličnih oglasa, uz objašnjenje da se hitno prodaje zbog selidbe.',
          'Prodavac odbija lično preuzimanje i traži uplatu unapred na tekući račun fizičkog lica.',
          'Serijski broj je zamućen ili izbrušen. Kod profesionalnog alata to gotovo uvek znači ukradenu mašinu.',
          'Odgovor „ne znam, dobio sam je od nekog" na pitanje o servisnoj istoriji mašine koja košta koliko mesečna plata.',
        ],
      },
      {
        tip: 'napomena',
        naslov: 'Ozbiljno pitanje koje razdvaja prodavce',
        tekst:
          'Pitaj: „Da li mogu da je isprobam pod opterećenjem kod tebe?" Prodavac koji zna da je mašina ispravna reći će da. Prodavac koji ima problem počeće da objašnjava zašto to nije moguće. To jedno pitanje otkloni više loših kupovina nego bilo koji drugi savet u ovom tekstu.',
      },

      { tip: 'h2', tekst: 'Šta se isplati popraviti', id: 'popravke' },
      {
        tip: 'tabela',
        zaglavlje: ['Kvar', 'Orijentaciona cena popravke', 'Vredi li'],
        redovi: [
          ['Četkice', '1.500–4.000 din', 'Uvek. Ovo je potrošni deo.'],
          ['Sklopka / prekidač', '2.500–7.000 din', 'Skoro uvek.'],
          ['Kabl', '1.500–3.500 din', 'Uvek.'],
          ['Stezna glava ili SDS čaura', '4.000–12.000 din', 'Da, ako je mašina srednje klase ili bolja.'],
          ['Ležajevi', '5.000–15.000 din', 'Samo kod profesionalne mašine.'],
          ['Statorski namotaj / rotor', '12.000–35.000 din', 'Retko. Obično je jeftinije kupiti drugu.'],
          ['Elektronika (regulacija)', '8.000–30.000 din', 'Zavisi od modela; kod jeftinih mašina nikad.'],
        ],
      },
      {
        tip: 'p',
        tekst:
          'Pravilo palca: ako popravka prelazi 40 posto cene ispravne polovne mašine istog modela, kupuješ ispravnu. Izuzetak su mašine kojima je stalo do kompleta, na primer kada dopunjuješ sistem u kome već imaš baterije i punjače.',
      },
      {
        tip: 'p',
        tekst:
          'I na kraju, ono najbanalnije: dogovori se da se nađete danju, na javnom mestu, sa strujom u blizini. Bez struje ne postoji test pod opterećenjem, a bez tog testa kupuješ fotografiju. Detaljne preporuke za susret i plaćanje su u sekciji [sigurna kupovina](/kako-radi#sigurna-kupovina).',
      },
    ],
    veze: [
      {
        naziv: 'Kako sajt radi',
        href: '/kako-radi',
        opis: 'Referentna tabela ocena stanja, saveti za plaćanje i za susret uživo.',
      },
      {
        naziv: 'Elektroalat',
        href: '/kategorija/elektroalat',
        opis: 'Najveći deo polovne ponude: bušilice, brusilice, testere.',
      },
      {
        naziv: 'Baterije',
        href: '/kategorija/akumulatorski-sistemi/baterije',
        opis: 'Kada mašinu kupuješ bez baterije, paket se dokupljuje ovde.',
      },
      {
        naziv: 'Akumulatorski sistemi objašnjeni',
        href: '/vodici/akumulatorski-sistemi-objasnjeni',
        opis: 'Zašto se pre mašine bira platforma.',
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════
     3. Akumulatorski sistemi objašnjeni
     ═══════════════════════════════════════════════════════════════ */
  {
    slug: 'akumulatorski-sistemi-objasnjeni',
    naslov: 'Akumulatorski sistemi objašnjeni',
    podnaslov:
      'Zašto se prvo bira platforma pa tek onda mašina, i kako izgleda poređenje glavnih sistema na našem tržištu.',
    opis:
      'Poređenje akumulatorskih platformi: Makita LXT i XGT, Bosch Professional 18V, DeWalt XR i FlexVolt, Milwaukee M18 i M12, Metabo CAS, Einhell Power X-Change i Ryobi ONE+.',
    datum: '2026-06-21',
    tema: 'Baterije',
    kljucno: [
      'Baterije i punjači su vremenom skuplji od samih mašina: platforma je prava odluka.',
      'Volti ne znače kompatibilnost: 18 V Makita i 18 V Bosch nikada neće raditi zajedno.',
      'Ampersati određuju trajanje, a broj i tip ćelija određuju snagu.',
      'Makita LXT je najlikvidniji polovni sistem u Srbiji; Bosch je najbolji po servisu.',
      'Metabo CAS je jedini sistem koji deli baterije između više proizvođača.',
    ],
    blokovi: [
      {
        tip: 'p',
        tekst:
          'Kada kupuješ akumulatorsku bušilicu, ne kupuješ bušilicu. Kupuješ ulaznicu za sistem u kome ćeš sledećih deset godina dokupljivati mašine, baterije i punjače. Zato je pitanje „koja bušilica" pogrešno postavljeno: pravo pitanje je „na kojoj platformi ću završiti".',
      },
      {
        tip: 'p',
        tekst:
          'Brojke to lepo pokazuju. Kod tipičnog majstora posle pet godina odnos je otprilike takav da na svaku mašinu dođe jedna do dve baterije, a baterija od 5 Ah košta između 8.000 i 22.000 dinara zavisno od sistema. U tom trenutku promena platforme znači bacanje svega što imaš, i zato se ta odluka donosi jednom.',
      },

      { tip: 'h2', tekst: 'Volti nisu standard', id: 'volti' },
      {
        tip: 'p',
        tekst:
          'Najčešća zabluda: „ima 18 V, znači odgovara". Ne odgovara. Napon je samo posledica broja ćelija u paketu: pet litijum-jonskih ćelija po 3,6 V daje 18 V. Sve ostalo je različito: oblik kliznog priključka, raspored kontakata, protokol komunikacije između baterije i mašine, i zaštita od pražnjenja. [18 V Makita LXT](/kategorija/akumulatorski-sistemi/baterije) i 18 V Bosch Professional su električno slična a mehanički i logički nespojiva rešenja.',
      },
      {
        tip: 'p',
        tekst:
          'Postoje adapteri sa raznih strana. Rade, uglavnom, ali gube komunikaciju baterija–mašina, što znači da zaštita od dubokog pražnjenja i od pregrevanja više nije potpuna. Na jeftinom alatu je to prihvatljiv rizik, na mašini od 60.000 dinara nije.',
      },
      {
        tip: 'napomena',
        naslov: 'Zato filtriramo po sistemu, a ne po naponu',
        tekst:
          'Filter „akumulatorski sistem" na pregledu oglasa pojavljuje se samo kada je izbor kategorije ili brenda takav da sistemi uopšte postoje. Vrednost je puno ime platforme („18V Makita LXT"), ne broj volti, upravo zato što se po naponu ne može zaključiti ništa o kompatibilnosti.',
      },

      { tip: 'h2', tekst: 'Ampersati, ćelije i šta stvarno menja osećaj', id: 'ampersati' },
      {
        tip: 'p',
        tekst:
          'Ampersat-časovi (Ah) govore koliko baterija traje, ne koliko je jaka. Baterija od 5 Ah traje otprilike dvostruko duže od baterije od 2,5 Ah na istom poslu. Snaga zavisi od toga koliko struje ćelije mogu da isporuče, a to zavisi od tipa ćelije i od toga koliko ih je paralelno vezano.',
      },
      {
        tip: 'lista',
        stavke: [
          '2,0 Ah: laka, jedan red ćelija. Za odvijač i lampu, ne za brusilicu.',
          '4,0–5,0 Ah: dva reda ćelija. Najbolji odnos mase, snage i cene. Ovo je podrazumevani izbor.',
          '6,0–8,0 Ah, za mašine koje vuku puno struje: ugaone brusilice, kružne testere, rotacione bušilice.',
          '9,0–12,0 Ah: teške, skupe, imaju smisla samo za akumulatorske mašine koje zamenjuju mrežne.',
        ],
      },
      {
        tip: 'p',
        tekst:
          'Praktična posledica: ako na akumulatorskoj brusilici koristiš bateriju od 2 Ah, mašina neće raditi lošije zato što je „prazna" nego zato što ćelije ne mogu da daju struju koju motor traži. Isti alat sa baterijom od 5 Ah deluje kao druga mašina.',
      },

      { tip: 'h2', tekst: 'Glavni sistemi, iskreno', id: 'sistemi' },
      {
        tip: 'tabela',
        zaglavlje: ['Sistem', 'Broj mašina', 'Za koga', 'Slaba tačka'],
        redovi: [
          [
            '18V Makita LXT',
            'preko 300',
            'Najširi izbor i najlikvidnije polovno tržište u Srbiji.',
            'XGT 40V je odvojen sistem, baterije nisu kompatibilne.',
          ],
          [
            '18V Bosch Professional',
            'oko 150',
            'Najbolja servisna mreža i dostupnost delova kod nas.',
            'Zeleni Bosch za kuću je potpuno drugi sistem: ne mešati.',
          ],
          [
            '18V DeWalt XR',
            'oko 200',
            'Građevina i tesarstvo; FlexVolt radi i na 18V i na 54V mašinama.',
            'FlexVolt paketi su osetno skuplji i teži.',
          ],
          [
            '18V Milwaukee M18',
            'oko 250',
            'Najjače brojke u klasi, posebno udarni ključevi.',
            'Tanja servisna mreža u Srbiji nego Bosch i Makita.',
          ],
          [
            '12V Milwaukee M12',
            'oko 100',
            'Elektro i instalaterski radovi, rad u skučenom prostoru.',
            'Nije zamena za 18 V kod bušenja i sečenja.',
          ],
          [
            '18V Metabo CAS',
            'oko 90',
            'Jedini otvoreni sistem: istu bateriju dele Metabo, Fein, Rothenberger i drugi.',
            'Manji izbor mašina po pojedinačnom brendu.',
          ],
          [
            '18V Einhell Power X-Change',
            'preko 250',
            'Najjeftiniji ulaz u sistem; ima i baštenski program na istoj bateriji.',
            'Hobi klasa: za svakodnevni profesionalni rad nije.',
          ],
          [
            '18V Ryobi ONE+',
            'preko 250',
            'Ista baterija od 1996. do danas; ogroman izbor sitnih mašina.',
            'Kvalitet mašina varira više nego kod ostalih.',
          ],
        ],
      },
      {
        tip: 'p',
        tekst:
          'Detaljnije o pozicioniranju pojedinih brendova ima u tekstu [Hilti vs Bosch vs Makita](/vodici/hilti-vs-bosch-vs-makita). Ako te zanima samo ponuda, kreni od [akumulatorskog alata](/kategorija/akumulatorski-sistemi/akumulatorski-alat) i od [setova](/kategorija/akumulatorski-sistemi/setovi).',
      },

      { tip: 'h2', tekst: 'Kako se ulazi u sistem bez bacanja para', id: 'ulazak' },
      {
        tip: 'koraci',
        stavke: [
          'Napiši spisak mašina koje ćeš realno imati za tri godine. Ako je na spisku ugaona brusilica ili kružna testera, ideš na 18 V. Ako je spisak odvijač, lampa i bušilica, 12 V sistem je lakši i jeftiniji.',
          'Proveri šta već imaju ljudi oko tebe. Pozajmljena baterija u pravom trenutku vredi više od dva procenta bolje specifikacije.',
          'Kupi set od dve mašine sa dve baterije i punjačem. Set je uvek jeftiniji nego iste mašine pojedinačno, i tako odmah imaš rezervni paket.',
          'Sve sledeće mašine kupuj kao „solo", bez baterije. Ovde je polovno tržište najzanimljivije: solo mašine su znatno jeftinije jer ih većina ljudi zaobilazi.',
          'Baterije dokupljuj nove ili vrlo mlade. Polovna baterija starija od četiri godine je rizik bez obzira na to koliko je korišćena.',
        ],
      },

      { tip: 'h2', tekst: 'Kada akumulatorski alat nema smisla', id: 'kad-nema-smisla' },
      {
        tip: 'p',
        tekst:
          'Ima poslova gde je kabl i dalje bolji. Mešalica za malter koja radi ceo dan, stona testera, veliki rotacioni čekić, kompresor: sve to na bateriju postoji, ali plaćaš dvostruko za pola autonomije. Ako mašina stoji na jednom mestu i struja je tu, mrežni alat je racionalniji izbor i ostaje u [kategoriji elektroalata](/kategorija/elektroalat).',
      },
      {
        tip: 'p',
        tekst:
          'Isto važi i za retku upotrebu. Baterija koja stoji godinu dana u fioci gubi kapacitet i kada se ne koristi; za dva vikenda godišnje mrežna mašina je jeftinija i pouzdanija. Akumulatorski sistem se isplati onome ko alat vadi svake nedelje.',
      },
    ],
    veze: [
      {
        naziv: 'Akumulatorski alat',
        href: '/kategorija/akumulatorski-sistemi/akumulatorski-alat',
        opis: 'Mašine sa filterom po sistemu: LXT, M18, XR, CAS i ostalo.',
      },
      {
        naziv: 'Baterije',
        href: '/kategorija/akumulatorski-sistemi/baterije',
        opis: 'Paketi po sistemu i kapacitetu.',
      },
      {
        naziv: 'Setovi',
        href: '/kategorija/akumulatorski-sistemi/setovi',
        opis: 'Najjeftiniji način da uđeš u platformu sa dve baterije.',
      },
      {
        naziv: 'Milwaukee',
        href: '/brend/milwaukee',
        opis: 'M18 i M12: dva podsistema koja pokrivaju različite poslove.',
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════
     4. Hilti vs Bosch vs Makita
     ═══════════════════════════════════════════════════════════════ */
  {
    slug: 'hilti-vs-bosch-vs-makita',
    naslov: 'Hilti vs Bosch vs Makita',
    podnaslov:
      'Tri različita poslovna modela, a ne tri različite marke. Koji od njih odgovara tvom načinu rada.',
    opis:
      'Iskreno poređenje Hilti, Bosch Professional i Makita alata: cena, servis, dostupnost delova, vrednost polovne mašine i za koji tip korisnika svaki od njih zaista ima smisla.',
    datum: '2026-07-09',
    tema: 'Brendovi',
    kljucno: [
      'Hilti ne prodaje mašine nego dostupnost: zamenska mašina i servis su u ceni.',
      'Bosch Professional je najsigurniji izbor u Srbiji zbog servisa i delova.',
      'Makita ima najveći katalog i najbolju preprodajnu vrednost na polovnom tržištu.',
      'Za povremenog korisnika sva tri su preskupa; tu ima smisla druga klasa alata.',
      'Servis u tvom gradu vredi više od pet procenata bolje specifikacije.',
    ],
    blokovi: [
      {
        tip: 'p',
        tekst:
          'Poređenja ova tri brenda obično se svode na to ko ima više obrtaja i ko je izdržao test bacanja sa skele. To je zabavno i skoro potpuno beskorisno. Razlika između vrhunskog Hilti, Bosch i Makita alata u istoj klasi je mala i za većinu poslova nemerljiva. Razlika u poslovnom modelu je ogromna i oseti se svakog dana.',
      },
      {
        tip: 'p',
        tekst:
          'Zato ovde ne poredimo mašine nego ono što stvarno kupuješ: cenu vlasništva, brzinu servisa, dostupnost delova i to koliko ćeš dobiti kada mašinu prodaš.',
      },

      { tip: 'h2', tekst: 'Hilti: kupuješ dostupnost, ne mašinu', id: 'hilti' },
      {
        tip: 'p',
        tekst:
          '[Hilti](/brend/hilti) se ne prodaje u prodavnicama. Prodaje se direktno, kroz sopstvenu prodajnu mrežu, i to je ključ celog modela. Cena mašine je viša za 40 do 100 posto u odnosu na konkurenciju iste klase, ali u toj ceni je servis bez naplate u definisanom periodu, popravka u fiksnom roku i zamenska mašina dok je tvoja u servisu.',
      },
      {
        tip: 'p',
        tekst:
          'Ako imaš ekipu od pet ljudi i mašina koja stane znači zaustavljen radni dan, ta računica je brutalno jasna. Jedan izgubljeni dan košta više nego razlika u ceni mašine. Ako mašina radi tri sata mesečno, plaćaš uslugu koju nikad nećeš iskoristiti.',
      },
      {
        tip: 'lista',
        stavke: [
          'Najbolje: sistem ankera i hemije, prašinarenje sa integrisanim usisavanjem, teško rušenje, merni instrumenti za trasiranje.',
          'Realna prednost: ergonomija i antivibracija na teškim mašinama je merljivo bolja i to se oseti posle šest sati štemovanja.',
          'Slabost: pribor i potrošni materijal su skupi i vezuju te za istog dobavljača.',
          'Polovno: mašine drže cenu, ali proveri da li servisni ugovor prelazi na novog vlasnika. Obično ne prelazi.',
        ],
      },

      { tip: 'h2', tekst: 'Bosch Professional: najsigurniji izbor kod nas', id: 'bosch' },
      {
        tip: 'p',
        tekst:
          '[Bosch Professional](/brend/bosch-professional), plava linija, je alat koji u Srbiji ima najgušću mrežu prodaje i servisa. To zvuči dosadno dok ti u utorak ne pukne sklopka, a u sredu ujutru mašina već radi. Delovi za popularne modele se drže na stanju u više gradova, a nezavisni servisi ih poznaju.',
      },
      {
        tip: 'p',
        tekst:
          'Merni instrumenti su im posebna priča: GLL laseri, GLM daljinomeri i PMD detektori su praktično referentni u struci i tu ih niko od ostala dva ne dodiruje po odnosu cene i pouzdanosti. Ako gradiš [merni deo opreme](/kategorija/merenje-i-obelezavanje), tu se ne mnogo razmišlja.',
      },
      {
        tip: 'napomena',
        naslov: 'Plavi i zeleni Bosch nisu isto',
        tekst:
          'Zeleni Bosch je hobi linija sa drugim motorima, drugom baterijom i drugom garancijom. Nije lošija nego što treba da bude. Samo je za drugu upotrebu. Kada u oglasu za polovnu mašinu piše samo „Bosch", traži fotografiju: boja kućišta ti kaže sve.',
      },
      {
        tip: 'lista',
        stavke: [
          'Najbolje: merni instrumenti, rotacione bušilice srednje klase, ubodne testere, dostupnost servisa.',
          'Realna prednost: najlakše je naći delove i najlakše je prodati mašinu jer je svima poznata.',
          'Slabost: akumulatorski katalog je manji nego kod Makite i Milwaukeeja.',
          'Polovno: najveća ponuda na tržištu, pa je i najlakše uporediti cene.',
        ],
      },

      { tip: 'h2', tekst: 'Makita: najveći katalog i najbolja preprodaja', id: 'makita' },
      {
        tip: 'p',
        tekst:
          '[Makita](/brend/makita) ima najveći akumulatorski katalog na svetu: preko trista mašina na istoj 18 V LXT bateriji, od bušilice do radija i ventilatora. Za nekoga ko gradi sistem to je odlučujuće: šta god ti zatreba, verovatno postoji na bateriji koju već imaš.',
      },
      {
        tip: 'p',
        tekst:
          'Druga stvar je likvidnost. LXT je platforma koju najviše majstora u regionu već ima, pa se polovna Makita prodaje najbrže i uz najmanji gubitak. Ako menjaš alat na svake tri do četiri godine, to je stvarna ušteda koja se ne vidi u ceni na polici.',
      },
      {
        tip: 'p',
        tekst:
          'Zamka: XGT 40V je odvojen sistem. Baterije nisu kompatibilne sa LXT bez adaptera, a adapter radi samo u jednom smeru. Ako kupuješ Makitu danas, odluči na kojoj si platformi pre nego što kupiš drugu mašinu, a ne posle pete.',
      },
      {
        tip: 'lista',
        stavke: [
          'Najbolje: širina akumulatorskog programa, testere i rendisaljke, alat za obradu drveta.',
          'Realna prednost: najbrža preprodaja i najlakše dokupljivanje baterija sa polovnog tržišta.',
          'Slabost: dva odvojena akumulatorska sistema koja se lako pomešaju pri kupovini.',
          'Polovno: gledaj da li je mašina iz LXT ili XGT programa pre nego što se dogovoriš oko cene.',
        ],
      },

      { tip: 'h2', tekst: 'Ukratko, po tipu kupca', id: 'po-kupcu' },
      {
        tip: 'tabela',
        zaglavlje: ['Ti si', 'Izbor', 'Zašto'],
        redovi: [
          [
            'Ekipa na gradilištu, alat radi svaki dan',
            'Hilti za teške mašine, Makita ili Bosch za ostalo',
            'Zamenska mašina i fiksan rok popravke vrede više od cene alata.',
          ],
          [
            'Samostalni majstor, alat je izvor prihoda',
            'Bosch Professional',
            'Najbrži pristup servisu i delovima u najviše gradova u Srbiji.',
          ],
          [
            'Gradiš akumulatorski sistem od nule',
            'Makita LXT',
            'Najveći katalog i najlakše dokupljivanje polovnih baterija.',
          ],
          [
            'Stolarska radionica',
            'Makita, uz Festool za precizne mašine',
            'Program za obradu drveta i usisavanje prašine je tu najrazvijeniji.',
          ],
          [
            'Renoviraš stan, alat ti treba dva meseca',
            'Nijedan od ova tri',
            'Druga klasa alata ili iznajmljivanje su racionalniji izbor.',
          ],
        ],
      },
      {
        tip: 'p',
        tekst:
          'I jedno pravilo koje nadjačava sve gore napisano: pre nego što kupiš, proveri gde je najbliži servis za taj brend. Mašina koja se popravlja u tvom gradu za tri dana bolja je od mašine koja je pet procenata jača a šalje se u drugu državu. Ako biraš iz ponude, [pregled po brendovima](/oglasi) je najbrži put do poređenja cena za isti model.',
      },
    ],
    veze: [
      {
        naziv: 'Hilti',
        href: '/brend/hilti',
        opis: 'Kada se model sa servisom u ceni zaista isplati.',
      },
      {
        naziv: 'Bosch Professional',
        href: '/brend/bosch-professional',
        opis: 'Najšira dostupnost servisa i delova u Srbiji.',
      },
      {
        naziv: 'Makita',
        href: '/brend/makita',
        opis: 'Najveći akumulatorski katalog i najlikvidnije polovno tržište.',
      },
      {
        naziv: 'Merenje i obeležavanje',
        href: '/kategorija/merenje-i-obelezavanje',
        opis: 'Laseri, daljinomeri i detektori: gde Bosch ima najjaču poziciju.',
      },
    ],
  },
]

/* ────────────────────────────────────────────────────────────────
   Pomoćne funkcije
   ──────────────────────────────────────────────────────────────── */

export function sviVodici(): Vodic[] {
  return vodici
}

export function vodicBySlug(slug: string): Vodic | undefined {
  return vodici.find((v) => v.slug === slug)
}

/** Ostali vodiči, za blok „Pročitaj i ovo" na dnu članka. */
export function ostaliVodici(slug: string): Vodic[] {
  return vodici.filter((v) => v.slug !== slug)
}

/** Grubi broj reči — koristi se za procenu vremena čitanja. */
export function brojReci(v: Vodic): number {
  let n = 0
  const prebroj = (s: string) => {
    n += s.trim().split(/\s+/).filter(Boolean).length
  }

  prebroj(v.podnaslov)
  for (const k of v.kljucno) prebroj(k)

  for (const b of v.blokovi) {
    switch (b.tip) {
      case 'p':
      case 'h3':
        prebroj(b.tekst)
        break
      case 'h2':
        prebroj(b.tekst)
        break
      case 'lista':
      case 'koraci':
        for (const s of b.stavke) prebroj(s)
        break
      case 'tabela':
        for (const c of b.zaglavlje) prebroj(c)
        for (const r of b.redovi) for (const c of r) prebroj(c)
        break
      case 'napomena':
        prebroj(b.naslov)
        prebroj(b.tekst)
        break
    }
  }
  return n
}

/** „7 min čitanja" — 200 reči u minuti, minimum 3. */
export function vremeCitanja(v: Vodic): number {
  return Math.max(3, Math.round(brojReci(v) / 200))
}

/** Naslovi drugog nivoa — sadržaj članka. */
export function sadrzaj(v: Vodic): { id: string; tekst: string }[] {
  return v.blokovi.filter((b): b is Extract<Blok, { tip: 'h2' }> => b.tip === 'h2').map((b) => ({
    id: b.id,
    tekst: b.tekst,
  }))
}
