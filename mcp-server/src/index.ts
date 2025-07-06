#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { createCanvas } from 'canvas';
import { nanoid } from 'nanoid';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import ReFlow core modules
// Note: These will be properly imported once we set up the build process
// For now, we'll implement minimal versions inline

// Temporary stub implementations
const loadJSTemplate = async (templateId: string) => {
  // In production, this would load from the actual template system
  return {
    id: templateId,
    name: templateId,
    description: `Template ${templateId}`,
    parameters: {},
    defaultParams: {},
    drawVisualization: (ctx: any, width: number, height: number, params: any) => {
      // Placeholder drawing
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#333';
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${templateId} template`, width / 2, height / 2);
    },
  };
};

const getAllJSTemplates = async () => {
  // In production, this would return all available templates
  return [
    { id: 'wave-bars', name: 'Wave Bars', description: 'Dynamic wave visualization', parameters: {} },
    { id: 'letter-mark', name: 'Letter Mark', description: 'Single letter logo', parameters: {} },
    { id: 'wordmark', name: 'Wordmark', description: 'Text-based logo', parameters: {} },
  ];
};

const createShortURL = (fullUrl: string, template: string, params: any) => {
  // In production, this would create an actual short URL
  return nanoid(6);
};

// Server metadata
const SERVER_NAME = 'reflow-mcp';
const SERVER_VERSION = '0.1.0';

// Tool definitions
const TOOLS: Tool[] = [
  {
    name: 'reflow_list_templates',
    description: 'List all available ReFlow templates with their parameters',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'reflow_generate_logo',
    description: 'Generate a logo using ReFlow templates',
    inputSchema: {
      type: 'object',
      properties: {
        template: {
          type: 'string',
          description: 'Template ID (e.g., wave-bars, letter-mark, wordmark)',
        },
        width: {
          type: 'number',
          description: 'Canvas width in pixels',
          default: 600,
        },
        height: {
          type: 'number',
          description: 'Canvas height in pixels',
          default: 600,
        },
        parameters: {
          type: 'object',
          description: 'Template-specific parameters',
          additionalProperties: true,
        },
        outputPath: {
          type: 'string',
          description: 'Optional path to save the generated PNG',
        },
      },
      required: ['template'],
    },
  },
  {
    name: 'reflow_create_short_url',
    description: 'Create a short URL for a logo configuration',
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
      },
      required: ['template', 'parameters'],
    },
  },
  {
    name: 'reflow_get_template_info',
    description: 'Get detailed information about a specific template',
    inputSchema: {
      type: 'object',
      properties: {
        template: {
          type: 'string',
          description: 'Template ID to get info for',
        },
      },
      required: ['template'],
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
      case 'reflow_list_templates': {
        const templates = await getAllJSTemplates();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                templates.map((t) => ({
                  id: t.id,
                  name: t.name,
                  description: t.description,
                  parameterCount: Object.keys(t.parameters || {}).length,
                })),
                null,
                2
              ),
            },
          ],
        };
      }

      case 'reflow_get_template_info': {
        const { template } = args as { template: string };
        const templateData = await loadJSTemplate(template);
        
        if (!templateData) {
          throw new Error(`Template '${template}' not found`);
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  id: templateData.id,
                  name: templateData.name,
                  description: templateData.description,
                  parameters: templateData.parameters,
                  defaultParams: templateData.defaultParams,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'reflow_generate_logo': {
        const {
          template,
          width = 600,
          height = 600,
          parameters = {},
          outputPath,
        } = args as {
          template: string;
          width?: number;
          height?: number;
          parameters?: Record<string, any>;
          outputPath?: string;
        };

        // Load template
        const templateData = await loadJSTemplate(template);
        if (!templateData) {
          throw new Error(`Template '${template}' not found`);
        }

        // Create canvas
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Merge parameters with defaults
        const finalParams = {
          ...templateData.defaultParams,
          ...parameters,
        };

        // Generate logo
        // For now, just draw a placeholder
        // In production, this would call the actual template rendering
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#333';
        ctx.font = '48px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${template}`, width / 2, height / 2);
        ctx.font = '24px sans-serif';
        ctx.fillText(JSON.stringify(finalParams).substring(0, 50), width / 2, height / 2 + 50);

        // Convert to PNG
        const buffer = canvas.toBuffer('image/png');

        // Save if path provided
        let savedPath = null;
        if (outputPath) {
          await fs.writeFile(outputPath, buffer);
          savedPath = outputPath;
        }

        // Return base64 encoded image
        const base64 = buffer.toString('base64');
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                template: template,
                width,
                height,
                parameters: finalParams,
                savedPath,
                dataUrl: `data:image/png;base64,${base64}`,
              }),
            },
          ],
        };
      }

      case 'reflow_create_short_url': {
        const { template, parameters } = args as {
          template: string;
          parameters: Record<string, any>;
        };

        // Build URL with parameters
        const params = new URLSearchParams();
        params.set('template', template);
        
        Object.entries(parameters).forEach(([key, value]) => {
          params.set(key, String(value));
        });

        const fullUrl = `/?${params.toString()}`;
        
        // Create short URL
        const shortId = createShortURL(fullUrl, template, parameters);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                shortId,
                shortUrl: `/s/${shortId}`,
                fullUrl,
                template,
                parameters,
              }),
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