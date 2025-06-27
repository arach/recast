/**
 * Converts new TypeScript preset modules to the legacy code string format
 * This allows the new presets to work with the existing system
 */

import type { Preset } from '@/presets/types';

/**
 * Convert a new preset module to legacy code string format
 */
export function convertPresetToLegacy(preset: Preset): string {
  // Convert parameters to the old PARAMETERS format
  const parametersCode = generateParametersCode(preset.parameters);
  
  // Convert the draw function to string
  const drawFunctionCode = preset.draw.toString();
  
  // Extract the function body
  const bodyMatch = drawFunctionCode.match(/\{([\s\S]*)\}$/);
  const functionBody = bodyMatch ? bodyMatch[1] : '';
  
  // Create the legacy code format
  return `// ${preset.metadata.name}
${parametersCode}

function drawVisualization(ctx, width, height, params, generator, time) {${functionBody}}`;
}

/**
 * Generate the PARAMETERS object code from parameter definitions
 */
function generateParametersCode(parameters: Preset['parameters']): string {
  const lines = ['const PARAMETERS = {'];
  
  Object.entries(parameters).forEach(([key, param], index, array) => {
    let paramLine = `  ${key}: { `;
    
    paramLine += `type: '${param.type}'`;
    
    if (param.min !== undefined) paramLine += `, min: ${param.min}`;
    if (param.max !== undefined) paramLine += `, max: ${param.max}`;
    if (param.step !== undefined) paramLine += `, step: ${param.step}`;
    if (param.options) paramLine += `, options: ${JSON.stringify(param.options)}`;
    paramLine += `, default: ${JSON.stringify(param.default)}`;
    paramLine += `, label: '${param.label}'`;
    
    paramLine += ' }';
    
    if (index < array.length - 1) paramLine += ',';
    
    lines.push(paramLine);
  });
  
  lines.push('};');
  
  return lines.join('\n');
}

/**
 * Load and convert a preset module to legacy format
 */
export async function loadPresetAsLegacy(presetName: string): Promise<{
  id: string;
  name: string;
  description: string;
  defaultParams: Record<string, any>;
  code: string;
}> {
  // Dynamic import of the preset module
  const module = await import(`@/presets/${presetName}`);
  
  const preset: Preset = {
    parameters: module.parameters,
    draw: module.draw,
    metadata: module.metadata
  };
  
  // Convert the preset to viewable code
  const code = convertPresetToLegacy(preset);
  
  return {
    id: presetName,
    name: preset.metadata.name,
    description: preset.metadata.description,
    defaultParams: preset.metadata.defaultParams,
    code
  };
}

/**
 * Get all available presets in legacy format
 */
export async function getAllPresetsAsLegacy() {
  const presetNames = [
    'wave-bars',
    'audio-bars', 
    'apex-vercel',
    'prism-google',
    'pulse-spotify'
  ];
  
  const presets = await Promise.all(
    presetNames.map(name => loadPresetAsLegacy(name))
  );
  
  return presets;
}