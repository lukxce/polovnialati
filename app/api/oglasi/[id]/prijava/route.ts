import { NextRequest, NextResponse } from 'next/server'
import { ucitajSesiju } from '@/lib/auth'
import { db } from '@/lib/db'
import { dozvoljeno, ipAdresa } from '@/lib/ogranicenje'
import { RAZLOZI_PRIJAVE } from '@/lib/prijave'

/** Prijava oglasa — admin je vidi u /admin. Može i bez naloga. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ip = await ipAdresa()
  if (!(await dozvoljeno(`prijava:${ip}`, 10, 60))) {
    return NextResponse.json({ greska: 'Previše prijava u kratkom roku.' }, { status: 429 })
  }

  const telo = await req.json().catch(() => ({}))
  const razlog = typeof telo.razlog === 'string' && RAZLOZI_PRIJAVE[telo.razlog] ? telo.razlog : null
  if (!razlog) return NextResponse.json({ greska: 'Izaberi razlog prijave.' }, { status: 400 })
  const tekst = typeof telo.tekst === 'string' ? telo.tekst.trim().slice(0, 1000) : ''

  const oglas = await db.oglas.findUnique({ where: { id }, select: { id: true } })
  if (!oglas) return NextResponse.json({ greska: 'Oglas ne postoji.' }, { status: 404 })

  const sesija = await ucitajSesiju()
  await db.prijava.create({
    data: { oglasId: id, userId: sesija?.userId ?? null, razlog, tekst: tekst || null },
  })
  return NextResponse.json({ ok: true })
}
