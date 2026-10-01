import type { Dostava, Oglas, Specifikacija, Stanje } from '@/lib/types'

/* ════════════════════════════════════════════════════════════════
   Nacrt oglasa — jedino stanje koje tok drži.
   Živi u memoriji pregledača dok se ne objavi; fotografije se otpremaju
   tek pri objavi (ProdajniTok.objavi).
   ════════════════════════════════════════════════════════════════ */

export type Fotografija = {
  id: string
  /** `URL.createObjectURL` — opoziva se pri napuštanju toka. */
  url: string
  ime: string
}

export type Nacrt = {
  kategorija?: string
  naslov: string
  /** Naslov je ručno menjan pa ga predlog više ne prepisuje. */
  naslovRucno: boolean
  brend?: string
  model: string
  godiste?: number
  stanje?: Stanje
  akuSistem?: string
  specifikacije: Specifikacija[]
  opis: string
  uPakovanju: string[]
  /** stavka → da li je u redu; nedostajući ključ znači „još neodgovoreno". */
  provera: Record<string, boolean>
  garancija: number
  fotografije: Fotografija[]
  cena?: number
  cenaDogovor: boolean
  grad?: string
  dostava: Dostava[]
}

export const PRAZAN_NACRT: Nacrt = {
  naslov: '',
  naslovRucno: false,
  model: '',
  specifikacije: [],
  opis: '',
  uPakovanju: [],
  provera: {},
  garancija: 0,
  fotografije: [],
  cenaDogovor: false,
  dostava: ['licno'],
}

/* ── Serijalizovane opcije koje server prosleđuje toku ─────────── */

export type ListKategorije = { slug: string; naziv: string; ikona: string }

export type GrupaKategorija = {
  slug: string
  naziv: string
  ikona: string
  opis?: string
  deca: ListKategorije[]
}

export type BrendOpcija = {
  slug: string
  naziv: string
  akuSistemi: string[]
}

/* ── Koraci ────────────────────────────────────────────────────── */

export const KORACI = [
  { broj: 1, naziv: 'Kategorija', kratko: 'Kategorija' },
  { broj: 2, naziv: 'Detalji mašine', kratko: 'Detalji' },
  { broj: 3, naziv: 'Stanje i provera', kratko: 'Stanje' },
  { broj: 4, naziv: 'Fotografije', kratko: 'Fotografije' },
  { broj: 5, naziv: 'Cena i objava', kratko: 'Cena' },
] as const

export const POSLEDNJI_KORAK = 5

/* ════════════════════════════════════════════════════════════════
   Liste provere po nadkategoriji.
   Provera nije univerzalna — kod agregata se gleda curenje ulja,
   kod baterije broj ciklusa. Zato svaka nadkategorija ima svoju listu.
   ════════════════════════════════════════════════════════════════ */

export const PROVERE: Record<string, string[]> = {
  elektroalat: [
    'Motor i četkice',
    'Kabl i utikač',
    'Prekidač',
    'Kućište bez pukotina',
    'Stezna glava / SDS prihvat',
    'Testiran pod opterećenjem',
  ],
  'akumulatorski-sistemi': [
    'Baterija drži kapacitet',
    'Punjač puni do kraja',
    'Kontakti čisti i neoštećeni',
    'Kućište baterije bez ispupčenja',
    'Original, nije replika ćelija',
    'Testirano na mašini',
  ],
  'rucni-alat': [
    'Bez pukotina i deformacija',
    'Drška čvrsta i cela',
    'Zaštitni sloj se ne ljušti',
    'Mehanizam radi glatko',
    'Garnitura kompletna',
    'Bez tragova varenja i improvizacija',
  ],
  'merenje-i-obelezavanje': [
    'Uključuje se i drži napajanje',
    'Tačnost proverena poređenjem',
    'Kalibracija poznata ili u roku',
    'Optika i staklo bez ogrebotina',
    'Nosač i stativ kompletni',
    'Kofer i pribor u kompletu',
  ],
  'burgije-seciva-i-potrosni-materijal': [
    'Stepen istrošenosti naveden u opisu',
    'Bez tragova pregrevanja',
    'Prihvat neoštećen',
    'Original pakovanje i oznake',
    'Rok upotrebe važeći',
    'Broj komada odgovara opisu',
  ],
  'pneumatika-i-kompresori': [
    'Motor se pokreće bez zastoja',
    'Kotao bez rđe i curenja',
    'Manometar i regulator rade',
    'Sigurnosni ventil ispravan',
    'Creva i priključci bez pucanja',
    'Radni pritisak proveren',
  ],
  zavarivanje: [
    'Aparat pali luk stabilno',
    'Ventilator hlađenja radi',
    'Kablovi, klešta i masa bez oštećenja',
    'Displej i regulacija ispravni',
    'Maska i zaštitna oprema kompletni',
    'Testirano na probnom komadu',
  ],
  'sitna-mehanizacija': [
    'Motor pali na hladno',
    'Bez curenja ulja i goriva',
    'Sati rada poznati',
    'Servis i filteri urađeni',
    'Ploča, bubanj ili pumpa bez pukotina',
    'Testirano pod opterećenjem',
  ],
  'skele-merdevine-i-zastita': [
    'Nosivost i klasa označene',
    'Bez deformacija i pukotina',
    'Zglobovi i osigurači drže',
    'Stopice i gume prisutne',
    'Atest ili dokumentacija postoji',
    'Svi delovi na broju',
  ],
  radionica: [
    'Konstrukcija stabilna, bez klimanja',
    'Točkovi i vođice rade',
    'Brave i kopče drže',
    'Bez rđe koja probija materijal',
    'Motor i filter ispravni (usisivači)',
    'Fioke i pregrade kompletne',
  ],
}

