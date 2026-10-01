import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import s from '@/components/nalog/nalog.module.css'
import ps from '@/components/poruke/poruke.module.css'
import { aktivnaSesija } from '@/lib/auth'
import { relativnoVreme } from '@/lib/format'
import { ucitajRazgovore } from '@/lib/poruke'

export const metadata: Metadata = { title: 'Poruke', robots: { index: false, follow: false } }

export default async function PorukeStranica() {
  const sesija = await aktivnaSesija()
  if (!sesija) redirect('/prijava?odakle=/poruke')

  const razgovori = await ucitajRazgovore(sesija.userId)

  return (
    <div className={['container', s.strana].join(' ')}>
      <header className={s.zaglavlje}>
        <div>
          <p className="micro">Nalog</p>
          <h1 className={s.naslov}>Poruke</h1>
          <p className={s.lede}>Razgovori sa kupcima i prodavcima oko tvojih oglasa.</p>
        </div>
      </header>

      {razgovori.length === 0 ? (
        <div className={s.karta}>
          <div className={s.prazno}>
            <p>Još uvek nema razgovora.</p>
          </div>
        </div>
      ) : (
        <div className={ps.lista}>
          {razgovori.map((r) => (
            <Link key={r.id} href={`/poruke/${r.id}`} className={ps.red}>
              <div className={ps.redInfo}>
                <p className={ps.redOglas}>{r.oglasNaslov}</p>
                <p className={[ps.redSagovornik, r.neprocitano > 0 ? ps.redNeprocitan : ''].join(' ')}>
                  {r.sagovornikNaziv}
                </p>
                <p className={ps.redPoruka}>{r.poslednjaPoruka}</p>
              </div>
              <div className={ps.redDesno}>
                <span className={ps.redVreme}>{relativnoVreme(r.poslednjaPorukaVreme.toISOString())}</span>
                {r.neprocitano > 0 ? <span className={ps.znackaBroj}>{r.neprocitano}</span> : null}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
