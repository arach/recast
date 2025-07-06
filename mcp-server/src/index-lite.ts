#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { nanoid } from 'nanoid';

// Server metadata
const SERVER_NAME = 'reflow-mcp';
const SERVER_VERSION = '0.1.0';

// Temporary in-memory storage (in production, use a database)
const storage = {
  templates: new Map<string, any>(),
  canvases: new Map<string, any>(),
  shortUrls: new Map<string, any>(),
  sessions: new Map<string, any>(),
  currentSession: null as string | null,
};

// Initialize with built-in templates
storage.templates.set('wave-bars', {
  id: 'wave-bars',
  name: 'Wave Bars',
  description: 'Dynamic wave visualization',
  builtin: true,
  code: null,
  parameters: {
    barCount: { default: 60, range: [10, 100, 1] },
    frequency: { default: 3.5, range: [0.1, 10, 0.1] },
    amplitude: { default: 40, range: [0, 100, 1] },
    colorMode: { default: 'spectrum', options: ['spectrum', 'mono', 'gradient'] }
  }
});

storage.templates.set('letter-mark', {
  id: 'letter-mark',
  name: 'Letter Mark',
  description: 'Single letter logo',
  builtin: true,
  code: null,
  parameters: {
    letter: { default: 'A', type: 'string' },
    fontSize: { default: 120, range: [20, 200, 1] },
    fillType: { default: 'solid', options: ['solid', 'gradient'] }
  }
});

storage.templates.set('wordmark', {
  id: 'wordmark',
  name: 'Wordmark',
  description: 'Text-based logo',
  builtin: true,
  code: null,
  parameters: {
    text: { default: 'reflow', type: 'string' },
    fontSize: { default: 48, range: [12, 120, 1] },
    fontWeight: { default: 700, range: [100, 900, 100] }
  }
});

const getAllJSTemplates = async () => {
  return Array.from(storage.templates.values());
};

const createShortURL = (fullUrl: string, template: string, params: any) => {
  const id = nanoid(6);
  storage.shortUrls.set(id, { fullUrl, template, params });
  return id;
};

