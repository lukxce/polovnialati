import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { heshirajLozinku, napraviSesijuKolacic, TIPOVI_NALOGA, ULOGE } from '@/lib/auth'
import type { TipProdavca } from '@/lib/types'

// Jedini način da neko dobije nalog — javna registracija, uvek uloga
// PRODAVAC. ADMIN se nikad ne pravi ovim putem (vidi prisma/seed.ts).
export async function POST(req: NextRequest) {
  const telo = await req.json().catch(() => null)
  const { email, lozinka, naziv, tip, grad, telefon, pib } = telo ?? {}

  if (!email?.trim() || !lozinka || !naziv?.trim() || !grad?.trim()) {
    return NextResponse.json({ greska: 'Email, lozinka, naziv i grad su obavezni.' }, { status: 400 })
  }
  if (String(lozinka).length < 8) {
    return NextResponse.json({ greska: 'Lozinka mora imati bar 8 karaktera.' }, { status: 400 })
  }
  if (!TIPOVI_NALOGA.includes(tip)) {
    return NextResponse.json({ greska: 'Nevažeći tip naloga.' }, { status: 400 })
  }

  const emailNorm = String(email).toLowerCase().trim()
  const postojeci = await db.user.findUnique({ where: { email: emailNorm } })
  if (postojeci) {
    return NextResponse.json({ greska: 'Nalog sa ovim emailom već postoji.' }, { status: 409 })
  }

  const korisnik = await db.user.create({
    data: {
      email: emailNorm,
      passwordHash: await heshirajLozinku(String(lozinka)),
      naziv: String(naziv).trim(),
      tip: tip as TipProdavca,
      grad: String(grad).trim(),
      telefon: telefon?.trim() || null,
      pib: tip !== 'privatno-lice' ? pib?.trim() || null : null,
      uloga: ULOGE.PRODAVAC,
    },
  })

  await napraviSesijuKolacic({
    userId: korisnik.id,
    email: korisnik.email,
    naziv: korisnik.naziv,
    tip: korisnik.tip as TipProdavca,
    uloga: korisnik.uloga as 'PRODAVAC' | 'ADMIN',
  })

  return NextResponse.json({ ok: true })
}
