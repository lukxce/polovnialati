import { Ikona } from '@/components/Ikone'
import Tekst from '@/components/vodici/Tekst'
import type { Blok } from '@/lib/vodici'
import s from './Clanak.module.css'

/**
 * Render svih varijanti `Blok` unije iz `lib/vodici.ts`.
 * Svaka varijanta ima svoj prikaz — nijedna se ne prećutkuje.
 */
function JedanBlok({ blok, uvodni }: { blok: Blok; uvodni?: boolean }) {
  switch (blok.tip) {
    case 'p':
      return (
        <p className={uvodni ? `${s.p} ${s.uvodni}` : s.p}>
          <Tekst>{blok.tekst}</Tekst>
        </p>
      )

    case 'h2':
      return (
        <h2 id={blok.id} className={s.h2}>
          <a href={`#${blok.id}`} className={s.sidro} aria-label={`Link ka sekciji: ${blok.tekst}`}>
            #
          </a>
          {blok.tekst}
        </h2>
      )

    case 'h3':
      return <h3 className={s.h3}>{blok.tekst}</h3>

    case 'lista':
      return (
        <ul className={s.lista}>
          {blok.stavke.map((stavka, i) => (
            <li key={i}>
              <Tekst>{stavka}</Tekst>
            </li>
          ))}
        </ul>
      )

    case 'koraci':
      return (
        <ol className={s.koraci}>
          {blok.stavke.map((stavka, i) => (
            <li key={i}>
              <Tekst>{stavka}</Tekst>
            </li>
          ))}
        </ol>
      )

    case 'tabela': {
      // Prazna prva ćelija zaglavlja znači da je prva kolona nosilac reda.
      const redoviSuNoseci = blok.zaglavlje[0] === ''
      return (
        <div className={s.tabelaOkvir}>
          <table className={s.tabela}>
            <thead>
              <tr>
                {blok.zaglavlje.map((c, i) => (
                  <th key={i} scope="col">
                    {c === '' ? <span className="sr-only">Osobina</span> : c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {blok.redovi.map((red, i) => (
                <tr key={i}>
                  {red.map((c, j) =>
                    redoviSuNoseci && j === 0 ? (
                      <th key={j} scope="row">
                        {c}
                      </th>
                    ) : (
                      <td key={j}>
                        <Tekst>{c}</Tekst>
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    case 'napomena':
      return (
        <aside className={s.napomena}>
          <span className={s.napomenaIkona}>
            <Ikona ime="stit" velicina={16} />
          </span>
          <div>
            <h3 className={s.napomenaNaslov}>{blok.naslov}</h3>
            <p className={s.napomenaTekst}>
              <Tekst>{blok.tekst}</Tekst>
            </p>
          </div>
        </aside>
      )

    default: {
      // Ako se uniji doda nova varijanta, ovde puca tipizacija — namerno.
      const nepoznat: never = blok
      return nepoznat
    }
  }
}

export function Blokovi({ blokovi }: { blokovi: Blok[] }) {
  return (
    <div className={s.proza}>
      {blokovi.map((b, i) => (
        <JedanBlok key={i} blok={b} uvodni={i === 0 && b.tip === 'p'} />
      ))}
    </div>
  )
}

export default Blokovi
