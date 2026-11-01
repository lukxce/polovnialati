/**
 * Pravi uvodni tekst za svaku od deset nadkategorija — pisan za kupca,
 * ne za pretraživač. Potkategorije dobijaju kraći, podacima vođen uvod.
 */
export const UVODI: Record<string, string[]> = {
  elektroalat: [
    'Mrežni alat je i dalje jeftiniji po vatu i ne staje kad se baterija isprazni. Zato se na gradilištu i dalje kupuje, uprkos svemu što se priča o akumulatorskim mašinama.',
    'Ovde su bušilice i odvijači, SDS rotacione bušilice, ugaone brusilice, testere, rendisaljke, brusilice za drvo i mešalice za malter. Kod polovnih mašina prvo se gleda kabl, stanje četkica i zazor u prihvatu: sve tri stavke stoje u obaveznoj listi provere na svakom oglasu.',
  ],
  'akumulatorski-sistemi': [
    'Baterija je veća odluka od mašine: kad jednom uzmeš platformu, sledećih pet alata biraš iz istog kataloga, hteo ti to ili ne.',
    'Ovde su akumulatorske mašine, same baterije, punjači i kompletni setovi: svaki oglas nosi naznačen sistem, jer 18 V jednog proizvođača ne ulazi u alat drugog. Filter „Akumulatorski sistem" radi baš na tom podatku, pa možeš da tražiš samo ono što ti radi na baterijama koje već imaš.',
  ],
  'rucni-alat': [
    'Alat koji ne zavisi ni od struje ni od baterije i koji uz malo pažnje nadživi dve generacije elektroalata.',
    'Garniture ključeva, čekići i dleta, klešta, odvijači i stege. Polovno se ovde kupuje bez velikog rizika: nema motora koji može tiho da otkaže, samo istrošenost koja se vidi na fotografiji i u listi provere.',
  ],
  'merenje-i-obelezavanje': [
    'Merni instrumenti odlučuju hoće li posao biti prav ili samo brz, a razlika se obično primeti tek kad se postavi prva pločica.',
    'Laseri, nivelatori, detektori instalacija, daljinomeri, metri i libele. Kod polovnog lasera traži podatak da je kalibracija proverena. To je jedina stavka koju nikako ne možeš da oceniš sa slike, i zato je ovde posebno izdvojena u specifikacijama.',
  ],
  'burgije-seciva-i-potrosni-materijal': [
    'Potrošni materijal je stavka koja se najčešće potceni u računici, a ume da košta više od same mašine na godišnjem nivou.',
    'SDS burgije, burgije za metal i drvo, bitovi i nastavci, krune, rezni i brusni diskovi, listovi za testere, šrafovi i tiplovi. Ovde je najviše novih artikala i najviše kupovine na količinu, pa cenu poredi po komadu, a ne po pakovanju. Razlika između dva naizgled ista seta zna da bude dvostruka.',
  ],
  'pneumatika-i-kompresori': [
    'Vazduh kao pogon znači jeftiniji i lakši alat, ali i sav teret prebačen na jednu mašinu koja mora da izdrži.',
    'Klipni i vijčani kompresori, pneumatski alat, creva i brzi priključci. Pre kupovine polovnog kompresora proveri sate rada, stanje kotla i da li je menjano ulje: ta tri podatka odlučuju o ceni više nego godište.',
  ],
  zavarivanje: [
    'Inverteri su spustili ulaznu cenu varenja na nivo bolje ugaone brusilice, ali razlika između povremenog i svakodnevnog varenja je i dalje ista kao pre.',
    'Ovde su inverteri, MIG/MAG aparati i zaštitna oprema. Ako aparat kupuješ polovno, pitaj za radni ciklus na struji koju stvarno koristiš, a ne za maksimalnu brojku sa nalepnice. To je mesto gde se jeftini aparati najbrže odaju.',
  ],
  'sitna-mehanizacija': [
    'Mašine koje staju u kombi, a ne na šleper: vibro nabijači, pumpe za vodu, agregati i mešalice za beton.',
    'Kod svega sa motorom sa unutrašnjim sagorevanjem presudni su sati rada i redovnost servisa, ne godište. Ako oglas nema naveden broj sati rada, pitaj pre nego što kreneš po mašinu u drugi grad.',
  ],
  'skele-merdevine-i-zastita': [
    'Deo opreme koji se prvi zaboravi da kupi i poslednji da zameni, a jedini je čija cena nije samo novac.',
    'Merdevine, modularne skele i lična zaštitna oprema. Kacige, pojasevi i oprema za rad na visini imaju rok trajanja i ovde se prodaju gotovo isključivo nove. Polovno u toj podkategoriji nema mnogo smisla ni po ceni ni po riziku.',
  ],
  radionica: [
    'Alat vredi onoliko koliko brzo možeš da ga nađeš, a to je pitanje kutija, kolica i radnog stola.',
    'Tu su i usisivači za gradilište, koji na renoviranju u useljenom stanu prave razliku između posla i svađe sa ukućanima. Sistemski koferi se odlično kupuju polovno jer na njima nema šta da otkaže. Samo proveri da li se slažu sa serijom koju već imaš.',
  ],
}

