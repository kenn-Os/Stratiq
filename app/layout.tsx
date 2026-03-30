// app/layout.tsx
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'STRATIQ – Decision Intelligence Platform',
    template: '%s | STRATIQ',
  },
  description: 'STRATIQ is the operating system for high-stakes decisions. Model scenarios, simulate outcomes, and decide with precision.',
  keywords: ['decision intelligence', 'scenario modelling', 'risk analysis', 'strategic decisions', 'decision platform'],
  authors: [{ name: 'STRATIQ' }],
  creator: 'STRATIQ',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://stratiq.io'),
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://stratiq.io',
    siteName: 'STRATIQ',
    title: 'STRATIQ – Decide With Precision',
    description: 'The decision intelligence platform for individuals, professionals, and enterprises.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'STRATIQ – Decision Intelligence Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'STRATIQ – Decide With Precision',
    description: 'The decision intelligence platform for high-stakes decisions.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: '#0E1117',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
