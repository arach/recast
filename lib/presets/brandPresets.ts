import { LogoIdManager } from '@/lib/utils/logoIdManager'

export interface BrandPresetHandlers {
  updateCore: (params: any) => void
  updateCustom: (params: any) => void
  applyTemplate?: (templateId: string) => Promise<void>
  forceRender: () => void
}

export class BrandPresets {
  /**
   * Initialize Reflow brand identity utilities
   */
  static initializeReflowUtilities(handlers: BrandPresetHandlers) {
    if (typeof window === 'undefined') return
    
    // Initialize Reflow brand
    (window as any).initReflow = async () => {
      console.log('✨ Creating Reflow brand identity...')
      
      const templateId = 'wordmark'
      if (handlers.applyTemplate) {
        await handlers.applyTemplate(templateId)
      }
      
      const reflowParams = {
        text: 'reflow',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        fontSize: 48,
        fontWeight: 600,
        letterSpacing: -3,
        textTransform: 'lowercase',
        textAlign: 'left',
        frequency: 0,
        amplitude: 0,
        complexity: 0,
        chaos: 0,
        damping: 1,
        layers: 1,
        backgroundType: 'transparent',
        fillType: 'solid',
        fillColor: '#000000',
        fillOpacity: 1,
        strokeType: 'none',
        showFrame: false,
        framePadding: 0,
        seed: 'reflow-2024'
      }
      
      handlers.updateCore({
        frequency: reflowParams.frequency,
        amplitude: reflowParams.amplitude,
        complexity: reflowParams.complexity,
        chaos: reflowParams.chaos,
        damping: reflowParams.damping,
        layers: reflowParams.layers
      })
      
      handlers.updateCustom(reflowParams)
      handlers.forceRender()
      
      console.log('✨ Reflow wordmark created')
    }
    
    // Reflow color options
    (window as any).reflowColor = async (color: string) => {
      const colors: Record<string, any> = {
        black: {
          fillType: 'solid',
          fillColor: '#000000',
          backgroundType: 'transparent'
        },
        blue: {
          fillType: 'solid', 
          fillColor: '#0066FF',
          backgroundType: 'transparent'
        },
        gradient: {
          fillType: 'gradient',
          fillGradientStart: '#7c3aed',
          fillGradientEnd: '#06b6d4',
          fillGradientDirection: 135,
          backgroundType: 'transparent'
        }
      }
      
      const colorParams = colors[color]
      if (!colorParams) {
        console.error('Unknown color:', color)
        console.log('Available: black, blue, gradient')
        return
      }
      
      handlers.updateCustom(colorParams)
      handlers.forceRender()
      console.log(`✅ Applied ${color} color`)
    }
  }
  
  /**
   * Create 4-logo demonstration grid
   */
  static async create4LogoGrid(forceRender: () => void) {
    const { useLogoStore } = await import('@/lib/stores/logoStore')
    const logoStore = useLogoStore.getState()
    
    LogoIdManager.clearInstances()
    
    // Clear existing logos except first
    const currentLogos = [...logoStore.logos]
    
    if (currentLogos.length > 1) {
      currentLogos.slice(1).forEach(logo => {
        logoStore.deleteLogo(logo.id)
      })
    }
    
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Import templates
    const [wordmark, letterMark, waveBars, prismGoogle] = await Promise.all([
      import('@/templates/wordmark'),
      import('@/templates/letter-mark'),
      import('@/templates/wave-bars'),
      import('@/templates/prism-google')
    ])
    
    
    const positions = [
      { x: 0, y: 0 },
      { x: 700, y: 0 },
      { x: 0, y: 700 },
      { x: 700, y: 700 }
    ]
    
    // Create logos with their configurations
    const logoConfigs = [
      {
        template: wordmark,
        templateId: 'wordmark',
        position: positions[0],
        params: {
          text: 'reflow',
          fontFamily: 'Inter, -apple-system, sans-serif',
          fontSize: 56,
          fontWeight: 600,
          letterSpacing: -2,
          fillType: 'solid',
          fillColor: '#000000',
          strokeType: 'none',
          backgroundType: 'transparent',
          frequency: 0,
          amplitude: 0
        }
      },
      {
        template: letterMark,
        templateId: 'letter-mark',
        position: positions[1],
        params: {
          letter: 'R',
          fontFamily: 'Inter, -apple-system, sans-serif',
          fontSize: 120,
          fontWeight: 700,
          fillType: 'solid',
          fillColor: '#0066FF',
          strokeType: 'none',
          backgroundType: 'transparent'
        }
      },
      {
        template: waveBars,
        templateId: 'wave-bars',
        position: positions[2],
        params: {
          barCount: 7,
          barSpacing: 3,
          fillType: 'gradient',
          fillGradientStart: '#7c3aed',
          fillGradientEnd: '#06b6d4',
          fillGradientDirection: 45,
          strokeType: 'none',
          backgroundType: 'transparent'
        },
        coreParams: {
          frequency: 2,
          amplitude: 40,
          complexity: 0.2,
          chaos: 0
        }
      },
      {
        template: prismGoogle,
        templateId: 'prism-google',
        position: positions[3],
        params: {
          symmetry: 6,
          radius: 60,
          colorMode: 'monochrome',
          fillType: 'solid',
          fillColor: '#000000',
          strokeType: 'none',
          backgroundType: 'transparent',
          frequency: 0,
          amplitude: 0
        }
      }
    ]
    
    // Create the logos
    const logoIds: string[] = []
    
    for (let i = 0; i < logoConfigs.length; i++) {
      const config = logoConfigs[i]
      let logoId: string
      
      if (i === 0 && logoStore.logos.length > 0) {
        // Update existing first logo
        logoId = logoStore.logos[0].id
        logoStore.updateLogo(logoId, {
          templateId: config.templateId,
          templateName: config.template.name
        })
        logoStore.updateLogoPosition(logoId, config.position)
      } else {
        // Create new logo
        logoId = logoStore.addLogo(config.templateId)
        await new Promise(resolve => setTimeout(resolve, 50))
        
        // Immediately update with correct template info to ensure it sticks
        logoStore.updateLogo(logoId, {
          templateId: config.templateId,
          templateName: config.template.name
        })
        logoStore.updateLogoPosition(logoId, config.position)
      }
      
      // Update parameters
      logoStore.updateLogoParameters(logoId, {
        custom: config.params,
        ...(config.coreParams && { core: config.coreParams })
      })
      
      logoIds.push(logoId)
    }
    
    logoStore.selectLogo(logoIds[0])
    forceRender()
    
    const savedInstances = LogoIdManager.loadInstances()
    console.log('✅ Created 4 brand logos')
  }
}