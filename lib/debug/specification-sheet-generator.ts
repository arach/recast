/**
 * Visual Specification Sheet Generator
 * Creates comprehensive PNG images showing logo + all parameters
 * Like a design specification sheet in a single shareable image
 */

import { Logo } from '../types';

export interface SpecificationSheetOptions {
  width?: number;
  height?: number;
  logoSize?: number;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  terminalStyle?: boolean;
  includeMetadata?: boolean;
  showGrid?: boolean;
  sections?: {
    showMetadata?: boolean;
    showParameters?: boolean;
    showEnvironment?: boolean;
  };
  fontSize?: {
    header: number;
    section: number;
    parameter: number;
    value: number;
  };
}

export interface SpecSheetOptions {
  logoSize?: number;
  showGrid?: boolean;
  terminalStyle?: boolean;
  sections?: {
    showMetadata?: boolean;
    showParameters?: boolean;
    showEnvironment?: boolean;
  };
}

export interface GeneratedSheet {
  dataUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
}

const DEFAULT_OPTIONS: Required<SpecificationSheetOptions> = {
  width: 1200,
  height: 800,
  logoSize: 350,
  backgroundColor: '#0f0f23', // grab-app dark slate
  textColor: '#ffffff',
  accentColor: '#ffffff',
  terminalStyle: true,
  includeMetadata: true,
  fontSize: {
    header: 24,
    section: 18,
    parameter: 14,
    value: 12
  }
};

/**
 * Generate a visual specification sheet directly to a canvas
 */
export async function generateSpecificationSheet(
  logo: Logo,
  canvas: HTMLCanvasElement,
  options: SpecSheetOptions = {}
): Promise<void> {
  if (!canvas) {
    throw new Error('Canvas is required');
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Convert SpecSheetOptions to SpecificationSheetOptions
  const fullOptions: SpecificationSheetOptions = {
    width: canvas.width,
    height: canvas.height,
    logoSize: options.logoSize || 350,
    terminalStyle: options.terminalStyle ?? true,
    includeMetadata: options.sections?.showMetadata ?? true,
    showGrid: options.showGrid ?? true,
    sections: options.sections
  };

  // Setup fonts and styles
  ctx.textBaseline = 'top';
  
  // Draw background
  drawBackground(ctx, { ...DEFAULT_OPTIONS, ...fullOptions });
  
  // Capture logo image
  const logoImage = await captureLogoForSheet(logo);
  
  // Calculate layout
  const layout = calculateLayout({ ...DEFAULT_OPTIONS, ...fullOptions });
  
  // Draw logo section
  if (logoImage) {
    drawLogoSection(ctx, logoImage, layout, { ...DEFAULT_OPTIONS, ...fullOptions });
  } else {
    drawLogoPlaceholder(ctx, layout, { ...DEFAULT_OPTIONS, ...fullOptions });
  }
  
  // Draw information sections
  drawHeader(ctx, logo, layout, { ...DEFAULT_OPTIONS, ...fullOptions });
  
  if (fullOptions.sections?.showParameters !== false) {
    drawParametersSection(ctx, logo, layout, { ...DEFAULT_OPTIONS, ...fullOptions });
  }
  
  if (fullOptions.sections?.showMetadata !== false) {
    drawMetadataSection(ctx, logo, logo.id, layout, { ...DEFAULT_OPTIONS, ...fullOptions });
  }
  
  // Add terminal styling if enabled
  if (fullOptions.terminalStyle) {
    addTerminalStyling(ctx, { ...DEFAULT_OPTIONS, ...fullOptions }, logo);
  }
}

/**
 * Generate a visual specification sheet as PNG (legacy function)
 */
export async function generateSpecificationSheetLegacy(
  logo: Logo,
  logoId: string,
  canvasOffset?: { x: number; y: number },
  zoom?: number,
  options: SpecificationSheetOptions = {}
): Promise<GeneratedSheet | null> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  try {
    // Create main canvas
    const canvas = document.createElement('canvas');
    canvas.width = opts.width;
    canvas.height = opts.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Setup fonts and styles
    ctx.textBaseline = 'top';
    
    // Draw background
    drawBackground(ctx, opts);
    
    // Capture logo image
    const logoImage = await captureLogoForSheet(logo);
    
    // Calculate layout
    const layout = calculateLayout(opts);
    
    // Draw logo section
    if (logoImage) {
      drawLogoSection(ctx, logoImage, layout, opts);
    } else {
      drawLogoPlaceholder(ctx, layout, opts);
    }
    
    // Draw information sections
    drawHeader(ctx, logo, layout, opts);
    drawParametersSection(ctx, logo, layout, opts);
    drawMetadataSection(ctx, logo, logoId, layout, opts, canvasOffset, zoom);
    
    // Add terminal styling if enabled
    if (opts.terminalStyle) {
      addTerminalStyling(ctx, opts, logo);
    }
    
    // Generate result
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const base64Length = dataUrl.split(',')[1].length;
    const sizeBytes = Math.round(base64Length * 0.75);
    
    return {
      dataUrl,
      width: opts.width,
      height: opts.height,
      sizeBytes
    };
    
  } catch (error) {
    console.error('Failed to generate specification sheet:', error);
    return null;
  }
}

