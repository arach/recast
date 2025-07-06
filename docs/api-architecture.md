# ReFlow API Architecture

## Overview

This document outlines the complete API architecture for ReFlow, designed to support both direct web usage and MCP (Model Context Protocol) integration. The API follows RESTful principles with a focus on clarity, consistency, and extensibility.

## Core Design Principles

1. **Resource-Oriented**: Each API endpoint represents a clear resource
2. **Stateless**: No server-side session state; use tokens/IDs for context
3. **Consistent**: Uniform response formats and error handling
4. **Versioned**: Future-proof with API versioning
5. **Validated**: Strong input validation and type safety
6. **Performant**: Efficient data fetching with pagination and filtering

## API Structure

```
/api/v1/
├── /templates/
│   ├── GET    /                    # List all templates
│   ├── POST   /                    # Create custom template
│   ├── GET    /:id                 # Get template details
│   ├── PUT    /:id                 # Update template
│   ├── DELETE /:id                 # Delete template
│   ├── POST   /:id/validate        # Validate template code
│   └── POST   /:id/preview         # Generate preview
│
├── /canvases/
│   ├── GET    /                    # List canvases
│   ├── POST   /                    # Create canvas
│   ├── GET    /:id                 # Get canvas details
│   ├── PUT    /:id                 # Update canvas metadata
│   ├── DELETE /:id                 # Delete canvas
│   ├── POST   /:id/logos           # Add logo to canvas
│   ├── PUT    /:id/logos/:logoId  # Update logo
│   ├── DELETE /:id/logos/:logoId  # Remove logo
│   ├── POST   /:id/export          # Export canvas
│   └── POST   /:id/duplicate       # Duplicate canvas
│
├── /logos/
│   ├── POST   /                    # Create standalone logo
│   ├── GET    /:id                 # Get logo details
│   ├── POST   /:id/render          # Render logo to image
│   └── POST   /:id/duplicate       # Duplicate with changes
│
├── /short-urls/
│   ├── POST   /                    # Create short URL
│   ├── GET    /:id                 # Get URL details
│   └── GET    /:id/stats           # Get click stats
│
└── /sessions/
    ├── POST   /                    # Start design session
    ├── GET    /current             # Get current session
    ├── PUT    /:id                 # Update session
    └── POST   /:id/suggestions     # Get AI suggestions
```

## Request/Response Formats

### Standard Response Format
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    version: string;
    requestId: string;
  };
}
```

### Pagination Format
```typescript
interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}
```

## Resource Schemas

### Template
```typescript
interface Template {
  id: string;
  name: string;
  description: string;
  category: 'geometric' | 'organic' | 'typography' | 'abstract' | 'custom';
  builtin: boolean;
  code?: string; // Only for custom templates
  parameters: Record<string, ParameterDefinition>;
  metadata: {
    author?: string;
    version: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
  };
}

