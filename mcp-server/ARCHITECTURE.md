# ReFlow MCP Architecture

## Overview

The ReFlow MCP server provides programmatic access to ReFlow's logo generation system, enabling LLMs to:
- Create and manage custom templates
- Build canvases with multiple logo instances
- Generate shareable links for human review
- Facilitate AI-driven brand design workflows

## Core Concepts

### 1. **Templates**
Templates are the fundamental building blocks - code that generates visual designs.

**Types:**
- **Built-in Templates**: Pre-made templates (wave-bars, letter-mark, etc.)
- **Custom Templates**: LLM-generated code templates

**Structure:**
```typescript
interface Template {
  id: string;                    // Unique identifier
  name: string;                  // Human-readable name
  description: string;           // What it does
  builtin: boolean;             // Is it a system template?
  code: string | null;          // JavaScript code (null for built-ins)
  parameters: ParameterSchema;   // What parameters it accepts
  createdAt: Date;
  createdBy: string;            // "system" or user/session ID
}
```

### 2. **Logo Instances**
A specific configuration of a template with actual parameter values.

**Structure:**
```typescript
interface LogoInstance {
  id: string;                    // Unique identifier
  templateId: string;            // Which template
  parameters: Record<string, any>; // Actual values
  position?: { x: number; y: number }; // Position on canvas
  size?: { width: number; height: number };
  metadata?: {
    name?: string;              // "Primary Logo", "Icon Variant"
    notes?: string;             // AI or user notes
  };
}
```

### 3. **Canvases**
Collections of logo instances arranged for comparison and iteration.

**Structure:**
```typescript
interface Canvas {
  id: string;                    // Unique identifier
  name: string;                  // "Brand Exploration #1"
  description?: string;          // Purpose/context
  logos: LogoInstance[];         // Array of logo instances
  layout?: {
    type: 'grid' | 'freeform' | 'row' | 'column';
    spacing?: number;
  };
  createdAt: Date;
  updatedAt: Date;
  shortUrl?: string;            // For sharing
}
```

### 4. **Sessions**
Track AI ideation sessions for context and history.

**Structure:**
```typescript
interface Session {
  id: string;
  startedAt: Date;
  context?: string;              // "Creating tech startup brand"
  canvases: string[];           // Canvas IDs created
  templates: string[];          // Custom template IDs created
}
```

## Database Schema

For MVP, we'll use JSON file storage. For production, migrate to SQLite/PostgreSQL.

```
data/
├── templates/
│   ├── custom/
│   │   ├── template-abc123.json
│   │   └── template-def456.json
│   └── index.json              # Template registry
├── canvases/
│   ├── canvas-xyz789.json
│   └── canvas-uvw012.json
├── sessions/
│   └── session-current.json
└── urls.json                   # Short URL mappings
```

## MCP Tools

### Canvas Management

#### `reflow_create_canvas`
Create a new canvas for logo exploration.
```typescript
{
  name: string;
  description?: string;
  layout?: 'grid' | 'freeform' | 'row' | 'column';
}
→ { canvasId: string; shortUrl: string }
```

#### `reflow_add_to_canvas`
Add a logo instance to a canvas.
```typescript
{
  canvasId: string;
  templateId: string;
  parameters: Record<string, any>;
  position?: { x: number; y: number };
  metadata?: { name?: string; notes?: string };
}
→ { logoId: string; canvasUrl: string }
```

#### `reflow_get_canvas`
Retrieve canvas details.
```typescript
{
  canvasId: string;
}
→ Canvas
```

#### `reflow_list_canvases`
List recent canvases.
```typescript
{
  limit?: number;
  sessionId?: string;
}
→ Canvas[]
```

### Template Management

#### `reflow_create_template`
Create a custom template from code.
```typescript
{
  name: string;
  description: string;
  code: string;                 // JavaScript visualization function
  parameters: ParameterSchema;  // What params it accepts
}
→ { templateId: string; success: boolean }
```

#### `reflow_list_templates`
List available templates (built-in + custom).
```typescript
{
  includeBuiltin?: boolean;
  includeCustom?: boolean;
}
→ Template[]
```

#### `reflow_get_template`
Get template details including code.
```typescript
{
  templateId: string;
}
→ Template
```

### Quick Actions

#### `reflow_create_logo`
Shorthand for creating a logo and getting a URL.
```typescript
{
  template: string;
  parameters: Record<string, any>;
}
→ { shortUrl: string; logoId: string }
```

#### `reflow_duplicate_and_modify`
Copy a logo with parameter changes.
```typescript
{
  logoId: string;
  parameterChanges: Record<string, any>;
  addToCanvas?: string;
}
→ { newLogoId: string; url: string }
```

## Workflows

### 1. **Basic Logo Creation**
```
1. LLM calls reflow_create_logo with template + params
2. Gets back short URL
3. Human visits URL to see result
```

### 2. **Template Development**
```
1. LLM writes custom visualization code
2. Calls reflow_create_template
3. Tests with reflow_create_logo
4. Iterates based on feedback
```

### 3. **Brand Exploration**
```
1. Create canvas with reflow_create_canvas
2. Add multiple variations with reflow_add_to_canvas
3. Share canvas URL for human review
4. Iterate based on feedback
```

### 4. **A/B Testing Setup**
```
1. Create canvas named "Homepage A/B Test"
2. Add variant A and variant B
3. Export URLs for each variant
```

## Implementation Phases

### Phase 1: Core Canvas System (Current)
- [x] Basic MCP server setup
- [ ] Canvas CRUD operations
- [ ] Logo instance management
- [ ] File-based storage

### Phase 2: Custom Templates
- [ ] Template creation API
- [ ] Code validation/sandboxing
- [ ] Parameter schema validation
- [ ] Template versioning

### Phase 3: Enhanced Workflows
- [ ] Session management
- [ ] Canvas layouts (grid, comparison)
- [ ] Export options (ZIP of variations)
- [ ] Collaboration features

### Phase 4: Intelligence
- [ ] Template suggestions based on context
- [ ] Parameter optimization
- [ ] Style learning from preferences

## Security Considerations

1. **Code Sandboxing**: Custom template code runs in isolated context
2. **Parameter Validation**: Strict schema enforcement
3. **Rate Limiting**: Prevent abuse of generation
4. **Access Control**: Session-based permissions

## API Response Patterns

All tools return consistent response format:
```typescript
{
  success: boolean;
  data?: any;        // Tool-specific response
  error?: string;    // If success=false
  shortUrl?: string; // If applicable
}
```

## Future Enhancements

1. **Multi-brand Management**: Workspaces for different brands
2. **Version Control**: Git-like branching for design iterations
3. **AI Memory**: Remember preferences across sessions
4. **Export API**: Direct PNG/SVG generation
5. **Webhooks**: Notify on canvas updates