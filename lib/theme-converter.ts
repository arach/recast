/**
 * Converts new TypeScript template modules to the legacy code string format
 * This allows the new templates to work with the existing system
 */

import type { Template } from '@/templates/types';

/**
 * Convert a new template module to legacy code string format
 */
export function convertTemplateToLegacy(template: Template): string {
  // Convert parameters to the old PARAMETERS format
  const parametersCode = generateParametersCode(template.parameters);
  console.log('🔧 Generated parameters code length:', parametersCode.length);
  console.log('🔍 Generated parameters preview:', parametersCode.substring(0, 500) + '...');
  console.log('📄 Full parameters code:\n', parametersCode);
  
  // Convert the draw function to string
  const drawFunctionCode = template.draw.toString();
  
  // Extract the function body
  const bodyMatch = drawFunctionCode.match(/\{([\s\S]*)\}$/);
  const functionBody = bodyMatch ? bodyMatch[1] : '';
  
  // Inject universal controls functions
  const universalControlsCode = getUniversalControlsCode();
  
  // Create the legacy code format
  return `// ${template.metadata.name}
${parametersCode}

${universalControlsCode}

function drawVisualization(ctx, width, height, params, generator, time) {
  // Ensure color parameters are available at the root level
  if (params.customParameters) {
    params.fillColor = params.fillColor || params.customParameters.fillColor;
    params.strokeColor = params.strokeColor || params.customParameters.strokeColor;
    params.backgroundColor = params.backgroundColor || params.customParameters.backgroundColor;
    params.textColor = params.textColor || params.customParameters.textColor;
    
    // Also make sure all custom parameters are available at root level for convenience
    Object.keys(params.customParameters).forEach(key => {
      if (params[key] === undefined) {
        params[key] = params.customParameters[key];
      }
    });
  }
${functionBody}}`;
}

/**
 * Generate the PARAMETERS object code from parameter definitions
 */
function generateParametersCode(parameters: Template['parameters']): string {
  const lines = ['const PARAMETERS = {'];
  
  console.log('📦 Input parameters:', Object.keys(parameters));
  
  // First, add universal controls parameters
  const universalParams = getUniversalParameterDefinitions();
  console.log('🌐 Universal params:', Object.keys(universalParams));
  
  const universalEntries = Object.entries(universalParams);
  universalEntries.forEach(([key, param], index) => {
    let paramLine = `  ${key}: { `;
    
    paramLine += `type: '${param.type}'`;
    
    if (param.min !== undefined) paramLine += `, min: ${param.min}`;
    if (param.max !== undefined) paramLine += `, max: ${param.max}`;
    if (param.step !== undefined) paramLine += `, step: ${param.step}`;
    if (param.options) paramLine += `, options: ${JSON.stringify(param.options)}`;
    paramLine += `, default: ${JSON.stringify(param.default)}`;
    paramLine += `, label: '${param.label}'`;
    if (param.category) paramLine += `, category: '${param.category}'`;
    
    // Handle showIf function - convert to string that can be eval'd
    if (param.showIf && typeof param.showIf === 'function') {
      const funcStr = param.showIf.toString();
      paramLine += `, showIf: ${funcStr}`;
    }
    
    paramLine += ' },';
    
    lines.push(paramLine);
  });
  
  // Then add template-specific parameters
  const templateParamEntries = Object.entries(parameters).filter(([key]) => !getUniversalParameterDefinitions()[key]);
  console.log('🎯 Template-specific params:', templateParamEntries.map(([key]) => key));
  
  templateParamEntries.forEach(([key, param], index) => {
    let paramLine = `  ${key}: { `;
    
    paramLine += `type: '${param.type}'`;
    
    if (param.min !== undefined) paramLine += `, min: ${param.min}`;
    if (param.max !== undefined) paramLine += `, max: ${param.max}`;
    if (param.step !== undefined) paramLine += `, step: ${param.step}`;
    if (param.options) paramLine += `, options: ${JSON.stringify(param.options)}`;
    paramLine += `, default: ${JSON.stringify(param.default)}`;
    paramLine += `, label: '${param.label}'`;
    if (param.category) paramLine += `, category: '${param.category}'`;
    
    // Handle showIf function - convert to string that can be eval'd
    if (param.showIf && typeof param.showIf === 'function') {
      const funcStr = param.showIf.toString();
      paramLine += `, showIf: ${funcStr}`;
    }
    
    paramLine += ' }';
    
    // Add comma if not the last parameter
    if (index < templateParamEntries.length - 1) paramLine += ',';
    
    lines.push(paramLine);
  });
  
  lines.push('};');
  
  return lines.join('\n');
}

