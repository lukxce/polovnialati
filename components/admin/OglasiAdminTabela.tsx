'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatCena } from '@/lib/format'
import s from '@/components/nalog/nalog.module.css'

export type OglasAdminRed = {
  id: string
  slug: string
  naslov: string
  cena: number
  cenaDogovor: boolean
  aktivan: boolean
  provereno: boolean
  istaknuto: boolean
  createdAt: string
  prodavacNaziv: string
  prodavacEmail: string
  brojPrijava: number
  pregleda: number
  klikovaPozovi: number
  poziva: number
  poruka: number
}

export default function OglasiAdminTabela({ oglasi }: { oglasi: OglasAdminRed[] }) {
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
            <th title="Pregledi · klik Pozovi · pozivi · poruke">Interes</th>
            <th>Aktivan</th>
            <th>Provereno</th>
            <th>Izdvojeno</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {oglasi.map((o) => (
            <tr key={o.id}>
              <td>
                {o.aktivan ? <Link href={`/oglas/${o.slug}`}>{o.naslov}</Link> : o.naslov}
                <br />
                <span className={s.mala}>
                  {new Date(o.createdAt).toLocaleDateString('sr-RS')}
                  {o.brojPrijava ? ` · ${o.brojPrijava} prijava` : ''}
                </span>
              </td>
              <td>
                {o.prodavacNaziv}
                <br />
                <span className={s.mala}>{o.prodavacEmail}</span>
              </td>
              <td>
                {formatCena(o.cena)}
                {o.cenaDogovor ? <span className={s.mala}> · dogovor</span> : null}
              </td>
              <td style={{ whiteSpace: 'nowrap' }}>
                {o.pregleda} pregl.
                <br />
                <span className={s.mala}>
                  {o.klikovaPozovi} „Pozovi" · {o.poziva} poz. · {o.poruka} por.
                </span>
              </td>
              {(['aktivan', 'provereno', 'istaknuto'] as const).map((polje) => (
                <td key={polje}>
                  <button
                    type="button"
                    className={[s.znacka, o[polje] ? s.znackaAktivan : s.znackaNeaktivan].join(' ')}
                    onClick={() => prebaci(o.id, polje, o[polje])}
                    title="Klikni za promenu"
                  >
                    {o[polje] ? 'Da' : 'Ne'}
                  </button>
                </td>
              ))}
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
