import { NextRequest } from 'next/server';
import { createApiResponse, createApiError } from '../../../../../_lib/response';
import { ErrorCode } from '../../../../../_lib/types';
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
 * POST /api/canvases/:id/logos/:logoId/duplicate
 * Duplicate a logo within a canvas
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: canvasId, logoId } = await params;
    
    // Get optional parameter changes from body
    let parameterChanges = {};
    try {
      const body = await request.json();
      parameterChanges = body.parameterChanges || {};
    } catch {
      // Body is optional
    }
    
    // Duplicate logo
    const newLogo = await canvasService.duplicateLogo(canvasId, logoId, parameterChanges);
    
    return createApiResponse(newLogo, 201);
  } catch (error) {
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
    
    console.error('Failed to duplicate logo:', error);
    return createApiError(
      ErrorCode.INTERNAL_ERROR,
      'Failed to duplicate logo'
    );
  }
}