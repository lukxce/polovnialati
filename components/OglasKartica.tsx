import Link from 'next/link'
import { Ikona } from '@/components/Ikone'
import ProdavacOznaka from '@/components/ProdavacOznaka'
import SacuvajDugme from '@/components/SacuvajDugme'
import Slika from '@/components/Slika'
import StanjeChip from '@/components/StanjeChip'
import { formatCena } from '@/lib/format'
import { brendBySlug } from '@/lib/taksonomija'
import type { Oglas } from '@/lib/types'
import s from './OglasKartica.module.css'

type Props = {
  oglas: Oglas
  /** Gušća varijanta za dvokolonu mrežu na telefonu i za uske rail-ove. */
  kompaktno?: boolean
}

export function OglasKartica({ oglas, kompaktno }: Props) {
  const brend = brendBySlug(oglas.brend)

  return (
    <article
      className={[
        'card',
        s.kartica,
        kompaktno ? s.kompaktna : '',
        oglas.istaknuto ? s.istaknuta : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {oglas.istaknuto ? <span className={s.izdvojeno}>Izdvojeno</span> : null}

      <div className={s.medija}>
        <Link href={`/oglas/${oglas.slug}`} className={s.slikaLink} tabIndex={-1} aria-hidden="true">
          <Slika oglas={oglas} />
        </Link>

        <div className={s.gore}>
          <StanjeChip stanje={oglas.stanje} />
          <SacuvajDugme slug={oglas.slug} />
        </div>

        {oglas.slike.length > 1 ? (
          <span className={s.brojSlika}>
            <Ikona ime="foto" velicina={13} />
            {oglas.slike.length}
          </span>
        ) : null}
      </div>

      <div className={s.telo}>
        <p className={s.brendModel}>
          <span className={s.brendIme}>{brend?.naziv ?? oglas.brend}</span>
          <span className={s.tacka} aria-hidden="true">
            ·
          </span>
          <span className={s.model}>{oglas.model}</span>
        </p>

        <h3 className={s.naslov}>
          <Link href={`/oglas/${oglas.slug}`} className={s.naslovLink}>
            {oglas.naslov}
          </Link>
        </h3>

        <div className={s.cenaRed}>
          <span className="cena">{formatCena(oglas.cena)}</span>
          {oglas.staraCena ? (
            <span className="stara-cena">{formatCena(oglas.staraCena)}</span>
          ) : null}
          {oglas.cenaDogovor ? <span className={s.dogovor}>Dogovor</span> : null}
        </div>

        <div className={s.podnozje}>
          <span className={s.lokacija}>
            <Ikona ime="lokacija" velicina={14} />
            {oglas.lokacija}
          </span>

          <ProdavacOznaka tip={oglas.prodavacTip} />

          {oglas.provereno ? (
            <span className={s.provereno} title="Oglas je pregledao tim Alatnice">
              <Ikona ime="cek" velicina={13} />
              Provereno
            </span>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export default OglasKartica
