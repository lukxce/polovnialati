import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { brojiSe, zabeleziInteres } from '@/lib/interes'

/**
 * Kupac je dodirnuo prikazan broj i telefon je otvorio poziv. Šalje se
 * preko navigator.sendBeacon, pa odgovor niko ne čita.
 */
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const oglas = await db.oglas.findUnique({ where: { id }, select: { aktivan: true, userId: true } })
  if (oglas?.aktivan && (await brojiSe(id, oglas.userId, 'poziv'))) {
    await zabeleziInteres(id, 'poziv')
  }
  return NextResponse.json({ ok: true })
}
