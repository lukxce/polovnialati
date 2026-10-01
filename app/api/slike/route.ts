import { NextRequest, NextResponse } from 'next/server'
import { aktivnaSesija } from '@/lib/auth'
import { dozvoljeno } from '@/lib/ogranicenje'
import { MAKS_BAJTOVA, prepoznajTip, sacuvajSliku } from '@/lib/slike'

/**
 * Otpremanje jedne fotografije oglasa (multipart, polje "slika").
 * Pregledač pre slanja smanjuje sliku (components/prodaj/smanjiSliku.ts),
 * pa je svaka obično ispod 1 MB — daleko ispod Vercel-ovog limita tela
 * zahteva. Vraća javni URL koji ide u oglas.
 */
export async function POST(req: NextRequest) {
  const sesija = await aktivnaSesija()
  if (!sesija) return NextResponse.json({ greska: 'Nisi prijavljen.' }, { status: 401 })

  if (!(await dozvoljeno(`slika:${sesija.userId}`, 120, 60))) {
    return NextResponse.json(
      { greska: 'Previše otpremljenih fotografija u kratkom roku. Pokušaj za sat vremena.' },
      { status: 429 },
    )
  }

  const forma = await req.formData().catch(() => null)
  const fajl = forma?.get('slika')
  if (!(fajl instanceof Blob)) {
    return NextResponse.json({ greska: 'Fotografija nije poslata.' }, { status: 400 })
  }
  if (fajl.size > MAKS_BAJTOVA) {
    return NextResponse.json({ greska: 'Fotografija je veća od 4 MB.' }, { status: 413 })
  }

  const bajtovi = new Uint8Array(await fajl.arrayBuffer())
  const tip = prepoznajTip(bajtovi)
  if (!tip) {
    return NextResponse.json({ greska: 'Podržani su samo JPG, PNG i WebP.' }, { status: 415 })
  }

  try {
    const url = await sacuvajSliku(sesija.userId, bajtovi, tip)
    return NextResponse.json({ url })
  } catch (e) {
    console.error('Otpremanje fotografije nije uspelo', e)
    return NextResponse.json({ greska: 'Fotografija nije sačuvana. Pokušaj ponovo.' }, { status: 500 })
  }
}
