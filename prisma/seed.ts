// Pravi prvi admin nalog — bez ovoga nema ko da uđe u /admin, jer se ADMIN
// uloga namerno ne može dobiti kroz javnu registraciju (vidi lib/auth.ts).
// Pokreni jednom: npx tsx prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  const lozinka = process.env.SEED_ADMIN_PASSWORD || 'promeni123'

  const admin = await db.user.upsert({
    where: { email: 'admin@alatnica.local' },
    update: {},
    create: {
      email: 'admin@alatnica.local',
      naziv: 'Admin',
      tip: 'privatno-lice',
      grad: 'Beograd',
      passwordHash: await bcrypt.hash(lozinka, 12),
      uloga: 'ADMIN',
      verifikovan: true,
    },
  })

  console.log(`Admin nalog: ${admin.email} (lozinka: ${lozinka})`)
  console.log('Promeni lozinku posle prve prijave — ovo je samo početna vrednost.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
