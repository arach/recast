import { stateTracer } from './stateUpdateTracer'
import { LogoIdManager } from '@/lib/utils/logoIdManager'

/**
 * Development utilities for debugging and testing
 * These are only available in development mode
 */
export class DevelopmentUtilities {
  private static initialized = false;
  
  static initialize() {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
      return
    }
    
    // Only initialize once
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    
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
      
      // Check for template inconsistencies
      const templateIds = new Set(logoStore.logos.map(l => l.templateId));
      if (templateIds.size === 1 && logoStore.logos.length > 1) {
        console.warn('⚠️  WARNING: All logos have the same templateId:', Array.from(templateIds)[0]);
      }
      
      logoStore.logos.forEach((logo, index) => {
        console.log(`Logo ${index + 1}:`)
        console.log(`  ID: ${logo.id}`)
        console.log(`  Template: ${logo.templateId} (${logo.templateName})`)
        console.log(`  Position: (${logo.position.x}, ${logo.position.y})`)
        console.log(`  Has code: ${logo.code ? 'Yes' : 'No'}`)
        console.log(`  Code snippet: ${logo.code ? logo.code.substring(0, 50) + '...' : 'N/A'}`)
        console.log(`  Parameters:`, logo.parameters.custom)
        console.log('')
      })
      
      // Also expose the store for direct manipulation if needed
      (window as any).logoStore = logoStore;
      console.log('💡 Tip: Access the store directly with window.logoStore');
    }
  }
  
  private static registerBrandPresets() {
    // ReFlow brand utilities are registered in BrandPresets module
  }
  
  private static showStartupMessage() {
    setTimeout(() => {
      console.log('')
      console.log('     ╔═══════════════════════════════════════════╗')
      console.log('     ║                                           ║')
      console.log('     ║        🚀 REFLOW DEVELOPMENT MODE 🚀      ║')
      console.log('     ║                                           ║')
      console.log('     ╚═══════════════════════════════════════════╝')
      console.log('')
      console.log('          ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿')
      console.log('         ∿                                   ∿')
      console.log('        ∿  Welcome, Code Wizard! 🧙‍♂️         ∿')
      console.log('       ∿   Your magical toolkit awaits...    ∿')
      console.log('      ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿')
      console.log('')
      console.log('🐛 Debug Toolbar: Look for the bug icon button in the bottom-right corner!')
      console.log('   (It\'s not a bug, it\'s a feature inspector! 🔍✨)')
      console.log('')
      console.log('┌─────────────────────────────────────────────┐')
      console.log('│ 🎨 Canvas Refactoring:                      │')
      console.log('├─────────────────────────────────────────────┤')
      console.log('│ • /test-canvas    - Test new architecture  │')
      console.log('│ • /compare-canvas - Compare old vs new     │')
      console.log('└─────────────────────────────────────────────┘')
      console.log('')
      console.log('┌─────────────────────────────────────────────┐')
      console.log('│ 🎮 Console Commands:                        │')
      console.log('├─────────────────────────────────────────────┤')
      console.log('│ • window.initReflow()      - Create logo   │')
      console.log('│ • window.reflowColor(...)  - Apply color   │')
      console.log('│ • window.load4Logos()      - 4-logo grid   │')
      console.log('│ • window.listLogoIds()     - List IDs      │')
      console.log('│ • window.clearLogoIds()    - Clear IDs     │')
      console.log('│ • window.debugLogos()      - Debug state   │')
      console.log('└─────────────────────────────────────────────┘')
      console.log('')
      console.log('     💡 Pro tip: Try window.load4Logos()')
      console.log('        and watch the magic happen!')
      console.log('')
      console.log('  Happy coding! May your waves be smooth')
      console.log('     and your parameters be valid 🌊')
      console.log('')
      console.log('     ～～～～～～～～～～～～～～～～～')
    }, 1000)
  }
}