import { db } from './db'

/**
 * Nađi postojeći razgovor za (oglas, kupac) ili napravi novi i upiši prvu
 * poruku u istom pozivu. @@unique([oglasId, kupacId]) u šemi garantuje da
 * isti kupac za isti oglas uvek nastavlja isti razgovor, ne otvara novi.
 *
 * Baca ako je oglas nepostojeći ili ako kupac pokušava da piše samom sebi
 * (svoj oglas) — pozivalac (API ruta) prevodi to u HTTP status.
 */
export async function dobijIliNapraviRazgovor(oglasId: string, kupacId: string, tekst: string) {
  const oglas = await db.oglas.findUnique({
    where: { id: oglasId },
    select: { id: true, userId: true, aktivan: true, user: { select: { blokiran: true } } },
  })
  if (!oglas || !oglas.aktivan || oglas.user.blokiran) throw new Error('OGLAS_NE_POSTOJI')
  if (oglas.userId === kupacId) throw new Error('SOPSTVENI_OGLAS')

  const razgovor = await db.razgovor.upsert({
    where: { oglasId_kupacId: { oglasId, kupacId } },
    update: { updatedAt: new Date() },
    create: { oglasId, kupacId, prodavacId: oglas.userId },
  })

  await db.poruka.create({ data: { razgovorId: razgovor.id, posiljalacId: kupacId, tekst } })

  return razgovor
}

/** Da li je `userId` jedna od dve strane u razgovoru — kupac ili prodavac. */
export function jeUcesnikRazgovora(razgovor: { kupacId: string; prodavacId: string }, userId: string) {
  return razgovor.kupacId === userId || razgovor.prodavacId === userId
}

export type RazgovorPregled = {
  id: string
  oglasId: string
  oglasNaslov: string
  sagovornikNaziv: string
  poslednjaPoruka: string
  poslednjaPorukaVreme: Date
  neprocitano: number
}

/** Svi razgovori u kojima je `userId` kupac ili prodavac, najnoviji prvi. */
export async function ucitajRazgovore(userId: string): Promise<RazgovorPregled[]> {
  const razgovori = await db.razgovor.findMany({
    where: {
      OR: [{ kupacId: userId }, { prodavacId: userId }],
      poruke: { some: {} }, // izbaci razgovor bez ijedne poruke (ne bi trebalo da postoji, ali za svaki slučaj)
    },
    orderBy: { updatedAt: 'desc' },
    include: {
      oglas: { select: { naslov: true } },
      kupac: { select: { naziv: true } },
      prodavac: { select: { naziv: true } },
      poruke: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
  })

  return Promise.all(
    razgovori.map(async (r) => {
      const jaSamKupac = r.kupacId === userId
      const procitanoPecat = jaSamKupac ? r.procitanoKupac : r.procitanoProdavac

      const neprocitano = await db.poruka.count({
        where: {
          razgovorId: r.id,
          posiljalacId: { not: userId },
          createdAt: procitanoPecat ? { gt: procitanoPecat } : undefined,
        },
      })

      return {
        id: r.id,
        oglasId: r.oglasId,
        oglasNaslov: r.oglas.naslov,
        sagovornikNaziv: jaSamKupac ? r.prodavac.naziv : r.kupac.naziv,
        poslednjaPoruka: r.poruke[0].tekst,
        poslednjaPorukaVreme: r.poruke[0].createdAt,
        neprocitano,
      } satisfies RazgovorPregled
    }),
  )
}

/**
 * Ukupan broj nepročitanih poruka preko svih razgovora — za značku u
 * navigaciji. Jedan SQL upit: ovo se zove na svakoj stranici (HeaderNav).
 */
export async function ukupnoNeprocitano(userId: string): Promise<number> {
  const [red] = await db.$queryRaw<{ broj: bigint }[]>`
    SELECT COUNT(*)::bigint AS broj
    FROM "Poruka" p
    JOIN "Razgovor" r ON r.id = p."razgovorId"
    WHERE p."posiljalacId" <> ${userId}
      AND (
        (r."kupacId" = ${userId} AND (r."procitanoKupac" IS NULL OR p."createdAt" > r."procitanoKupac"))
        OR
        (r."prodavacId" = ${userId} AND (r."procitanoProdavac" IS NULL OR p."createdAt" > r."procitanoProdavac"))
      )
  `
  return Number(red?.broj ?? 0)
}

/** Označi razgovor kao pročitan za tu stranu (poziva se kad korisnik otvori nit). */
export async function oznaciProcitano(razgovorId: string, userId: string) {
  const razgovor = await db.razgovor.findUnique({
    where: { id: razgovorId },
    select: { kupacId: true, prodavacId: true },
  })
  if (!razgovor || !jeUcesnikRazgovora(razgovor, userId)) return

  await db.razgovor.update({
    where: { id: razgovorId },
    data: razgovor.kupacId === userId ? { procitanoKupac: new Date() } : { procitanoProdavac: new Date() },
  })
}
