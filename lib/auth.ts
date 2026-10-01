import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { db } from './db'
import type { TipProdavca } from './types'

// Public self-registration — anyone can create a PRODAVAC account, choosing
// one of the same three types the site already models (lib/types.ts
// TipProdavca). ADMIN accounts are never created through this form; the
// first one is seeded by hand (see prisma/seed.ts).
export const ULOGE = { PRODAVAC: 'PRODAVAC', ADMIN: 'ADMIN' } as const
export type Uloga = (typeof ULOGE)[keyof typeof ULOGE]

export const TIPOVI_NALOGA: TipProdavca[] = ['privatno-lice', 'servis', 'prodavnica']

const KOLACIC = 'nalog'
const SESIJA_DANA = 30

function tajniKljuc() {
  const tajna = process.env.SESSION_SECRET
  if (!tajna) {
    throw new Error('SESSION_SECRET nije podešen — vidi .env.example. Generiši sa: openssl rand -base64 32')
  }
  return new TextEncoder().encode(tajna)
}

export async function heshirajLozinku(obicna: string): Promise<string> {
  return bcrypt.hash(obicna, 12)
}

export async function proveriLozinku(obicna: string, hash: string): Promise<boolean> {
  return bcrypt.compare(obicna, hash)
}

export type Sesija = { userId: string; email: string; naziv: string; tip: TipProdavca; uloga: Uloga }

export async function napraviSesijuKolacic(podaci: Sesija) {
  const token = await new SignJWT({ ...podaci })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESIJA_DANA}d`)
    .sign(tajniKljuc())

  const kolacici = await cookies()
  kolacici.set(KOLACIC, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESIJA_DANA * 24 * 60 * 60,
  })
}

export async function obrisiSesijuKolacic() {
  const kolacici = await cookies()
  kolacici.delete(KOLACIC)
}

/** Vraća null za svakog ko nije prijavljen — pozivalac odlučuje šta dalje, ova funkcija nikad ne baca za "nema sesije". */
export async function ucitajSesiju(): Promise<Sesija | null> {
  const kolacici = await cookies()
  const token = kolacici.get(KOLACIC)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, tajniKljuc())
    return payload as unknown as Sesija
  } catch {
    return null // istekao ili neispravan token — isto kao da sesije nema
  }
}

/**
 * Sesija proverena i u bazi: nalog još postoji i nije blokiran, a uloga se
 * čita iz baze, ne iz kolačića. Kolačić važi 30 dana, pa bez ove provere
 * blokiran ili obrisan nalog bi i dalje mogao da objavljuje i šalje poruke.
 * Koristi se za svaku radnju koja nešto upisuje.
 */
export async function aktivnaSesija(): Promise<Sesija | null> {
  const sesija = await ucitajSesiju()
  if (!sesija) return null
  const korisnik = await db.user.findUnique({
    where: { id: sesija.userId },
    select: { blokiran: true, uloga: true, naziv: true, tip: true },
  })
  if (!korisnik || korisnik.blokiran) return null
  return {
    ...sesija,
    uloga: korisnik.uloga as Uloga,
    naziv: korisnik.naziv,
    tip: korisnik.tip as TipProdavca,
  }
}

export async function zahtevajSesiju(): Promise<Sesija> {
  const sesija = await aktivnaSesija()
  if (!sesija) throw new Error('NIJE_PRIJAVLJEN')
  return sesija
}

export async function zahtevajAdmina(): Promise<Sesija> {
  const sesija = await zahtevajSesiju()
  if (sesija.uloga !== ULOGE.ADMIN) throw new Error('NIJE_DOZVOLJENO')
  return sesija
}

