import 'server-only'
import { revalidateTag } from 'next/cache'
import { KATALOG_TAG } from '@/lib/queries'

/**
 * Posle svake izmene koja menja ono što javne stranice prikazuju (nov,
 * izmenjen, (de)aktiviran ili obrisan oglas, verifikacija ili blokada naloga,
 * izmena profila). `expire: 0` jer prodavac odmah posle objave otvara
 * pretragu — stale-while-revalidate bi mu prvi put pokazao stari katalog.
 */
export function osveziKatalog() {
  revalidateTag(KATALOG_TAG, { expire: 0 })
}
