import { NextRequest, NextResponse } from 'next/server'
import { oglasBySlug } from '@/lib/queries'

/**
 * Podaci za kartice sačuvanih oglasa. Lista sačuvanih živi u localStorage-u,
 * pa /sacuvano traži samo te slugove umesto da renderuje ceo katalog.
 * Oglasi koji više nisu aktivni se jednostavno ne vraćaju.
 */
export async function GET(req: NextRequest) {
  const slugovi = (req.nextUrl.searchParams.get('slug') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => /^[a-z0-9-]{1,120}$/.test(s))
    .slice(0, 100)

  const oglasi = (await Promise.all(slugovi.map((s) => oglasBySlug(s)))).filter(Boolean)
  return NextResponse.json({ oglasi })
}
