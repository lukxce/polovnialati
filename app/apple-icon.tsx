import { ImageResponse } from 'next/og'
import { NAVRTKA_PUTANJA } from '@/components/Logo'

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
          background: '#171613',
        }}
      >
        <svg width="124" height="124" viewBox="0 0 32 32">
          <path
            d={NAVRTKA_PUTANJA}
            fill="#FF8A00"
            fillRule="evenodd"
            stroke="#FF8A00"
            strokeWidth={3}
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    size,
  )
}
