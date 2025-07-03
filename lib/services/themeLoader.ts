import { ParameterService } from './parameterService'

export class ThemeLoader {
  // Text parameters that should be preserved when loading themes
  private static readonly TEXT_PARAMS = [
    'text', 'letter', 'letters', 'brandName', 
    'words', 'title', 'subtitle'
  ]
  
  /**
   * Load a theme template by ID
   */
  static async loadTheme(
    themeId: string,
    customDefaults?: Record<string, any>
  ): Promise<{
    code: string
    id: string
    name: string
    parameters: Record<string, any>
  }> {
    try {
      // Direct import of the template module
      const template = await import(`@/templates/${themeId}`)
      
      if (!template || !template.code) {
        throw new Error(`Theme not found: ${themeId}`)
      }
      
      // Parse parameter definitions from the template code
      const parsedParams = ParameterService.parseParametersFromCode(template.code) || {}
      
      // Build complete parameters from definitions
      const completeParams: Record<string, any> = {}
      Object.entries(parsedParams).forEach(([key, paramDef]) => {
        if (paramDef.default !== undefined) {
          completeParams[key] = paramDef.default
        }
      })
      
      // Merge with template defaults and custom defaults
      const mergedParams = {
        ...completeParams,
        ...template.defaultParams,
        ...customDefaults
      }
      
      return {
        code: template.code,
        id: template.id,
        name: template.name,
        parameters: mergedParams
      }
    } catch (error) {
      console.error('Failed to load theme:', error)
      throw error
    }
  }
  
  /**
   * Load theme while preserving text values
   */
  static async loadThemePreservingText(
    themeId: string,
    currentParams: Record<string, any> | undefined,
    customDefaults?: Record<string, any>
  ) {
    const theme = await this.loadTheme(themeId, customDefaults)
    
    // Preserve current text values
    const textValues: Record<string, any> = {}
    if (currentParams) {
      this.TEXT_PARAMS.forEach(param => {
        if (currentParams[param] !== undefined) {
          textValues[param] = currentParams[param]
        }
      })
    }
    
    return {
      ...theme,
      parameters: {
        ...theme.parameters,
        ...textValues
      }
    }
  }
  
  /**
   * Apply color theme without changing template
   */
  static filterColorParameters(params: Record<string, any>): Record<string, any> {
    const colorParams = [
      'fillColor', 'strokeColor', 'backgroundColor', 'textColor',
      'backgroundGradientStart', 'backgroundGradientEnd',
      'fillGradientStart', 'fillGradientEnd',
      'strokeGradientStart', 'strokeGradientEnd'
    ]
    
    return Object.entries(params).reduce((acc, [key, value]) => {
      if (colorParams.includes(key)) {
        acc[key] = value
      }
      return acc
    }, {} as Record<string, any>)
  }
  
  /**
   * Filter out text parameters from presets
   */
  static filterNonTextParameters(params: Record<string, any>): Record<string, any> {
    return Object.fromEntries(
      Object.entries(params).filter(([key]) => !this.TEXT_PARAMS.includes(key))
    )
  }
}