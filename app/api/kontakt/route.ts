import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { dozvoljeno, ipAdresa } from '@/lib/ogranicenje'

/** Poruka sa /kontakt — čuva se u bazi, admin je čita u /admin. */
export async function POST(req: NextRequest) {
  const ip = await ipAdresa()
  if (!(await dozvoljeno(`kontakt:${ip}`, 5, 60))) {
    return NextResponse.json({ greska: 'Previše poruka u kratkom roku. Pokušaj kasnije.' }, { status: 429 })
  }

  const t = await req.json().catch(() => ({}))
  const ime = typeof t.ime === 'string' ? t.ime.trim().slice(0, 100) : ''
  const email = typeof t.email === 'string' ? t.email.trim().toLowerCase().slice(0, 200) : ''
  const tema = typeof t.tema === 'string' ? t.tema.trim().slice(0, 100) : ''
  const tekst = typeof t.tekst === 'string' ? t.tekst.trim().slice(0, 5000) : ''

  if (!ime || !tekst) return NextResponse.json({ greska: 'Ime i poruka su obavezni.' }, { status: 400 })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ greska: 'Unesi ispravnu email adresu.' }, { status: 400 })
  }

  await db.kontaktPoruka.create({ data: { ime, email, tema: tema || 'Opšte', tekst } })
  return NextResponse.json({ ok: true })
}
