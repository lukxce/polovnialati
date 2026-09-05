import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// Runs on the Edge runtime — can't import lib/auth.ts as-is (it pulls in
// next/headers' cookies(), which needs the full request lifecycle) or
// lib/db.ts (Prisma isn't Edge-compatible). Deliberately minimal,
// standalone read of the same JWT cookie — same split used on the
// Pricetracker dashboard.

// /prodaj traži prijavu od početka — bolje nego pustiti nekoga da popuni
// svih pet koraka pa mu tek na kraju reći da mora da se prijavi i izgubi
// nacrt (Nacrt živi samo u memoriji pregledača, vidi model.ts).
const ZASTICENO = ['/nalog', '/admin', '/prodaj']

function tajniKljuc() {
  const tajna = process.env.SESSION_SECRET
  if (!tajna) throw new Error('SESSION_SECRET nije podešen — vidi .env.example')
  return new TextEncoder().encode(tajna)
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const trebaZastitu = ZASTICENO.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  if (!trebaZastitu) return NextResponse.next()

  const token = req.cookies.get('nalog')?.value
  let uloga: string | null = null
  if (token) {
    try {
      const { payload } = await jwtVerify(token, tajniKljuc())
      uloga = (payload as { uloga?: string }).uloga ?? null
    } catch {
      uloga = null // istekao/neispravan — tretira se kao odjavljen
    }
  }

  if (!uloga) {
    const prijava = new URL('/prijava', req.url)
    prijava.searchParams.set('odakle', pathname)
    return NextResponse.redirect(prijava)
  }

  if (pathname.startsWith('/admin') && uloga !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/nalog/:path*', '/admin/:path*', '/prodaj/:path*'],
}
