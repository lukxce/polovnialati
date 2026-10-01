import { NextRequest, NextResponse } from 'next/server'
import { aktivnaSesija, heshirajLozinku, proveriLozinku } from '@/lib/auth'
import { db } from '@/lib/db'
import { dozvoljeno } from '@/lib/ogranicenje'

export async function POST(req: NextRequest) {
  const sesija = await aktivnaSesija()
  if (!sesija) return NextResponse.json({ greska: 'Nisi prijavljen.' }, { status: 401 })

  if (!(await dozvoljeno(`lozinka:${sesija.userId}`, 10, 15))) {
    return NextResponse.json({ greska: 'Previše pokušaja. Sačekaj 15 minuta.' }, { status: 429 })
  }

  const { trenutna, nova } = await req.json().catch(() => ({}))
  if (typeof nova !== 'string' || nova.length < 8 || nova.length > 200) {
    return NextResponse.json({ greska: 'Nova lozinka mora imati bar 8 karaktera.' }, { status: 400 })
  }

  const korisnik = await db.user.findUnique({ where: { id: sesija.userId } })
  if (!korisnik || !(await proveriLozinku(String(trenutna ?? ''), korisnik.passwordHash))) {
    return NextResponse.json({ greska: 'Trenutna lozinka nije tačna.' }, { status: 401 })
  }

  await db.user.update({ where: { id: korisnik.id }, data: { passwordHash: await heshirajLozinku(nova) } })
  return NextResponse.json({ ok: true })
}
