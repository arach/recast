import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createApiResponse, createApiError } from '../../../_lib/response';
import { ErrorCode } from '../../../_lib/types';
import { addLogoSchema } from '../../../_lib/validation';
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
  params: Promise<{ id: string }>;
}

/**
 * POST /api/canvases/:id/logos
 * Add a logo to a canvas
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: canvasId } = await params;
    const body = await request.json();
    
    // Validate request body
    const validated = addLogoSchema.parse(body);
    
    // Add logo to canvas
    const logo = await canvasService.addLogoToCanvas(canvasId, validated);
    
    return createApiResponse(logo, 201);
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
    
    console.error('Failed to add logo to canvas:', error);
    return createApiError(
      ErrorCode.INTERNAL_ERROR,
      'Failed to add logo to canvas'
    );
  }
}