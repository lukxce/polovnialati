/**
 * Javni API filter iskustva.
 *
 * Serverska strana:
 *   const filteri = parseFiltere(await searchParams)
 *   const podaci  = pripremiBrowse(filteri)          // rezultati + sve fasete
 *   <BrowseLayout filteri={filteri} fasete={samoFasete(podaci)} osnova="/oglasi">
 *     …mreža kartica ili <PraznoRezultati … />
 *   </BrowseLayout>
 *
 * Kategorijska strana prosleđuje `osnova="/kategorija/elektroalat"` i
 * `zakljucanaKategorija="elektroalat"`: stablo se skuplja na tu granu, čip za
 * kategoriju se ne prikazuje, a slug se ne duplira u query-ju.
 */
export { default as BrowseLayout, SORTIRANJA } from './BrowseLayout'
export { default as PraznoRezultati } from './PraznoRezultati'
export { default as FilterSadrzaj } from './FilterSadrzaj'
export { default as DonjiList } from './DonjiList'
export { pripremiBrowse, samoFasete } from './podaci'
export type { BrowseBrojevi, BrowseFasete, BrowsePodaci } from './podaci'
export { aktivneOznake, obrisiSve } from './oznake'
export type { AktivnaOznaka, ImenaFiltera } from './oznake'
export { useFilteri, prebaciVrednost } from './useFilteri'