interface ParameterDefinition {
  type: 'number' | 'string' | 'boolean' | 'color' | 'select';
  default: any;
  required?: boolean;
  range?: [number, number, number]; // [min, max, step]
  options?: string[]; // For select type
  description?: string;
}
```

### Canvas
```typescript
interface Canvas {
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

interface LogoInstance {
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
```

### Session
```typescript
interface Session {
  id: string;
  context: string;
  preferences: {
    style?: string;
    colors?: string[];
    avoid?: string[];
    inspiration?: string[];
  };
  canvases: string[]; // Canvas IDs
  history: HistoryEntry[];
  metadata: {
    startedAt: string;
    lastActivityAt: string;
    endedAt?: string;
  };
}

interface HistoryEntry {
  timestamp: string;
  action: string;
  resourceType: 'canvas' | 'logo' | 'template';
  resourceId: string;
  changes?: any;
}
```

## API Endpoints Detail

### Templates API

#### List Templates
```http
GET /api/v1/templates
Query Parameters:
  - category?: string
  - builtin?: boolean
  - search?: string
  - page?: number
  - perPage?: number
  - sort?: 'name' | 'created' | 'updated'
  - order?: 'asc' | 'desc'
```

#### Create Custom Template
```http
POST /api/v1/templates
Body: {
  name: string;
  description: string;
  category: string;
  code: string;
  parameters: Record<string, ParameterDefinition>;
  tags?: string[];
}
```

#### Validate Template Code
```http
POST /api/v1/templates/:id/validate
Body: {
  code: string;
  testParameters?: Record<string, any>;
}
Response: {
  valid: boolean;
  errors?: Array<{line: number; message: string}>;
  warnings?: Array<{line: number; message: string}>;
}
```

### Canvas API

#### Create Canvas
```http
POST /api/v1/canvases
Body: {
  name: string;
  description?: string;
  layout?: 'grid' | 'freeform';
  settings?: {
    gridSize?: number;
    spacing?: number;
  };
}
```

#### Add Logo to Canvas
```http
POST /api/v1/canvases/:id/logos
Body: {
  templateId: string;
  parameters: Record<string, any>;
  position?: { x: number; y: number };
  metadata?: {
    name?: string;
    notes?: string;
  };
}
```

#### Export Canvas
```http
POST /api/v1/canvases/:id/export
Body: {
  format: 'json' | 'zip' | 'pdf' | 'png';
  options?: {
    scale?: number;
    includeMetadata?: boolean;
    separateFiles?: boolean;
  };
}
Response: {
  downloadUrl: string;
  expiresAt: string;
}
```

### Short URLs API

#### Create Short URL
```http
POST /api/v1/short-urls
Body: {
  url: string;
  type: 'logo' | 'canvas' | 'template';
  metadata?: {
    title?: string;
    description?: string;
  };
}
Response: {
  id: string;
  shortUrl: string;
  fullUrl: string;
}
```

## Error Handling

### Error Codes
```typescript
enum ErrorCode {
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
```

### Error Response Example
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid template parameters",
    "details": {
      "fields": {
        "frequency": "Value must be between 0.1 and 10"
      }
    }
  },
  "meta": {
    "timestamp": "2024-01-06T12:00:00Z",
    "requestId": "req_abc123"
  }
}
```

## Authentication & Authorization

### API Key Authentication
```http
Authorization: Bearer <api-key>
```

### Permissions Model
```typescript
interface ApiKey {
  key: string;
  name: string;
  permissions: Permission[];
  rateLimit: {
    requests: number;
    window: 'minute' | 'hour' | 'day';
  };
}

enum Permission {
  // Templates
  TEMPLATES_READ = 'templates:read',
  TEMPLATES_WRITE = 'templates:write',
  TEMPLATES_DELETE = 'templates:delete',
  
  // Canvases
  CANVASES_READ = 'canvases:read',
  CANVASES_WRITE = 'canvases:write',
  CANVASES_DELETE = 'canvases:delete',
  
  // Admin
  ADMIN_ALL = 'admin:*',
}
```

## Rate Limiting

### Default Limits
- Anonymous: 60 requests/hour
- Authenticated: 600 requests/hour
- Enterprise: Custom limits

### Rate Limit Headers
```http
X-RateLimit-Limit: 600
X-RateLimit-Remaining: 599
X-RateLimit-Reset: 1704547200
```

## Webhooks

### Webhook Events
```typescript
interface WebhookEvent {
  id: string;
  type: 'canvas.created' | 'canvas.updated' | 'template.created' | 'logo.rendered';
  data: any;
  timestamp: string;
}
```

### Webhook Configuration
```http
POST /api/v1/webhooks
Body: {
  url: string;
  events: string[];
  secret: string;
}
```

## Migration Strategy

### Phase 1: Core APIs
1. Implement template listing and retrieval
2. Basic canvas CRUD operations
3. Short URL creation

### Phase 2: Advanced Features
1. Template validation and preview
2. Canvas export functionality
3. Session management

### Phase 3: Optimization
1. Caching layer
2. CDN integration
3. WebSocket support for real-time updates

## Security Considerations

1. **Input Validation**: Strict validation on all inputs
2. **Template Sandboxing**: Execute custom code in isolated environment
3. **Rate Limiting**: Prevent abuse and ensure fair usage
4. **CORS**: Configurable CORS policies
5. **Content Security**: Validate uploaded content
6. **Audit Logging**: Track all API actions

## Performance Optimizations

1. **Response Caching**: Cache template renders and canvas exports
2. **Database Indexing**: Optimize queries with proper indexes
3. **Lazy Loading**: Load logos progressively for large canvases
4. **CDN**: Serve rendered images from edge locations
5. **Connection Pooling**: Efficient database connections

## Next Steps

1. Implement core API routes in Next.js
2. Add comprehensive input validation
3. Create API client SDK
4. Write API documentation with examples
5. Set up monitoring and analytics