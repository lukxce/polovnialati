import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ucitajSesiju } from '@/lib/auth'
import { db } from '@/lib/db'
import { citanjePodataka } from '@/lib/oglasi'
import OdjaviDugme from '@/components/auth/OdjaviDugme'
import OglasiTabela from '@/components/nalog/OglasiTabela'
import s from '@/components/nalog/nalog.module.css'

export const metadata = { title: 'Moj nalog' }

export default async function NalogPage() {
  const sesija = await ucitajSesiju()
  if (!sesija) redirect('/prijava?odakle=/nalog')

  const redovi = await db.oglas.findMany({
    where: { userId: sesija.userId },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className={`container ${s.strana}`}>
      <div className={s.zaglavlje}>
        <div>
          <p className="micro">MOJ NALOG</p>
          <h1 className={s.naslov}>{sesija.naziv}</h1>
          <p className={s.lede}>{sesija.email}</p>
        </div>
        <div className={s.dugmad}>
          <Link href="/prodaj" className="btn btn-primary">
            + Novi oglas
          </Link>
          <OdjaviDugme />
        </div>
      </div>

      <OglasiTabela oglasi={redovi.map(citanjePodataka)} />
    </div>
  )
}
