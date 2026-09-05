import type { Metadata, Viewport } from 'next'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { fontVariables } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://alatnica.rs'),
  title: {
    default: 'Alatnica: nov i polovan alat, sa pravim opisom stanja',
    template: '%s · Alatnica',
  },
  description:
    'Marketplace za nov i polovan alat i sitnu građevinsku opremu. Prava taksonomija, pet ocena stanja sa objavljenom definicijom, filter po akumulatorskom sistemu i prodavac koji se zna.',
  applicationName: 'Alatnica',
  keywords: [
    'alat',
    'polovan alat',
    'elektroalat',
    'akumulatorski alat',
    'građevinska oprema',
    'oglasi',
  ],
  authors: [{ name: 'Alatnica' }],
  openGraph: {
    type: 'website',
    locale: 'sr_RS',
    siteName: 'Alatnica',
    url: 'https://alatnica.rs',
    title: 'Alatnica: nov i polovan alat, sa pravim opisom stanja',
    description:
      'Elektroalat, akumulatorski sistemi, merni instrumenti i sitna mehanizacija. Pet ocena stanja umesto slobodnog teksta, filter po bateriji i proveren prodavac.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alatnica: nov i polovan alat',
    description:
      'Marketplace za alat sa pravom taksonomijom, ocenjenim stanjem i poznatim prodavcem.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
}

export const viewport: Viewport = {
  themeColor: '#f4f2ed',
  colorScheme: 'light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr" className={fontVariables}>
      <body>
        <Header />
        <main id="glavni">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
