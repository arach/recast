import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createApiResponse, createApiError } from '../../_lib/response';
import { ErrorCode } from '../../_lib/types';
import { updateTemplateSchema } from '../../_lib/validation';
import { FileStorage } from '@/lib/storage/file-storage';
import { TemplateRepository } from '@/lib/repositories/template-repository';
import path from 'path';

// Initialize storage and repository
const storage = new FileStorage(path.join(process.cwd(), 'data', 'api'));
const templateRepository = new TemplateRepository(storage);

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/v1/templates/:id
 * Get a specific template by ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    
    const template = await templateRepository.findByIdWithBuiltin(id);
    
    if (!template) {
      return createApiError(
        ErrorCode.NOT_FOUND,
        `Template '${id}' not found`
      );
    }
    
    return createApiResponse(template);
  } catch (error) {
    console.error('Failed to fetch template:', error);
    return createApiError(
      ErrorCode.INTERNAL_ERROR,
      'Failed to fetch template'
    );
  }
}

/**
 * PUT /api/v1/templates/:id
 * Update a custom template
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Check if template exists and is not built-in
    const existing = await templateRepository.findByIdWithBuiltin(id);
    if (!existing) {
      return createApiError(
        ErrorCode.NOT_FOUND,
        `Template '${id}' not found`
      );
    }
    
    if (existing.builtin) {
      return createApiError(
        ErrorCode.FORBIDDEN,
        'Cannot modify built-in templates'
      );
    }
    
    // Validate request body
    const validated = updateTemplateSchema.parse(body);
    
    // TODO: Validate template code if provided
    // if (validated.code) {
    //   const validation = await validateTemplateCode(validated.code);
    //   if (!validation.valid) {
    //     return createApiError(
    //       ErrorCode.VALIDATION_ERROR,
    //       'Invalid template code',
    //       validation.errors
    //     );
    //   }
    // }
    
    // Update template
    const updated = await templateRepository.update(id, validated);
    
    if (!updated) {
      return createApiError(
        ErrorCode.INTERNAL_ERROR,
        'Failed to update template'
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
    
    console.error('Failed to update template:', error);
    return createApiError(
      ErrorCode.INTERNAL_ERROR,
      'Failed to update template'
    );
  }
}

/**
 * DELETE /api/v1/templates/:id
 * Delete a custom template
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    
    // Check if template exists and is not built-in
    const existing = await templateRepository.findByIdWithBuiltin(id);
    if (!existing) {
      return createApiError(
        ErrorCode.NOT_FOUND,
        `Template '${id}' not found`
      );
    }
    
    if (existing.builtin) {
      return createApiError(
        ErrorCode.FORBIDDEN,
        'Cannot delete built-in templates'
      );
    }
    
    // Delete template
    const deleted = await templateRepository.delete(id);
    
    if (!deleted) {
      return createApiError(
        ErrorCode.INTERNAL_ERROR,
        'Failed to delete template'
      );
    }
    
    return createApiResponse({ deleted: true });
  } catch (error) {
    console.error('Failed to delete template:', error);
    return createApiError(
      ErrorCode.INTERNAL_ERROR,
      'Failed to delete template'
    );
  }
}