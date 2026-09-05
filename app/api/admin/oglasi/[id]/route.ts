import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { zahtevajAdmina } from '@/lib/auth'

// Admin verzija — za razliku od app/api/oglasi/[id], ne proverava vlasništvo
// (admin sme da menja bilo koji oglas) i dozvoljava polja koja prodavac
// sam sebi ne sme dati (provereno, istaknuto).
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await zahtevajAdmina()
  } catch {
    return NextResponse.json({ greska: 'Nije dozvoljeno.' }, { status: 403 })
  }
  const { id } = await params
  const telo = await req.json().catch(() => ({}))
  const podaci: Record<string, boolean> = {}
  for (const polje of ['aktivan', 'provereno', 'istaknuto'] as const) {
    if (typeof telo[polje] === 'boolean') podaci[polje] = telo[polje]
  }
  await db.oglas.update({ where: { id }, data: podaci })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await zahtevajAdmina()
  } catch {
    return NextResponse.json({ greska: 'Nije dozvoljeno.' }, { status: 403 })
  }
  const { id } = await params
  await db.oglas.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
