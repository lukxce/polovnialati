import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { dozvoljeno, ipAdresa } from '@/lib/ogranicenje'

/**
 * Broj telefona prodavca se ne upisuje u HTML stranice oglasa (botovi bi ga
 * pokupili za par minuta), nego se otkriva na klik, uz limit po IP adresi.
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ip = await ipAdresa()
  if (!(await dozvoljeno(`telefon:${ip}`, 30, 60))) {
    return NextResponse.json({ greska: 'Previše zahteva. Pokušaj kasnije.' }, { status: 429 })
  }

  const oglas = await db.oglas.findUnique({
    where: { id },
    select: { aktivan: true, user: { select: { telefon: true, blokiran: true } } },
  })
  if (!oglas || !oglas.aktivan || oglas.user.blokiran) {
    return NextResponse.json({ greska: 'Oglas ne postoji.' }, { status: 404 })
  }
  return NextResponse.json({ telefon: oglas.user.telefon ?? null })
}
