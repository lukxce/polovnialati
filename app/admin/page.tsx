import { redirect } from 'next/navigation'
import { ucitajSesiju } from '@/lib/auth'
import { db } from '@/lib/db'
import { citanjePodataka } from '@/lib/oglasi'
import OdjaviDugme from '@/components/auth/OdjaviDugme'
import KorisniciTabela from '@/components/admin/KorisniciTabela'
import OglasiAdminTabela from '@/components/admin/OglasiAdminTabela'
import s from '@/components/nalog/nalog.module.css'

export const metadata = { title: 'Admin' }

export default async function AdminPage() {
  const sesija = await ucitajSesiju()
  if (!sesija) redirect('/prijava?odakle=/admin')
  if (sesija.uloga !== 'ADMIN') redirect('/')

  const [korisnici, oglasi] = await Promise.all([
    db.user.findMany({ orderBy: { createdAt: 'desc' } }),
    db.oglas.findMany({ orderBy: { createdAt: 'desc' }, include: { user: true } }),
  ])

  const oglasiRedovi = oglasi.map((o) => ({
    ...citanjePodataka(o),
    prodavacNaziv: o.user.naziv,
    prodavacEmail: o.user.email,
  }))

  return (
    <div className="container" style={{ paddingTop: 14, paddingBottom: 56 }}>
      <div className={s.zaglavlje}>
        <div>
          <p className="micro">ADMIN</p>
          <h1 className={s.naslov}>Pregled</h1>
          <p className={s.lede}>
            {korisnici.length} korisnika · {oglasi.length} oglasa
          </p>
        </div>
        <OdjaviDugme />
      </div>

      <h2 style={{ fontSize: 18, marginBottom: 12 }}>Korisnici</h2>
      <KorisniciTabela korisnici={korisnici} />

      <h2 style={{ fontSize: 18, margin: '32px 0 12px' }}>Oglasi</h2>
      <OglasiAdminTabela oglasi={oglasiRedovi} />
    </div>
  )
}
