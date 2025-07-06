import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createApiResponse, createApiError } from '../../../../_lib/response';
import { ErrorCode } from '../../../../_lib/types';
import { updateLogoSchema } from '../../../../_lib/validation';
import { FileStorage } from '@/lib/storage/file-storage';
import { CanvasRepository } from '@/lib/repositories/canvas-repository';
import { TemplateRepository } from '@/lib/repositories/template-repository';
import { CanvasService } from '@/lib/services/canvas-service';
import path from 'path';

// Initialize dependencies
const storage = new FileStorage(path.join(process.cwd(), 'data', 'api'));
const canvasRepository = new CanvasRepository(storage);
const templateRepository = new TemplateRepository(storage);
const canvasService = new CanvasService(canvasRepository, templateRepository);

interface RouteParams {
  params: Promise<{ id: string; logoId: string }>;
}

/**
 * PUT /api/canvases/:id/logos/:logoId
 * Update a logo in a canvas
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: canvasId, logoId } = await params;
    const body = await request.json();
    
    // Validate request body
    const validated = updateLogoSchema.parse(body);
    
    // Update logo
    const logo = await canvasService.updateLogoInCanvas(canvasId, logoId, validated);
    
    return createApiResponse(logo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createApiError(
        ErrorCode.VALIDATION_ERROR,
        'Invalid request body',
        error.errors
      );
    }
    
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return createApiError(
          ErrorCode.NOT_FOUND,
          error.message
        );
      }
      
      if (error.message.includes('Parameter')) {
        return createApiError(
          ErrorCode.VALIDATION_ERROR,
          error.message
        );
      }
    }
    
    console.error('Failed to update logo:', error);
    return createApiError(
      ErrorCode.INTERNAL_ERROR,
      'Failed to update logo'
    );
  }
}

/**
 * DELETE /api/canvases/:id/logos/:logoId
 * Remove a logo from a canvas
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: canvasId, logoId } = await params;
    
    // Remove logo
    await canvasService.removeLogoFromCanvas(canvasId, logoId);
    
    return createApiResponse({ deleted: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return createApiError(
        ErrorCode.NOT_FOUND,
        error.message
      );
    }
    
    console.error('Failed to remove logo:', error);
    return createApiError(
      ErrorCode.INTERNAL_ERROR,
      'Failed to remove logo'
    );
  }
}