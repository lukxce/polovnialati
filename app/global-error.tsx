'use client'

/** Poslednja linija: greška u samom layout-u. Bez zajedničkih stilova i komponenti. */
export default function GlobalnaGreska({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="sr-Latn">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#F4F2ED',
          color: '#171613',
          fontFamily: 'system-ui, sans-serif',
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 440, textAlign: 'center' }}>
          <h1 style={{ fontSize: 28, margin: '0 0 12px' }}>Alatnica trenutno ne radi</h1>
          <p style={{ lineHeight: 1.6, color: '#48453D' }}>
            Došlo je do greške na našoj strani. Pokušaj ponovo za par minuta.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 16,
              padding: '12px 20px',
              border: 0,
              borderRadius: 14,
              background: '#FF8A00',
              color: '#171613',
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            Pokušaj ponovo
          </button>
        </div>
      </body>
    </html>
  )
}