/**
 * Get the universal controls functions as code string
 */
function getUniversalControlsCode(): string {
  return `
// Universal Controls Functions (injected automatically)

// Helper to get color from params (checks both root and customParameters)
function getColor(params, colorName, defaultValue) {
  return params[colorName] || params.customParameters?.[colorName] || defaultValue;
}

function applyUniversalBackground(ctx, width, height, controls) {
  const backgroundColor = getColor(controls, 'backgroundColor', '#ffffff');
  const backgroundType = controls.backgroundType || 'solid';
  const backgroundGradientStart = controls.backgroundGradientStart || '#ffffff';
  const backgroundGradientEnd = controls.backgroundGradientEnd || '#f0f0f0';
  const backgroundGradientDirection = controls.backgroundGradientDirection || 0;

  ctx.save();

  switch (backgroundType) {
    case 'transparent':
      // Do nothing - leave transparent
      break;
      
    case 'solid':
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
      break;
      
    case 'gradient':
      const angle = (backgroundGradientDirection * Math.PI) / 180;
      const gradient = ctx.createLinearGradient(
        0, 0,
        Math.cos(angle) * width,
        Math.sin(angle) * height
      );
      gradient.addColorStop(0, backgroundGradientStart);
      gradient.addColorStop(1, backgroundGradientEnd);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      break;
  }

  ctx.restore();
}

function applyUniversalFill(ctx, bounds, controls) {
  const fillType = controls.fillType || 'solid';
  const fillColor = controls.fillColor || '#3b82f6';
  const fillGradientStart = controls.fillGradientStart || '#3b82f6';
  const fillGradientEnd = controls.fillGradientEnd || '#1d4ed8';
  const fillGradientDirection = controls.fillGradientDirection || 45;
  const fillOpacity = controls.fillOpacity !== undefined ? controls.fillOpacity : 1;

  if (fillType === 'none') return;

  ctx.save();
  ctx.globalAlpha = fillOpacity;

  switch (fillType) {
    case 'solid':
      ctx.fillStyle = fillColor;
      break;
      
    case 'gradient':
      const angle = (fillGradientDirection * Math.PI) / 180;
      const gradient = ctx.createLinearGradient(
        bounds.centerX - Math.cos(angle) * bounds.width / 2,
        bounds.centerY - Math.sin(angle) * bounds.height / 2,
        bounds.centerX + Math.cos(angle) * bounds.width / 2,
        bounds.centerY + Math.sin(angle) * bounds.height / 2
      );
      gradient.addColorStop(0, fillGradientStart);
      gradient.addColorStop(1, fillGradientEnd);
      ctx.fillStyle = gradient;
      break;
  }

  ctx.fill();
  ctx.restore();
}

function applyUniversalStroke(ctx, controls) {
  const strokeType = controls.strokeType || 'solid';
  const strokeColor = controls.strokeColor || '#1e40af';
  const strokeWidth = controls.strokeWidth !== undefined ? controls.strokeWidth : 2;
  const strokeOpacity = controls.strokeOpacity !== undefined ? controls.strokeOpacity : 1;

  if (strokeType === 'none') return;

  ctx.save();
  ctx.globalAlpha = strokeOpacity;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  switch (strokeType) {
    case 'solid':
      ctx.setLineDash([]);
      break;
    case 'dashed':
      ctx.setLineDash([strokeWidth * 3, strokeWidth * 2]);
      break;
    case 'dotted':
      ctx.setLineDash([strokeWidth, strokeWidth]);
      break;
  }

  ctx.stroke();
  ctx.restore();
}

function getBoundsFromPoints(points) {
  if (points.length === 0) {
    return { width: 0, height: 0, centerX: 0, centerY: 0, minX: 0, maxX: 0, minY: 0, maxY: 0 };
  }

  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2
  };
}
`;
}

