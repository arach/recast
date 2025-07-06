import { z } from 'zod';

// Common validation schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});

export const idSchema = z.string().regex(/^[a-zA-Z0-9_-]+$/);

// Template schemas
export const parameterDefinitionSchema = z.object({
  type: z.enum(['number', 'string', 'boolean', 'color', 'select']),
  default: z.any(),
  required: z.boolean().optional(),
  range: z.tuple([z.number(), z.number(), z.number()]).optional(),
  options: z.array(z.string()).optional(),
  description: z.string().optional(),
});

export const createTemplateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  category: z.enum(['geometric', 'organic', 'typography', 'abstract', 'custom']),
  code: z.string(),
  parameters: z.record(parameterDefinitionSchema),
  tags: z.array(z.string()).optional(),
});

export const updateTemplateSchema = createTemplateSchema.partial();

export const templateFiltersSchema = z.object({
  category: z.enum(['geometric', 'organic', 'typography', 'abstract', 'custom']).optional(),
  builtin: z.coerce.boolean().optional(),
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
  ...paginationSchema.shape,
});

// Canvas schemas
export const createCanvasSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  layout: z.enum(['grid', 'freeform', 'row', 'column']).default('grid'),
  settings: z.object({
    gridSize: z.number().min(10).max(500).optional(),
    spacing: z.number().min(0).max(100).optional(),
    background: z.string().optional(),
  }).optional(),
});

export const updateCanvasSchema = createCanvasSchema.partial();

export const addLogoSchema = z.object({
  templateId: idSchema,
  parameters: z.record(z.any()),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }).optional(),
  metadata: z.object({
    name: z.string().optional(),
    notes: z.string().optional(),
    variant: z.string().optional(),
    order: z.number().optional(),
  }).optional(),
});

export const updateLogoSchema = z.object({
  parameters: z.record(z.any()).optional(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }).optional(),
  size: z.object({
    width: z.number().min(50).max(1000),
    height: z.number().min(50).max(1000),
  }).optional(),
  rotation: z.number().min(0).max(360).optional(),
  locked: z.boolean().optional(),
  metadata: z.object({
    name: z.string().optional(),
    notes: z.string().optional(),
    variant: z.string().optional(),
    order: z.number().optional(),
  }).optional(),
});

// Export schemas
export const exportCanvasSchema = z.object({
  format: z.enum(['json', 'zip', 'pdf', 'png']),
  options: z.object({
    scale: z.number().min(0.5).max(4).optional(),
    includeMetadata: z.boolean().optional(),
    separateFiles: z.boolean().optional(),
  }).optional(),
});

// Session schemas
export const startSessionSchema = z.object({
  context: z.string().min(1).max(500),
  preferences: z.object({
    style: z.string().optional(),
    colors: z.array(z.string()).optional(),
    avoid: z.array(z.string()).optional(),
    inspiration: z.array(z.string()).optional(),
  }).optional(),
});

export const updateSessionSchema = z.object({
  context: z.string().min(1).max(500).optional(),
  preferences: z.object({
    style: z.string().optional(),
    colors: z.array(z.string()).optional(),
    avoid: z.array(z.string()).optional(),
    inspiration: z.array(z.string()).optional(),
  }).optional(),
});

// Short URL schemas
export const createShortUrlSchema = z.object({
  url: z.string(),
  type: z.enum(['logo', 'canvas', 'template']),
  metadata: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }).optional(),
});

// Type exports
export type CreateTemplateDto = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateDto = z.infer<typeof updateTemplateSchema>;
export type TemplateFilters = z.infer<typeof templateFiltersSchema>;

export type CreateCanvasDto = z.infer<typeof createCanvasSchema>;
export type UpdateCanvasDto = z.infer<typeof updateCanvasSchema>;
export type AddLogoDto = z.infer<typeof addLogoSchema>;
export type UpdateLogoDto = z.infer<typeof updateLogoSchema>;

export type ExportCanvasDto = z.infer<typeof exportCanvasSchema>;
export type StartSessionDto = z.infer<typeof startSessionSchema>;
export type UpdateSessionDto = z.infer<typeof updateSessionSchema>;
export type CreateShortUrlDto = z.infer<typeof createShortUrlSchema>;