/**
 * Calculate layout dimensions and positions
 */
function calculateLayout(opts: Required<SpecificationSheetOptions>) {
  const padding = 40;
  const sectionGap = 30;
  const logoAreaWidth = opts.logoSize + (padding * 2);
  const infoAreaWidth = opts.width - logoAreaWidth - padding;
  
  return {
    padding,
    sectionGap,
    logo: {
      x: padding,
      y: padding,
      width: logoAreaWidth,
      height: opts.logoSize + (padding * 2)
    },
    info: {
      x: logoAreaWidth + padding,
      y: padding,
      width: infoAreaWidth,
      height: opts.height - (padding * 2)
    },
    logoImage: {
      x: padding + (logoAreaWidth - opts.logoSize) / 2,
      y: padding + 50, // Leave space for logo title
      size: opts.logoSize
    }
  };
}

/**
 * Draw background with gradient and grid (grab-app terminal style)
 */
function drawBackground(ctx: CanvasRenderingContext2D, opts: Required<SpecificationSheetOptions>) {
  // grab-app gradient background: from-slate-950 via-gray-950 to-black
  const gradient = ctx.createLinearGradient(0, 0, opts.width, opts.height);
  gradient.addColorStop(0, '#020617'); // slate-950
  gradient.addColorStop(0.5, '#030712'); // gray-950  
  gradient.addColorStop(1, '#000000'); // black
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, opts.width, opts.height);
  
  if (opts.showGrid && opts.terminalStyle) {
    // Add very subtle grid pattern (grab-app style)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 0.5;
    
    // Minimal grid - fewer lines, more subtle
    for (let x = 0; x < opts.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, opts.height);
      ctx.stroke();
    }
    
    for (let y = 0; y < opts.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(opts.width, y);
      ctx.stroke();
    }
  }
  
  if (opts.terminalStyle) {
    // Add terminal window decoration
    drawTerminalHeader(ctx, opts);
  }
}

/**
 * Draw terminal window header (grab-app style)
 */
function drawTerminalHeader(ctx: CanvasRenderingContext2D, opts: Required<SpecificationSheetOptions>) {
  const headerHeight = 35;
  
  // Header background - grab-app glass effect
  ctx.fillStyle = 'rgba(255, 255, 255, 0.005)';
  ctx.fillRect(0, 0, opts.width, headerHeight);
  
  // Header border (subtle)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, headerHeight);
  ctx.lineTo(opts.width, headerHeight);
  ctx.stroke();
  
  // Traffic lights (more subtle, grab-app style)
  const lightY = headerHeight / 2;
  const lightRadius = 5;
  const lightSpacing = 18;
  const startX = 18;
  
  // Red (more muted)
  ctx.fillStyle = 'rgba(255, 95, 87, 0.7)';
  ctx.beginPath();
  ctx.arc(startX, lightY, lightRadius, 0, Math.PI * 2);
  ctx.fill();
  
  // Yellow (more muted)
  ctx.fillStyle = 'rgba(255, 189, 46, 0.7)';
  ctx.beginPath();
  ctx.arc(startX + lightSpacing, lightY, lightRadius, 0, Math.PI * 2);
  ctx.fill();
  
  // Green (more muted)
  ctx.fillStyle = 'rgba(40, 202, 66, 0.7)';
  ctx.beginPath();
  ctx.arc(startX + lightSpacing * 2, lightY, lightRadius, 0, Math.PI * 2);
  ctx.fill();
  
  // Terminal title (grab-app typography)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = `11px 'SF Mono', 'Monaco', 'Cascadia Code', monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('reflow-specification-sheet.png', opts.width / 2, 13);
  ctx.textAlign = 'left';
}

