import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { dozvoljeno, ipAdresa } from '@/lib/ogranicenje'

/**
 * Broji pregled oglasa. Stranica oglasa je statična (ISR), pa se brojanje
 * radi ovim pozivom iz pregledača, jednom po sesiji kartice. Jedna IP adresa
 * se broji najviše jednom na sat po oglasu. Keš kataloga se namerno ne
 * osvežava — broj pregleda sme da kasni.
 */
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ip = await ipAdresa()
  if (!(await dozvoljeno(`pregled:${id}:${ip}`, 1, 60))) return NextResponse.json({ ok: true })
  await db.oglas.updateMany({ where: { id, aktivan: true }, data: { pregleda: { increment: 1 } } })
  return NextResponse.json({ ok: true })
}
