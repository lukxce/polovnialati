'use client'

import { useEffect } from 'react'
import Prazno from '@/components/Prazno'

export default function Greska({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <Prazno
        ikona="x"
        naslov="Nešto nije u redu"
        opis="Stranica nije mogla da se učita. Pokušaj ponovo za trenutak. Ako se greška ponavlja, javi nam preko stranice Kontakt."
        predlozi={[
          { tekst: 'Početna', href: '/' },
          { tekst: 'Kontakt', href: '/kontakt' },
        ]}
      >
        <button type="button" className="btn btn-primary" onClick={reset} style={{ marginTop: 16 }}>
          Pokušaj ponovo
        </button>
      </Prazno>
    </div>
  )
}
