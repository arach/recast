import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createApiResponse, createApiError } from '../_lib/response';
import { ErrorCode } from '../_lib/types';
import { templateFiltersSchema, createTemplateSchema } from '../_lib/validation';
import { FileStorage } from '@/lib/storage/file-storage';
import { TemplateRepository } from '@/lib/repositories/template-repository';
import path from 'path';

// Initialize storage and repository
const storage = new FileStorage(path.join(process.cwd(), 'data', 'api'));
const templateRepository = new TemplateRepository(storage);

/**
 * GET /api/v1/templates
 * List all templates with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse and validate query parameters
    const filters = templateFiltersSchema.parse({
      category: searchParams.get('category') || undefined,
      builtin: searchParams.get('builtin') || undefined,
      search: searchParams.get('search') || undefined,
      tags: searchParams.getAll('tags').length > 0 ? searchParams.getAll('tags') : undefined,
      page: searchParams.get('page') || undefined,
      perPage: searchParams.get('perPage') || undefined,
    });
    
    // Get templates with filters
    const templates = await templateRepository.findAllWithFilters(filters);
    const total = await templateRepository.countWithFilters(filters);
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(total / filters.perPage);
    
    return createApiResponse({
      items: templates,
      pagination: {
        page: filters.page,
        perPage: filters.perPage,
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
    
    console.error('Failed to fetch templates:', error);
    return createApiError(
      ErrorCode.INTERNAL_ERROR,
      'Failed to fetch templates'
    );
  }
}

/**
 * POST /api/v1/templates
 * Create a new custom template
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validated = createTemplateSchema.parse(body);
    
    // TODO: Validate template code execution
    // const validation = await validateTemplateCode(validated.code);
    // if (!validation.valid) {
    //   return createApiError(
    //     ErrorCode.VALIDATION_ERROR,
    //     'Invalid template code',
    //     validation.errors
    //   );
    // }
    
    // Create template
    const template = await templateRepository.create({
      ...validated,
      builtin: false,
      metadata: {
        author: 'user', // TODO: Get from auth
        version: '1.0.0',
        tags: validated.tags || [],
      },
    });
    
    return createApiResponse(template, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createApiError(
        ErrorCode.VALIDATION_ERROR,
        'Invalid request body',
        error.errors
      );
    }
    
    console.error('Failed to create template:', error);
    return createApiError(
      ErrorCode.INTERNAL_ERROR,
      'Failed to create template'
    );
  }
}