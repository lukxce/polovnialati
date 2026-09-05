'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatCena } from '@/lib/format'
import type { OglasZaPrikaz } from '@/lib/oglasi'
import s from './nalog.module.css'

export default function OglasiTabela({ oglasi }: { oglasi: OglasZaPrikaz[] }) {
  const router = useRouter()

  async function prebaciAktivan(id: string, trenutno: boolean) {
    await fetch(`/api/oglasi/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aktivan: !trenutno }),
    })
    router.refresh()
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
            <th>Provereno</th>
            <th>Objavljeno</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {oglasi.map((o) => (
            <tr key={o.id}>
              <td>{o.naslov}</td>
              <td>{o.cenaDogovor ? 'Dogovor' : formatCena(o.cena)}</td>
              <td>
                <span className={[s.znacka, o.aktivan ? s.znackaAktivan : s.znackaNeaktivan].join(' ')}>
                  {o.aktivan ? 'Aktivan' : 'Neaktivan'}
                </span>
              </td>
              <td>{o.provereno ? 'Da' : 'Ne'}</td>
              <td>{new Date(o.createdAt).toLocaleDateString('sr-RS')}</td>
              <td>
                <div className={s.akcije}>
                  <button type="button" className="btn btn-tertiary" onClick={() => prebaciAktivan(o.id, o.aktivan)}>
                    {o.aktivan ? 'Deaktiviraj' : 'Aktiviraj'}
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
