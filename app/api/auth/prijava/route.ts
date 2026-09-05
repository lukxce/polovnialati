import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { proveriLozinku, napraviSesijuKolacic } from '@/lib/auth'
import type { TipProdavca } from '@/lib/types'

export async function POST(req: NextRequest) {
  const { email, lozinka } = await req.json().catch(() => ({}))
  if (!email || !lozinka) {
    return NextResponse.json({ greska: 'Email i lozinka su obavezni.' }, { status: 400 })
  }

  const korisnik = await db.user.findUnique({ where: { email: String(email).toLowerCase().trim() } })
  // Ista poruka za "ne postoji" i "pogrešna lozinka" — standardna praksa,
  // ne otkriva napadaču koji email postoji u bazi.
  const opstaGreska = () => NextResponse.json({ greska: 'Pogrešan email ili lozinka.' }, { status: 401 })

  if (!korisnik) return opstaGreska()
  const ispravna = await proveriLozinku(lozinka, korisnik.passwordHash)
  if (!ispravna) return opstaGreska()

  await napraviSesijuKolacic({
    userId: korisnik.id,
    email: korisnik.email,
    naziv: korisnik.naziv,
    tip: korisnik.tip as TipProdavca,
    uloga: korisnik.uloga as 'PRODAVAC' | 'ADMIN',
  })

  return NextResponse.json({ ok: true, uloga: korisnik.uloga })
}
