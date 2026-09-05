import OglasKartica from '@/components/OglasKartica'
import Prazno from '@/components/Prazno'
import type { Oglas } from '@/lib/types'

type Props = {
  oglasi: Oglas[]
  /** Ograniči broj prikazanih kartica (npr. „Izdvojeni" na početnoj). */
  limit?: number
  kompaktno?: boolean
  praznoNaslov?: string
  praznoOpis?: string
  praznoPredlozi?: { tekst: string; href: string }[]
}

export function MrezaOglasa({
  oglasi,
  limit,
  kompaktno = true,
  praznoNaslov = 'Nema oglasa za ovaj izbor',
  praznoOpis = 'Filteri su verovatno preuski. Skini jedan uslov ili proširi cenovni opseg. U bazi ima još alata.',
  praznoPredlozi,
}: Props) {
  const vidljivi = limit ? oglasi.slice(0, limit) : oglasi

  if (vidljivi.length === 0) {
    return (
      <Prazno
        ikona="alat"
        naslov={praznoNaslov}
        opis={praznoOpis}
        predlozi={praznoPredlozi}
        akcijaHref={praznoPredlozi?.length ? undefined : '/oglasi'}
        akcijaTekst={praznoPredlozi?.length ? undefined : 'Pregledaj sve oglase'}
      />
    )
  }

  return (
    <div className="mreza">
      {vidljivi.map((o) => (
        <OglasKartica key={o.id} oglas={o} kompaktno={kompaktno} />
      ))}
    </div>
  )
}

export default MrezaOglasa
