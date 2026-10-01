'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import s from '@/components/nalog/nalog.module.css'

export type PrijavaRed = {
  id: string
  razlog: string
  tekst: string | null
  createdAt: string
  prijavio: string | null
  oglasNaslov: string
  oglasSlug: string
  oglasAktivan: boolean
}

export default function PrijaveTabela({ prijave }: { prijave: PrijavaRed[] }) {
  const router = useRouter()

  async function resi(id: string) {
    await fetch(`/api/admin/prijave/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resena: true }),
    })
    router.refresh()
  }

  if (prijave.length === 0) {
    return (
      <div className={s.karta}>
        <p className={s.prazno}>Nema otvorenih prijava.</p>
      </div>
    )
  }

  return (
    <div className={s.karta} style={{ overflowX: 'auto' }}>
      <table className={s.tabela}>
        <thead>
          <tr>
            <th>Oglas</th>
            <th>Razlog</th>
            <th>Prijavio</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {prijave.map((p) => (
            <tr key={p.id}>
              <td>
                {p.oglasAktivan ? <Link href={`/oglas/${p.oglasSlug}`}>{p.oglasNaslov}</Link> : p.oglasNaslov}
                <br />
                <span className={s.mala}>{new Date(p.createdAt).toLocaleString('sr-RS')}</span>
              </td>
              <td>
                <strong>{p.razlog}</strong>
                {p.tekst ? <p className={s.tekstCelije}>{p.tekst}</p> : null}
              </td>
              <td>{p.prijavio ?? <span className={s.mala}>neprijavljen posetilac</span>}</td>
              <td>
                <button type="button" className="btn btn-tertiary" onClick={() => resi(p.id)}>
                  Označi rešeno
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
