// Pravi prvi admin nalog — bez ovoga nema ko da uđe u /admin, jer se ADMIN
// uloga namerno ne može dobiti kroz javnu registraciju (vidi lib/auth.ts).
//
// Pokreni jednom (lokalno ili nad produkcijskom bazom):
//   SEED_ADMIN_EMAIL=ti@domen.rs SEED_ADMIN_PASSWORD='jaka-lozinka' npm run db:admin
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  const email = (process.env.SEED_ADMIN_EMAIL || 'admin@alatnica.local').toLowerCase().trim()
  const lozinka = process.env.SEED_ADMIN_PASSWORD

  if (!lozinka || lozinka.length < 12) {
    throw new Error(
      'Postavi SEED_ADMIN_PASSWORD (bar 12 karaktera). Podrazumevana lozinka namerno ne postoji.',
    )
  }

  const admin = await db.user.upsert({
    where: { email },
    update: { uloga: 'ADMIN', passwordHash: await bcrypt.hash(lozinka, 12), blokiran: false },
    create: {
      email,
      slug: `admin-${Date.now().toString(36)}`,
      naziv: 'Alatnica',
      tip: 'privatno-lice',
      grad: 'Beograd',
      passwordHash: await bcrypt.hash(lozinka, 12),
      uloga: 'ADMIN',
      verifikovan: true,
    },
  })

  console.log(`Admin nalog spreman: ${admin.email}`)
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
