/**
 * Canvas API client functions
 */

import type { Canvas, LogoInstance } from '@/app/api/_lib/types';

const API_BASE = '/api';

export interface CreateCanvasData {
  name: string;
  description?: string;
  layout?: 'grid' | 'freeform' | 'row' | 'column';
}

export interface AddLogoData {
  templateId: string;
  parameters: Record<string, any>;
  position?: { x: number; y: number };
  metadata?: {
    name?: string;
    notes?: string;
  };
}

/**
 * Create a new canvas
 */
export async function createCanvas(data: CreateCanvasData): Promise<Canvas> {
  const response = await fetch(`${API_BASE}/canvases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create canvas');
  }
  
  const result = await response.json();
  return result.data;
}

/**
 * Get a canvas by ID
 */
export async function getCanvas(id: string): Promise<Canvas> {
  const response = await fetch(`${API_BASE}/canvases/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to load canvas');
  }
  
  const result = await response.json();
  return result.data;
}

/**
 * Update a canvas
 */
export async function updateCanvas(id: string, updates: Partial<Canvas>): Promise<Canvas> {
  const response = await fetch(`${API_BASE}/canvases/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update canvas');
  }
  
  const result = await response.json();
  return result.data;
}

/**
 * Add a logo to a canvas
 */
export async function addLogoToCanvas(canvasId: string, data: AddLogoData): Promise<LogoInstance> {
  const response = await fetch(`${API_BASE}/canvases/${canvasId}/logos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to add logo to canvas');
  }
  
  const result = await response.json();
  return result.data;
}

/**
 * Update a logo in a canvas
 */
export async function updateLogoInCanvas(
  canvasId: string,
  logoId: string,
  updates: Partial<LogoInstance>
): Promise<LogoInstance> {
  const response = await fetch(`${API_BASE}/canvases/${canvasId}/logos/${logoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update logo');
  }
  
  const result = await response.json();
  return result.data;
}

/**
 * Remove a logo from a canvas
 */
export async function removeLogoFromCanvas(canvasId: string, logoId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/canvases/${canvasId}/logos/${logoId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to remove logo');
  }
}

/**
 * Create a short URL for a canvas
 */
export async function createCanvasShortUrl(canvasId: string): Promise<string> {
  const response = await fetch(`${API_BASE}/short-urls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: `/canvas/${canvasId}`,
      type: 'canvas',
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create short URL');
  }
  
  const result = await response.json();
  return result.data.shortUrl;
}