const PODRAZUMEVANA_PROVERA = PROVERE.elektroalat

export function proveraZaKoren(koren?: string): string[] {
  if (!koren) return PODRAZUMEVANA_PROVERA
  return PROVERE[koren] ?? PODRAZUMEVANA_PROVERA
}

/* ── Predlozi naziva specifikacija po nadkategoriji ────────────── */

export const PREDLOZI_SPECIFIKACIJA: Record<string, string[]> = {
  elektroalat: ['Snaga', 'Napon', 'Broj obrtaja', 'Energija udara', 'Prihvat', 'Težina'],
  'akumulatorski-sistemi': [
    'Napon',
    'Kapacitet',
    'Tip ćelija',
    'Vreme punjenja',
    'Broj ciklusa',
    'Težina',
  ],
  'rucni-alat': ['Materijal', 'Broj delova', 'Prihvat', 'Dimenzije', 'Težina'],
  'merenje-i-obelezavanje': ['Domet', 'Tačnost', 'Klasa zaštite', 'Napajanje', 'Radna temperatura'],
  'burgije-seciva-i-potrosni-materijal': [
    'Prečnik',
    'Dužina',
    'Prihvat',
    'Materijal',
    'Broj komada',
  ],
  'pneumatika-i-kompresori': [
    'Radni pritisak',
    'Protok vazduha',
    'Zapremina kotla',
    'Snaga motora',
    'Nivo buke',
  ],
  zavarivanje: [
    'Struja zavarivanja',
    'Radni ciklus',
    'Napajanje',
    'Prečnik elektrode',
    'Težina',
  ],
  'sitna-mehanizacija': [
    'Snaga motora',
    'Zapremina motora',
    'Gorivo',
    'Radna širina',
    'Težina',
  ],
  'skele-merdevine-i-zastita': ['Nosivost', 'Visina', 'Broj gazišta', 'Materijal', 'Standard'],
  radionica: ['Dimenzije', 'Broj fioka', 'Nosivost', 'Materijal', 'Zapremina'],
}

export function predloziSpecifikacija(koren?: string): string[] {
  if (!koren) return PREDLOZI_SPECIFIKACIJA.elektroalat
  return PREDLOZI_SPECIFIKACIJA[koren] ?? PREDLOZI_SPECIFIKACIJA.elektroalat
}

/* ── Predlozi za „u pakovanju" ─────────────────────────────────── */

