import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { brojiSe, zabeleziInteres } from '@/lib/interes'

/**
 * Broji pregled oglasa. Stranica oglasa je statična (ISR), pa se brojanje
 * radi ovim pozivom iz pregledača, jednom po sesiji kartice. Jedna IP adresa
 * se broji najviše jednom na sat po oglasu, a vlasnik i admin se ne broje.
 * Keš kataloga se namerno ne osvežava — broj pregleda sme da kasni.
 */
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const oglas = await db.oglas.findUnique({ where: { id }, select: { aktivan: true, userId: true } })
  if (!oglas?.aktivan || !(await brojiSe(id, oglas.userId, 'pregled'))) {
    return NextResponse.json({ ok: true })
  }
  await db.oglas.update({ where: { id }, data: { pregleda: { increment: 1 } } })
  await zabeleziInteres(id, 'pregled')
  return NextResponse.json({ ok: true })
}