/**
 * Capture or generate logo for specification sheet
 */
async function captureLogoForSheet(logo: Logo): Promise<HTMLImageElement | null> {
  return new Promise(async (resolve) => {
    // First try to find existing logo canvas
    const canvases = document.querySelectorAll('canvas');
    let logoCanvas: HTMLCanvasElement | null = null;

    for (const canvas of Array.from(canvases)) {
      if (canvas.width === 600 && canvas.height === 600) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;
          
          let hasContent = false;
          for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] > 0) {
              hasContent = true;
              break;
            }
          }
          
          if (hasContent) {
            logoCanvas = canvas;
            break;
          }
        }
      }
    }

    // If we found an existing canvas, use it
    if (logoCanvas) {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = logoCanvas.toDataURL();
      return;
    }

    // Otherwise, generate a temporary logo for the spec sheet
    try {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 600;
      tempCanvas.height = 600;
      const tempCtx = tempCanvas.getContext('2d');
      
      if (!tempCtx) {
        resolve(null);
        return;
      }

      // Just show a simple placeholder since this legacy system is being phased out
      tempCtx.fillStyle = '#f3f4f6';
      tempCtx.fillRect(0, 0, 600, 600);
      tempCtx.fillStyle = '#6b7280';
      tempCtx.font = '20px monospace';
      tempCtx.textAlign = 'center';
      tempCtx.fillText('Legacy spec sheet (deprecated)', 300, 300);

      // Convert to image
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = tempCanvas.toDataURL();
    } catch (error) {
      console.error('Failed to generate temporary logo:', error);
      resolve(null);
    }
  });
}

// DELETED: Terrible fake logo generation code

/**
 * Draw logo section (grab-app glass card style)
 */
function drawLogoSection(
  ctx: CanvasRenderingContext2D, 
  logoImage: HTMLImageElement, 
  layout: any, 
  opts: Required<SpecificationSheetOptions>
) {
  // Section background - grab-app glass effect
  ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
  ctx.fillRect(layout.logo.x, layout.logo.y, layout.logo.width, layout.logo.height);
  
  // Section border - grab-app subtle border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  ctx.strokeRect(layout.logo.x, layout.logo.y, layout.logo.width, layout.logo.height);
  
  // Section title - grab-app typography
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = `${opts.fontSize.section}px 'SF Mono', monospace`;
  ctx.fillText('🎨 logo preview', layout.logo.x + 20, layout.logo.y + 15);
  
  // Logo background (white)
  const logoBg = {
    x: layout.logoImage.x,
    y: layout.logoImage.y,
    size: layout.logoImage.size
  };
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(logoBg.x, logoBg.y, logoBg.size, logoBg.size);
  
  // Logo border - grab-app style
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  ctx.strokeRect(logoBg.x, logoBg.y, logoBg.size, logoBg.size);
  
  // Draw logo image
  ctx.drawImage(logoImage, logoBg.x, logoBg.y, logoBg.size, logoBg.size);
  
  // Logo dimensions label - grab-app muted text
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.font = `${opts.fontSize.value}px 'SF Mono', monospace`;
  ctx.textAlign = 'center';
  ctx.fillText(`${logoBg.size}×${logoBg.size}px`, logoBg.x + logoBg.size / 2, logoBg.y + logoBg.size + 10);
  ctx.textAlign = 'left';
}

/**
 * Draw logo placeholder if no image available (grab-app style)
 */
