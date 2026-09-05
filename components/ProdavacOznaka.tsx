import { Ikona } from '@/components/Ikone'
import { tipProdavcaLabela } from '@/lib/format'
import type { TipProdavca } from '@/lib/types'
import s from './ProdavacOznaka.module.css'

const GLIF: Record<TipProdavca, 'osoba' | 'prodavnica' | 'kljuc'> = {
  'privatno-lice': 'osoba',
  prodavnica: 'prodavnica',
  servis: 'kljuc',
}

type Props = {
  tip: TipProdavca
  /** Umesto opšte reči prikaži ime prodavca. */
  naziv?: string
  velicina?: 'malo' | 'srednje'
  className?: string
}

/** Glif + reč. Nikad samo glif. */
export function ProdavacOznaka({ tip, naziv, velicina = 'malo', className }: Props) {
  return (
    <span
      className={[s.oznaka, s[tip], velicina === 'srednje' ? s.srednje : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
    >
      <Ikona ime={GLIF[tip]} velicina={velicina === 'srednje' ? 18 : 15} />
      <span className={s.rec}>{naziv ?? tipProdavcaLabela(tip)}</span>
    </span>
  )
}

export default ProdavacOznaka
