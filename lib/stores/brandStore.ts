import { create } from 'zustand'
import { BrandProfile } from '../types/core'

interface BrandStore {
  // Brand profile data
  brandProfile: BrandProfile | null
  
  // Actions
  setBrandProfile: (profile: BrandProfile) => void
  updatePersonality: (personality: Partial<BrandProfile['personality']>) => void
  updatePreferences: (preferences: Partial<BrandProfile['preferences']>) => void
  setIndustry: (industry: string) => void
  resetBrandProfile: () => void
}

const defaultBrandProfile: BrandProfile = {
  personality: {
    innovative: 0.5,
    trustworthy: 0.5,
    approachable: 0.5,
    sophisticated: 0.5
  },
  industry: '',
  preferences: {
    colorIntensity: 0.5,
    animationSpeed: 0.5,
    geometricVsOrganic: 0.5
  }
}

export const useBrandStore = create<BrandStore>((set) => ({
  brandProfile: null,
  
  setBrandProfile: (profile) => set({ brandProfile: profile }),
  
  updatePersonality: (personality) => set((state) => ({
    brandProfile: state.brandProfile ? {
      ...state.brandProfile,
      personality: {
        ...state.brandProfile.personality,
        ...personality
      }
    } : {
      ...defaultBrandProfile,
      personality: {
        ...defaultBrandProfile.personality,
        ...personality
      }
    }
  })),
  
  updatePreferences: (preferences) => set((state) => ({
    brandProfile: state.brandProfile ? {
      ...state.brandProfile,
      preferences: {
        ...state.brandProfile.preferences,
        ...preferences
      }
    } : {
      ...defaultBrandProfile,
      preferences: {
        ...defaultBrandProfile.preferences,
        ...preferences
      }
    }
  })),
  
  setIndustry: (industry) => set((state) => ({
    brandProfile: state.brandProfile ? {
      ...state.brandProfile,
      industry
    } : {
      ...defaultBrandProfile,
      industry
    }
  })),
  
  resetBrandProfile: () => set({ brandProfile: null })
}))