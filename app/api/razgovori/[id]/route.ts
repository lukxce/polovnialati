import { NextResponse } from 'next/server'
import { zahtevajSesiju } from '@/lib/auth'
import { db } from '@/lib/db'
import { jeUcesnikRazgovora, oznaciProcitano } from '@/lib/poruke'

type Props = { params: Promise<{ id: string }> }

/** Puna nit + osnovni podaci — i označava razgovor kao pročitan za onog ko čita. */
export async function GET(_zahtev: Request, { params }: Props) {
  let sesija
  try {
    sesija = await zahtevajSesiju()
  } catch {
    return NextResponse.json({ greska: 'Nisi prijavljen.' }, { status: 401 })
  }

  const { id } = await params
  const razgovor = await db.razgovor.findUnique({
    where: { id },
    include: {
      oglas: { select: { id: true, naslov: true } },
      kupac: { select: { id: true, naziv: true } },
      prodavac: { select: { id: true, naziv: true } },
      poruke: { orderBy: { createdAt: 'asc' } },
    },
  })

  if (!razgovor || !jeUcesnikRazgovora(razgovor, sesija.userId)) {
    return NextResponse.json({ greska: 'Razgovor ne postoji.' }, { status: 404 })
  }

  await oznaciProcitano(id, sesija.userId)

  return NextResponse.json({
    id: razgovor.id,
    oglas: razgovor.oglas,
    kupac: razgovor.kupac,
    prodavac: razgovor.prodavac,
    jaSam: razgovor.kupacId === sesija.userId ? 'kupac' : 'prodavac',
    poruke: razgovor.poruke.map((p) => ({
      id: p.id,
      tekst: p.tekst,
      posiljalacId: p.posiljalacId,
      createdAt: p.createdAt,
    })),
  })
}

export async function POST(zahtev: Request, { params }: Props) {
  let sesija
  try {
    sesija = await zahtevajSesiju()
  } catch {
    return NextResponse.json({ greska: 'Nisi prijavljen.' }, { status: 401 })
  }

  const { id } = await params
  const razgovor = await db.razgovor.findUnique({
    where: { id },
    select: { kupacId: true, prodavacId: true },
  })
  if (!razgovor || !jeUcesnikRazgovora(razgovor, sesija.userId)) {
    return NextResponse.json({ greska: 'Razgovor ne postoji.' }, { status: 404 })
  }

  const telo = await zahtev.json().catch(() => null)
  const tekst = typeof telo?.tekst === 'string' ? telo.tekst.trim() : ''
  if (!tekst) return NextResponse.json({ greska: 'Poruka je prazna.' }, { status: 400 })
  if (tekst.length > 2000) return NextResponse.json({ greska: 'Poruka je predugačka.' }, { status: 400 })

  const poruka = await db.poruka.create({
    data: { razgovorId: id, posiljalacId: sesija.userId, tekst },
  })
  await db.razgovor.update({ where: { id }, data: { updatedAt: new Date() } })
  // pošiljalac ne treba da vidi sopstvenu poruku kao nepročitanu
  await oznaciProcitano(id, sesija.userId)

  return NextResponse.json({
    id: poruka.id,
    tekst: poruka.tekst,
    posiljalacId: poruka.posiljalacId,
    createdAt: poruka.createdAt,
  })
}
