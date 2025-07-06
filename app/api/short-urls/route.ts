import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createApiResponse, createApiError } from '../_lib/response';
import { ErrorCode } from '../_lib/types';
import { createShortUrlSchema } from '../_lib/validation';
import { createShortURL } from '@/lib/shorturl-simple';

/**
 * POST /api/short-urls
 * Create a short URL
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validated = createShortUrlSchema.parse(body);
    
    // Extract base URL from request
    const baseUrl = new URL(request.url).origin;
    
    // Create short URL
    const shortId = createShortURL(
      validated.url,
      validated.type,
      validated.metadata
    );
    
    return createApiResponse({
      id: shortId,
      shortUrl: `${baseUrl}/s/${shortId}`,
      fullUrl: validated.url,
      type: validated.type,
      metadata: validated.metadata,
    }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createApiError(
        ErrorCode.VALIDATION_ERROR,
        'Invalid request body',
        error.errors
      );
    }
    
    console.error('Failed to create short URL:', error);
    return createApiError(
      ErrorCode.INTERNAL_ERROR,
      'Failed to create short URL'
    );
  }
}