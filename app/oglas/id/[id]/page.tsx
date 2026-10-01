import { notFound, permanentRedirect } from 'next/navigation'
import { db } from '@/lib/db'

type Props = { params: Promise<{ id: string }> }

/**
 * Stara adresa oglasa po ID-u (pre nego što su pravi oglasi dobili slug).
 * Ostaje kao trajno preusmerenje, da stari linkovi iz poruka i sa nalog
 * strane i dalje rade.
 */
export default async function OglasPoIdStranica({ params }: Props) {
  const { id } = await params
  const oglas = await db.oglas.findUnique({ where: { id }, select: { slug: true } })
  if (!oglas) notFound()
  permanentRedirect(`/oglas/${oglas.slug}`)
}
