import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { heshirajLozinku, napraviSesijuKolacic, TIPOVI_NALOGA, ULOGE } from '@/lib/auth'
import { slugProdavca } from '@/lib/nalozi'
import { dozvoljeno, ipAdresa } from '@/lib/ogranicenje'
import type { TipProdavca } from '@/lib/types'

// Jedini način da neko dobije nalog — javna registracija, uvek uloga
// PRODAVAC. ADMIN se nikad ne pravi ovim putem (vidi prisma/seed.ts).
export async function POST(req: NextRequest) {
  const telo = await req.json().catch(() => null)
  const { email, lozinka, naziv, tip, grad, telefon, pib, saglasnost } = telo ?? {}

  if (!email?.trim() || !lozinka || !naziv?.trim() || !grad?.trim()) {
    return NextResponse.json({ greska: 'Email, lozinka, naziv i grad su obavezni.' }, { status: 400 })
  }
  const emailNorm = String(email).toLowerCase().trim().slice(0, 200)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
    return NextResponse.json({ greska: 'Unesi ispravnu email adresu.' }, { status: 400 })
  }
  if (String(lozinka).length < 8) {
    return NextResponse.json({ greska: 'Lozinka mora imati bar 8 karaktera.' }, { status: 400 })
  }
  if (String(lozinka).length > 200) {
    return NextResponse.json({ greska: 'Lozinka je predugačka.' }, { status: 400 })
  }
  if (!TIPOVI_NALOGA.includes(tip)) {
    return NextResponse.json({ greska: 'Nevažeći tip naloga.' }, { status: 400 })
  }
  if (saglasnost !== true) {
    return NextResponse.json(
      { greska: 'Za otvaranje naloga potrebno je da prihvatiš uslove korišćenja.' },
      { status: 400 },
    )
  }

  const ip = await ipAdresa()
  if (!(await dozvoljeno(`registracija:${ip}`, 5, 60))) {
    return NextResponse.json(
      { greska: 'Previše novih naloga sa ove adrese. Pokušaj za sat vremena.' },
      { status: 429 },
    )
  }

  const postojeci = await db.user.findUnique({ where: { email: emailNorm } })
  if (postojeci) {
    return NextResponse.json({ greska: 'Nalog sa ovim emailom već postoji.' }, { status: 409 })
  }

  const nazivCist = String(naziv).trim().slice(0, 80)
  const korisnik = await db.user.create({
    data: {
      email: emailNorm,
      slug: await slugProdavca(nazivCist),
      passwordHash: await heshirajLozinku(String(lozinka)),
      naziv: nazivCist,
      tip: tip as TipProdavca,
      grad: String(grad).trim().slice(0, 60),
      telefon: String(telefon ?? '').trim().slice(0, 30) || null,
      pib: tip !== 'privatno-lice' ? String(pib ?? '').trim().slice(0, 20) || null : null,
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
