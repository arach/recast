import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';
import type { ApiResponse, ErrorCode } from './types';

/**
 * Creates a successful API response
 */
export function apiResponse<T>(data: T, meta?: any): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
      ...meta
    }
  };
}

/**
 * Creates an error API response
 */
export function apiError(code: ErrorCode, message: string, details?: any): ApiResponse<never> {
  return {
    success: false,
    error: { code, message, details },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: generateRequestId()
    }
  };
}

/**
 * Creates a NextResponse with proper status code
 */
export function createApiResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(apiResponse(data), { status });
}

/**
 * Creates an error NextResponse with proper status code
 */
export function createApiError(code: ErrorCode, message: string, details?: any): NextResponse {
  const status = getStatusFromErrorCode(code);
  return NextResponse.json(apiError(code, message, details), { status });
}

/**
 * Generates a unique request ID
 */
function generateRequestId(): string {
  return `req_${nanoid(12)}`;
}

/**
 * Maps error codes to HTTP status codes
 */
function getStatusFromErrorCode(code: ErrorCode): number {
  switch (code) {
    case 'INVALID_REQUEST':
      return 400;
    case 'UNAUTHORIZED':
      return 401;
    case 'FORBIDDEN':
      return 403;
    case 'NOT_FOUND':
      return 404;
    case 'CONFLICT':
      return 409;
    case 'VALIDATION_ERROR':
      return 422;
    case 'RATE_LIMITED':
      return 429;
    case 'INTERNAL_ERROR':
    case 'TEMPLATE_EXECUTION_ERROR':
    case 'STORAGE_ERROR':
      return 500;
    case 'SERVICE_UNAVAILABLE':
      return 503;
    default:
      return 500;
  }
}