/**
 * Get universal parameter definitions that are built-in for all templates
 */
function getUniversalParameterDefinitions() {
  return {
    // Background Section
    backgroundColor: {
      type: 'color',
      default: '#ffffff',
      label: 'Background Color',
      category: 'Background'
    },
    backgroundType: {
      type: 'select',
      options: [
        { value: 'transparent', label: 'Transparent' },
        { value: 'solid', label: 'Solid Color' },
        { value: 'gradient', label: 'Gradient' }
      ],
      default: 'transparent',
      label: 'Background Type',
      category: 'Background'
    },
    backgroundGradientStart: {
      type: 'color',
      default: '#ffffff',
      label: 'Gradient Start',
      category: 'Background',
      showIf: (params) => params.backgroundType === 'gradient'
    },
    backgroundGradientEnd: {
      type: 'color',
      default: '#f0f0f0',
      label: 'Gradient End',
      category: 'Background',
      showIf: (params) => params.backgroundType === 'gradient'
    },
    backgroundGradientDirection: {
      type: 'slider',
      min: 0,
      max: 360,
      step: 15,
      default: 0,
      label: 'Gradient Direction',
      category: 'Background',
      showIf: (params) => params.backgroundType === 'gradient'
    },
    
    // Fill Section
    fillType: {
      type: 'select',
      options: [
        { value: 'none', label: 'None' },
        { value: 'solid', label: 'Solid Color' },
        { value: 'gradient', label: 'Gradient' }
      ],
      default: 'solid',
      label: 'Fill Type',
      category: 'Fill'
    },
    fillColor: {
      type: 'color',
      default: '#3b82f6',
      label: 'Fill Color',
      category: 'Fill',
      showIf: (params) => params.fillType === 'solid'
    },
    fillGradientStart: {
      type: 'color',
      default: '#3b82f6',
      label: 'Gradient Start',
      category: 'Fill',
      showIf: (params) => params.fillType === 'gradient'
    },
    fillGradientEnd: {
      type: 'color',
      default: '#1d4ed8',
      label: 'Gradient End',
      category: 'Fill',
      showIf: (params) => params.fillType === 'gradient'
    },
    fillGradientDirection: {
      type: 'slider',
      min: 0,
      max: 360,
      step: 15,
      default: 45,
      label: 'Gradient Direction',
      category: 'Fill',
      showIf: (params) => params.fillType === 'gradient'
    },
    fillOpacity: {
      type: 'slider',
      min: 0,
      max: 1,
      step: 0.05,
      default: 1,
      label: 'Fill Opacity',
      category: 'Fill',
      showIf: (params) => params.fillType !== 'none'
    },
    
    // Stroke Section
    strokeType: {
      type: 'select',
      options: [
        { value: 'none', label: 'None' },
        { value: 'solid', label: 'Solid' },
        { value: 'dashed', label: 'Dashed' },
        { value: 'dotted', label: 'Dotted' }
      ],
      default: 'solid',
      label: 'Stroke Type',
      category: 'Stroke'
    },
    strokeColor: {
      type: 'color',
      default: '#1e40af',
      label: 'Stroke Color',
      category: 'Stroke',
      showIf: (params) => params.strokeType !== 'none'
    },
    strokeWidth: {
      type: 'slider',
      min: 0,
      max: 10,
      step: 0.5,
      default: 2,
      label: 'Stroke Width',
      category: 'Stroke',
      showIf: (params) => params.strokeType !== 'none'
    },
    strokeOpacity: {
      type: 'slider',
      min: 0,
      max: 1,
      step: 0.05,
      default: 1,
      label: 'Stroke Opacity',
      category: 'Stroke',
      showIf: (params) => params.strokeType !== 'none'
    }
  };
}

/**
 * Load and convert a template module to legacy format
 */
