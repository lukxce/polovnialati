'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatCena } from '@/lib/format'
import s from './nalog.module.css'

export type MojOglasRed = {
  id: string
  slug: string
  naslov: string
  cena: number
  cenaDogovor: boolean
  aktivan: boolean
  provereno: boolean
  pregleda: number
  brojRazgovora: number
  createdAt: string
}

export default function OglasiTabela({ oglasi }: { oglasi: MojOglasRed[] }) {
  const router = useRouter()

  async function izmeni(id: string, telo: Record<string, unknown>) {
    const res = await fetch(`/api/oglasi/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(telo),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data.greska || 'Izmena nije uspela.')
    }
    router.refresh()
  }

  async function promeniCenu(o: MojOglasRed) {
    const unos = prompt(`Nova cena za „${o.naslov}" (u dinarima):`, String(o.cena))
    if (unos === null) return
    const cena = Number(unos.replace(/[^\d]/g, ''))
    if (!cena) return alert('Unesi cenu u dinarima, npr. 15000.')
    await izmeni(o.id, { cena })
  }

  async function obrisi(id: string, naslov: string) {
    if (!confirm(`Obrisati oglas „${naslov}"? Ovo se ne može opozvati.`)) return
    await fetch(`/api/oglasi/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  if (oglasi.length === 0) {
    return (
      <div className={s.karta}>
        <div className={s.prazno}>
          <p>Još uvek nemaš nijedan oglas.</p>
          <Link href="/prodaj" className="btn btn-primary" style={{ marginTop: 12 }}>
            Objavi prvi oglas
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={s.karta} style={{ overflowX: 'auto' }}>
      <table className={s.tabela}>
        <thead>
          <tr>
            <th>Naslov</th>
            <th>Cena</th>
            <th>Status</th>
            <th>Pregleda</th>
            <th>Upita</th>
            <th>Objavljeno</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {oglasi.map((o) => (
            <tr key={o.id}>
              <td>
                {o.aktivan ? <Link href={`/oglas/${o.slug}`}>{o.naslov}</Link> : o.naslov}
                {o.provereno ? <span className={s.mala}> · provereno</span> : null}
              </td>
              <td>
                {formatCena(o.cena)}
                {o.cenaDogovor ? <span className={s.mala}> · dogovor</span> : null}
              </td>
              <td>
                <span className={[s.znacka, o.aktivan ? s.znackaAktivan : s.znackaNeaktivan].join(' ')}>
                  {o.aktivan ? 'Aktivan' : 'Neaktivan'}
                </span>
              </td>
              <td className="tabular">{o.pregleda}</td>
              <td className="tabular">{o.brojRazgovora}</td>
              <td>{new Date(o.createdAt).toLocaleDateString('sr-RS')}</td>
              <td>
                <div className={s.akcije}>
                  <button type="button" className="btn btn-ghost" onClick={() => promeniCenu(o)}>
                    Cena
                  </button>
                  <button
                    type="button"
                    className="btn btn-tertiary"
                    onClick={() => izmeni(o.id, { aktivan: !o.aktivan })}
                  >
                    {o.aktivan ? 'Prodato / skloni' : 'Vrati u ponudu'}
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => obrisi(o.id, o.naslov)}>
                    Obriši
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
