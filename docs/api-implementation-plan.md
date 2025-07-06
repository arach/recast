# ReFlow API Implementation Plan

## Overview

This document outlines the step-by-step implementation plan for the ReFlow API, ensuring a systematic and testable approach.

## Phase 1: Foundation (Week 1)

### 1.1 API Infrastructure Setup

#### Directory Structure
```
app/api/v1/
├── _lib/
│   ├── auth.ts           # Authentication middleware
│   ├── validation.ts     # Input validation helpers
│   ├── errors.ts         # Error handling utilities
│   ├── response.ts       # Standard response formatters
│   └── middleware.ts     # Common middleware
├── templates/
├── canvases/
├── logos/
├── short-urls/
└── sessions/
```

#### Core Utilities Implementation
```typescript
// app/api/v1/_lib/response.ts
export function apiResponse<T>(data: T, meta?: any): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      version: 'v1',
      requestId: generateRequestId(),
      ...meta
    }
  };
}

export function apiError(code: ErrorCode, message: string, details?: any): ApiResponse<never> {
  return {
    success: false,
    error: { code, message, details },
    meta: {
      timestamp: new Date().toISOString(),
      version: 'v1',
      requestId: generateRequestId()
    }
  };
}
```

### 1.2 Data Layer Setup

#### Storage Abstraction
```typescript
// lib/storage/base.ts
export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
  list<T>(prefix: string, options?: ListOptions): Promise<T[]>;
}

// lib/storage/file-storage.ts
export class FileStorage implements StorageAdapter {
  // File-based implementation
}

// lib/storage/memory-storage.ts
export class MemoryStorage implements StorageAdapter {
  // In-memory implementation for development
}
```

#### Repository Pattern
```typescript
// lib/repositories/template-repository.ts
export class TemplateRepository {
  constructor(private storage: StorageAdapter) {}
  
  async findAll(filters?: TemplateFilters): Promise<Template[]> {
    // Implementation
  }
  
  async findById(id: string): Promise<Template | null> {
    // Implementation
  }
  
  async create(template: CreateTemplateDto): Promise<Template> {
    // Implementation
  }
  
  async update(id: string, updates: UpdateTemplateDto): Promise<Template> {
    // Implementation
  }
  
  async delete(id: string): Promise<void> {
    // Implementation
  }
}
```

### 1.3 Validation Layer

#### Schema Definitions
```typescript
// lib/validation/schemas/template.ts
import { z } from 'zod';

export const createTemplateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  category: z.enum(['geometric', 'organic', 'typography', 'abstract', 'custom']),
  code: z.string(),
  parameters: z.record(z.object({
    type: z.enum(['number', 'string', 'boolean', 'color', 'select']),
    default: z.any(),
    required: z.boolean().optional(),
    range: z.tuple([z.number(), z.number(), z.number()]).optional(),
    options: z.array(z.string()).optional(),
    description: z.string().optional()
  })),
  tags: z.array(z.string()).optional()
});

export type CreateTemplateDto = z.infer<typeof createTemplateSchema>;
```

## Phase 2: Core APIs (Week 2)

### 2.1 Template API Implementation

#### GET /api/v1/templates
```typescript
// app/api/v1/templates/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const filters = {
    category: searchParams.get('category'),
    builtin: searchParams.get('builtin') === 'true',
    search: searchParams.get('search'),
    page: parseInt(searchParams.get('page') || '1'),
    perPage: parseInt(searchParams.get('perPage') || '20')
  };
  
  try {
    const templates = await templateRepository.findAll(filters);
    return NextResponse.json(apiResponse(templates));
  } catch (error) {
    return NextResponse.json(
      apiError(ErrorCode.INTERNAL_ERROR, 'Failed to fetch templates'),
      { status: 500 }
    );
  }
}
```

#### POST /api/v1/templates
```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createTemplateSchema.parse(body);
    
    // Validate template code
    const validation = await validateTemplateCode(validated.code);
    if (!validation.valid) {
      return NextResponse.json(
        apiError(ErrorCode.VALIDATION_ERROR, 'Invalid template code', validation.errors),
        { status: 400 }
      );
    }
    
    const template = await templateRepository.create(validated);
    return NextResponse.json(apiResponse(template), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        apiError(ErrorCode.VALIDATION_ERROR, 'Invalid request', error.errors),
        { status: 400 }
      );
    }
    throw error;
  }
}
```

### 2.2 Canvas API Implementation

