'use client'

import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Templates from '@/components/Templates'
import HowItWorks from '@/components/HowItWorks'
import Pricing from '@/components/Pricing'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'
import Navigation from '@/components/Navigation'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-recast-dark dark:to-gray-900">
      <Navigation />
      <Hero />
      <Features />
      <Templates />
      <HowItWorks />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  )
}