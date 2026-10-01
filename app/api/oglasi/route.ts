import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { aktivnaSesija } from '@/lib/auth'
import { proveriOglas, slugOglasa, uOglas } from '@/lib/oglasi'
import { dozvoljeno } from '@/lib/ogranicenje'
import { osveziKatalog } from '@/lib/osvezavanje'
import { nasaSlika } from '@/lib/slike'

// GET: prodavčevi sopstveni oglasi (za /nalog). POST: objava novog oglasa —
// jedino mesto gde ProdajniTok stvarno upisuje ono što je nacrt sakupio.
export async function GET() {
  const sesija = await aktivnaSesija()
  if (!sesija) return NextResponse.json({ greska: 'Nisi prijavljen.' }, { status: 401 })

  const redovi = await db.oglas.findMany({
    where: { userId: sesija.userId },
    include: { user: { select: { id: true, slug: true, tip: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ oglasi: redovi.map(uOglas) })
}

export async function POST(req: NextRequest) {
  const sesija = await aktivnaSesija()
  if (!sesija) return NextResponse.json({ greska: 'Nisi prijavljen.' }, { status: 401 })

  if (!(await dozvoljeno(`oglas:${sesija.userId}`, 20, 24 * 60))) {
    return NextResponse.json(
      { greska: 'Dostignut je dnevni limit od 20 novih oglasa. Javi nam se ako ti treba više.' },
      { status: 429 },
    )
  }

  const telo = await req.json().catch(() => null)
  const provera = proveriOglas(telo, nasaSlika)
  if (!provera.ok) return NextResponse.json({ greska: provera.greska }, { status: 400 })
  const o = provera.oglas

  const oglas = await db.oglas.create({
    data: {
      userId: sesija.userId,
      slug: slugOglasa(o.naslov),
      ...o,
      specifikacije: o.specifikacije,
      stanjeChecklist: o.stanjeChecklist,
    },
  })

  osveziKatalog()
  return NextResponse.json({ ok: true, id: oglas.id, slug: oglas.slug })
}
