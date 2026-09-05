import type { Oglas as OglasRow } from '@prisma/client'
import type { Dostava, Specifikacija } from './types'

/**
 * SQLite/Prisma nema nativni niz/JSON tip (vidi napomenu u schema.prisma),
 * pa polja lista žive kao JSON-string kolone. Ova dva pretvarača su
 * jedino mesto koje to zna — svaka strana koda (upload iz prodaje, prikaz
 * u nalogu, admin pregled) radi sa pravim TypeScript nizovima.
 */

export type NoviOglas = {
  naslov: string
  kategorija: string
  brend: string
  model: string
  stanje: string
  cena: number
  cenaDogovor: boolean
  opis: string
  slike: string[]
  specifikacije: Specifikacija[]
  uPakovanju: string[]
  godiste?: number
  garancija?: number
  akuSistem?: string
  lokacija: string
  dostava: Dostava[]
}

export function upisPodataka(o: NoviOglas) {
  return {
    naslov: o.naslov,
    kategorija: o.kategorija,
    brend: o.brend,
    model: o.model,
    stanje: o.stanje,
    cena: o.cena,
    cenaDogovor: o.cenaDogovor,
    opis: o.opis,
    slike: JSON.stringify(o.slike),
    specifikacije: JSON.stringify(o.specifikacije),
    uPakovanju: JSON.stringify(o.uPakovanju),
    godiste: o.godiste ?? null,
    garancija: o.garancija ?? null,
    akuSistem: o.akuSistem ?? null,
    lokacija: o.lokacija,
    dostava: JSON.stringify(o.dostava),
  }
}

export type OglasZaPrikaz = Omit<OglasRow, 'slike' | 'specifikacije' | 'uPakovanju' | 'dostava'> & {
  slike: string[]
  specifikacije: Specifikacija[]
  uPakovanju: string[]
  dostava: Dostava[]
}

export function citanjePodataka(red: OglasRow): OglasZaPrikaz {
  return {
    ...red,
    slike: JSON.parse(red.slike),
    specifikacije: JSON.parse(red.specifikacije),
    uPakovanju: JSON.parse(red.uPakovanju),
    dostava: JSON.parse(red.dostava),
  }
}
