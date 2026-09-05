import { NextResponse } from 'next/server'
import { obrisiSesijuKolacic } from '@/lib/auth'

export async function POST() {
  await obrisiSesijuKolacic()
  return NextResponse.json({ ok: true })
}
