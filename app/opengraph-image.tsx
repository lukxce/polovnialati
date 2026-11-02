import { ImageResponse } from 'next/og'
import { ETIKETA_OKRET, ETIKETA_PUTANJA } from '@/components/Logo'

export const alt = 'Polovni alati — nov i polovan alat, sa pravim opisom stanja'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/** Podrazumevana slika za deljenje linka (stranice bez sopstvene fotografije). */
export default function OgSlika() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#171613',
          color: '#F4F2ED',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 48, letterSpacing: -1.5 }}>
          <svg width="58" height="58" viewBox="0 0 32 32">
            <path d={ETIKETA_PUTANJA} transform={ETIKETA_OKRET} fill="#FF8A00" fillRule="evenodd" />
          </svg>
          <span>polovni</span>
          <span style={{ color: '#FF8A00' }}>alati</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            Dobar alat ne mora da bude nov
          </div>
          <div style={{ fontSize: 32, color: '#C6C0B4' }}>
            Pet ocena stanja · filter po aku sistemu · poznat prodavac
          </div>
        </div>
      </div>
    ),
    size,
  )
}
