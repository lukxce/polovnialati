import { Ikona } from '@/components/Ikone'
import { brojSr } from '@/lib/format'
import { raspodelaOcena } from './raspodela'
import s from './Ocena.module.css'

type Props = {
  ocena: number
  brojOcena: number
}

/** Pet zvezdica sa delimičnim popunjavanjem — bez slika, samo dva sloja. */
function Zvezdice({ ocena, velicina = 18 }: { ocena: number; velicina?: number }) {
  const procenat = Math.max(0, Math.min(100, (ocena / 5) * 100))
  return (
    <span className={s.zvezdice} style={{ ['--zv-velicina' as string]: `${velicina}px` }}>
      <span className={s.zvezdiceSloj} aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <Ikona key={i} ime="zvezda" velicina={velicina} />
        ))}
      </span>
      <span className={s.zvezdicePun} style={{ width: `${procenat}%` }} aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <Ikona key={i} ime="zvezda" velicina={velicina} />
        ))}
      </span>
    </span>
  )
}

export function Ocena({ ocena, brojOcena }: Props) {
  const raspodela = raspodelaOcena(ocena, brojOcena)
  const najveci = Math.max(1, ...raspodela)

  return (
    <div className={s.blok}>
      <div className={s.sazetak}>
        <p className={s.broj}>{ocena.toFixed(1).replace('.', ',')}</p>
        <Zvezdice ocena={ocena} velicina={19} />
        <p className={s.ukupno}>{brojSr(brojOcena, ['ocena', 'ocene', 'ocena'])}</p>
      </div>

      <ul className={s.raspodela}>
        {[5, 4, 3, 2, 1].map((zvezda) => {
          const broj = raspodela[zvezda - 1]
          const udeo = brojOcena > 0 ? Math.round((broj / brojOcena) * 100) : 0
          return (
            <li key={zvezda} className={s.red}>
              <span className={s.oznakaZvezde}>
                {zvezda}
                <Ikona ime="zvezda" velicina={12} />
              </span>
              <span className={s.sipka}>
                <span
                  className={s.sipkaPun}
                  style={{ width: `${(broj / najveci) * 100}%` }}
                  aria-hidden="true"
                />
              </span>
              <span className={s.redBroj}>
                {broj}
                <span className={s.redUdeo}> · {udeo}%</span>
              </span>
            </li>
          )
        })}
      </ul>

      <p className={s.napomena}>
        Raspodela je izvedena iz proseka i broja ocena ovog demo naloga, pa se njen prosek poklapa
        sa ocenom iznad.
      </p>
    </div>
  )
}

export default Ocena
