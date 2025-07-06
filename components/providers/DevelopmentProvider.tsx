'use client'

import { useEffect } from 'react'
import { DevelopmentUtilities } from '@/lib/debug/developmentUtilities'

export function DevelopmentProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize development utilities once when the app starts
    DevelopmentUtilities.initialize()
  }, [])

  return <>{children}</>
}