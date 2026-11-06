import 'server-only'
import { ucitajSesiju, ULOGE } from '@/lib/auth'
import { db } from '@/lib/db'
import { dozvoljeno, ipAdresa } from '@/lib/ogranicenje'

export type TipInteresa = 'pregled' | 'telefon' | 'poziv'

/**
 * Da li se poseta broji u statistici: vlasnik oglasa i admin ne, i ista IP
 * adresa najviše jednom na sat po oglasu i vrsti radnje.
 */
export async function brojiSe(oglasId: string, vlasnikId: string, tip: TipInteresa) {
  const sesija = await ucitajSesiju()
  if (sesija && (sesija.userId === vlasnikId || sesija.uloga === ULOGE.ADMIN)) return false
  const ip = await ipAdresa()
  return dozvoljeno(`interes:${tip}:${oglasId}:${ip}`, 1, 60)
}

/** Upisuje jedan red interesovanja. Greška u statistici ne sme da obori zahtev. */
export async function zabeleziInteres(oglasId: string, tip: TipInteresa) {
  await db.interes.create({ data: { oglasId, tip } }).catch(() => {})
}
