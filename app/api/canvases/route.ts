import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createApiResponse, createApiError } from '../_lib/response';
import { ErrorCode } from '../_lib/types';
import { createCanvasSchema, paginationSchema } from '../_lib/validation';
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

/**
 * GET /api/canvases
 * List all canvases with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const pagination = paginationSchema.parse({
      page: searchParams.get('page') || undefined,
      perPage: searchParams.get('perPage') || undefined,
    });
    
    const filters = {
      search: searchParams.get('search') || undefined,
      layout: searchParams.get('layout') || undefined,
      isPublic: searchParams.get('isPublic') === 'true' ? true :
                searchParams.get('isPublic') === 'false' ? false : undefined,
      limit: pagination.perPage,
      offset: (pagination.page - 1) * pagination.perPage,
    };
    
    // Get canvases
    const canvases = await canvasRepository.findAllWithFilters(filters);
    const total = await canvasRepository.count();
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(total / pagination.perPage);
    
    return createApiResponse({
      items: canvases,
      pagination: {
        page: pagination.page,
        perPage: pagination.perPage,
        total,
        totalPages,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createApiError(
        ErrorCode.VALIDATION_ERROR,
        'Invalid query parameters',
        error.errors
      );
    }
    
    console.error('Failed to fetch canvases:', error);
    return createApiError(
      ErrorCode.INTERNAL_ERROR,
      'Failed to fetch canvases'
    );
  }
}

/**
 * POST /api/canvases
 * Create a new canvas
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validated = createCanvasSchema.parse(body);
    
    // Create canvas
    const canvas = await canvasService.createCanvas(validated);
    
    return createApiResponse(canvas, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createApiError(
        ErrorCode.VALIDATION_ERROR,
        'Invalid request body',
        error.errors
      );
    }
    
    console.error('Failed to create canvas:', error);
    return createApiError(
      ErrorCode.INTERNAL_ERROR,
      'Failed to create canvas'
    );
  }
}