#### Canvas Service Layer
```typescript
// lib/services/canvas-service.ts
export class CanvasService {
  constructor(
    private canvasRepo: CanvasRepository,
    private templateRepo: TemplateRepository
  ) {}
  
  async createCanvas(data: CreateCanvasDto): Promise<Canvas> {
    const canvas: Canvas = {
      id: `canvas-${nanoid(8)}`,
      name: data.name,
      description: data.description,
      layout: data.layout || 'grid',
      logos: [],
      settings: data.settings || {},
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString(),
        isPublic: false
      }
    };
    
    await this.canvasRepo.create(canvas);
    return canvas;
  }
  
  async addLogoToCanvas(canvasId: string, data: AddLogoDto): Promise<LogoInstance> {
    const canvas = await this.canvasRepo.findById(canvasId);
    if (!canvas) {
      throw new NotFoundError('Canvas not found');
    }
    
    const template = await this.templateRepo.findById(data.templateId);
    if (!template) {
      throw new NotFoundError('Template not found');
    }
    
    // Validate parameters against template schema
    const validatedParams = validateParameters(template.parameters, data.parameters);
    
    const logo: LogoInstance = {
      id: `logo-${nanoid(8)}`,
      templateId: data.templateId,
      parameters: validatedParams,
      position: data.position || { x: 0, y: 0 },
      size: { width: 180, height: 180 },
      metadata: data.metadata || {}
    };
    
    canvas.logos.push(logo);
    canvas.metadata.updatedAt = new Date().toISOString();
    
    await this.canvasRepo.update(canvasId, canvas);
    return logo;
  }
}
```

### 2.3 Logo Rendering API

#### Render Service
```typescript
// lib/services/render-service.ts
export class RenderService {
  async renderLogo(templateId: string, parameters: any): Promise<Buffer> {
    const template = await templateRepository.findById(templateId);
    if (!template) {
      throw new NotFoundError('Template not found');
    }
    
    // Create canvas
    const canvas = createCanvas(512, 512);
    const ctx = canvas.getContext('2d');
    
    // Execute template
    if (template.builtin) {
      await executeBuiltinTemplate(templateId, ctx, 512, 512, parameters);
    } else {
      await executeCustomTemplate(template.code!, ctx, 512, 512, parameters);
    }
    
    return canvas.toBuffer('png');
  }
  
  async renderCanvas(canvasId: string, options: RenderOptions): Promise<Buffer> {
    const canvas = await canvasRepository.findById(canvasId);
    if (!canvas) {
      throw new NotFoundError('Canvas not found');
    }
    
    // Calculate dimensions based on layout
    const dimensions = calculateCanvasDimensions(canvas, options);
    const outputCanvas = createCanvas(dimensions.width, dimensions.height);
    const ctx = outputCanvas.getContext('2d');
    
    // Render each logo
    for (const logo of canvas.logos) {
      const logoCanvas = await this.renderLogo(logo.templateId, logo.parameters);
      // Position and draw logo
      ctx.drawImage(logoCanvas, logo.position.x, logo.position.y);
    }
    
    return outputCanvas.toBuffer(options.format || 'png');
  }
}
```

## Phase 3: Advanced Features (Week 3)

### 3.1 Template Execution Sandbox

#### Secure Execution Environment
```typescript
// lib/sandbox/template-executor.ts
import { VM } from 'vm2';

export class TemplateExecutor {
  private vm: VM;
  
  constructor() {
    this.vm = new VM({
      timeout: 5000, // 5 second timeout
      sandbox: {
        console: {
          log: (...args: any[]) => {
            // Safe logging
          }
        },
        Math: Math,
        Date: Date,
        // Add other safe globals
      }
    });
  }
  
  async execute(code: string, ctx: any, width: number, height: number, params: any): Promise<void> {
    const wrappedCode = `
      (function(ctx, width, height, params) {
        ${code}
      })(ctx, width, height, params);
    `;
    
    try {
      await this.vm.run(wrappedCode);
    } catch (error) {
      throw new TemplateExecutionError('Template execution failed', error);
    }
  }
}
```

### 3.2 Export System

#### Export Service
```typescript
// lib/services/export-service.ts
export class ExportService {
  async exportCanvas(canvasId: string, format: ExportFormat, options: ExportOptions): Promise<ExportResult> {
    switch (format) {
      case 'json':
        return this.exportAsJson(canvasId);
      case 'zip':
        return this.exportAsZip(canvasId, options);
      case 'pdf':
        return this.exportAsPdf(canvasId, options);
      case 'png':
        return this.exportAsImage(canvasId, 'png', options);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }
  
  private async exportAsZip(canvasId: string, options: ExportOptions): Promise<ExportResult> {
    const canvas = await canvasRepository.findById(canvasId);
    if (!canvas) throw new NotFoundError('Canvas not found');
    
    const zip = new JSZip();
    
    // Add canvas metadata
    zip.file('canvas.json', JSON.stringify(canvas, null, 2));
    
    // Render and add each logo
    for (const logo of canvas.logos) {
      const buffer = await renderService.renderLogo(logo.templateId, logo.parameters);
      const filename = `${logo.metadata.name || logo.id}.png`;
      zip.file(`logos/${filename}`, buffer);
    }
    
    // Add README
    const readme = generateCanvasReadme(canvas);
    zip.file('README.md', readme);
    
    const buffer = await zip.generateAsync({ type: 'nodebuffer' });
    
    // Upload to temporary storage
    const url = await uploadToStorage(buffer, `exports/${canvasId}.zip`);
    
    return {
      downloadUrl: url,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };
  }
}
```

