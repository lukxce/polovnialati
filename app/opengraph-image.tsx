import { ImageResponse } from 'next/og'

export const alt = 'Alatnica — nov i polovan alat, sa pravim opisom stanja'
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
        <div style={{ fontSize: 40, fontWeight: 800, color: '#FF8A00', letterSpacing: -1 }}>
          Alatnica
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            Nov i polovan alat, sa pravim opisom stanja
          </div>
          <div style={{ fontSize: 32, color: '#C6C0B4' }}>
            Pet ocena stanja · filter po akumulatorskom sistemu · prodavac koji se zna
          </div>
        </div>
      </div>
    ),
    size,
  )
}
