import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ReCast - Dynamic Brand Identity System',
  description: 'Transform your brand into living code. Create adaptive identities that respond to context while maintaining consistency.',
  keywords: 'brand identity, dynamic logos, generative design, brand system, identity design',
  authors: [{ name: 'ReCast' }],
  openGraph: {
    title: 'ReCast - Dynamic Brand Identity System',
    description: 'Transform your brand into living code',
    type: 'website',
    url: 'https://recast.arach.io',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReCast - Dynamic Brand Identity System',
    description: 'Transform your brand into living code',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}