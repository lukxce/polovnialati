import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ucitajSesiju } from '@/lib/auth'

// PATCH: prodavac (de)aktivira sopstveni oglas. DELETE: prodavac trajno
// briše sopstveni oglas. Obe rute proveravaju da oglas stvarno pripada
// prijavljenom korisniku — ADMIN ima svoje odvojene rute (vidi
// app/api/admin/oglasi/[id]/route.ts) sa širim ovlašćenjima.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const sesija = await ucitajSesiju()
  if (!sesija) return NextResponse.json({ greska: 'Nisi prijavljen.' }, { status: 401 })
  const { id } = await params

  const oglas = await db.oglas.findUnique({ where: { id } })
  if (!oglas || oglas.userId !== sesija.userId) {
    return NextResponse.json({ greska: 'Oglas nije pronađen.' }, { status: 404 })
  }

  const { aktivan } = await req.json().catch(() => ({}))
  await db.oglas.update({ where: { id }, data: { aktivan: Boolean(aktivan) } })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const sesija = await ucitajSesiju()
  if (!sesija) return NextResponse.json({ greska: 'Nisi prijavljen.' }, { status: 401 })
  const { id } = await params

  const oglas = await db.oglas.findUnique({ where: { id } })
  if (!oglas || oglas.userId !== sesija.userId) {
    return NextResponse.json({ greska: 'Oglas nije pronađen.' }, { status: 404 })
  }

  await db.oglas.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