function drawLogoPlaceholder(
  ctx: CanvasRenderingContext2D,
  layout: any,
  opts: Required<SpecificationSheetOptions>
) {
  // Section background - grab-app glass effect
  ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
  ctx.fillRect(layout.logo.x, layout.logo.y, layout.logo.width, layout.logo.height);
  
  // Section border - grab-app subtle border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  ctx.strokeRect(layout.logo.x, layout.logo.y, layout.logo.width, layout.logo.height);
  
  // Section title - grab-app typography
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = `${opts.fontSize.section}px 'SF Mono', monospace`;
  ctx.fillText('🎨 logo preview', layout.logo.x + 20, layout.logo.y + 15);
  
  // Placeholder area
  const placeholderArea = {
    x: layout.logoImage.x,
    y: layout.logoImage.y,
    size: layout.logoImage.size
  };
  
  // Placeholder background - darker glass effect
  ctx.fillStyle = 'rgba(255, 255, 255, 0.005)';
  ctx.fillRect(placeholderArea.x, placeholderArea.y, placeholderArea.size, placeholderArea.size);
  
  // Placeholder border - grab-app dashed style
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.setLineDash([8, 8]);
  ctx.strokeRect(placeholderArea.x, placeholderArea.y, placeholderArea.size, placeholderArea.size);
  ctx.setLineDash([]);
  
  // Placeholder text - grab-app muted
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.font = `${opts.fontSize.parameter}px 'SF Mono', monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('logo not captured', placeholderArea.x + placeholderArea.size / 2, placeholderArea.y + placeholderArea.size / 2);
  ctx.textAlign = 'left';
}

/**
 * Draw header with logo info (grab-app style)
 */
function drawHeader(
  ctx: CanvasRenderingContext2D,
  logo: Logo,
  layout: any,
  opts: Required<SpecificationSheetOptions>
) {
  let currentY = layout.info.y;
  
  // Main title - grab-app header style
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = `${opts.fontSize.header}px 'SF Mono', monospace`;
  ctx.fillText('📋 logo specification', layout.info.x, currentY);
  currentY += opts.fontSize.header + 10;
  
  // Subtitle - grab-app muted text
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = `${opts.fontSize.parameter}px 'SF Mono', monospace`;
  ctx.fillText('complete parameter configuration and metadata', layout.info.x, currentY);
  currentY += opts.fontSize.parameter + 20;
  
  // Logo basic info section - grab-app accent
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = `${opts.fontSize.section}px 'SF Mono', monospace`;
  ctx.fillText('⚙️  configuration', layout.info.x, currentY);
  currentY += opts.fontSize.section + 15;
  
  // Basic logo info
  const basicInfo = [
    ['template id', logo.templateId || 'custom'],
    ['template name', logo.templateName || 'custom template'],
    ['logo id', logo.id],
    ['position', logo.position ? `(${logo.position.x}, ${logo.position.y})` : '(0, 0)']
  ];
  
  basicInfo.forEach(([key, value]) => {
    // Parameter name - grab-app primary text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = `${opts.fontSize.parameter}px 'SF Mono', monospace`;
    ctx.fillText(`${key}:`, layout.info.x + 20, currentY);
    
    // Parameter value - grab-app secondary text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = `${opts.fontSize.value}px 'SF Mono', monospace`;
    ctx.fillText(String(value), layout.info.x + 180, currentY);
    
    currentY += opts.fontSize.parameter + 8;
  });
}

/**
 * Draw parameters section (grab-app style)
 */
function drawParametersSection(
  ctx: CanvasRenderingContext2D,
  logo: Logo,
  layout: any,
  opts: Required<SpecificationSheetOptions>
) {
  let currentY = layout.info.y + 200; // Start after header
  
  // Parameters section title - grab-app style
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = `${opts.fontSize.section}px 'SF Mono', monospace`;
  ctx.fillText('🎛️  parameters', layout.info.x, currentY);
  currentY += opts.fontSize.section + 15;
  
  if (!logo.parameters || Object.keys(logo.parameters).length === 0) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = `${opts.fontSize.parameter}px 'SF Mono', monospace`;
    ctx.fillText('no parameters configured', layout.info.x + 20, currentY);
    return;
  }
  
  // Group parameters by category
  const paramGroups = groupParametersByCategory(logo.parameters);
  
  Object.entries(paramGroups).forEach(([category, params]) => {
    // Category header - grab-app accent style
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = `${opts.fontSize.parameter}px 'SF Mono', monospace`;
    ctx.fillText(`▶ ${category.toLowerCase()}`, layout.info.x + 20, currentY);
    currentY += opts.fontSize.parameter + 10;
    
    // Parameters in this category
    Object.entries(params).forEach(([key, value]) => {
      const displayValue = formatParameterValue(value);
      
      // Parameter name - grab-app primary text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = `${opts.fontSize.value}px 'SF Mono', monospace`;
      ctx.fillText(`  ${key}:`, layout.info.x + 40, currentY);
      
      // Parameter value - grab-app colored by type
      ctx.fillStyle = getGrabAppValueColor(value);
      ctx.font = `${opts.fontSize.value}px 'SF Mono', monospace`;
      const valueX = layout.info.x + 180;
      
      // Handle long values
      if (displayValue.length > 30) {
        const lines = wrapText(displayValue, 30);
        lines.forEach((line, index) => {
          ctx.fillText(line, valueX, currentY + (index * opts.fontSize.value));
        });
        currentY += lines.length * opts.fontSize.value + 5;
      } else {
        ctx.fillText(displayValue, valueX, currentY);
        currentY += opts.fontSize.value + 5;
      }
    });
    
    currentY += 10; // Space between categories
  });
}

/**
 * Draw metadata section (grab-app style)
 */
function drawMetadataSection(
  ctx: CanvasRenderingContext2D,
  logo: Logo,
  logoId: string,
  layout: any,
  opts: Required<SpecificationSheetOptions>,
  canvasOffset?: { x: number; y: number },
  zoom?: number
) {
  if (!opts.includeMetadata) return;
  
  let currentY = layout.info.y + layout.info.height - 150; // Start from bottom
  
  // Metadata section - grab-app style
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = `${opts.fontSize.section}px 'SF Mono', monospace`;
  ctx.fillText('📊 metadata', layout.info.x, currentY);
  currentY += opts.fontSize.section + 15;
  
  // Metadata info
  const metadata = [
    ['generated', new Date().toLocaleString()],
    ['environment', process.env.NODE_ENV || 'unknown'],
    ['canvas offset', canvasOffset ? `(${canvasOffset.x.toFixed(0)}, ${canvasOffset.y.toFixed(0)})` : 'unknown'],
    ['zoom level', zoom ? `${(zoom * 100).toFixed(0)}%` : 'unknown'],
    ['url', typeof window !== 'undefined' ? window.location.pathname : 'unknown']
  ];
  
  metadata.forEach(([key, value]) => {
    // Metadata key - grab-app muted text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = `${opts.fontSize.value}px 'SF Mono', monospace`;
    ctx.fillText(`${key}:`, layout.info.x + 20, currentY);
    
    // Metadata value - grab-app very muted
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillText(String(value), layout.info.x + 140, currentY);
    
    currentY += opts.fontSize.value + 6;
  });
}

/**
 * Add terminal styling elements (grab-app style)
 */
function addTerminalStyling(ctx: CanvasRenderingContext2D, opts: Required<SpecificationSheetOptions>, logo: Logo) {
  // Terminal prompt at bottom - grab-app glass effect
  const promptY = opts.height - 25;
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.005)';
  ctx.fillRect(0, promptY - 5, opts.width, 30);
  
  // Subtle border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, promptY - 5);
  ctx.lineTo(opts.width, promptY - 5);
  ctx.stroke();
  
  // Create realistic command with actual logo data
  const templateParam = logo.templateId ? `--template=${logo.templateId}` : '';
  const logoIdParam = logo.id ? `--logo-id=${logo.id}` : '--logo-id=main';
  const sizeParam = opts.logoSize ? `--size=${opts.logoSize}` : '';
  const formatParam = '--format=png';
  const outputParam = '--output=reflow-spec-sheet.png';
  
  // Build command with available parameters
  const command = `reflow@studio:~$ reflow generate ${templateParam} ${logoIdParam} ${formatParam} ${sizeParam} ${outputParam}`.replace(/\s+/g, ' ').trim();
  
  // Terminal prompt text - grab-app muted style
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = `12px 'SF Mono', monospace`;
  ctx.fillText(command, 10, promptY + 5);
  
  // Calculate cursor position based on command length
  const commandWidth = ctx.measureText(command).width;
  
  // Cursor - subtle blinking effect simulation
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillRect(commandWidth + 15, promptY + 8, 8, 2);
}

/**
 * Group parameters by category (heuristic based on parameter names)
 */
function groupParametersByCategory(parameters: Record<string, any>): Record<string, Record<string, any>> {
  const groups: Record<string, Record<string, any>> = {};
  
  Object.entries(parameters).forEach(([key, value]) => {
    let category = 'General';
    
    // Categorize by parameter name patterns
    if (key.includes('color') || key.includes('Color') || key.includes('fill') || key.includes('stroke')) {
      category = 'Colors';
    } else if (key.includes('size') || key.includes('width') || key.includes('height') || key.includes('scale')) {
      category = 'Dimensions';
    } else if (key.includes('speed') || key.includes('time') || key.includes('duration') || key.includes('animation')) {
      category = 'Animation';
    } else if (key.includes('frequency') || key.includes('amplitude') || key.includes('wave') || key.includes('noise')) {
      category = 'Wave Properties';
    } else if (key.includes('count') || key.includes('number') || key.includes('amount')) {
      category = 'Quantities';
    }
    
    if (!groups[category]) {
      groups[category] = {};
    }
    groups[category][key] = value;
  });
  
  return groups;
}

/**
 * Format parameter value for display
 */
function formatParameterValue(value: any): string {
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  if (typeof value === 'number') {
    return Number.isInteger(value) ? String(value) : value.toFixed(3);
  }
  if (typeof value === 'string') {
    return `"${value}"`;
  }
  if (Array.isArray(value)) {
    return `[${value.map(v => formatParameterValue(v)).join(', ')}]`;
  }
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value);
  }
  return String(value);
}

/**
 * Get color for parameter value based on type (grab-app style)
 */
function getGrabAppValueColor(value: any): string {
  if (typeof value === 'boolean') {
    return value ? 'rgba(126, 231, 135, 0.8)' : 'rgba(255, 123, 114, 0.8)'; // green/red
  }
  if (typeof value === 'number') {
    return 'rgba(210, 168, 255, 0.8)'; // purple
  }
  if (typeof value === 'string') {
    return 'rgba(165, 214, 255, 0.8)'; // blue
  }
  if (Array.isArray(value)) {
    return 'rgba(255, 166, 87, 0.8)'; // orange
  }
  return 'rgba(255, 255, 255, 0.5)'; // default
}

/**
 * Get color for parameter value based on type (legacy for compatibility)
 */
function getValueColor(value: any, opts: Required<SpecificationSheetOptions>): string {
  if (typeof value === 'boolean') {
    return value ? '#7ee787' : '#ff7b72';
  }
  if (typeof value === 'number') {
    return '#d2a8ff';
  }
  if (typeof value === 'string') {
    return '#a5d6ff';
  }
  if (Array.isArray(value)) {
    return '#ffa657';
  }
  return opts.textColor;
}

/**
 * Wrap text to multiple lines
 */
function wrapText(text: string, maxLength: number): string[] {
  if (text.length <= maxLength) return [text];
  
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  words.forEach(word => {
    if ((currentLine + word).length <= maxLength) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  });
  
  if (currentLine) lines.push(currentLine);
  return lines;
}

/**
 * Download specification sheet as PNG
 */
export async function downloadSpecificationSheet(
  logo: Logo,
  logoId: string,
  canvasOffset?: { x: number; y: number },
  zoom?: number,
  options: SpecificationSheetOptions = {}
): Promise<void> {
  const sheet = await generateSpecificationSheetLegacy(logo, logoId, canvasOffset, zoom, options);
  
  if (!sheet) {
    throw new Error('Failed to generate specification sheet');
  }
  
  // Create download
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `reflow-spec-sheet-${timestamp}.png`;
  
  const link = document.createElement('a');
  link.href = sheet.dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}