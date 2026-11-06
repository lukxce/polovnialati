import 'server-only'
import { db } from '@/lib/db'

/** Kolone statistike, istim redom u svim tabelama u /admin. */
export const MERE = [
  { kljuc: 'pregled', naziv: 'Pregledi' },
  { kljuc: 'telefon', naziv: 'Klik „Pozovi"' },
  { kljuc: 'poziv', naziv: 'Pozivi' },
  { kljuc: 'razgovor', naziv: 'Poruke' },
  { kljuc: 'registracija', naziv: 'Registracije' },
] as const

export type Mera = (typeof MERE)[number]['kljuc']
export type Brojevi = Record<Mera, number>

const VREMENSKA_ZONA = 'Europe/Belgrade'
const DANA_U_TABELI = 14

const nule = (): Brojevi => ({ pregled: 0, telefon: 0, poziv: 0, razgovor: 0, registracija: 0 })

/** Ponoć po beogradskom vremenu, `danaUnazad` dana pre današnjeg. */
function ponoc(danaUnazad: number): Date {
  const sada = new Date()
  const datum = new Intl.DateTimeFormat('en-CA', { timeZone: VREMENSKA_ZONA }).format(sada)
  const pomak = new Intl.DateTimeFormat('en-US', { timeZone: VREMENSKA_ZONA, timeZoneName: 'shortOffset' })
    .formatToParts(sada)
    .find((d) => d.type === 'timeZoneName')!
    .value.replace('GMT', '')
  const sati = Number(pomak || 0)
  const znak = sati < 0 ? '-' : '+'
  const p = new Date(`${datum}T00:00:00${znak}${String(Math.abs(sati)).padStart(2, '0')}:00`)
  return new Date(p.getTime() - danaUnazad * 24 * 60 * 60_000)
}

type Red = { dan: string; mera: string; n: number }

/**
 * Brojevi po danu za poslednjih 14 dana, plus zbirovi za danas, 7 i 30 dana.
 * Pregledi, klikovi i pozivi dolaze iz tabele Interes, poruke su novi
 * razgovori (prva poruka kupca), registracije su novi nalozi bez demo i admin.
 */
export async function statistikaInteresa() {
  const od30 = ponoc(29)
  const redovi = await db.$queryRaw<Red[]>`
    select to_char(("createdAt" at time zone 'UTC') at time zone ${VREMENSKA_ZONA}, 'YYYY-MM-DD') as dan,
           tip as mera, count(*)::int as n
      from "Interes" where "createdAt" >= ${od30} group by 1, 2
    union all
    select to_char(("createdAt" at time zone 'UTC') at time zone ${VREMENSKA_ZONA}, 'YYYY-MM-DD'),
           'razgovor', count(*)::int
      from "Razgovor" where "createdAt" >= ${od30} group by 1
    union all
    select to_char(("createdAt" at time zone 'UTC') at time zone ${VREMENSKA_ZONA}, 'YYYY-MM-DD'),
           'registracija', count(*)::int
      from "User" where "createdAt" >= ${od30} and demo = false and uloga <> 'ADMIN' group by 1`

  const poDanu = new Map<string, Brojevi>()
  for (const r of redovi) {
    const b = poDanu.get(r.dan) ?? nule()
    b[r.mera as Mera] += r.n
    poDanu.set(r.dan, b)
  }

  const oznakaDana = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: VREMENSKA_ZONA }).format(d)
  const saberi = (dana: number) => {
    const zbir = nule()
    for (let i = 0; i < dana; i++) {
      const b = poDanu.get(oznakaDana(new Date(ponoc(i).getTime() + 12 * 60 * 60_000)))
      if (b) for (const m of MERE) zbir[m.kljuc] += b[m.kljuc]
    }
    return zbir
  }

  const dani = Array.from({ length: DANA_U_TABELI }, (_, i) => {
    const sredina = new Date(ponoc(i).getTime() + 12 * 60 * 60_000)
    const kljuc = oznakaDana(sredina)
    return {
      dan: new Intl.DateTimeFormat('sr-Latn-RS', {
        timeZone: VREMENSKA_ZONA,
        weekday: 'short',
        day: 'numeric',
        month: 'numeric',
      }).format(sredina),
      brojevi: poDanu.get(kljuc) ?? nule(),
    }
  })

  return {
    zbirovi: [
      { naziv: 'Danas', brojevi: saberi(1) },
      { naziv: 'Poslednjih 7 dana', brojevi: saberi(7) },
      { naziv: 'Poslednjih 30 dana', brojevi: saberi(30) },
    ],
    dani,
  }
}

/** Ukupan broj klikova „Pozovi" i poziva po oglasu, za tabelu oglasa. */
export async function interesPoOglasu(oglasIds: string[]) {
  const grupe = await db.interes.groupBy({
    by: ['oglasId', 'tip'],
    where: { oglasId: { in: oglasIds }, tip: { in: ['telefon', 'poziv'] } },
    _count: { _all: true },
  })
  const mapa = new Map<string, { telefon: number; poziv: number }>()
  for (const g of grupe) {
    const r = mapa.get(g.oglasId) ?? { telefon: 0, poziv: 0 }
    r[g.tip as 'telefon' | 'poziv'] = g._count._all
    mapa.set(g.oglasId, r)
  }
  return mapa
}

/** Oglasi sa najviše kontakata (klik „Pozovi" + poruke) u poslednjih 30 dana. */
export async function najtrazenijiOglasi(koliko = 10) {
  const od30 = ponoc(29)
  const [interes, razgovori] = await Promise.all([
    db.interes.groupBy({
      by: ['oglasId', 'tip'],
      where: { createdAt: { gte: od30 } },
      _count: { _all: true },
    }),
    db.razgovor.groupBy({ by: ['oglasId'], where: { createdAt: { gte: od30 } }, _count: { _all: true } }),
  ])
  const mapa = new Map<string, Brojevi>()
  for (const g of interes) {
    const b = mapa.get(g.oglasId) ?? nule()
    b[g.tip as Mera] = g._count._all
    mapa.set(g.oglasId, b)
  }
  for (const g of razgovori) {
    const b = mapa.get(g.oglasId) ?? nule()
    b.razgovor = g._count._all
    mapa.set(g.oglasId, b)
  }
  const kontakti = (b: Brojevi) => b.telefon + b.razgovor
  const izabrani = [...mapa.entries()]
    .sort(([, a], [, b]) => kontakti(b) - kontakti(a) || b.pregled - a.pregled)
    .slice(0, koliko)
  if (!izabrani.length) return []

  const oglasi = await db.oglas.findMany({
    where: { id: { in: izabrani.map(([id]) => id) } },
    select: { id: true, slug: true, naslov: true, aktivan: true, user: { select: { naziv: true } } },
  })
  const poId = new Map(oglasi.map((o) => [o.id, o]))
  return izabrani.flatMap(([id, brojevi]) => {
    const o = poId.get(id)
    return o ? [{ ...o, prodavac: o.user.naziv, brojevi }] : []
  })
}