/**
 * Jedan konkretan savet po potkategoriji — ono što kupac stvarno gleda kad
 * bira baš taj alat. Potkategorije dobijaju lakši obrazac uvoda: jedna
 * rečenica izvedena iz podataka + ovaj savet.
 */
export const SAVETI: Record<string, string> = {
  // Elektroalat
  'busilice-i-odvijaci':
    'Kod polovne bušilice najviše govori zazor u glavi: ako burgija „šeta" u praznom hodu, ležajevi su već otišli i to se ne popravlja zatezanjem.',
  'rotacione-busilice-sds':
    'SDS-plus je za tiplove i instalacije, SDS-max za probijanje i rušenje. Džuli udara su ovde važniji podatak od vata.',
  'ugaone-brusilice':
    'Prečnik diska određuje sve: 125 mm za svakodnevni rad u ruci, 230 mm tek kad stvarno sečeš beton i armaturu.',
  testere:
    'Ubodna, kružna i sabljasta rade tri različita posla. Pre poređenja cena pogledaj koji list stoji u pakovanju.',
  rendisaljke:
    'Stopa mora da bude ravna, a noževi bez okrznuća: udubljenje na stopi se vidi na prvoj dasci i ne da se izbrusiti.',
  'brusilice-za-drvo':
    'Vibraciona, ekscentrična i tračna nisu zamenljive; kod polovne prvo proveri priključak za usisivač, jer bez njega papir traje upola kraće.',
  'mesalice-za-malter':
    'Za lepak i malter dovoljna je jednovretena mašina. Dvovretene se kupuju za estrih i samonivelirajuće mase.',

  // Akumulatorski sistemi
  'akumulatorski-alat':
    'Gola mašina bez baterije je najjeftiniji način da proširiš sistem koji već imaš. Proveri oznaku sistema, ne samo napon.',
  baterije:
    'Kod polovne baterije traži godinu proizvodnje ili broj ciklusa; ćelije stare i kada paket mirno stoji na polici.',
  punjaci:
    'Brzi punjač vraća paket od 5 Ah za pola sata, ali greje ćelije. Za povremenu upotrebu je običan punjač bolji po vek baterije.',
  setovi:
    'Set sa dve baterije i punjačem je gotovo uvek jeftiniji nego kupovina istih delova pojedinačno.',

  // Ručni alat
  'kljucevi-i-garniture':
    'Gledaj broj zuba u račni: 72 i više znači da možeš da odvrneš i tamo gde ruka ima pet stepeni zamaha.',
  'cekici-i-dleta':
    'Drška i glava moraju da budu čvrsto spojene. Klimav čekić se ne popravlja klinom „za sada".',
  klesta:
    'Kombinovana, špic i sečice pokrivaju najveći deo posla; specijalna klešta se kupuju tek kad ih konkretan posao traži.',
  odvijaci:
    'Set sa S2 čelikom i magnetnim vrhovima nadživi tri jeftina seta zaredom, a razlika u ceni je jedan izlazak.',
  stege:
    'Za lepljenje su bitne dubina grla i ravnomeran pritisak, a ne broj stega u oglasu.',

  // Merenje i obeležavanje
  laseri:
    'Traži podatak da je kalibracija proverena. Odstupanje se ne vidi na fotografiji, nego tek kad postaviš prvi red pločica.',
  nivelatori:
    'Rotacioni nivelator sa prijemnikom radi napolju, gde se linijski laser jednostavno ne vidi po danu.',
  detektori:
    'Detektor koji razdvaja metal, drvo i napon vredi tačno onoliko koliko i jedno popodne bez struje u stanu.',
  daljinomeri:
    'Za stanove je domet do 30 m sasvim dovoljan; sve preko toga plaćaš zbog fasada i placeva.',
  'metri-i-libele':
    'Libela se proverava okretanjem za 180 stepeni na istoj površini. Mehur mora da pokaže isto oba puta.',

  // Burgije, sečiva i potrošni materijal
  'sds-burgije':
    'Burgija sa četiri rezne ivice duže drži oštrinu u armiranom betonu i ne beži kad naiđe na armaturu.',
  'burgije-za-metal-i-drvo':
    'HSS burgija za metal ne buši beton, a burgija za beton u čeliku samo greje. Na kutiji traži materijal, ne samo prečnik.',
  'bitovi-i-nastavci':
    'Udarni odvijač traži bitove za udarni rad (označene kao „Impact"); obični pucaju na torziji posle par šrafova.',
  krune:
    'Dijamantska kruna za mokro bušenje traži i dovod vode i mašinu sa odgovarajućim brojem obrtaja. Suva kruna nije zamena.',
  'rezni-i-brusni-diskovi':
    'Na obruču svakog diska stoji rok trajanja; star disk puca i kada izgleda potpuno netaknuto.',
  'listovi-za-testere':
    'Broj zuba bira materijal, ne cena: krupni zub za drvo, sitni za metal, bez improvizacije između.',
  'srafovi-i-tiplovi':
    'Cenu poredi po komadu, a ne po pakovanju. Razlika između dva naizgled ista kutijaša ume da bude dvostruka.',

  // Pneumatika i kompresori
  kompresori:
    'Presudna je isporuka vazduha u litrima po minutu, a ne zapremina kotla; po tom broju se bira alat koji sme da radi bez pauze.',
  'pneumatski-alat':
    'Udarni ključ traži i protok i suv vazduh. Bez separatora vlage mehanizam strada za nekoliko meseci.',
  'creva-i-prikljucci':
    'Brze spojnice nisu standardizovane; proveri tip priključka pre nego što naručiš crevo iz drugog grada.',

  // Zavarivanje
  inverteri:
    'Radni ciklus na struji koju stvarno koristiš je jedini podatak koji razdvaja povremeno varenje od svakodnevnog.',
  'mig-mag':
    'Za lim i tanje profile MIG je brži i čistiji, ali u računicu ulazi i boca sa gasom, ne samo aparat.',
  'oprema-i-zastita':
    'Automatska maska sa četiri senzora i podesivim zatamnjenjem košta manje od jednog opekotinskog oštećenja rožnjače.',

  // Sitna mehanizacija
  'vibro-nabijaci':
    'Za rovove i uske prolaze bira se skakavac, za površine ploča, a masa mašine mora da odgovara debljini sloja.',
  'pumpe-za-vodu':
    'Pumpa za prljavu vodu ima veći slobodan prolaz; ona za čistu vodu se u šahtu zapuši istog dana.',
  agregati:
    'Ako pališ elektroniku, inverterski agregat nije luksuz: daje čistiji napon i troši osetno manje na delimičnom opterećenju.',
  'mesalice-za-beton':
    'Venac i zupčanik su najskuplji deo mešalice; kod polovne mašine tu se gleda pre nego u lim.',

  // Skele, merdevine i zaštita
  merdevine:
    'Traži oznaku standarda i deklarisanu nosivost. Merdevine bez deklaracije nemaju šta da traže na gradilištu.',
  skele:
    'Modularne skele se kupuju po poljima; proveri da li su nogari, ograda i podovi u kompletu ili se dokupljuju.',
  'licna-zastita':
    'Kacige i pojasevi imaju rok trajanja upisan u školjku ili etiketu, pa se ovde gotovo isključivo kupuje novo.',

  // Radionica
  'kutije-i-kolica-za-alat':
    'Sistemski koferi se odlično kupuju polovno jer na njima nema šta da otkaže. Samo proveri da li se slažu sa serijom koju već imaš.',
  'radni-stolovi':
    'Stabilnost zavisi od mase i ukrućenja, ne od debljine ploče; klimav sto pokvari i najprecizniji rez.',
  usisivaci:
    'Za prašinu od betona i gipsa M klasa je minimum. Običan kućni usisivač tu izdrži jedno popodne.',
}
