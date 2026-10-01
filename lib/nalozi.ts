import 'server-only'
import { db } from '@/lib/db'
import { sufiks, uSlug } from '@/lib/oglasi'

/** Jedinstven slug javnog profila: „Servis Mihajlović" → „servis-mihajlovic" (ili sa sufiksom). */
export async function slugProdavca(naziv: string): Promise<string> {
  const osnova = uSlug(naziv, 50).replace(/^oglas$/, 'prodavac')
  if (!(await db.user.findUnique({ where: { slug: osnova }, select: { id: true } }))) return osnova
  for (let i = 0; i < 5; i++) {
    const kandidat = `${osnova}-${sufiks(4)}`
    if (!(await db.user.findUnique({ where: { slug: kandidat }, select: { id: true } }))) return kandidat
  }
  return `${osnova}-${sufiks(8)}`
}
