import { NextResponse } from 'next/server'
import { aktivnaSesija } from '@/lib/auth'
import { ukupnoNeprocitano } from '@/lib/poruke'

/**
 * Sesija se čita ovde, ne u deljenom Header-u — Header je deo layout-a
 * svake stranice, pa bi cookies() tamo naterao ceo sajt na dinamičko
 * renderovanje (nema cacheComponents u next.config, pa je granica i dalje
 * na nivou rute). Umesto toga HeaderNav ovo učita na klijentu, isto kao
 * useSacuvani() za broj sačuvanih oglasa.
 *
 * Nosi i broj nepročitanih poruka — jedan fetch umesto dva na svakoj strani.
 */
export async function GET() {
  const sesija = await aktivnaSesija()
  if (!sesija) return NextResponse.json(null)

  const neprocitano = await ukupnoNeprocitano(sesija.userId)
  return NextResponse.json(
    { id: sesija.userId, naziv: sesija.naziv, uloga: sesija.uloga, neprocitano },
    { headers: { 'Cache-Control': 'private, no-store' } },
  )
}
