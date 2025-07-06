// API Response Types

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId: string;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

// Error Codes
export enum ErrorCode {
  // Client errors (4xx)
  INVALID_REQUEST = 'INVALID_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMITED = 'RATE_LIMITED',
  
  // Server errors (5xx)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TEMPLATE_EXECUTION_ERROR = 'TEMPLATE_EXECUTION_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
}

// Core Resource Types
export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'geometric' | 'organic' | 'typography' | 'abstract' | 'custom';
  builtin: boolean;
  code?: string;
  parameters: Record<string, ParameterDefinition>;
  metadata: {
    author?: string;
    version: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
  };
}

export interface ParameterDefinition {
  type: 'number' | 'string' | 'boolean' | 'color' | 'select';
  default: any;
  required?: boolean;
  range?: [number, number, number];
  options?: string[];
  description?: string;
}

export interface Canvas {
  id: string;
  name: string;
  description?: string;
  layout: 'grid' | 'freeform' | 'row' | 'column';
  logos: LogoInstance[];
  settings: {
    gridSize?: number;
    spacing?: number;
    background?: string;
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    lastAccessedAt: string;
    isPublic: boolean;
    shareToken?: string;
  };
}

export interface LogoInstance {
  id: string;
  templateId: string;
  parameters: Record<string, any>;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation?: number;
  locked?: boolean;
  metadata: {
    name?: string;
    notes?: string;
    variant?: string;
    order?: number;
  };
}

export interface Session {
  id: string;
  context: string;
  preferences: {
    style?: string;
    colors?: string[];
    avoid?: string[];
    inspiration?: string[];
  };
  canvases: string[];
  history: HistoryEntry[];
  metadata: {
    startedAt: string;
    lastActivityAt: string;
    endedAt?: string;
  };
}

export interface HistoryEntry {
  timestamp: string;
  action: string;
  resourceType: 'canvas' | 'logo' | 'template';
  resourceId: string;
  changes?: any;
}