// Tool definitions
const TOOLS: Tool[] = [
  // Canvas Management
  {
    name: 'reflow_create_canvas',
    description: 'Create a new canvas for logo exploration',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Canvas name (e.g., "Brand Exploration #1")',
        },
        description: {
          type: 'string',
          description: 'Purpose or context for this canvas',
        },
        layout: {
          type: 'string',
          enum: ['grid', 'freeform', 'row', 'column'],
          description: 'How logos should be arranged',
          default: 'grid',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'reflow_add_to_canvas',
    description: 'Add a logo instance to a canvas',
    inputSchema: {
      type: 'object',
      properties: {
        canvasId: {
          type: 'string',
          description: 'Canvas ID to add to',
        },
        templateId: {
          type: 'string',
          description: 'Template to use',
        },
        parameters: {
          type: 'object',
          description: 'Logo parameters',
          additionalProperties: true,
        },
        position: {
          type: 'object',
          properties: {
            x: { type: 'number' },
            y: { type: 'number' },
          },
          description: 'Position on canvas (for freeform layout)',
        },
        metadata: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Name for this logo variant' },
            notes: { type: 'string', description: 'Notes about this design' },
          },
        },
      },
      required: ['canvasId', 'templateId', 'parameters'],
    },
  },
  {
    name: 'reflow_get_canvas',
    description: 'Get canvas details including all logos',
    inputSchema: {
      type: 'object',
      properties: {
        canvasId: {
          type: 'string',
          description: 'Canvas ID',
        },
      },
      required: ['canvasId'],
    },
  },
  {
    name: 'reflow_list_canvases',
    description: 'List recent canvases',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Maximum number to return',
          default: 10,
        },
      },
    },
  },
  // Template Management
  {
    name: 'reflow_create_template',
    description: 'Create a custom template from code',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Template name',
        },
        description: {
          type: 'string',
          description: 'What this template creates',
        },
        code: {
          type: 'string',
          description: 'JavaScript visualization function code',
        },
        parameters: {
          type: 'object',
          description: 'Parameter schema for the template',
          additionalProperties: true,
        },
      },
      required: ['name', 'description', 'code', 'parameters'],
    },
  },
  {
    name: 'reflow_list_templates',
    description: 'List all available ReFlow templates',
    inputSchema: {
      type: 'object',
      properties: {
        includeBuiltin: {
          type: 'boolean',
          description: 'Include built-in templates',
          default: true,
        },
        includeCustom: {
          type: 'boolean',
          description: 'Include custom templates',
          default: true,
        },
      },
    },
  },
  {
    name: 'reflow_get_template',
    description: 'Get detailed information about a specific template',
    inputSchema: {
      type: 'object',
      properties: {
        templateId: {
          type: 'string',
          description: 'Template ID to get info for',
        },
      },
      required: ['templateId'],
    },
  },
  // Quick Actions
  {
    name: 'reflow_create_logo',
    description: 'Quick create a logo and get a shareable URL',
    inputSchema: {
      type: 'object',
      properties: {
        template: {
          type: 'string',
          description: 'Template ID',
        },
        parameters: {
          type: 'object',
          description: 'Template parameters',
          additionalProperties: true,
        },
        baseUrl: {
          type: 'string',
          description: 'Base URL for the ReFlow instance',
          default: 'http://localhost:3002',
        },
      },
      required: ['template', 'parameters'],
    },
  },
  {
    name: 'reflow_duplicate_logo',
    description: 'Duplicate a logo with parameter changes',
    inputSchema: {
      type: 'object',
      properties: {
        canvasId: {
          type: 'string',
          description: 'Canvas containing the logo',
        },
        logoId: {
          type: 'string',
          description: 'Logo to duplicate',
        },
        parameterChanges: {
          type: 'object',
          description: 'Parameters to change',
          additionalProperties: true,
        },
        metadata: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            notes: { type: 'string' },
          },
        },
      },
      required: ['canvasId', 'logoId', 'parameterChanges'],
    },
  },
  {
    name: 'reflow_export_canvas',
    description: 'Export canvas as shareable package',
    inputSchema: {
      type: 'object',
      properties: {
        canvasId: {
          type: 'string',
          description: 'Canvas to export',
        },
        format: {
          type: 'string',
          enum: ['json', 'urls', 'summary'],
          description: 'Export format',
          default: 'urls',
        },
      },
      required: ['canvasId'],
    },
  },
  // Session Management
  {
    name: 'reflow_start_session',
    description: 'Start a new design session',
    inputSchema: {
      type: 'object', 
      properties: {
        context: {
          type: 'string',
          description: 'What are we designing? (e.g., "Tech startup logo")',
        },
        preferences: {
          type: 'object',
          properties: {
            style: { type: 'string', description: 'Preferred style' },
            colors: { type: 'array', items: { type: 'string' } },
            avoid: { type: 'string', description: 'Things to avoid' },
          },
        },
      },
      required: ['context'],
    },
  },
  {
    name: 'reflow_get_suggestions',
    description: 'Get AI suggestions based on current canvas',
    inputSchema: {
      type: 'object',
      properties: {
        canvasId: {
          type: 'string',
          description: 'Canvas to analyze',
        },
        type: {
          type: 'string',
          enum: ['variations', 'improvements', 'alternatives'],
          description: 'Type of suggestions',
          default: 'variations',
        },
      },
      required: ['canvasId'],
    },
  },
];