export const PREDLOZI_PAKOVANJA: Record<string, string[]> = {
  elektroalat: ['Originalni kofer', 'Dodatna ručka', 'Ključ za steznu glavu', 'Uputstvo', 'Račun'],
  'akumulatorski-sistemi': ['Baterija', 'Punjač', 'Kofer', 'Uputstvo', 'Račun'],
  'rucni-alat': ['Kofer ili torba', 'Uložak sa pregradama', 'Uputstvo', 'Račun'],
  'merenje-i-obelezavanje': ['Kofer', 'Stativ', 'Ciljna ploča', 'Baterije', 'Račun'],
  'burgije-seciva-i-potrosni-materijal': ['Original pakovanje', 'Kutija sa pregradama', 'Račun'],
  'pneumatika-i-kompresori': ['Crevo', 'Brzi priključci', 'Regulator', 'Uputstvo', 'Račun'],
  zavarivanje: ['Kablovi sa kleštima', 'Maska', 'Četka i čekić', 'Kofer', 'Račun'],
  'sitna-mehanizacija': ['Transportni točkovi', 'Alat za servis', 'Uputstvo', 'Račun'],
  'skele-merdevine-i-zastita': ['Osigurači', 'Stopice', 'Atest', 'Uputstvo'],
  radionica: ['Ključevi za bravu', 'Uložak sa pregradama', 'Filter', 'Uputstvo', 'Račun'],
}

export function predloziPakovanja(koren?: string): string[] {
  if (!koren) return PREDLOZI_PAKOVANJA.elektroalat
  return PREDLOZI_PAKOVANJA[koren] ?? PREDLOZI_PAKOVANJA.elektroalat
}

/* ════════════════════════════════════════════════════════════════
   Akumulatorski sistem — uslovno polje
   ════════════════════════════════════════════════════════════════ */

/** Nadkategorije u kojima uopšte ima smisla pitati za bateriju. */
const AKU_KORENI = new Set(['akumulatorski-sistemi', 'elektroalat'])

export function traziAkuSistem(koren: string | undefined, brend: BrendOpcija | undefined): boolean {
  if (!koren || !brend) return false
  if (!AKU_KORENI.has(koren)) return false
  return brend.akuSistemi.length > 0
}

/* ════════════════════════════════════════════════════════════════
   Validacija — po koraku, sa razlogom koji korisnik vidi
   ════════════════════════════════════════════════════════════════ */

export const MIN_OPIS = 20
export const PREPORUCEN_OPIS = 220

export type Greske = Record<string, string>

/** Greške koraka: ključ polja → poruka. Prazan objekat znači „korak je u redu". */
export function greskeKoraka(korak: number, n: Nacrt, koren?: string): Greske {
  const g: Greske = {}

  if (korak === 1) {
    if (!n.kategorija) g.kategorija = 'Izaberi potkategoriju u koju mašina spada.'
    return g
  }

  if (korak === 2) {
    if (n.naslov.trim().length < 8) g.naslov = 'Naslov mora imati bar 8 znakova.'
    if (n.naslov.trim().length > 90) g.naslov = 'Naslov je duži od 90 znakova.'
    if (!n.brend) g.brend = 'Izaberi brend.'
    if (n.model.trim().length < 2) g.model = 'Unesi oznaku modela, npr. GBH 2-28 F.'
    if (!n.stanje) g.stanje = 'Izaberi jednu od pet ocena stanja.'
    if (n.godiste !== undefined && (n.godiste < 1980 || n.godiste > new Date().getFullYear())) {
      g.godiste = `Godište mora biti između 1980. i ${new Date().getFullYear()}.`
    }
    const duzinaOpisa = n.opis.trim().length
    if (duzinaOpisa < MIN_OPIS) {
      g.opis = `Opis ima ${duzinaOpisa} od najmanje ${MIN_OPIS} znakova.`
    }
    for (const s of n.specifikacije) {
      if (s.naziv.trim() && !s.vrednost.trim()) {
        g.specifikacije = 'Svaka specifikacija mora imati i naziv i vrednost.'
        break
      }
      if (!s.naziv.trim() && s.vrednost.trim()) {
        g.specifikacije = 'Svaka specifikacija mora imati i naziv i vrednost.'
        break
      }
    }
    return g
  }

  if (korak === 3) {
    if (n.stanje && n.stanje !== 'novo') {
      const stavke = proveraZaKoren(koren)
      const neodgovoreno = stavke.filter((s) => n.provera[s] === undefined)
      if (neodgovoreno.length > 0) {
        g.provera = `Ostalo je ${neodgovoreno.length} od ${stavke.length} stavki bez odgovora.`
      }
    }
    if (n.stanje === 'novo' && n.garancija < 1) {
      g.garancija = 'Ocena „Novo" znači punu garanciju: unesi broj meseci.'
    }
    if (n.garancija < 0 || n.garancija > 120) {
      g.garancija = 'Garancija se unosi u mesecima, od 0 do 120.'
    }
    return g
  }

  if (korak === 4) {
    if (n.fotografije.length === 0) g.fotografije = 'Dodaj bar jednu fotografiju.'
    if (n.fotografije.length > 12) g.fotografije = 'Najviše 12 fotografija po oglasu.'
    return g
  }

  if (korak === 5) {
    if (n.cena === undefined || n.cena <= 0) g.cena = 'Unesi cenu u dinarima.'
    else if (n.cena > 9_999_999) g.cena = 'Cena je van opsega: najviše 9.999.999 din.'
    if (!n.grad) g.grad = 'Izaberi grad u kome se mašina preuzima.'
    if (n.dostava.length === 0) g.dostava = 'Izaberi bar jedan način preuzimanja.'
    return g
  }

  return g
}

