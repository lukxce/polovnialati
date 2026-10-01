// Demo podaci za LOKALNI razvoj: ~75 oglasa i 18 prodavaca iz data/*.ts,
// označeni sa demo=true, da bi se pretraga, filteri i fasete mogli videti
// bez ručnog unošenja. Demo nalozi ne mogu da se prijave (vidi
// app/api/auth/prijava). Nikad nad produkcijskom bazom.
//
//   npm run db:demo           upiši (ponovo) demo podatke
//   npm run db:demo:obrisi    obriši sve demo naloge i oglase
import { randomBytes } from 'node:crypto'
import { PrismaClient } from '@prisma/client'
import { oglasi } from '../data/oglasi'
import { prodavci } from '../data/prodavci'

const db = new PrismaClient()

function proveriDaNijeProdukcija() {
  const url = process.env.DATABASE_URL ?? ''
  const lokalno = /localhost|127\.0\.0\.1/.test(url)
  if (!lokalno && !process.argv.includes('--znam-sta-radim')) {
    throw new Error(
      'DATABASE_URL ne pokazuje na lokalnu bazu. Demo podaci se ne upisuju u produkciju (dodaj --znam-sta-radim ako baš moraš).',
    )
  }
}

async function obrisi() {
  const { count: oglasa } = await db.oglas.deleteMany({ where: { demo: true } })
  const { count: naloga } = await db.user.deleteMany({ where: { demo: true } })
  console.log(`Obrisano: ${oglasa} demo oglasa, ${naloga} demo naloga.`)
}

async function upisi() {
  await obrisi()

  const idPoSlugu = new Map<string, string>()
  for (const p of prodavci) {
    const u = await db.user.create({
      data: {
        slug: p.slug,
        email: `${p.slug}@demo.alatnica.local`,
        // Nasumičan otisak koji ne odgovara nijednoj lozinci — demo nalog se ne može prijaviti.
        passwordHash: `demo:${randomBytes(16).toString('hex')}`,
        naziv: p.naziv,
        tip: p.tip,
        grad: p.grad,
        opis: p.opis ?? null,
        verifikovan: p.verifikovan,
        demo: true,
        createdAt: new Date(p.clanOd),
      },
    })
    idPoSlugu.set(p.slug, u.id)
  }

  let upisano = 0
  for (const o of oglasi) {
    const userId = idPoSlugu.get(o.prodavacId)
    if (!userId) continue
    await db.oglas.create({
      data: {
        slug: o.slug,
        userId,
        naslov: o.naslov,
        kategorija: o.kategorija,
        brend: o.brend,
        model: o.model,
        stanje: o.stanje,
        cena: Math.round(o.cena),
        cenaDogovor: o.cenaDogovor,
        staraCena: o.staraCena ?? null,
        opis: o.opis,
        slike: o.slike,
        specifikacije: o.specifikacije,
        uPakovanju: o.uPakovanju,
        stanjeChecklist: o.stanjeChecklist,
        godiste: o.godiste ?? null,
        satiRada: o.satiRada ?? null,
        garancija: o.garancija ?? null,
        akuSistem: o.akuSistem ?? null,
        lokacija: o.lokacija,
        dostava: o.dostava,
        pregleda: o.pregleda,
        provereno: o.provereno,
        istaknuto: o.istaknuto,
        demo: true,
        createdAt: new Date(o.objavljeno),
      },
    })
    upisano++
  }

  console.log(`Upisano: ${prodavci.length} demo prodavaca, ${upisano} demo oglasa.`)
  console.log('Pokreni `npm run dev` (ili osveži stranicu) — keš kataloga se osvežava sam za 10 minuta, ili obriši .next/cache.')
}

async function main() {
  proveriDaNijeProdukcija()
  if (process.argv.includes('--obrisi')) await obrisi()
  else await upisi()
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
