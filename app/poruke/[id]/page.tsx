import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import s from '@/components/nalog/nalog.module.css'
import { Nit } from '@/components/poruke/Nit'
import { ucitajSesiju } from '@/lib/auth'
import { db } from '@/lib/db'
import { jeUcesnikRazgovora, oznaciProcitano } from '@/lib/poruke'

export const metadata: Metadata = { title: 'Razgovor', robots: { index: false, follow: false } }

type Props = { params: Promise<{ id: string }> }

export default async function RazgovorStranica({ params }: Props) {
  const sesija = await ucitajSesiju()
  if (!sesija) redirect('/prijava?odakle=/poruke')

  const { id } = await params
  const razgovor = await db.razgovor.findUnique({
    where: { id },
    include: {
      oglas: { select: { id: true, naslov: true } },
      kupac: { select: { id: true, naziv: true } },
      prodavac: { select: { id: true, naziv: true } },
      poruke: { orderBy: { createdAt: 'asc' } },
    },
  })

  if (!razgovor || !jeUcesnikRazgovora(razgovor, sesija.userId)) notFound()

  await oznaciProcitano(id, sesija.userId)

  const sagovornik = razgovor.kupacId === sesija.userId ? razgovor.prodavac : razgovor.kupac

  return (
    <div className={['container', s.strana].join(' ')} style={{ maxWidth: 720 }}>
      <p style={{ marginBottom: 8 }}>
        <Link href="/poruke">← Sve poruke</Link>
      </p>

      <header className={s.zaglavlje}>
        <div>
          <p className="micro">
            <Link href={`/oglas/id/${razgovor.oglas.id}`}>{razgovor.oglas.naslov}</Link>
          </p>
          <h1 className={s.naslov} style={{ fontSize: 22 }}>
            {sagovornik.naziv}
          </h1>
        </div>
      </header>

      <Nit
        razgovorId={razgovor.id}
        mojId={sesija.userId}
        pocetnePoruke={razgovor.poruke.map((p) => ({
          id: p.id,
          tekst: p.tekst,
          posiljalacId: p.posiljalacId,
          createdAt: p.createdAt.toISOString(),
        }))}
      />
    </div>
  )
}
