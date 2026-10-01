import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { zahtevajAdmina } from '@/lib/auth'
import { osveziKatalog } from '@/lib/osvezavanje'
import { obrisiSlike } from '@/lib/slike'

// Admin verzija — za razliku od app/api/oglasi/[id], ne proverava vlasništvo
// (admin sme da menja bilo koji oglas) i dozvoljava polja koja prodavac
// sam sebi ne sme dati (provereno, istaknuto).
type Props = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Props) {
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
  osveziKatalog()
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  try {
    await zahtevajAdmina()
  } catch {
    return NextResponse.json({ greska: 'Nije dozvoljeno.' }, { status: 403 })
  }
  const { id } = await params
  const oglas = await db.oglas.findUnique({ where: { id }, select: { slike: true } })
  if (!oglas) return NextResponse.json({ greska: 'Oglas ne postoji.' }, { status: 404 })
  await db.oglas.delete({ where: { id } })
  await obrisiSlike(oglas.slike)
  osveziKatalog()
  return NextResponse.json({ ok: true })
}
