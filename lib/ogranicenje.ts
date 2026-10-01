import 'server-only'
import { headers } from 'next/headers'
import { db } from '@/lib/db'

/**
 * Jednostavno ograničenje broja pokušaja, u bazi (tabela Pokusaj) — radi i
 * na serverless-u, gde memorija procesa ne preživljava između zahteva.
 *
 * Vraća true ako je radnja dozvoljena (i beleži pokušaj), false ako je
 * `kljuc` već iskoristio `max` pokušaja u poslednjih `minuta` minuta.
 */
export async function dozvoljeno(kljuc: string, max: number, minuta: number): Promise<boolean> {
  const od = new Date(Date.now() - minuta * 60_000)
  const broj = await db.pokusaj.count({ where: { kljuc, createdAt: { gte: od } } })
  if (broj >= max) return false
  await db.pokusaj.create({ data: { kljuc } })

  // Usputno čišćenje: ~1 od 10 poziva briše sve starije od jednog dana.
  if (Math.random() < 0.1) {
    await db.pokusaj
      .deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 24 * 60 * 60_000) } } })
      .catch(() => {})
  }
  return true
}

/** Briše zabeležene pokušaje za ključ — npr. posle uspešne prijave. */
export async function ponistiPokusaje(kljuc: string) {
  await db.pokusaj.deleteMany({ where: { kljuc } }).catch(() => {})
}

/** IP adresa klijenta iza Vercel/proxy-ja; 'nepoznato' lokalno. */
export async function ipAdresa(): Promise<string> {
  const h = await headers()
  const xff = h.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return h.get('x-real-ip') ?? 'nepoznato'
}
