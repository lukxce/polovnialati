import { ImageResponse } from 'next/og'
import { ETIKETA_OKRET, ETIKETA_PUTANJA } from '@/components/Logo'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FF8A00',
        }}
      >
        <svg width="140" height="140" viewBox="0 0 32 32">
          <path d={ETIKETA_PUTANJA} transform={ETIKETA_OKRET} fill="#171613" fillRule="evenodd" />
        </svg>
      </div>
    ),
    size,
  )
}
