'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import s from '@/components/nalog/nalog.module.css'

export type KorisnikRed = {
  id: string
  slug: string
  naziv: string
  email: string
  tip: string
  grad: string
  telefon: string | null
  pib: string | null
  uloga: string
  verifikovan: boolean
  blokiran: boolean
  brojOglasa: number
  createdAt: string
}

export default function KorisniciTabela({ korisnici }: { korisnici: KorisnikRed[] }) {
  const router = useRouter()

  async function izmeni(id: string, telo: Record<string, boolean>) {
    const res = await fetch(`/api/admin/korisnici/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(telo),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) alert(data.greska || 'Izmena nije uspela.')
    return data
  }

  async function blokiraj(k: KorisnikRed) {
    const poruka = k.blokiran
      ? `Odblokirati nalog „${k.naziv}"?`
      : `Blokirati nalog „${k.naziv}"? Oglasi mu nestaju iz pretrage, ne može da se prijavi ni da šalje poruke.`
    if (!confirm(poruka)) return
    await izmeni(k.id, { blokiran: !k.blokiran })
    router.refresh()
  }

  async function novaLozinka(k: KorisnikRed) {
    if (!confirm(`Napraviti novu privremenu lozinku za ${k.email}? Stara lozinka prestaje da važi.`)) return
    const data = await izmeni(k.id, { novaLozinka: true })
    if (data.privremenaLozinka) {
      prompt(
        `Privremena lozinka za ${k.email} (prikazuje se samo sada — javi je korisniku i reci mu da je promeni u Moj nalog):`,
        data.privremenaLozinka,
      )
    }
  }

  if (korisnici.length === 0) {
    return (
      <div className={s.karta}>
        <p className={s.prazno}>Nema korisnika.</p>
      </div>
    )
  }

  return (
    <div className={s.karta} style={{ overflowX: 'auto' }}>
      <table className={s.tabela}>
        <thead>
          <tr>
            <th>Naziv</th>
            <th>Kontakt</th>
            <th>Tip · grad</th>
            <th>Oglasa</th>
            <th>Verifikovan</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {korisnici.map((k) => (
            <tr key={k.id}>
              <td>
                <Link href={`/prodavac/${k.slug}`}>{k.naziv}</Link>
                {k.uloga === 'ADMIN' ? <span className={s.mala}> · ADMIN</span> : null}
                <br />
                <span className={s.mala}>od {new Date(k.createdAt).toLocaleDateString('sr-RS')}</span>
              </td>
              <td>
                {k.email}
                {k.telefon ? (
                  <>
                    <br />
                    <span className={s.mala}>{k.telefon}</span>
                  </>
                ) : null}
              </td>
              <td>
                {k.tip}
                <br />
                <span className={s.mala}>
                  {k.grad}
                  {k.pib ? ` · PIB ${k.pib}` : ''}
                </span>
              </td>
              <td className="tabular">{k.brojOglasa}</td>
              <td>
                {k.uloga !== 'ADMIN' ? (
                  <button
                    type="button"
                    className={[s.znacka, k.verifikovan ? s.znackaAktivan : s.znackaNeaktivan].join(' ')}
                    onClick={async () => {
                      await izmeni(k.id, { verifikovan: !k.verifikovan })
                      router.refresh()
                    }}
                    title="Klikni za promenu"
                  >
                    {k.verifikovan ? 'Da' : 'Ne'}
                  </button>
                ) : null}
              </td>
              <td>
                <span className={[s.znacka, k.blokiran ? s.znackaBlokiran : s.znackaAktivan].join(' ')}>
                  {k.blokiran ? 'Blokiran' : 'Aktivan'}
                </span>
              </td>
              <td>
                {k.uloga !== 'ADMIN' ? (
                  <div className={s.akcije}>
                    <button type="button" className="btn btn-ghost" onClick={() => novaLozinka(k)}>
                      Nova lozinka
                    </button>
                    <button type="button" className="btn btn-tertiary" onClick={() => blokiraj(k)}>
                      {k.blokiran ? 'Odblokiraj' : 'Blokiraj'}
                    </button>
                  </div>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
