import type { NextConfig } from 'next'

const BEZBEDNOSNA_ZAGLAVLJA = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  /**
   * Fotografije oglasa iz Vercel Blob-a idu kroz Vercel-ovo smanjivanje slika:
   * kartica dobija ~480px WebP umesto pune fotografije od 1200px.
   *
   * Hobby plan ima 5.000 smanjivanja mesečno; posle toga nove slike vraćaju
   * grešku 402 dok se brojač ne resetuje. Zato samo tri širine (kartica i
   * sličice u galeriji dele 480, galerija koristi 1080) i keš od 31 dan —
   * najviše tri smanjivanja po oglasu, i to samo za oglase koje neko otvori.
   * Ne dodaj širine bez računice.
   */
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com', pathname: '/oglasi/**' }],
    deviceSizes: [480, 640, 1080],
    imageSizes: [],
    minimumCacheTTL: 2678400,
  },
  async headers() {
    return [{ source: '/:path*', headers: BEZBEDNOSNA_ZAGLAVLJA }]
  },
}

export default nextConfig
