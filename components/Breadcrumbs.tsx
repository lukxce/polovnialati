import Link from 'next/link'
import s from './Breadcrumbs.module.css'

export type Mrvica = { naziv: string; href?: string }

type Props = {
  stavke: Mrvica[]
  /** Osnovni URL za JSON-LD. Podrazumevano produkcioni domen. */
  osnova?: string
  className?: string
}

/**
 * Vizuelni breadcrumb + `BreadcrumbList` JSON-LD.
 * Poslednja stavka je trenutna strana i nije link.
 */
export function Breadcrumbs({ stavke, osnova = 'https://alatnica.rs', className }: Props) {
  if (stavke.length === 0) return null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: stavke.map((st, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: st.naziv,
      ...(st.href ? { item: `${osnova}${st.href}` } : {}),
    })),
  }

  return (
    <nav aria-label="Putanja" className={[s.nav, className ?? ''].filter(Boolean).join(' ')}>
      <ol className={s.lista}>
        {stavke.map((st, i) => {
          const poslednja = i === stavke.length - 1
          return (
            <li key={`${st.naziv}-${i}`} className={s.stavka}>
              {st.href && !poslednja ? (
                <Link href={st.href} className={s.link}>
                  {st.naziv}
                </Link>
              ) : (
                <span className={s.trenutna} aria-current={poslednja ? 'page' : undefined}>
                  {st.naziv}
                </span>
              )}
              {!poslednja ? (
                <span className={s.strelica} aria-hidden="true">
                  ›
                </span>
              ) : null}
            </li>
          )
        })}
      </ol>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </nav>
  )
}

export default Breadcrumbs
