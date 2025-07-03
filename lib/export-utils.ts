/**
 * Utility functions for exporting logos in various formats
 */

export async function exportCanvasAsPNG(
  canvas: HTMLCanvasElement,
  filename: string = 'logo.png',
  size?: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // If a specific size is requested, we need to scale
      if (size && (canvas.width !== size || canvas.height !== size)) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = size;
        tempCanvas.height = size;
        const ctx = tempCanvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Scale and center the content
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        const scale = Math.min(size / canvas.width, size / canvas.height);
        const x = (size - canvas.width * scale) / 2;
        const y = (size - canvas.height * scale) / 2;
        
        ctx.drawImage(canvas, x, y, canvas.width * scale, canvas.height * scale);
        
        // Export the scaled canvas
        tempCanvas.toBlob((blob) => {
          if (blob) {
            downloadBlob(blob, filename);
            resolve();
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, 'image/png');
      } else {
        // Export at original size
        canvas.toBlob((blob) => {
          if (blob) {
            downloadBlob(blob, filename);
            resolve();
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, 'image/png');
      }
    } catch (error) {
      reject(error);
    }
  });
}

export async function exportAllSizes(
  canvas: HTMLCanvasElement,
  baseFilename: string = 'logo'
): Promise<void> {
  const sizes = [16, 32, 64, 128, 256, 512, 1024];
  
  for (const size of sizes) {
    const filename = `${baseFilename}-${size}x${size}.png`;
    await exportCanvasAsPNG(canvas, filename, size);
    // Small delay between exports to avoid overwhelming the browser
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

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

export function getCanvasFromId(canvasId: string): HTMLCanvasElement | null {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
    console.error(`Canvas with id "${canvasId}" not found`);
    return null;
  }
  return canvas;
}