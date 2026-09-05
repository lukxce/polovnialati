import { NextResponse } from 'next/server'
import { ucitajSesiju } from '@/lib/auth'

/**
 * Sesija se čita ovde, ne u deljenom Header-u — Header je deo layout-a
 * svake stranice, pa bi cookies() tamo naterao ceo sajt na dinamičko
 * renderovanje (nema cacheComponents u next.config, pa je granica i dalje
 * na nivou rute). Umesto toga HeaderNav ovo učita na klijentu, isto kao
 * useSacuvani() za broj sačuvanih oglasa.
 */
export async function GET() {
  const sesija = await ucitajSesiju()
  return NextResponse.json(
    sesija ? { naziv: sesija.naziv, uloga: sesija.uloga } : null,
  )
}
