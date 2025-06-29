import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ReCast - Programmatic Logo Generator',
  description: 'Generate unique logos through programmatic definition of shapes',
  icons: {
    icon: [
      { url: '/ReCast-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/ReCast-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/ReCast-128.png', sizes: '128x128', type: 'image/png' },
    ],
    apple: [
      { url: '/ReCast-256.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  )
}