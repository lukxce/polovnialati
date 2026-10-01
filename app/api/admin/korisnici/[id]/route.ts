import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { randomBytes } from 'node:crypto'
import { heshirajLozinku, zahtevajAdmina } from '@/lib/auth'
import { osveziKatalog } from '@/lib/osvezavanje'

/** Admin verifikuje ili blokira nalog. Drugi admin se ne može blokirati odavde. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await zahtevajAdmina()
  } catch {
    return NextResponse.json({ greska: 'Nije dozvoljeno.' }, { status: 403 })
  }
  const { id } = await params
  const telo = await req.json().catch(() => ({}))

  const korisnik = await db.user.findUnique({ where: { id }, select: { uloga: true } })
  if (!korisnik) return NextResponse.json({ greska: 'Nalog ne postoji.' }, { status: 404 })

  const podaci: { verifikovan?: boolean; blokiran?: boolean } = {}
  if (typeof telo.verifikovan === 'boolean') podaci.verifikovan = telo.verifikovan
  if (typeof telo.blokiran === 'boolean') {
    if (korisnik.uloga === 'ADMIN') {
      return NextResponse.json({ greska: 'Admin nalog se ne blokira.' }, { status: 400 })
    }
    podaci.blokiran = telo.blokiran
  }

  // Nema slanja emaila, pa zaboravljena lozinka ide preko admina: korisnik
  // piše preko /kontakt, admin ovde pravi privremenu lozinku i javlja mu je.
  if (telo.novaLozinka === true) {
    if (korisnik.uloga === 'ADMIN') {
      return NextResponse.json({ greska: 'Admin menja lozinku sam, u svom nalogu.' }, { status: 400 })
    }
    const privremena = randomBytes(9).toString('base64url')
    await db.user.update({ where: { id }, data: { passwordHash: await heshirajLozinku(privremena) } })
    return NextResponse.json({ ok: true, privremenaLozinka: privremena })
  }

  await db.user.update({ where: { id }, data: podaci })
  osveziKatalog()
  return NextResponse.json({ ok: true })
}
