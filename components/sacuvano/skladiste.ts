/**
 * Brisanje cele liste sačuvanih.
 *
 * Čitanje i pojedinačno prebacivanje žive u `components/SacuvajDugme.tsx`
 * (`procitajSacuvane`, `useSacuvani`) — tamo je i jedini upis po oglasu.
 * Ovde je samo grupno brisanje, pa se ključ i ime događaja moraju poklapati
 * sa tim modulom. Ako se tamo promene, promeni ih i ovde.
 */
const KLJUC = 'alatnica:sacuvano'
const DOGADJAJ = 'alatnica:sacuvano-promena'

export function obrisiSve(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(KLJUC, JSON.stringify([]))
  } catch {
    /* privatni režim — tiho odustani */
  }
  window.dispatchEvent(new CustomEvent(DOGADJAJ, { detail: [] }))
}
