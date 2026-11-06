import Link from 'next/link'
import s from '@/components/nalog/nalog.module.css'
import { MERE, type Brojevi } from '@/lib/statistika'

type Props = {
  zbirovi: { naziv: string; brojevi: Brojevi }[]
  dani: { dan: string; brojevi: Brojevi }[]
  najtrazeniji: {
    id: string
    slug: string
    naslov: string
    aktivan: boolean
    prodavac: string
    brojevi: Brojevi
  }[]
}

const broj = (n: number) => (n ? n.toLocaleString('sr-RS') : <span className={s.mala}>0</span>)

/** Statistika interesovanja kupaca: zbirovi, po danima i najtraženiji oglasi. */
export default function Statistika({ zbirovi, dani, najtrazeniji }: Props) {
  return (
    <>
      <div className={s.karta} style={{ overflowX: 'auto' }}>
        <table className={s.tabela}>
          <thead>
            <tr>
              <th></th>
              {MERE.map((m) => (
                <th key={m.kljuc}>{m.naziv}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {zbirovi.map((z) => (
              <tr key={z.naziv}>
                <td>
                  <strong>{z.naziv}</strong>
                </td>
                {MERE.map((m) => (
                  <td key={m.kljuc}>{broj(z.brojevi[m.kljuc])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={s.mala} style={{ marginTop: 8 }}>
        Klik „Pozovi" znači da je kupac otvorio broj prodavca, a poziv da je na telefonu dodirnuo
        broj. Poruke su novi razgovori. Ista adresa se broji jednom na sat po oglasu; tvoji
        klikovi i klikovi vlasnika oglasa se ne broje. Klikovi se beleže od 6. 11. 2026.
      </p>

      <details style={{ marginTop: 16 }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Po danima (poslednjih 14)</summary>
        <div className={s.karta} style={{ overflowX: 'auto', marginTop: 12 }}>
          <table className={s.tabela}>
            <thead>
              <tr>
                <th>Dan</th>
                {MERE.map((m) => (
                  <th key={m.kljuc}>{m.naziv}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dani.map((d) => (
                <tr key={d.dan}>
                  <td>{d.dan}</td>
                  {MERE.map((m) => (
                    <td key={m.kljuc}>{broj(d.brojevi[m.kljuc])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <h3 className={s.sekcijaNaslov} style={{ marginTop: 24, fontSize: 16 }}>
        Najtraženiji oglasi (30 dana)
      </h3>
      {najtrazeniji.length ? (
        <div className={s.karta} style={{ overflowX: 'auto' }}>
          <table className={s.tabela}>
            <thead>
              <tr>
                <th>Oglas</th>
                <th>Pregledi</th>
                <th>Klik „Pozovi"</th>
                <th>Pozivi</th>
                <th>Poruke</th>
              </tr>
            </thead>
            <tbody>
              {najtrazeniji.map((o) => (
                <tr key={o.id}>
                  <td>
                    {o.aktivan ? <Link href={`/oglas/${o.slug}`}>{o.naslov}</Link> : o.naslov}
                    <br />
                    <span className={s.mala}>{o.prodavac}</span>
                  </td>
                  <td>{broj(o.brojevi.pregled)}</td>
                  <td>{broj(o.brojevi.telefon)}</td>
                  <td>{broj(o.brojevi.poziv)}</td>
                  <td>{broj(o.brojevi.razgovor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={s.karta}>
          <p className={s.prazno}>Još nema zabeleženih pregleda ni kontakata.</p>
        </div>
      )}
    </>
  )
}
