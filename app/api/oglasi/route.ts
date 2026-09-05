import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ucitajSesiju } from '@/lib/auth'
import { upisPodataka, citanjePodataka, type NoviOglas } from '@/lib/oglasi'

// GET: prodavčevi sopstveni oglasi (za /nalog). POST: objava novog oglasa —
// jedino mesto gde ProdajniTok stvarno upisuje ono što je nacrt sakupio.
export async function GET() {
  const sesija = await ucitajSesiju()
  if (!sesija) return NextResponse.json({ greska: 'Nisi prijavljen.' }, { status: 401 })

  const redovi = await db.oglas.findMany({
    where: { userId: sesija.userId },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ oglasi: redovi.map(citanjePodataka) })
}

export async function POST(req: NextRequest) {
  const sesija = await ucitajSesiju()
  if (!sesija) return NextResponse.json({ greska: 'Nisi prijavljen.' }, { status: 401 })

  const telo = (await req.json().catch(() => null)) as NoviOglas | null
  if (!telo?.naslov?.trim() || !telo.model?.trim() || !telo.brend || !telo.kategorija || !telo.stanje) {
    return NextResponse.json({ greska: 'Nedostaju obavezna polja.' }, { status: 400 })
  }
  if (!telo.cena || telo.cena <= 0) {
    return NextResponse.json({ greska: 'Cena mora biti veća od nule.' }, { status: 400 })
  }
  if (!telo.lokacija?.trim()) {
    return NextResponse.json({ greska: 'Grad je obavezan.' }, { status: 400 })
  }

  const oglas = await db.oglas.create({
    data: { userId: sesija.userId, ...upisPodataka(telo) },
  })

  return NextResponse.json({ ok: true, id: oglas.id })
}
