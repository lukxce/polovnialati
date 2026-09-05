import type { Brend } from '@/lib/types'

/**
 * 17 brendova sa iskrenim pozicioniranjem — ne marketinški tekst,
 * nego ono što majstor stvarno treba da zna pre kupovine.
 */
export const brendovi: Brend[] = [
  {
    slug: 'hilti',
    naziv: 'Hilti',
    opis: 'Najskuplji izbor na tržištu i to se ne krije. Hilti se ne prodaje po prodavnicama nego direktno, a cena uključuje servis, zamensku mašinu dok je tvoja na popravci i realno dužu radnu vek pod svakodnevnim opterećenjem. Ima smisla ako mašina radi osam sati dnevno na gradilištu; za kućnu upotrebu je bacanje para.',
    akuSistemi: ['22V Hilti Nuron', '12V Hilti'],
  },
  {
    slug: 'bosch-professional',
    naziv: 'Bosch Professional',
    opis: 'Plava linija, profesionalna: ne mešati sa zelenim Bosch alatom za kuću. Najšira ponuda i najbolja dostupnost servisa i delova u Srbiji, što na duže staze vredi više nego par procenata performansi. Merni instrumenti (GLL, GLM, PMD) su im praktično referentni u struci.',
    akuSistemi: ['18V Bosch Professional', '12V Bosch Professional'],
  },
  {
    slug: 'makita',
    naziv: 'Makita',
    opis: 'Najveći akumulatorski katalog na svetu: preko 300 mašina na jednoj bateriji. LXT 18V je platforma koju najviše majstora u regionu već ima, pa je polovna Makita najlakša za dokupljivanje i preprodaju. XGT 40V je odvojen sistem, baterije nisu kompatibilne sa LXT bez adaptera.',
    akuSistemi: ['18V Makita LXT', '40V Makita XGT', '12V Makita CXT'],
  },
  {
    slug: 'dewalt',
    naziv: 'DeWalt',
    opis: 'Američka škola: robusno, glasno, žuto i napravljeno da preživi pad sa skele. Jako u građevini i tesarstvu. FlexVolt baterije rade i na 18V XR i na 54V mašinama, što je jedan od pametnijih poteza u branši, ali su i osetno skuplje od običnih XR paketa.',
    akuSistemi: ['18V DeWalt XR', '54V DeWalt FlexVolt', '12V DeWalt XR'],
  },
  {
    slug: 'milwaukee',
    naziv: 'Milwaukee',
    opis: 'Trenutno najagresivniji u razvoju: udarni ključevi i akumulatorske mašine im obično imaju najbolje brojke u klasi. M12 podsistem je nešto što konkurencija nema u istom obimu i idealan je za elektro i instalaterske radove. Servisna mreža u Srbiji je tanja nego kod Bosch-a i Makite.',
    akuSistemi: ['18V Milwaukee M18', '12V Milwaukee M12'],
  },
  {
    slug: 'metabo',
    naziv: 'Metabo',
    opis: 'Nemački alat sa reputacijom u brušenju i obradi metala; ugaone brusilice su im istorijski jača strana od bušilica. CAS je zanimljiv detalj: ista 18V baterija radi na alatu više od dvadeset proizvođača (Mafell, Rothenberger, Eibenstock, Fein...). Cenovno između Bosch Professional i Hilti.',
    akuSistemi: ['18V Metabo CAS', '12V Metabo'],
  },
  {
    slug: 'festool',
    naziv: 'Festool',
    opis: 'Alat za stolare i montažere kuhinja, ne za grubu građevinu. Vrednost je u sistemu: uranjajuća testera sa šinom, otprašivanje koje stvarno radi i Systainer kutije koje se slažu jedna na drugu. Skupo je i to se ne isplati ako preciznost reza nije direktno tvoj prihod.',
    akuSistemi: ['18V Festool'],
  },
  {
    slug: 'hikoki',
    naziv: 'HiKOKI',
    opis: 'Bivši Hitachi Power Tools, isto japansko poreklo i ista fabrika, samo drugo ime posle prodaje. Kvalitet mašine je na nivou Makite, ali brend ima slabiju prepoznatljivost pa se polovno kupuje osetno jeftinije: to je prilika ako ne planiraš brzu preprodaju. MultiVolt baterija radi i na 18V i na 36V alatu.',
    akuSistemi: ['18V HiKOKI', '36V HiKOKI MultiVolt'],
  },
  {
    slug: 'einhell',
    naziv: 'Einhell',
    opis: 'Najbolji odnos cene i upotrebljivosti za kućnu i povremenu upotrebu, bez pretenzija da bude više od toga. Power X-Change je jedna baterija za bušilicu, kosačicu, duvač i pumpu: za domaćinstvo je to praktičnije nego bolji motor. Ne kupovati za dnevni profesionalni rad, motori i ležajevi tu ne izdrže.',
    akuSistemi: ['18V Einhell Power X-Change'],
  },
  {
    slug: 'ryobi',
    naziv: 'Ryobi',
    opis: 'DIY brend sa neobično širokim ONE+ katalogom: preko 250 alata i bašte na istoj 18V bateriji, i stara baterija iz 2010. i dalje radi na novoj mašini. Kvalitet je iznad Einhell-a, ispod profesionalnih serija. Dobar izbor za renoviranje sopstvenog stana, loš za majstora koji od toga živi.',
    akuSistemi: ['18V Ryobi ONE+'],
  },
  {
    slug: 'stanley',
    naziv: 'Stanley',
    opis: 'Jak u ručnom alatu: metri, libele, noževi, garniture ključeva. Tu je i dalje standard koji drugi kopiraju. Elektroalat pod ovim imenom je srednja klasa i ne meri se sa DeWalt-om, iako su ista korporacija. Cena je razlog zbog kog se kupuje, i to je legitiman razlog.',
  },
  {
    slug: 'wurth',
    naziv: 'Würth',
    opis: 'Prvenstveno kuća za vezni i potrošni materijal: šrafovi, tiplovi, hemija, burgije. Tu je kvalitet stvarno vrhunski i cena prati. Master linija elektroalata se proizvodi kod drugih (dobrim delom Metabo i Panasonic) i prodaje kroz njihove terenske komercijaliste, pa je polovno teže naći delove.',
    akuSistemi: ['18V Würth M-Cube'],
  },
  {
    slug: 'flex',
    naziv: 'Flex',
    opis: 'Firma koja je 1954. napravila prvu ugaonu brusilicu: otud i reč „fleksarica". Uzak ali dubok katalog: brusilice, polirke i mašine za renovaciju. Kod polirki za automobile i sanacije betona nemaju ozbiljnu konkurenciju. Van tih niša nema mnogo razloga da ih biraš.',
    akuSistemi: ['18V Flex'],
  },
  {
    slug: 'fein',
    naziv: 'Fein',
    opis: 'Izumitelji oscilirajućeg multialata i najstariji proizvođač električnog alata uopšte. Specijalisti za obradu metala, sečenje limova i mašine za bušenje magnetom. Cena je na Hilti nivou, opravdana je samo ako radiš baš to čime se oni bave. Za opšte gradilište je preskupo.',
    akuSistemi: ['18V Fein AMPShare', '18V Metabo CAS'],
  },
  {
    slug: 'villager',
    naziv: 'Villager',
    opis: 'Domaći brend sa realnom servisnom mrežom po celoj Srbiji, što kod kineski proizvedene mašine vredi više nego specifikacija. Najjači su u baštenskom programu, agregatima i pumpama. Elektroalat je upotrebljiv za povremene poslove; delovi i servis se dobijaju bez čekanja, i to je glavna prednost.',
    akuSistemi: ['20V Villager Fuse'],
  },
  {
    slug: 'total',
    naziv: 'Total',
    opis: 'Budget brend koji je poslednjih godina osetno podigao nivo: ima realnu garanciju i uvoznika u Srbiji, za razliku od bezimenih mašina sa istog nivoa cene. Za alat koji koristiš nekoliko puta godišnje potpuno je dovoljan. Nemoj računati na dostupnost rezervnih delova posle par godina.',
    akuSistemi: ['20V Total'],
  },
  {
    slug: 'ingco',
    naziv: 'Ingco',
    opis: 'Najjeftiniji ulaz u kategoriju, sa ogromnim katalogom koji pokriva sve od odvijača do kompresora. Kvalitet varira od artikla do artikla: neki ručni alat je iznenađujuće dobar, elektroalat je za povremenu upotrebu. Kupuj kada je alat potreban za jedan posao, ne kada ti je alat zanat.',
    akuSistemi: ['20V Ingco'],
  },
]

export default brendovi
