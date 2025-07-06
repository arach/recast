# ReFlow MCP Implementation Guide

## Quick Start

```bash
cd mcp-server
pnpm install
pnpm build
```

## Core Features to Implement

### 1. Canvas Route (`/canvas/[id]`)
Create a new page in the main app:

```typescript
// app/canvas/[id]/page.tsx
export default function CanvasPage({ params }: { params: { id: string } }) {
  // Load canvas data from API
  // Render logos in grid/freeform layout
  // Allow rearranging
}
```

### 2. Canvas API Routes
```typescript
// app/api/canvas/route.ts
- POST: Create canvas
- GET: List canvases

// app/api/canvas/[id]/route.ts  
- GET: Get canvas details
- PUT: Update canvas
- DELETE: Delete canvas

// app/api/canvas/[id]/logos/route.ts
- POST: Add logo to canvas
- PUT: Update logo position/metadata
```

### 3. Template Execution System
```typescript
// lib/template-executor.ts
export async function executeTemplate(
  code: string,
  parameters: Record<string, any>,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  // Create sandboxed environment
  // Inject safe utilities
  // Execute code with parameters
  // Handle errors gracefully
}
```

### 4. Storage Implementation
Replace in-memory storage with file-based:

```typescript
// lib/storage/canvas-storage.ts
export class CanvasStorage {
  async create(canvas: Canvas): Promise<void>
  async get(id: string): Promise<Canvas | null>
  async update(id: string, updates: Partial<Canvas>): Promise<void>
  async list(limit?: number): Promise<Canvas[]>
}
```

### 5. UI Components Needed

#### CanvasGrid Component
```typescript
// components/canvas/CanvasGrid.tsx
- Responsive grid layout
- Drag & drop support
- Logo hover states
- Quick actions menu
```

#### TemplateEditor Component
```typescript
// components/template/TemplateEditor.tsx
- Code editor (Monaco/CodeMirror)
- Live preview
- Parameter builder
- Error display
```

#### CanvasHeader Component
```typescript
// components/canvas/CanvasHeader.tsx
- Canvas name (editable)
- Share button → short URL
- Export options
- Layout toggle
```

## Database Schema (Future)

```sql
-- Templates
CREATE TABLE templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  code TEXT,
  parameters JSONB,
  builtin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by TEXT
);

-- Canvases
CREATE TABLE canvases (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  layout TEXT DEFAULT 'grid',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Logos
CREATE TABLE logos (
  id TEXT PRIMARY KEY,
  canvas_id TEXT REFERENCES canvases(id),
  template_id TEXT REFERENCES templates(id),
  parameters JSONB,
  position JSONB,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sessions
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  context TEXT,
  preferences JSONB,
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP
);
```

## Security Considerations

### Template Code Execution
1. Use VM2 or similar for sandboxing
2. Whitelist allowed APIs
3. Timeout protection
4. Memory limits

### Access Control
1. Canvas ownership
2. Public/private toggle
3. Share tokens for collaboration

## Testing Strategy

### MCP Server Tests
```bash
# Test tool listing
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/index-lite.js

# Test canvas creation
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"reflow_create_canvas","arguments":{"name":"Test Canvas"}}}' | node dist/index-lite.js
```

### Integration Tests
1. Create canvas via MCP
2. Add logos via MCP
3. Navigate to canvas URL
4. Verify rendering

## Performance Optimizations

1. **Logo Rendering Cache**
   - Cache rendered logos by template + params hash
   - Invalidate on template update

2. **Lazy Loading**
   - Load canvas logos progressively
   - Virtual scrolling for large canvases

3. **Optimistic Updates**
   - Update UI immediately
   - Sync to storage in background

## Deployment Considerations

1. **MCP Server**
   - Can run alongside main app
   - Or as separate microservice
   - Consider serverless for scalability

2. **Storage**
   - Start with SQLite for simplicity
   - Migrate to PostgreSQL for production
   - Consider S3 for template code storage

3. **CDN Strategy**
   - Cache rendered logo PNGs
   - Serve templates from edge
   - Invalidate on updates