// Create server instance
const server = new Server(
  {
    name: SERVER_NAME,
    version: SERVER_VERSION,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS,
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      // Canvas Management
      case 'reflow_create_canvas': {
        const { name, description, layout = 'grid' } = args as {
          name: string;
          description?: string;
          layout?: 'grid' | 'freeform' | 'row' | 'column';
        };

        const canvasId = `canvas-${nanoid(8)}`;
        const canvas = {
          id: canvasId,
          name,
          description,
          layout,
          logos: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        storage.canvases.set(canvasId, canvas);

        // Create a short URL for the canvas
        const shortId = createShortURL(`/canvas/${canvasId}`, 'canvas', { canvasId });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                canvasId,
                shortUrl: `/c/${shortId}`,
                canvas,
              }, null, 2),
            },
          ],
        };
      }

      case 'reflow_add_to_canvas': {
        const { canvasId, templateId, parameters, position, metadata } = args as {
          canvasId: string;
          templateId: string;
          parameters: Record<string, any>;
          position?: { x: number; y: number };
          metadata?: { name?: string; notes?: string };
        };

        const canvas = storage.canvases.get(canvasId);
        if (!canvas) {
          throw new Error(`Canvas '${canvasId}' not found`);
        }

        const template = storage.templates.get(templateId);
        if (!template) {
          throw new Error(`Template '${templateId}' not found`);
        }

        const logoId = `logo-${nanoid(8)}`;
        const logo = {
          id: logoId,
          templateId,
          parameters,
          position: position || { x: canvas.logos.length * 200, y: 0 },
          size: { width: 180, height: 180 },
          metadata: metadata || {},
        };

        canvas.logos.push(logo);
        canvas.updatedAt = new Date().toISOString();
        storage.canvases.set(canvasId, canvas);

        // Create short URL for this specific logo
        const params = new URLSearchParams();
        params.set('template', templateId);
        Object.entries(parameters).forEach(([key, value]) => {
          params.set(key, String(value));
        });
        const logoShortId = createShortURL(`/?${params.toString()}`, templateId, parameters);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                logoId,
                canvasUrl: `/canvas/${canvasId}`,
                logoUrl: `/s/${logoShortId}`,
                logo,
              }, null, 2),
            },
          ],
        };
      }

      case 'reflow_get_canvas': {
        const { canvasId } = args as { canvasId: string };
        const canvas = storage.canvases.get(canvasId);
        
        if (!canvas) {
          throw new Error(`Canvas '${canvasId}' not found`);
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(canvas, null, 2),
            },
          ],
        };
      }

      case 'reflow_list_canvases': {
        const { limit = 10 } = args as { limit?: number };
        const canvases = Array.from(storage.canvases.values())
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, limit);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(canvases, null, 2),
            },
          ],
        };
      }

      // Template Management
      case 'reflow_create_template': {
        const { name, description, code, parameters } = args as {
          name: string;
          description: string;
          code: string;
          parameters: Record<string, any>;
        };

        const templateId = `custom-${nanoid(8)}`;
        const template = {
          id: templateId,
          name,
          description,
          builtin: false,
          code,
          parameters,
          createdAt: new Date().toISOString(),
          createdBy: 'ai',
        };

        storage.templates.set(templateId, template);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                templateId,
                template,
              }, null, 2),
            },
          ],
        };
      }

      case 'reflow_list_templates': {
        const { includeBuiltin = true, includeCustom = true } = args as {
          includeBuiltin?: boolean;
          includeCustom?: boolean;
        };

        let templates = Array.from(storage.templates.values());
        
        if (!includeBuiltin) {
          templates = templates.filter(t => !t.builtin);
        }
        if (!includeCustom) {
          templates = templates.filter(t => t.builtin);
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                templates.map((t) => ({
                  id: t.id,
                  name: t.name,
                  description: t.description,
                  builtin: t.builtin,
                  parameterCount: Object.keys(t.parameters || {}).length,
                  createdAt: t.createdAt,
                })),
                null,
                2
              ),
            },
          ],
        };
      }

      case 'reflow_get_template': {
        const { templateId } = args as { templateId: string };
        const template = storage.templates.get(templateId);
        
        if (!template) {
          throw new Error(`Template '${templateId}' not found`);
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(template, null, 2),
            },
          ],
        };
      }

      // Quick Actions
      case 'reflow_create_logo': {
        const { template, parameters, baseUrl = 'http://localhost:3002' } = args as {
          template: string;
          parameters: Record<string, any>;
          baseUrl?: string;
        };

        // Verify template exists
        if (!storage.templates.has(template)) {
          throw new Error(`Template '${template}' not found`);
        }

        // Build URL with parameters
        const params = new URLSearchParams();
        params.set('template', template);
        
        Object.entries(parameters).forEach(([key, value]) => {
          params.set(key, String(value));
        });

        const fullUrl = `/?${params.toString()}`;
        const shortId = createShortURL(fullUrl, template, parameters);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                shortId,
                shortUrl: `${baseUrl}/s/${shortId}`,
                fullUrl: `${baseUrl}${fullUrl}`,
                template,
                parameters,
              }, null, 2),
            },
          ],
        };
      }

      case 'reflow_duplicate_logo': {
        const { canvasId, logoId, parameterChanges, metadata } = args as {
          canvasId: string;
          logoId: string;
          parameterChanges: Record<string, any>;
          metadata?: { name?: string; notes?: string };
        };

        const canvas = storage.canvases.get(canvasId);
        if (!canvas) {
          throw new Error(`Canvas '${canvasId}' not found`);
        }

        const originalLogo = canvas.logos.find((l: any) => l.id === logoId);
        if (!originalLogo) {
          throw new Error(`Logo '${logoId}' not found in canvas`);
        }

        // Create new logo with merged parameters
        const newLogoId = `logo-${nanoid(8)}`;
        const newParameters = { ...originalLogo.parameters, ...parameterChanges };
        
        const newLogo = {
          id: newLogoId,
          templateId: originalLogo.templateId,
          parameters: newParameters,
          position: {
            x: originalLogo.position.x + 200,
            y: originalLogo.position.y,
          },
          size: { ...originalLogo.size },
          metadata: metadata || {
            name: `${originalLogo.metadata?.name || 'Logo'} (Copy)`,
            notes: `Duplicated from ${logoId}`,
          },
        };

        canvas.logos.push(newLogo);
        canvas.updatedAt = new Date().toISOString();
        storage.canvases.set(canvasId, canvas);

        // Create short URL for the new logo
        const params = new URLSearchParams();
        params.set('template', originalLogo.templateId);
        Object.entries(newParameters).forEach(([key, value]) => {
          params.set(key, String(value));
        });
        const logoShortId = createShortURL(`/?${params.toString()}`, originalLogo.templateId, newParameters);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                newLogoId,
                originalLogoId: logoId,
                canvasUrl: `/canvas/${canvasId}`,
                logoUrl: `/s/${logoShortId}`,
                newLogo,
              }, null, 2),
            },
          ],
        };
      }

      case 'reflow_export_canvas': {
        const { canvasId, format = 'urls' } = args as {
          canvasId: string;
          format?: 'json' | 'urls' | 'summary';
        };

        const canvas = storage.canvases.get(canvasId);
        if (!canvas) {
          throw new Error(`Canvas '${canvasId}' not found`);
        }

        let exportData: any;

        switch (format) {
          case 'json':
            // Full JSON export with all data
            exportData = {
              canvas,
              templates: canvas.logos.map((logo: any) => {
                const template = storage.templates.get(logo.templateId);
                return {
                  logoId: logo.id,
                  template: template || { id: logo.templateId, name: 'Unknown' },
                };
              }),
              exportedAt: new Date().toISOString(),
            };
            break;

          case 'urls':
            // Generate short URLs for each logo
            exportData = {
              canvasName: canvas.name,
              canvasUrl: `/c/${createShortURL(`/canvas/${canvasId}`, 'canvas', { canvasId })}`,
              logos: canvas.logos.map((logo: any) => {
                const params = new URLSearchParams();
                params.set('template', logo.templateId);
                Object.entries(logo.parameters).forEach(([key, value]) => {
                  params.set(key, String(value));
                });
                const shortId = createShortURL(`/?${params.toString()}`, logo.templateId, logo.parameters);
                
                return {
                  id: logo.id,
                  name: logo.metadata?.name || `Logo ${logo.id}`,
                  shortUrl: `/s/${shortId}`,
                  template: logo.templateId,
                };
              }),
            };
            break;

          case 'summary':
            // Human-readable summary
            const templateCounts = canvas.logos.reduce((acc: any, logo: any) => {
              acc[logo.templateId] = (acc[logo.templateId] || 0) + 1;
              return acc;
            }, {});

            exportData = {
              summary: `Canvas: ${canvas.name}`,
              description: canvas.description || 'No description',
              stats: {
                totalLogos: canvas.logos.length,
                layout: canvas.layout,
                created: canvas.createdAt,
                lastUpdated: canvas.updatedAt,
              },
              templateUsage: Object.entries(templateCounts).map(([templateId, count]) => ({
                template: templateId,
                count,
              })),
              logos: canvas.logos.map((logo: any) => ({
                name: logo.metadata?.name || `Logo ${logo.id}`,
                template: logo.templateId,
                notes: logo.metadata?.notes || '',
              })),
            };
            break;
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(exportData, null, 2),
            },
          ],
        };
      }

      // Session Management
      case 'reflow_start_session': {
        const { context, preferences } = args as {
          context: string;
          preferences?: {
            style?: string;
            colors?: string[];
            avoid?: string;
          };
        };

        const sessionId = `session-${nanoid(8)}`;
        const session = {
          id: sessionId,
          context,
          preferences: preferences || {},
          canvases: [],
          startedAt: new Date().toISOString(),
          lastActivity: new Date().toISOString(),
        };

        // Store session (in production, this would go to a database)
        storage.sessions.set(sessionId, session);
        storage.currentSession = sessionId;

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                sessionId,
                session,
                message: `Started design session for: ${context}`,
              }, null, 2),
            },
          ],
        };
      }

      case 'reflow_get_suggestions': {
        const { canvasId, type = 'variations' } = args as {
          canvasId: string;
          type?: 'variations' | 'improvements' | 'alternatives';
        };

        const canvas = storage.canvases.get(canvasId);
        if (!canvas) {
          throw new Error(`Canvas '${canvasId}' not found`);
        }

        // Analyze canvas content
        const templates = new Set(canvas.logos.map((l: any) => l.templateId));
        const logoCount = canvas.logos.length;

        let suggestions: any[] = [];

        switch (type) {
          case 'variations':
            // Suggest parameter variations for existing logos
            suggestions = canvas.logos.slice(0, 3).map((logo: any) => ({
              action: 'vary_parameters',
              logoId: logo.id,
              description: `Try different ${logo.templateId} variations`,
              suggestions: [
                { parameter: 'fillOpacity', change: 'Reduce to 0.7 for subtlety' },
                { parameter: 'strokeWidth', change: 'Increase for bolder look' },
                { parameter: 'seed', change: 'Change for new random variation' },
              ],
            }));
            break;

          case 'improvements':
            // Suggest improvements based on current content
            suggestions = [
              {
                action: 'adjust_consistency',
                description: 'Align color schemes across all logos',
                details: 'Use consistent fill colors for brand cohesion',
              },
              {
                action: 'optimize_layout',
                description: 'Reorganize logos by template type',
                details: 'Group similar designs together',
              },
            ];
            break;

          case 'alternatives':
            // Suggest different templates
            const unusedTemplates = Array.from(storage.templates.keys())
              .filter(t => !templates.has(t));
            
            suggestions = unusedTemplates.slice(0, 3).map(templateId => ({
              action: 'try_template',
              templateId,
              description: `Try the ${templateId} template`,
              rationale: 'Explore different visual styles',
            }));
            break;
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                canvasId,
                type,
                currentLogos: logoCount,
                suggestions,
                analysisNotes: `Canvas uses ${templates.size} different templates`,
              }, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`${SERVER_NAME} v${SERVER_VERSION} started`);
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});