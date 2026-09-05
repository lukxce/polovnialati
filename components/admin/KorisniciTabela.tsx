'use client'

import { useRouter } from 'next/navigation'
import type { User } from '@prisma/client'
import s from '@/components/nalog/nalog.module.css'

export default function KorisniciTabela({ korisnici }: { korisnici: User[] }) {
  const router = useRouter()

  async function prebaciVerifikovan(id: string, trenutno: boolean) {
    await fetch(`/api/admin/korisnici/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verifikovan: !trenutno }),
    })
    router.refresh()
  }

  return (
    <div className={s.karta} style={{ overflowX: 'auto' }}>
      <table className={s.tabela}>
        <thead>
          <tr>
            <th>Naziv</th>
            <th>Email</th>
            <th>Tip</th>
            <th>Grad</th>
            <th>Uloga</th>
            <th>Verifikovan</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {korisnici.map((k) => (
            <tr key={k.id}>
              <td>{k.naziv}</td>
              <td>{k.email}</td>
              <td>{k.tip}</td>
              <td>{k.grad}</td>
              <td>{k.uloga}</td>
              <td>
                <span className={[s.znacka, k.verifikovan ? s.znackaAktivan : s.znackaNeaktivan].join(' ')}>
                  {k.verifikovan ? 'Da' : 'Ne'}
                </span>
              </td>
              <td>
                {k.uloga !== 'ADMIN' ? (
                  <button
                    type="button"
                    className="btn btn-tertiary"
                    onClick={() => prebaciVerifikovan(k.id, k.verifikovan)}
                  >
                    {k.verifikovan ? 'Poništi verifikaciju' : 'Verifikuj'}
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
