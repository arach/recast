/**
 * Diagnostic sharing utilities for ReFlow debug toolbar
 * Generates shareable diagnostic reports for development collaboration
 */

import { Logo, Parameters, Position } from '@/lib/types';

export interface DiagnosticReport {
  // Metadata
  timestamp: string;
  url: string;
  version: string;
  
  // Logo configuration
  selectedLogoId: string | null;
  selectedLogo: Logo | null;
  
  // Template information
  templateInfo: {
    id: string;
    name: string;
    code?: string;
  } | null;
  
  // Parameters (both style and template-specific)
  parameters: Parameters | null;
  
  // Canvas information
  canvasInfo: {
    position: Position;
    zoom: number;
    size: { width: number; height: number };
  };
  
  // Environment
  environment: {
    userAgent: string;
    viewport: { width: number; height: number };
    nodeEnv: string;
  };
  
  // Store states (minimal)
  stores: {
    logoCount: number;
    allLogoIds: string[];
    uiState: Record<string, any>;
  };
  
  // Image data (optional)
  image?: {
    dataUrl: string;
    format: 'png' | 'jpeg';
    width: number;
    height: number;
    sizeBytes: number;
    thumbnail?: string; // Smaller version for preview
  };
}

export interface DiagnosticImportData {
  templateId: string;
  templateName: string;
  parameters: Parameters;
  position?: Position;
}

/**
 * Generate a comprehensive diagnostic report
 */
export async function generateDiagnosticReport(
  selectedLogo: Logo | null,
  selectedLogoId: string | null,
  canvasOffset: { x: number; y: number } | null,
  zoom: number,
  logoStore: any,
  uiStore: any,
  includeImage: boolean = false,
  imageFormat: 'png' | 'jpeg' = 'png',
  imageQuality: number = 0.9
): Promise<DiagnosticReport> {
  // Calculate effective canvas size (estimate)
  const mockCanvasSize = { width: 1200, height: 800 };
  
  // Capture image if requested
  let imageData: DiagnosticReport['image'] | undefined;
  if (includeImage) {
    imageData = await captureLogoImage(selectedLogo, imageQuality, imageFormat, true);
  }
  
  return {
    // Metadata
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    version: '0.1.0', // TODO: Get from package.json
    
    // Logo configuration
    selectedLogoId,
    selectedLogo,
    
    // Template information
    templateInfo: selectedLogo ? {
      id: selectedLogo.templateId,
      name: selectedLogo.templateName,
      code: selectedLogo.code ? selectedLogo.code.substring(0, 500) + '...' : undefined // Truncate code
    } : null,
    
    // Parameters
    parameters: selectedLogo?.parameters || null,
    
    // Canvas information
    canvasInfo: {
      position: canvasOffset || { x: 0, y: 0 },
      zoom,
      size: mockCanvasSize
    },
    
    // Environment
    environment: {
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      viewport: typeof window !== 'undefined' ? {
        width: window.innerWidth,
        height: window.innerHeight
      } : { width: 0, height: 0 },
      nodeEnv: process.env.NODE_ENV || 'unknown'
    },
    
    // Store states (minimal)
    stores: {
      logoCount: logoStore?.logos?.length || 0,
      allLogoIds: logoStore?.logos?.map((l: Logo) => l.id) || [],
      uiState: {
        zoom: uiStore?.zoom,
        // Add other relevant UI state fields
      }
    },
    
    // Image data (if captured)
    image: imageData
  };
}

/**
 * Format diagnostic report for clipboard
 */
export function formatDiagnosticForClipboard(report: DiagnosticReport): string {
  return JSON.stringify(report, null, 2);
}

/**
 * Generate a compact diagnostic report for quick sharing
 */
export function generateCompactDiagnostic(
  selectedLogo: Logo | null,
  selectedLogoId: string | null
): string {
  if (!selectedLogo) {
    return JSON.stringify({
      selectedLogoId,
      selectedLogo: null,
      timestamp: new Date().toISOString(),
      message: 'No logo selected'
    }, null, 2);
  }
  
  return JSON.stringify({
    templateId: selectedLogo.templateId,
    templateName: selectedLogo.templateName,
    parameters: selectedLogo.parameters,
    position: selectedLogo.position,
    timestamp: new Date().toISOString(),
    logoId: selectedLogoId
  }, null, 2);
}

/**
 * Extract import data from diagnostic report
 */
export function extractImportData(diagnosticJson: string): DiagnosticImportData | null {
  try {
    const diagnostic = JSON.parse(diagnosticJson);
    
    // Check if it's a full diagnostic report
    if (diagnostic.selectedLogo) {
      return {
        templateId: diagnostic.selectedLogo.templateId,
        templateName: diagnostic.selectedLogo.templateName,
        parameters: diagnostic.selectedLogo.parameters,
        position: diagnostic.selectedLogo.position
      };
    }
    
    // Check if it's a compact diagnostic
    if (diagnostic.templateId && diagnostic.parameters) {
      return {
        templateId: diagnostic.templateId,
        templateName: diagnostic.templateName,
        parameters: diagnostic.parameters,
        position: diagnostic.position
      };
    }
    
    return null;
  } catch (error) {
    console.error('Failed to parse diagnostic JSON:', error);
    return null;
  }
}

/**
 * Apply diagnostic data to create/update a logo
 */
