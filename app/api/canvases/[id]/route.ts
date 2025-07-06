import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createApiResponse, createApiError } from '../../_lib/response';
import { ErrorCode } from '../../_lib/types';
import { updateCanvasSchema } from '../../_lib/validation';
import { FileStorage } from '@/lib/storage/file-storage';
import { CanvasRepository } from '@/lib/repositories/canvas-repository';
import { TemplateRepository } from '@/lib/repositories/template-repository';
import { CanvasService } from '@/lib/services/canvas-service';
import { NotFoundError } from '@/app/api/_lib/errors';
import path from 'path';

// Initialize dependencies
const storage = new FileStorage(path.join(process.cwd(), 'data', 'api'));
const canvasRepository = new CanvasRepository(storage);
const templateRepository = new TemplateRepository(storage);
const canvasService = new CanvasService(canvasRepository, templateRepository);

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/canvases/:id
 * Get a specific canvas by ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    
    const canvas = await canvasRepository.findById(id);
    
    if (!canvas) {
      return createApiError(
        ErrorCode.NOT_FOUND,
        `Canvas '${id}' not found`
      );
    }
    
    // Update last accessed time
    await canvasRepository.touchCanvas(id);
    
    return createApiResponse(canvas);
  } catch (error) {
    console.error('Failed to fetch canvas:', error);
    return createApiError(
      ErrorCode.INTERNAL_ERROR,
      'Failed to fetch canvas'
    );
  }
}

/**
 * PUT /api/canvases/:id
 * Update a canvas
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Check if canvas exists
    const existing = await canvasRepository.findById(id);
    if (!existing) {
      return createApiError(
        ErrorCode.NOT_FOUND,
        `Canvas '${id}' not found`
      );
    }
    
    // Validate request body
    const validated = updateCanvasSchema.parse(body);
    
    // Update canvas (preserve logos and other data)
    const updated = await canvasRepository.update(id, {
      ...validated,
      metadata: {
        ...existing.metadata,
        updatedAt: new Date().toISOString(),
      },
    });
    
    if (!updated) {
      return createApiError(
        ErrorCode.INTERNAL_ERROR,
        'Failed to update canvas'
      );
    }
    
    return createApiResponse(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createApiError(
        ErrorCode.VALIDATION_ERROR,
        'Invalid request body',
        error.errors
      );
    }
    
    console.error('Failed to update canvas:', error);
    return createApiError(
      ErrorCode.INTERNAL_ERROR,
      'Failed to update canvas'
    );
  }
}

/**
 * DELETE /api/canvases/:id
 * Delete a canvas
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    
    // Check if canvas exists
    const existing = await canvasRepository.findById(id);
    if (!existing) {
      return createApiError(
        ErrorCode.NOT_FOUND,
        `Canvas '${id}' not found`
      );
    }
    
    // Delete canvas
    const deleted = await canvasRepository.delete(id);
    
    if (!deleted) {
      return createApiError(
        ErrorCode.INTERNAL_ERROR,
        'Failed to delete canvas'
      );
    }
    
    return createApiResponse({ deleted: true });
  } catch (error) {
    console.error('Failed to delete canvas:', error);
    return createApiError(
      ErrorCode.INTERNAL_ERROR,
      'Failed to delete canvas'
    );
  }
}