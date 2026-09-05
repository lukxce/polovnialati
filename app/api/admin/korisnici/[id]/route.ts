import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { zahtevajAdmina } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await zahtevajAdmina()
  } catch {
    return NextResponse.json({ greska: 'Nije dozvoljeno.' }, { status: 403 })
  }
  const { id } = await params
  const { verifikovan } = await req.json().catch(() => ({}))
  await db.user.update({ where: { id }, data: { verifikovan: Boolean(verifikovan) } })
  return NextResponse.json({ ok: true })
}
