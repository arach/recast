import { stateTracer } from './stateUpdateTracer'
import { LogoIdManager } from '@/lib/utils/logoIdManager'

/**
 * Development utilities for debugging and testing
 * These are only available in development mode
 */
export class DevelopmentUtilities {
  static initialize() {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
      return
    }
    
    // State tracer utilities
    this.registerStateTracer()
    
    // Logo management utilities
    this.registerLogoUtilities()
    
    // Brand preset utilities
    this.registerBrandPresets()
    
    // Show startup message
    this.showStartupMessage()
  }
  
  private static registerStateTracer() {
    // Already registered via debug actions in the component
    // This is here for completeness
  }
  
  private static registerLogoUtilities() {
    // List tracked logo IDs
    (window as any).listLogoIds = async () => {
      const instances = LogoIdManager.loadInstances()
      console.log('📋 Tracked Logo Instances:')
      console.log('═══════════════════════════')
      if (instances.length === 0) {
        console.log('No logos tracked in localStorage')
      } else {
        instances.forEach((instance, index) => {
          console.log(`${index + 1}. ID: ${instance.id}`)
          console.log(`   Position: (${instance.position.x}, ${instance.position.y})`)
          console.log(`   Template: ${instance.templateId || 'unknown'}`)
        })
      }
      return instances
    }
    
    // Clear tracked logo IDs
    (window as any).clearLogoIds = async () => {
      LogoIdManager.clearInstances()
      console.log('✅ Cleared all tracked logo IDs from localStorage')
    }
    
    // Debug current logo state
    (window as any).debugLogos = async () => {
      const { useLogoStore } = await import('@/lib/stores/logoStore')
      const logoStore = useLogoStore.getState()
      
      console.log('🔍 Current Logo State:')
      console.log('════════════════════════')
      console.log(`Total logos: ${logoStore.logos.length}`)
      console.log(`Selected logo: ${logoStore.selectedLogoId}`)
      console.log('')
      
      logoStore.logos.forEach((logo, index) => {
        console.log(`Logo ${index + 1}:`)
        console.log(`  ID: ${logo.id}`)
        console.log(`  Template: ${logo.templateId} (${logo.templateName})`)
        console.log(`  Position: (${logo.position.x}, ${logo.position.y})`)
        console.log(`  Has code: ${logo.code ? 'Yes' : 'No'}`)
        console.log(`  Parameters:`, logo.parameters.custom)
        console.log('')
      })
    }
  }
  
  private static registerBrandPresets() {
    // Reflow brand utilities are registered in BrandPresets module
  }
  
  private static showStartupMessage() {
    setTimeout(() => {
      console.log('')
      console.log('🚀 RECAST DEVELOPMENT MODE')
      console.log('═══════════════════════════')
      console.log('')
      console.log('🐛 Debug Toolbar: Look for the bug icon button in the bottom-right corner!')
      console.log('')
      console.log('Canvas Refactoring:')
      console.log('• /test-canvas - Test new canvas architecture')
      console.log('• /compare-canvas - Compare old vs new canvas')
      console.log('')
      console.log('Console Commands:')
      console.log('• window.initReflow() - Create wordmark')
      console.log('• window.reflowColor("black"|"blue"|"gradient") - Apply color')
      console.log('• window.load4Logos() - Load 4 logos with ID tracking')
      console.log('• window.listLogoIds() - List tracked logo IDs')
      console.log('• window.clearLogoIds() - Clear ID tracking')
      console.log('• window.debugLogos() - Debug current logo state')
      console.log('')
      console.log('"The canvas has overcome itself!" - Thus Spoke Zustand')
    }, 1000)
  }
}