export function applyDiagnosticData(
  importData: DiagnosticImportData,
  logoStore: any
): string | null {
  try {
    // Add a new logo with the diagnostic parameters
    const logoId = logoStore.addLogo(importData.templateId);
    
    // Update the logo with the imported parameters
    logoStore.updateLogo(logoId, {
      templateName: importData.templateName,
      parameters: importData.parameters,
      position: importData.position || { x: 100, y: 100 }
    });
    
    // Select the newly created logo
    logoStore.selectLogo(logoId);
    
    return logoId;
  } catch (error) {
    console.error('Failed to apply diagnostic data:', error);
    return null;
  }
}

/**
 * Capture current logo canvas as image data
 */
export function captureLogoImage(
  selectedLogo: Logo | null,
  quality: number = 0.9,
  format: 'png' | 'jpeg' = 'png',
  generateThumbnail: boolean = true
): Promise<DiagnosticReport['image'] | null> {
  return new Promise((resolve) => {
    if (!selectedLogo || typeof window === 'undefined') {
      resolve(null);
      return;
    }

    try {
      // Find the canvas element for the selected logo
      // We'll search for canvas elements and try to identify the right one
      const canvases = document.querySelectorAll('canvas');
      let logoCanvas: HTMLCanvasElement | null = null;

      // Look for a canvas that seems to be rendering our logo
      // Since logos are 600x600, look for canvases with those dimensions
      for (const canvas of canvases) {
        if (canvas.width === 600 && canvas.height === 600) {
          // Check if this canvas has actual content (not blank)
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            
            // Check if canvas has non-transparent content
            let hasContent = false;
            for (let i = 3; i < pixels.length; i += 4) { // Check alpha channel
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

      if (!logoCanvas) {
        console.warn('Could not find logo canvas for image capture');
        resolve(null);
        return;
      }

      // Capture main image
      const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const dataUrl = logoCanvas.toDataURL(mimeType, quality);
      
      // Calculate size in bytes (rough estimate)
      const base64Length = dataUrl.split(',')[1].length;
      const sizeBytes = Math.round(base64Length * 0.75); // Base64 overhead factor

      const result: DiagnosticReport['image'] = {
        dataUrl,
        format,
        width: logoCanvas.width,
        height: logoCanvas.height,
        sizeBytes
      };

      // Generate thumbnail if requested
      if (generateThumbnail) {
        const thumbnailCanvas = document.createElement('canvas');
        const thumbnailSize = 150; // 150x150 thumbnail
        thumbnailCanvas.width = thumbnailSize;
        thumbnailCanvas.height = thumbnailSize;
        
        const thumbCtx = thumbnailCanvas.getContext('2d');
        if (thumbCtx) {
          // Clear with white background
          thumbCtx.fillStyle = '#ffffff';
          thumbCtx.fillRect(0, 0, thumbnailSize, thumbnailSize);
          
          // Draw scaled logo
          thumbCtx.drawImage(logoCanvas, 0, 0, thumbnailSize, thumbnailSize);
          
          // Generate thumbnail data URL (always use JPEG for smaller size)
          result.thumbnail = thumbnailCanvas.toDataURL('image/jpeg', 0.8);
        }
      }

      resolve(result);
    } catch (error) {
      console.error('Failed to capture logo image:', error);
      resolve(null);
    }
  });
}

/**
 * Find and capture the canvas for a specific logo
 */
export function findLogoCanvas(logoId: string): HTMLCanvasElement | null {
  // Look for canvas elements that might be associated with our logo
  const canvases = document.querySelectorAll('canvas');
  
  for (const canvas of canvases) {
    // Check if this canvas is 600x600 (logo size) and has content
    if (canvas.width === 600 && canvas.height === 600) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, 50, 50); // Sample top-left corner
        const pixels = imageData.data;
        
        // Check if canvas has non-transparent content
        for (let i = 3; i < pixels.length; i += 4) { // Check alpha channel
          if (pixels[i] > 0) {
            return canvas;
          }
        }
      }
    }
  }
  
  return null;
}

/**
 * Download diagnostic report as separate files (JSON + image)
 */
export async function downloadDiagnosticFiles(
  report: DiagnosticReport,
  includeImage: boolean = true
): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const baseName = `reflow-diagnostic-${timestamp}`;

  try {
    // Download JSON file
    const jsonBlob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json'
    });
    downloadBlob(jsonBlob, `${baseName}.json`);

    // Download image file if available and requested
    if (includeImage && report.image) {
      const imageBlob = dataURLToBlob(report.image.dataUrl);
      if (imageBlob) {
        const extension = report.image.format === 'jpeg' ? 'jpg' : 'png';
        downloadBlob(imageBlob, `${baseName}-logo.${extension}`);
      }
    }
  } catch (error) {
    console.error('Failed to download diagnostic files:', error);
  }
}

/**
 * Convert data URL to Blob
 */
function dataURLToBlob(dataURL: string): Blob | null {
  try {
    const parts = dataURL.split(',');
    const mimeType = parts[0].match(/:(.*?);/)?.[1] || '';
    const base64 = parts[1];
    
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return new Blob([bytes], { type: mimeType });
  } catch (error) {
    console.error('Failed to convert data URL to blob:', error);
    return null;
  }
}

/**
 * Download a blob as a file
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate ZIP file with both JSON and image
 */
export async function generateDiagnosticZip(
  report: DiagnosticReport
): Promise<Blob | null> {
  // Note: This would require a ZIP library like JSZip
  // For now, we'll use separate file downloads
  console.warn('ZIP generation not implemented yet - use downloadDiagnosticFiles instead');
  return null;
}

/**
 * Copy text to clipboard with fallback
 */
export async function copyDiagnosticToClipboard(text: string): Promise<boolean> {
  try {
    // Modern way
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return successful;
  } catch (error) {
    console.error('Failed to copy diagnostic to clipboard:', error);
    return false;
  }
}