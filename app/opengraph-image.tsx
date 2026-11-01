import { ImageResponse } from 'next/og'
import { NAVRTKA_PUTANJA } from '@/components/Logo'

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 44, letterSpacing: -1 }}>
          <svg width="52" height="52" viewBox="0 0 32 32">
            <path
              d={NAVRTKA_PUTANJA}
              fill="#FF8A00"
              fillRule="evenodd"
              stroke="#FF8A00"
              strokeWidth={3}
              strokeLinejoin="round"
            />
          </svg>
          <span style={{ fontWeight: 500 }}>polovni</span>
          <span style={{ fontWeight: 800 }}>alati</span>
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