/** Prva poruka greške koraka — ono što stoji uz onemogućeno dugme „Dalje". */
export function razlogBlokade(korak: number, n: Nacrt, koren?: string): string | undefined {
  const g = greskeKoraka(korak, n, koren)
  // Redosled prati vizuelni redosled polja na ekranu — razlog uz onemogućeno
  // dugme mora da pokazuje na prvo polje koje korisnik vidi, ne na bilo koje.
  const redosled = [
    'kategorija',
    'brend',
    'model',
    'godiste',
    'naslov',
    'stanje',
    'opis',
    'specifikacije',
    'provera',
    'garancija',
    'fotografije',
    'cena',
    'grad',
    'dostava',
  ]
  for (const k of redosled) if (g[k]) return g[k]
  const prvi = Object.values(g)[0]
  return prvi
}

export function korakValidan(korak: number, n: Nacrt, koren?: string): boolean {
  return Object.keys(greskeKoraka(korak, n, koren)).length === 0
}

/**
 * Najdalji korak na koji se sme skočiti. Osvežavanje briše nacrt, pa `?korak=4`
 * bez podataka mora da se spusti na prvi korak koji još nije ispunjen —
 * nikad da otvori polupraznu stranicu ili da pukne.
 */
export function najdaljiDozvoljen(n: Nacrt, koren?: string): number {
  for (let k = 1; k < POSLEDNJI_KORAK; k++) {
    if (!korakValidan(k, n, koren)) return k
  }
  return POSLEDNJI_KORAK
}

/* ════════════════════════════════════════════════════════════════
   Nacrt → oglas (za živi pregled kartice)
   ════════════════════════════════════════════════════════════════ */

export function nacrtUOglas(n: Nacrt): Oglas {
  return {
    id: 'nacrt',
    slug: 'nacrt',
    naslov: n.naslov.trim() || 'Naslov oglasa još nije unet',
    kategorija: n.kategorija ?? 'busilice-i-odvijaci',
    brend: n.brend ?? 'bosch-professional',
    model: n.model.trim() || 'Model',
    stanje: n.stanje ?? 'koristeno-ispravno',
    cena: n.cena ?? 0,
    cenaDogovor: n.cenaDogovor,
    opis: n.opis,
    slike: n.fotografije.map((f) => f.url),
    specifikacije: n.specifikacije.filter((s) => s.naziv.trim() && s.vrednost.trim()),
    uPakovanju: n.uPakovanju,
    godiste: n.godiste,
    garancija: n.garancija,
    akuSistem: n.akuSistem,
    lokacija: n.grad ?? 'Beograd',
    dostava: n.dostava,
    prodavacId: 'nacrt',
    prodavacTip: 'privatno-lice',
    vlasnikId: 'nacrt',
    objavljeno: new Date().toISOString(),
    pregleda: 0,
    provereno: false,
    istaknuto: false,
    stanjeChecklist: Object.entries(n.provera).map(([stavka, ok]) => ({ stavka, ok })),
  }
}

/* ── Sitnice ───────────────────────────────────────────────────── */

/** Uklanja dijakritiku — pretraga kategorija radi i bez „č/ć". */
export function normalizuj(s: string): string {
  return s
    .toLowerCase()
    .replace(/đ/g, 'd')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

export function noviId(): string {
  return `f${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36)}`
}
