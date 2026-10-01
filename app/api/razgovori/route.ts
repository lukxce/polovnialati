import { NextResponse } from 'next/server'
import { zahtevajSesiju } from '@/lib/auth'
import { dozvoljeno } from '@/lib/ogranicenje'
import { dobijIliNapraviRazgovor, ucitajRazgovore } from '@/lib/poruke'

export async function GET() {
  try {
    const sesija = await zahtevajSesiju()
    const razgovori = await ucitajRazgovore(sesija.userId)
    return NextResponse.json({ razgovori })
  } catch {
    return NextResponse.json({ greska: 'Nisi prijavljen.' }, { status: 401 })
  }
}

export async function POST(zahtev: Request) {
  let sesija
  try {
    sesija = await zahtevajSesiju()
  } catch {
    return NextResponse.json({ greska: 'Nisi prijavljen.' }, { status: 401 })
  }

  const telo = await zahtev.json().catch(() => null)
  const oglasId = typeof telo?.oglasId === 'string' ? telo.oglasId : ''
  const tekst = typeof telo?.tekst === 'string' ? telo.tekst.trim() : ''

  if (!oglasId || !tekst) {
    return NextResponse.json({ greska: 'Nedostaje oglas ili tekst poruke.' }, { status: 400 })
  }
  if (tekst.length > 2000) {
    return NextResponse.json({ greska: 'Poruka je predugačka.' }, { status: 400 })
  }

  if (!(await dozvoljeno(`poruka:${sesija.userId}`, 60, 60))) {
    return NextResponse.json(
      { greska: 'Poslao si previše poruka u poslednjih sat vremena. Pokušaj malo kasnije.' },
      { status: 429 },
    )
  }

  try {
    const razgovor = await dobijIliNapraviRazgovor(oglasId, sesija.userId, tekst)
    return NextResponse.json({ ok: true, razgovorId: razgovor.id })
  } catch (e) {
    if (e instanceof Error && e.message === 'OGLAS_NE_POSTOJI') {
      return NextResponse.json({ greska: 'Oglas ne postoji.' }, { status: 404 })
    }
    if (e instanceof Error && e.message === 'SOPSTVENI_OGLAS') {
      return NextResponse.json({ greska: 'Ne možeš poslati poruku za sopstveni oglas.' }, { status: 400 })
    }
    return NextResponse.json({ greska: 'Greška pri slanju poruke.' }, { status: 500 })
  }
}
