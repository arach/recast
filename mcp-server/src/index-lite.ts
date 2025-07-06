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

// Temporary stub implementations
const getAllJSTemplates = async () => {
  return [
    { 
      id: 'wave-bars', 
      name: 'Wave Bars', 
      description: 'Dynamic wave visualization',
      parameters: {
        barCount: { default: 60, range: [10, 100, 1] },
        frequency: { default: 3.5, range: [0.1, 10, 0.1] },
        amplitude: { default: 40, range: [0, 100, 1] },
        colorMode: { default: 'spectrum', options: ['spectrum', 'mono', 'gradient'] }
      }
    },
    { 
      id: 'letter-mark', 
      name: 'Letter Mark', 
      description: 'Single letter logo',
      parameters: {
        letter: { default: 'A', type: 'string' },
        fontSize: { default: 120, range: [20, 200, 1] },
        fillType: { default: 'solid', options: ['solid', 'gradient'] }
      }
    },
    { 
      id: 'wordmark', 
      name: 'Wordmark', 
      description: 'Text-based logo',
      parameters: {
        text: { default: 'reflow', type: 'string' },
        fontSize: { default: 48, range: [12, 120, 1] },
        fontWeight: { default: 700, range: [100, 900, 100] }
      }
    },
  ];
};

const createShortURL = (fullUrl: string, template: string, params: any) => {
  return nanoid(6);
};

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
        baseUrl: {
          type: 'string',
          description: 'Base URL for the ReFlow instance (e.g., http://localhost:3002)',
          default: 'http://localhost:3002',
        },
      },
      required: ['template', 'parameters'],
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
        const templates = await getAllJSTemplates();
        const templateData = templates.find(t => t.id === template);
        
        if (!templateData) {
          throw new Error(`Template '${template}' not found`);
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(templateData, null, 2),
            },
          ],
        };
      }

      case 'reflow_create_short_url': {
        const { template, parameters, baseUrl = 'http://localhost:3002' } = args as {
          template: string;
          parameters: Record<string, any>;
          baseUrl?: string;
        };

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