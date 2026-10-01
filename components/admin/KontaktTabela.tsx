'use client'

import { useRouter } from 'next/navigation'
import s from '@/components/nalog/nalog.module.css'

export type KontaktRed = {
  id: string
  ime: string
  email: string
  tema: string
  tekst: string
  procitana: boolean
  createdAt: string
}

export default function KontaktTabela({ poruke }: { poruke: KontaktRed[] }) {
  const router = useRouter()

  async function prebaci(id: string, procitana: boolean) {
    await fetch(`/api/admin/kontakt/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ procitana }),
    })
    router.refresh()
  }

  if (poruke.length === 0) {
    return (
      <div className={s.karta}>
        <p className={s.prazno}>Nema poruka sa kontakt forme.</p>
      </div>
    )
  }

  return (
    <div className={s.karta} style={{ overflowX: 'auto' }}>
      <table className={s.tabela}>
        <thead>
          <tr>
            <th>Od</th>
            <th>Poruka</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {poruke.map((p) => (
            <tr key={p.id} className={p.procitana ? s.procitano : undefined}>
              <td>
                <strong>{p.ime}</strong>
                <br />
                <a href={`mailto:${p.email}?subject=${encodeURIComponent(`Re: ${p.tema}`)}`}>{p.email}</a>
                <br />
                <span className={s.mala}>{new Date(p.createdAt).toLocaleString('sr-RS')}</span>
              </td>
              <td>
                <strong>{p.tema}</strong>
                <p className={s.tekstCelije}>{p.tekst}</p>
              </td>
              <td>
                <button type="button" className="btn btn-ghost" onClick={() => prebaci(p.id, !p.procitana)}>
                  {p.procitana ? 'Nepročitano' : 'Pročitano'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
