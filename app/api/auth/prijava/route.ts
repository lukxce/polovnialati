import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { proveriLozinku, napraviSesijuKolacic } from '@/lib/auth'
import { dozvoljeno, ipAdresa, ponistiPokusaje } from '@/lib/ogranicenje'
import type { TipProdavca } from '@/lib/types'

export async function POST(req: NextRequest) {
  const { email, lozinka } = await req.json().catch(() => ({}))
  if (!email || !lozinka) {
    return NextResponse.json({ greska: 'Email i lozinka su obavezni.' }, { status: 400 })
  }
  const emailNorm = String(email).toLowerCase().trim()

  // Zaštita od pogađanja lozinke: 10 pokušaja po nalogu i 30 po IP adresi
  // u 15 minuta. Uspešna prijava briše brojač naloga.
  const ip = await ipAdresa()
  const kljucNaloga = `prijava:${emailNorm}`
  if (!(await dozvoljeno(`prijava-ip:${ip}`, 30, 15)) || !(await dozvoljeno(kljucNaloga, 10, 15))) {
    return NextResponse.json(
      { greska: 'Previše pokušaja prijave. Sačekaj 15 minuta pa pokušaj ponovo.' },
      { status: 429 },
    )
  }

  const korisnik = await db.user.findUnique({ where: { email: emailNorm } })
  // Ista poruka za "ne postoji" i "pogrešna lozinka" — standardna praksa,
  // ne otkriva napadaču koji email postoji u bazi.
  const opstaGreska = () => NextResponse.json({ greska: 'Pogrešan email ili lozinka.' }, { status: 401 })

  if (!korisnik || korisnik.demo) return opstaGreska()
  const ispravna = await proveriLozinku(String(lozinka), korisnik.passwordHash)
  if (!ispravna) return opstaGreska()

  if (korisnik.blokiran) {
    return NextResponse.json(
      { greska: 'Ovaj nalog je blokiran. Ako misliš da je greška, piši nam preko stranice Kontakt.' },
      { status: 403 },
    )
  }

  await ponistiPokusaje(kljucNaloga)
  await napraviSesijuKolacic({
    userId: korisnik.id,
    email: korisnik.email,
    naziv: korisnik.naziv,
    tip: korisnik.tip as TipProdavca,
    uloga: korisnik.uloga as 'PRODAVAC' | 'ADMIN',
  })

  return NextResponse.json({ ok: true, uloga: korisnik.uloga })
}
