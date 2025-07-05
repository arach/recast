/**
 * Parameter loader for JavaScript templates
 * Fetches parameter schemas from JSON files
 */

import { loadJSTemplate } from './js-template-registry'

export interface JSParameterDefinition {
  type: 'slider' | 'color' | 'select' | 'text' | 'toggle' | 'number'
  label?: string
  default: any
  min?: number
  max?: number
  step?: number
  options?: Array<string | { value: string, label: string }>
  placeholder?: string
  when?: {
    parameter: string
    value: any
  }
}

export async function loadJSTemplateParameters(templateId: string): Promise<Record<string, JSParameterDefinition> | null> {
  try {
    // Get the template which includes merged parameters
    const template = await loadJSTemplate(templateId)
    
    if (!template || !template.parameters) {
      return null
    }
    
    // Filter out universal parameters - we only want template-specific ones
    const universalKeys = [
      'backgroundType', 'backgroundColor', 'backgroundOpacity', 'backgroundGradientStart', 'backgroundGradientEnd', 'backgroundGradientDirection',
      'fillType', 'fillColor', 'fillOpacity', 'fillGradientStart', 'fillGradientEnd', 'fillGradientDirection',
      'strokeType', 'strokeColor', 'strokeWidth', 'strokeOpacity', 'strokeDashSize', 'strokeGapSize'
    ]
    
    const templateSpecificParams: Record<string, JSParameterDefinition> = {}
    
    Object.entries(template.parameters).forEach(([key, param]: [string, any]) => {
      if (!universalKeys.includes(key)) {
        templateSpecificParams[key] = param as JSParameterDefinition
      }
    })
    
    return templateSpecificParams
  } catch (error) {
    console.error('Error loading JS template parameters:', error)
    return null
  }
}