export async function loadThemeAsLegacy(themeName: string): Promise<{
  id: string;
  name: string;
  description: string;
  defaultParams: Record<string, any>;
  code: string;
}> {
  console.log('🔄 loadThemeAsLegacy called with themeName:', themeName);
  
  try {
    // Dynamic import of the template module
    console.log('📥 Attempting to import:', `@/templates/${themeName}`);
    const module = await import(`@/templates/${themeName}`);
  
    console.log('📦 Module imported successfully:', Object.keys(module));
    console.log('🔧 Module parameters:', module.parameters ? Object.keys(module.parameters) : 'MISSING');
    console.log('🎨 Module draw function:', typeof module.draw);
    console.log('📋 Module metadata:', module.metadata);
    
    // Additional debugging - check if the module structure matches what we expect
    console.log('🔍 Module structure validation:');
    console.log('  - typeof module.parameters:', typeof module.parameters);
    console.log('  - typeof module.draw:', typeof module.draw);
    console.log('  - typeof module.metadata:', typeof module.metadata);
    console.log('  - module.parameters is object:', typeof module.parameters === 'object' && module.parameters !== null);
    console.log('  - module.draw is function:', typeof module.draw === 'function');
    console.log('  - module.metadata is object:', typeof module.metadata === 'object' && module.metadata !== null);
    
    // Validate that all required properties exist
    if (!module.parameters || typeof module.parameters !== 'object') {
      throw new Error(`Module ${themeName} is missing or has invalid 'parameters' export`);
    }
    if (!module.draw || typeof module.draw !== 'function') {
      throw new Error(`Module ${themeName} is missing or has invalid 'draw' export`);
    }
    if (!module.metadata || typeof module.metadata !== 'object') {
      throw new Error(`Module ${themeName} is missing or has invalid 'metadata' export`);
    }

    const template: Template = {
      parameters: module.parameters,
      draw: module.draw,
      metadata: module.metadata
    };
    
    // Convert the template to viewable code
    console.log('🔄 Converting template to legacy format...');
    const code = convertTemplateToLegacy(template);
    console.log('✅ Converted code length:', code.length);
    
    const result = {
      id: themeName,
      name: template.metadata.name,
      description: template.metadata.description,
      defaultParams: template.metadata.defaultParams,
      code
    };
    
    console.log('🎯 Returning theme result:', {
      id: result.id,
      name: result.name,
      description: result.description,
      defaultParamsKeys: Object.keys(result.defaultParams || {}),
      codeLength: result.code.length
    });
    
    return result;
  } catch (error) {
    console.error('❌ Error in loadThemeAsLegacy:', error);
    console.error('❌ Theme name that failed:', themeName);
    throw error;
  }
}

/**
 * Get all available templates in legacy format
 */
export async function getAllTemplatesAsLegacy() {
  const templateNames = [
    // Accessible brand-focused templates (new)
    'letter-mark',
    'wordmark',
    'minimal-shape',
    
    // Original creative templates
    'wave-bars',
    'audio-bars', 
    'apex-vercel',
    'prism-google',
    'pulse-spotify',
    'spinning-triangles',
    'infinity-loops',
    'network-constellation',
    'brand-network',
    'luxury-brand',
    'premium-kinetic',
    'sophisticated-strokes',
    'border-effects',
    'nexus-ai-brand',
    'terra-eco-brand',
    'volt-electric-brand',
    'clean-triangle',
    'golden-circle',
    'smart-hexagon',
    'dynamic-diamond',
    'neon-glow',
    'minimal-line', 
    'hand-sketch',
    'liquid-flow',
    'crystal-lattice',
    'organic-bark',
    'architectural-grid',
    'quantum-field',
    'simple-prism'
  ];
  
  const templates = await Promise.all(
    templateNames.map(name => loadThemeAsLegacy(name))
  );
  
  return templates;
}

// Backward compatibility alias
export const loadTemplateAsLegacy = loadThemeAsLegacy;

// Debug function for testing specific themes
export async function debugLoadTheme(themeName: string) {
  console.log('🐛 DEBUG: Testing theme load for:', themeName);
  try {
    const result = await loadThemeAsLegacy(themeName);
    console.log('🐛 DEBUG: Theme loaded successfully:', result.name);
    return result;
  } catch (error) {
    console.error('🐛 DEBUG: Theme load failed:', error);
    throw error;
  }
}