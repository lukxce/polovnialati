'use client'

import { useRouter } from 'next/navigation'
import { formatCena } from '@/lib/format'
import type { OglasZaPrikaz } from '@/lib/oglasi'
import s from '@/components/nalog/nalog.module.css'

type Red = OglasZaPrikaz & { prodavacNaziv: string; prodavacEmail: string }

export default function OglasiAdminTabela({ oglasi }: { oglasi: Red[] }) {
  const router = useRouter()

  async function prebaci(id: string, polje: 'provereno' | 'istaknuto' | 'aktivan', trenutno: boolean) {
    await fetch(`/api/admin/oglasi/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [polje]: !trenutno }),
    })
    router.refresh()
  }

  async function obrisi(id: string, naslov: string) {
    if (!confirm(`Obrisati oglas „${naslov}"? Ovo se ne može opozvati.`)) return
    await fetch(`/api/admin/oglasi/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  if (oglasi.length === 0) {
    return (
      <div className={s.karta}>
        <p className={s.prazno}>Još uvek nema objavljenih oglasa.</p>
      </div>
    )
  }

  return (
    <div className={s.karta} style={{ overflowX: 'auto' }}>
      <table className={s.tabela}>
        <thead>
          <tr>
            <th>Naslov</th>
            <th>Prodavac</th>
            <th>Cena</th>
            <th>Aktivan</th>
            <th>Provereno</th>
            <th>Istaknuto</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {oglasi.map((o) => (
            <tr key={o.id}>
              <td>{o.naslov}</td>
              <td>
                {o.prodavacNaziv}
                <br />
                <span style={{ color: 'var(--ink-3)', fontSize: 12 }}>{o.prodavacEmail}</span>
              </td>
              <td>{o.cenaDogovor ? 'Dogovor' : formatCena(o.cena)}</td>
              <td>
                <button
                  type="button"
                  className={[s.znacka, o.aktivan ? s.znackaAktivan : s.znackaNeaktivan].join(' ')}
                  onClick={() => prebaci(o.id, 'aktivan', o.aktivan)}
                >
                  {o.aktivan ? 'Aktivan' : 'Neaktivan'}
                </button>
              </td>
              <td>
                <button
                  type="button"
                  className={[s.znacka, o.provereno ? s.znackaAktivan : s.znackaNeaktivan].join(' ')}
                  onClick={() => prebaci(o.id, 'provereno', o.provereno)}
                >
                  {o.provereno ? 'Da' : 'Ne'}
                </button>
              </td>
              <td>
                <button
                  type="button"
                  className={[s.znacka, o.istaknuto ? s.znackaAktivan : s.znackaNeaktivan].join(' ')}
                  onClick={() => prebaci(o.id, 'istaknuto', o.istaknuto)}
                >
                  {o.istaknuto ? 'Da' : 'Ne'}
                </button>
              </td>
              <td>
                <button type="button" className="btn btn-ghost" onClick={() => obrisi(o.id, o.naslov)}>
                  Obriši
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
