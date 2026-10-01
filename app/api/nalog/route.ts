import { NextRequest, NextResponse } from 'next/server'
import { aktivnaSesija, napraviSesijuKolacic, obrisiSesijuKolacic, proveriLozinku } from '@/lib/auth'
import { db } from '@/lib/db'
import { osveziKatalog } from '@/lib/osvezavanje'
import { obrisiSlike } from '@/lib/slike'

/** Izmena sopstvenog profila: naziv, grad, telefon, PIB, javni opis. */
export async function PATCH(req: NextRequest) {
  const sesija = await aktivnaSesija()
  if (!sesija) return NextResponse.json({ greska: 'Nisi prijavljen.' }, { status: 401 })

  const t = await req.json().catch(() => ({}))
  const naziv = typeof t.naziv === 'string' ? t.naziv.trim().slice(0, 80) : ''
  const grad = typeof t.grad === 'string' ? t.grad.trim().slice(0, 60) : ''
  if (!naziv || !grad) return NextResponse.json({ greska: 'Naziv i grad su obavezni.' }, { status: 400 })

  const telefon = typeof t.telefon === 'string' ? t.telefon.trim().slice(0, 30) : ''
  const opis = typeof t.opis === 'string' ? t.opis.trim().slice(0, 1000) : ''
  const pib = typeof t.pib === 'string' ? t.pib.trim().slice(0, 20) : ''

  const korisnik = await db.user.update({
    where: { id: sesija.userId },
    data: {
      naziv,
      grad,
      telefon: telefon || null,
      opis: opis || null,
      pib: sesija.tip !== 'privatno-lice' ? pib || null : null,
    },
  })

  // Naziv stoji i u kolačiću (prikaz u navigaciji) — osveži ga.
  await napraviSesijuKolacic({ ...sesija, naziv: korisnik.naziv })
  osveziKatalog()
  return NextResponse.json({ ok: true })
}

/** Brisanje sopstvenog naloga, uz potvrdu lozinkom. Briše i oglase, poruke i fotografije. */
export async function DELETE(req: NextRequest) {
  const sesija = await aktivnaSesija()
  if (!sesija) return NextResponse.json({ greska: 'Nisi prijavljen.' }, { status: 401 })
  if (sesija.uloga === 'ADMIN') {
    return NextResponse.json({ greska: 'Admin nalog se ne briše odavde.' }, { status: 400 })
  }

  const { lozinka } = await req.json().catch(() => ({}))
  const korisnik = await db.user.findUnique({ where: { id: sesija.userId } })
  if (!korisnik || !(await proveriLozinku(String(lozinka ?? ''), korisnik.passwordHash))) {
    return NextResponse.json({ greska: 'Pogrešna lozinka.' }, { status: 401 })
  }

  const oglasi = await db.oglas.findMany({ where: { userId: korisnik.id }, select: { slike: true } })
  await db.user.delete({ where: { id: korisnik.id } })
  await obrisiSlike(oglasi.flatMap((o) => o.slike))
  await obrisiSesijuKolacic()
  osveziKatalog()
  return NextResponse.json({ ok: true })
}
