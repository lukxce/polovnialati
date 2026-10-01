import type { Metadata } from 'next'
import Link from 'next/link'
import Prazno from '@/components/Prazno'

export const metadata: Metadata = {
  title: 'Stranica nije pronađena',
  robots: { index: false, follow: true },
}

export default function NijePronadjeno() {
  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <Prazno
        ikona="pretraga"
        naslov="Ova stranica ne postoji"
        opis={
          <>
            Ako si došao preko linka ka oglasu, oglas je verovatno prodat ili uklonjen. Pogledaj
            slične u pretrazi ili se vrati na <Link href="/">početnu</Link>.
          </>
        }
        akcijaHref="/oglasi"
        akcijaTekst="Svi oglasi"
        predlozi={[
          { tekst: 'Pretraga', href: '/pretraga' },
          { tekst: 'Postavi oglas', href: '/prodaj' },
        ]}
      />
    </div>
  )
}
