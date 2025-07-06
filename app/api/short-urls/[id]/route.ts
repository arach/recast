import { NextRequest } from 'next/server';
import { createApiResponse, createApiError } from '../../_lib/response';
import { ErrorCode } from '../../_lib/types';
import { getURL, incrementClicks } from '@/lib/shorturl-simple';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/short-urls/:id
 * Get short URL details
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    
    const url = getURL(id);
    
    if (!url) {
      return createApiError(
        ErrorCode.NOT_FOUND,
        `Short URL '${id}' not found`
      );
    }
    
    return createApiResponse(url);
  } catch (error) {
    console.error('Failed to fetch short URL:', error);
    return createApiError(
      ErrorCode.INTERNAL_ERROR,
      'Failed to fetch short URL'
    );
  }
}

/**
 * GET /api/short-urls/:id/stats
 * Get click statistics for a short URL
 */
export async function getStats(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    
    const url = getURL(id);
    
    if (!url) {
      return createApiError(
        ErrorCode.NOT_FOUND,
        `Short URL '${id}' not found`
      );
    }
    
    return createApiResponse({
      id: url.id,
      clicks: url.clicks,
      created_at: url.created_at,
      last_clicked: url.last_clicked,
    });
  } catch (error) {
    console.error('Failed to fetch short URL stats:', error);
    return createApiError(
      ErrorCode.INTERNAL_ERROR,
      'Failed to fetch short URL stats'
    );
  }
}