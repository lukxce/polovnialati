import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { aktivnaSesija } from '@/lib/auth'
import { db } from '@/lib/db'
import OdjaviDugme from '@/components/auth/OdjaviDugme'
import OglasiTabela from '@/components/nalog/OglasiTabela'
import { LozinkaForma, ObrisiNalog, ProfilForma } from '@/components/nalog/Podesavanja'
import s from '@/components/nalog/nalog.module.css'

export const metadata: Metadata = { title: 'Moj nalog', robots: { index: false, follow: false } }

export default async function NalogPage() {
  const sesija = await aktivnaSesija()
  if (!sesija) redirect('/prijava?odakle=/nalog')

  const [korisnik, redovi] = await Promise.all([
    db.user.findUnique({ where: { id: sesija.userId } }),
    db.oglas.findMany({
      where: { userId: sesija.userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        naslov: true,
        cena: true,
        cenaDogovor: true,
        aktivan: true,
        provereno: true,
        pregleda: true,
        createdAt: true,
        _count: { select: { razgovori: true } },
      },
    }),
  ])
  if (!korisnik) redirect('/prijava?odakle=/nalog')

  return (
    <div className={`container ${s.strana}`}>
      <div className={s.zaglavlje}>
        <div>
          <p className="micro">MOJ NALOG</p>
          <h1 className={s.naslov}>{korisnik.naziv}</h1>
          <p className={s.lede}>
            {korisnik.email} ·{' '}
            <Link href={`/prodavac/${korisnik.slug}`}>javni profil</Link>
            {korisnik.verifikovan ? ' · verifikovan nalog' : ''}
          </p>
        </div>
        <div className={s.dugmad}>
          <Link href="/poruke" className="btn btn-tertiary">
            Poruke
          </Link>
          <Link href="/prodaj" className="btn btn-primary">
            + Novi oglas
          </Link>
          <OdjaviDugme />
        </div>
      </div>

      <OglasiTabela
        oglasi={redovi.map(({ _count, createdAt, ...o }) => ({
          ...o,
          brojRazgovora: _count.razgovori,
          createdAt: createdAt.toISOString(),
        }))}
      />

      <section className={s.sekcija}>
        <h2 className={s.sekcijaNaslov}>Podešavanja</h2>
        <div className={s.dveKolone}>
          <ProfilForma
            pocetno={{
              naziv: korisnik.naziv,
              grad: korisnik.grad,
              telefon: korisnik.telefon ?? '',
              opis: korisnik.opis ?? '',
              pib: korisnik.pib ?? '',
            }}
            firma={korisnik.tip !== 'privatno-lice'}
          />
          <div className={s.dveKolone} style={{ gridTemplateColumns: '1fr' }}>
            <LozinkaForma />
            {korisnik.uloga !== 'ADMIN' ? <ObrisiNalog /> : null}
          </div>
        </div>
      </section>
    </div>
  )
}
