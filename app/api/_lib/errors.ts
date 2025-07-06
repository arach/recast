import { ErrorCode } from './types';

/**
 * Base API Error class
 */
export class ApiError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Specific error classes for common scenarios
 */
export class ValidationError extends ApiError {
  constructor(message: string, details?: any) {
    super(ErrorCode.VALIDATION_ERROR, message, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(ErrorCode.NOT_FOUND, message);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(ErrorCode.UNAUTHORIZED, message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(ErrorCode.FORBIDDEN, message);
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends ApiError {
  constructor(message: string) {
    super(ErrorCode.CONFLICT, message);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends ApiError {
  constructor(message = 'Rate limit exceeded') {
    super(ErrorCode.RATE_LIMITED, message);
    this.name = 'RateLimitError';
  }
}

export class InternalError extends ApiError {
  constructor(message: string, details?: any) {
    super(ErrorCode.INTERNAL_ERROR, message, details);
    this.name = 'InternalError';
  }
}

export class TemplateExecutionError extends ApiError {
  constructor(message: string, details?: any) {
    super(ErrorCode.TEMPLATE_EXECUTION_ERROR, message, details);
    this.name = 'TemplateExecutionError';
  }
}

export class StorageError extends ApiError {
  constructor(message: string, details?: any) {
    super(ErrorCode.STORAGE_ERROR, message, details);
    this.name = 'StorageError';
  }
}