### 3.3 Session Management

#### Session Service
```typescript
// lib/services/session-service.ts
export class SessionService {
  async startSession(data: StartSessionDto): Promise<Session> {
    const session: Session = {
      id: `session-${nanoid(8)}`,
      context: data.context,
      preferences: data.preferences || {},
      canvases: [],
      history: [],
      metadata: {
        startedAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString()
      }
    };
    
    await sessionRepository.create(session);
    return session;
  }
  
  async getSuggestions(sessionId: string, canvasId: string): Promise<Suggestion[]> {
    const session = await sessionRepository.findById(sessionId);
    if (!session) throw new NotFoundError('Session not found');
    
    const canvas = await canvasRepository.findById(canvasId);
    if (!canvas) throw new NotFoundError('Canvas not found');
    
    // Analyze canvas and session context
    const analysis = await this.analyzeCanvas(canvas, session);
    
    // Generate suggestions based on analysis
    return this.generateSuggestions(analysis);
  }
  
  private async analyzeCanvas(canvas: Canvas, session: Session): Promise<CanvasAnalysis> {
    // Analyze template usage, color schemes, patterns
    // Consider session preferences and history
    return {
      templateDiversity: calculateTemplateDiversity(canvas),
      colorHarmony: analyzeColorHarmony(canvas),
      layoutBalance: analyzeLayoutBalance(canvas),
      sessionAlignment: calculateSessionAlignment(canvas, session)
    };
  }
}
```

## Phase 4: Testing & Documentation (Week 4)

### 4.1 API Testing Strategy

#### Unit Tests
```typescript
// __tests__/api/templates.test.ts
describe('Templates API', () => {
  it('should list templates with pagination', async () => {
    const response = await fetch('/api/v1/templates?page=1&perPage=10');
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(10);
    expect(data.pagination).toBeDefined();
  });
  
  it('should validate template code before creation', async () => {
    const invalidTemplate = {
      name: 'Test Template',
      code: 'invalid javascript code {',
      parameters: {}
    };
    
    const response = await fetch('/api/v1/templates', {
      method: 'POST',
      body: JSON.stringify(invalidTemplate)
    });
    
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error.code).toBe('VALIDATION_ERROR');
  });
});
```

#### Integration Tests
```typescript
// __tests__/integration/canvas-workflow.test.ts
describe('Canvas Workflow', () => {
  it('should create canvas, add logos, and export', async () => {
    // Create canvas
    const canvas = await createCanvas({ name: 'Test Canvas' });
    
    // Add logos
    const logo1 = await addLogoToCanvas(canvas.id, {
      templateId: 'wave-bars',
      parameters: { frequency: 2 }
    });
    
    const logo2 = await addLogoToCanvas(canvas.id, {
      templateId: 'letter-mark',
      parameters: { letter: 'R' }
    });
    
    // Export
    const exportResult = await exportCanvas(canvas.id, 'zip');
    
    expect(exportResult.downloadUrl).toBeDefined();
  });
});
```

### 4.2 API Documentation

#### OpenAPI Specification
```yaml
openapi: 3.0.0
info:
  title: ReFlow API
  version: 1.0.0
  description: Programmatic logo generation and design system API

paths:
  /api/v1/templates:
    get:
      summary: List templates
      parameters:
        - name: category
          in: query
          schema:
            type: string
            enum: [geometric, organic, typography, abstract, custom]
        - name: page
          in: query
          schema:
            type: integer
            default: 1
      responses:
        200:
          description: List of templates
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TemplateListResponse'
```

## Phase 5: Production Readiness

### 5.1 Performance Optimization
- Implement Redis caching for rendered logos
- Add database indexes for common queries
- Set up CDN for exported assets
- Implement request queuing for heavy operations

### 5.2 Monitoring & Analytics
- Set up APM (Application Performance Monitoring)
- Implement request logging
- Add metrics collection
- Create dashboards for API usage

### 5.3 Security Hardening
- Implement rate limiting per API key
- Add request signing for sensitive operations
- Set up WAF rules
- Regular security audits

## Timeline Summary

- **Week 1**: Foundation setup, core utilities, data layer
- **Week 2**: Template and Canvas APIs
- **Week 3**: Advanced features (sandbox, export, sessions)
- **Week 4**: Testing, documentation, optimization
- **Week 5**: Production deployment and monitoring

## Success Metrics

1. **API Response Time**: < 200ms for reads, < 500ms for writes
2. **Template Execution Time**: < 2s for complex templates
3. **Export Generation**: < 10s for large canvases
4. **Uptime**: 99.9% availability
5. **Error Rate**: < 0.1% of requests