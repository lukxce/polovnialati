import type { Kategorija } from '@/lib/types'

/**
 * Dvonivoska taksonomija. Nadkategorije nemaju `roditelj`,
 * potkategorije (listovi) nose slug nadkategorije u `roditelj`.
 * `ikona` je ključ iz components/Ikone.tsx.
 */
export const kategorije: Kategorija[] = [
  // ── 1. Elektroalat ───────────────────────────────────────────────
  {
    slug: 'elektroalat',
    naziv: 'Elektroalat',
    ikona: 'busilica',
    opis: 'Mrežni i akumulatorski alat za bušenje, sečenje, brušenje i obradu. Srce svake radionice i gradilišta.',
  },
  { slug: 'busilice-i-odvijaci', naziv: 'Bušilice i odvijači', roditelj: 'elektroalat', ikona: 'busilica' },
  { slug: 'rotacione-busilice-sds', naziv: 'Rotacione bušilice (SDS)', roditelj: 'elektroalat', ikona: 'cekic-busilica' },
  { slug: 'ugaone-brusilice', naziv: 'Ugaone brusilice', roditelj: 'elektroalat', ikona: 'brusilica' },
  { slug: 'testere', naziv: 'Testere', roditelj: 'elektroalat', ikona: 'testera' },
  { slug: 'rendisaljke', naziv: 'Rendisaljke', roditelj: 'elektroalat', ikona: 'rende' },
  { slug: 'brusilice-za-drvo', naziv: 'Brusilice za drvo', roditelj: 'elektroalat', ikona: 'vibro-brusilica' },
  { slug: 'mesalice-za-malter', naziv: 'Mešalice za malter', roditelj: 'elektroalat', ikona: 'mesalica' },

  // ── 2. Akumulatorski sistemi ─────────────────────────────────────
  {
    slug: 'akumulatorski-sistemi',
    naziv: 'Akumulatorski sistemi',
    ikona: 'baterija',
    opis: 'Platforma je važnija od pojedinačne mašine. Ovde biraš po sistemu: alat, baterije, punjači i kompletni setovi.',
  },
  { slug: 'akumulatorski-alat', naziv: 'Akumulatorski alat', roditelj: 'akumulatorski-sistemi', ikona: 'aku-busilica' },
  { slug: 'baterije', naziv: 'Baterije', roditelj: 'akumulatorski-sistemi', ikona: 'baterija' },
  { slug: 'punjaci', naziv: 'Punjači', roditelj: 'akumulatorski-sistemi', ikona: 'punjac' },
  { slug: 'setovi', naziv: 'Setovi', roditelj: 'akumulatorski-sistemi', ikona: 'kofer' },

  // ── 3. Ručni alat ────────────────────────────────────────────────
  {
    slug: 'rucni-alat',
    naziv: 'Ručni alat',
    ikona: 'kljuc',
    opis: 'Alat bez kabla i baterije, onaj koji traje decenijama. Garniture ključeva, čekići, klešta, odvijači i stege.',
  },
  { slug: 'kljucevi-i-garniture', naziv: 'Ključevi i garniture', roditelj: 'rucni-alat', ikona: 'kljuc' },
  { slug: 'cekici-i-dleta', naziv: 'Čekići i dleta', roditelj: 'rucni-alat', ikona: 'cekic' },
  { slug: 'klesta', naziv: 'Klešta', roditelj: 'rucni-alat', ikona: 'klesta' },
  { slug: 'odvijaci', naziv: 'Odvijači', roditelj: 'rucni-alat', ikona: 'odvijac' },
  { slug: 'stege', naziv: 'Stege', roditelj: 'rucni-alat', ikona: 'stega' },

  // ── 4. Merenje i obeležavanje ────────────────────────────────────
  {
    slug: 'merenje-i-obelezavanje',
    naziv: 'Merenje i obeležavanje',
    ikona: 'laser',
    opis: 'Laseri, nivelatori, detektori i daljinomeri. Oprema koja odlučuje da li će posao biti prav ili samo brz.',
  },
  { slug: 'laseri', naziv: 'Laseri', roditelj: 'merenje-i-obelezavanje', ikona: 'laser' },
  { slug: 'nivelatori', naziv: 'Nivelatori', roditelj: 'merenje-i-obelezavanje', ikona: 'nivelator' },
  { slug: 'detektori', naziv: 'Detektori', roditelj: 'merenje-i-obelezavanje', ikona: 'detektor' },
  { slug: 'daljinomeri', naziv: 'Daljinomeri', roditelj: 'merenje-i-obelezavanje', ikona: 'daljinomer' },
  { slug: 'metri-i-libele', naziv: 'Metri i libele', roditelj: 'merenje-i-obelezavanje', ikona: 'libela' },

  // ── 5. Burgije, sečiva i potrošni materijal ──────────────────────
  {
    slug: 'burgije-seciva-i-potrosni-materijal',
    naziv: 'Burgije, sečiva i potrošni materijal',
    ikona: 'burgija',
    opis: 'Ono što se troši i najčešće dokupljuje: burgije, krune, diskovi, listovi za testere i vezni materijal.',
  },
  { slug: 'sds-burgije', naziv: 'SDS burgije', roditelj: 'burgije-seciva-i-potrosni-materijal', ikona: 'burgija' },
  { slug: 'burgije-za-metal-i-drvo', naziv: 'Burgije za metal i drvo', roditelj: 'burgije-seciva-i-potrosni-materijal', ikona: 'burgija' },
  { slug: 'bitovi-i-nastavci', naziv: 'Bitovi i nastavci', roditelj: 'burgije-seciva-i-potrosni-materijal', ikona: 'odvijac' },
  { slug: 'krune', naziv: 'Krune', roditelj: 'burgije-seciva-i-potrosni-materijal', ikona: 'kruna' },
  { slug: 'rezni-i-brusni-diskovi', naziv: 'Rezni i brusni diskovi', roditelj: 'burgije-seciva-i-potrosni-materijal', ikona: 'disk' },
  { slug: 'listovi-za-testere', naziv: 'Listovi za testere', roditelj: 'burgije-seciva-i-potrosni-materijal', ikona: 'list-testere' },
  { slug: 'srafovi-i-tiplovi', naziv: 'Šrafovi i tiplovi', roditelj: 'burgije-seciva-i-potrosni-materijal', ikona: 'sraf' },

  // ── 6. Pneumatika i kompresori ───────────────────────────────────
  {
    slug: 'pneumatika-i-kompresori',
    naziv: 'Pneumatika i kompresori',
    ikona: 'kompresor',
    opis: 'Vazduh kao pogon: klipni i vijčani kompresori, pneumatski alat, creva i brzi priključci.',
  },
  { slug: 'kompresori', naziv: 'Kompresori', roditelj: 'pneumatika-i-kompresori', ikona: 'kompresor' },
  { slug: 'pneumatski-alat', naziv: 'Pneumatski alat', roditelj: 'pneumatika-i-kompresori', ikona: 'pneumatski-kljuc' },
  { slug: 'creva-i-prikljucci', naziv: 'Creva i priključci', roditelj: 'pneumatika-i-kompresori', ikona: 'crevo' },

  // ── 7. Zavarivanje ───────────────────────────────────────────────
  {
    slug: 'zavarivanje',
    naziv: 'Zavarivanje',
    ikona: 'zavarivanje',
    opis: 'Inverteri, MIG/MAG aparati i zaštitna oprema. Od kućne garaže do bravarske radionice.',
  },
  { slug: 'inverteri', naziv: 'Inverteri', roditelj: 'zavarivanje', ikona: 'inverter' },
  { slug: 'mig-mag', naziv: 'MIG/MAG', roditelj: 'zavarivanje', ikona: 'mig' },
  { slug: 'oprema-i-zastita', naziv: 'Oprema i zaštita', roditelj: 'zavarivanje', ikona: 'maska' },

  // ── 8. Sitna mehanizacija ────────────────────────────────────────
  {
    slug: 'sitna-mehanizacija',
    naziv: 'Sitna mehanizacija',
    ikona: 'vibro',
    opis: 'Mašine koje se voze u kombiju, a ne na šleperu: vibro nabijači, pumpe, agregati i mešalice za beton.',
  },
  { slug: 'vibro-nabijaci', naziv: 'Vibro nabijači', roditelj: 'sitna-mehanizacija', ikona: 'vibro' },
  { slug: 'pumpe-za-vodu', naziv: 'Pumpe za vodu', roditelj: 'sitna-mehanizacija', ikona: 'pumpa' },
  { slug: 'agregati', naziv: 'Agregati', roditelj: 'sitna-mehanizacija', ikona: 'agregat' },
  { slug: 'mesalice-za-beton', naziv: 'Mešalice za beton', roditelj: 'sitna-mehanizacija', ikona: 'betonjerka' },

  // ── 9. Skele, merdevine i zaštita ────────────────────────────────
  {
    slug: 'skele-merdevine-i-zastita',
    naziv: 'Skele, merdevine i zaštita',
    ikona: 'merdevine',
    opis: 'Pristup i bezbednost na visini, plus lična zaštitna oprema koja se prva zaboravi da kupi.',
  },
  { slug: 'merdevine', naziv: 'Merdevine', roditelj: 'skele-merdevine-i-zastita', ikona: 'merdevine' },
  { slug: 'skele', naziv: 'Skele', roditelj: 'skele-merdevine-i-zastita', ikona: 'skela' },
  { slug: 'licna-zastita', naziv: 'Lična zaštita', roditelj: 'skele-merdevine-i-zastita', ikona: 'stit' },

  // ── 10. Radionica ────────────────────────────────────────────────
  {
    slug: 'radionica',
    naziv: 'Radionica',
    ikona: 'kofer',
    opis: 'Sve što alat drži na okupu: kutije i kolica, radni stolovi i usisivači za gradilište.',
  },
  { slug: 'kutije-i-kolica-za-alat', naziv: 'Kutije i kolica za alat', roditelj: 'radionica', ikona: 'kofer' },
  { slug: 'radni-stolovi', naziv: 'Radni stolovi', roditelj: 'radionica', ikona: 'radni-sto' },
  { slug: 'usisivaci', naziv: 'Usisivači', roditelj: 'radionica', ikona: 'usisivac' },
]

export default kategorije
