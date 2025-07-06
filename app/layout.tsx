import type { Metadata } from 'next'
import { Inter, Silkscreen, Orbitron } from 'next/font/google'
import './globals.css'
import { DarkModeProvider } from '@/components/providers/DarkModeProvider'
import { DevelopmentProvider } from '@/components/providers/DevelopmentProvider'

const inter = Inter({ subsets: ['latin'] })
const silkscreen = Silkscreen({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-silkscreen'
})
const orbitron = Orbitron({ 
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-orbitron'
})

export const metadata: Metadata = {
  title: 'ReFlow - Programmatic Logo Generator',
  description: 'Generate unique logos through programmatic definition of shapes',
  icons: {
    icon: [
      { url: '/ReFlow-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/ReFlow-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/ReFlow-128.png', sizes: '128x128', type: 'image/png' },
    ],
    apple: [
      { url: '/ReFlow-256.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${silkscreen.variable} ${orbitron.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=DotGothic16&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <DarkModeProvider>
          <DevelopmentProvider>
            {children}
          </DevelopmentProvider>
        </DarkModeProvider>
      </body>
    </html>
  )
}