import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { aktivnaSesija } from '@/lib/auth'
import { osveziKatalog } from '@/lib/osvezavanje'
import { obrisiSlike } from '@/lib/slike'

// PATCH: prodavac (de)aktivira sopstveni oglas. DELETE: prodavac trajno
// briše sopstveni oglas. Obe rute proveravaju da oglas stvarno pripada
// prijavljenom korisniku — ADMIN ima svoje odvojene rute (vidi
// app/api/admin/oglasi/[id]/route.ts) sa širim ovlašćenjima.
type Props = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Props) {
  const sesija = await aktivnaSesija()
  if (!sesija) return NextResponse.json({ greska: 'Nisi prijavljen.' }, { status: 401 })
  const { id } = await params

  const oglas = await db.oglas.findUnique({ where: { id } })
  if (!oglas || oglas.userId !== sesija.userId) {
    return NextResponse.json({ greska: 'Oglas nije pronađen.' }, { status: 404 })
  }

  const telo = await req.json().catch(() => ({}))
  const podaci: { aktivan?: boolean; cena?: number; cenaDogovor?: boolean } = {}
  if (typeof telo.aktivan === 'boolean') podaci.aktivan = telo.aktivan
  if (typeof telo.cenaDogovor === 'boolean') podaci.cenaDogovor = telo.cenaDogovor
  if (telo.cena !== undefined) {
    const cena = Math.round(Number(telo.cena))
    if (!Number.isFinite(cena) || cena <= 0 || cena > 50_000_000) {
      return NextResponse.json({ greska: 'Cena mora biti veća od nule.' }, { status: 400 })
    }
    podaci.cena = cena
  }

  await db.oglas.update({ where: { id }, data: podaci })
  osveziKatalog()
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  const sesija = await aktivnaSesija()
  if (!sesija) return NextResponse.json({ greska: 'Nisi prijavljen.' }, { status: 401 })
  const { id } = await params

  const oglas = await db.oglas.findUnique({ where: { id } })
  if (!oglas || oglas.userId !== sesija.userId) {
    return NextResponse.json({ greska: 'Oglas nije pronađen.' }, { status: 404 })
  }

  await db.oglas.delete({ where: { id } })
  await obrisiSlike(oglas.slike)
  osveziKatalog()
  return NextResponse.json({ ok: true })
}
