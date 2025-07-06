# ReFlow MCP Server

An MCP (Model Context Protocol) server that exposes ReFlow's programmatic logo generation capabilities.

## Features

- **List Templates**: Discover all available ReFlow templates
- **Generate Logos**: Create logos programmatically with any template
- **Create Short URLs**: Generate shareable links for logo configurations
- **Template Info**: Get detailed parameter information for each template

## Installation

```bash
cd mcp-server
pnpm install
pnpm build
```

## Usage

### In Claude Desktop

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "reflow": {
      "command": "node",
      "args": ["/path/to/reflow/mcp-server/dist/index.js"],
      "env": {}
    }
  }
}
```

### Available Tools

#### `reflow_list_templates`
Lists all available ReFlow templates.

```
No parameters required
```

#### `reflow_get_template_info`
Get detailed information about a specific template including all parameters.

```json
{
  "template": "wave-bars"
}
```

#### `reflow_generate_logo`
Generate a logo using any ReFlow template.

```json
{
  "template": "letter-mark",
  "width": 600,
  "height": 600,
  "parameters": {
    "letter": "R",
    "fontSize": 120,
    "fontWeight": 700,
    "fillType": "gradient",
    "fillGradientStart": "#7C3AED",
    "fillGradientEnd": "#06B6D4"
  },
  "outputPath": "/tmp/logo.png"  // Optional
}
```

#### `reflow_create_short_url`
Create a short URL for sharing logo configurations.

```json
{
  "template": "wordmark",
  "parameters": {
    "text": "reflow",
    "fontSize": 48,
    "fontWeight": 700
  }
}
```

## Development

```bash
# Run in development mode
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Examples

### Generate a Letter Logo
```
Use reflow_generate_logo with:
- template: "letter-mark"
- parameters: { "letter": "A", "fillType": "gradient" }
```

### Create a Wave Animation
```
Use reflow_generate_logo with:
- template: "wave-bars"
- parameters: { "barCount": 60, "colorMode": "spectrum" }
```

### Get Template Parameters
```
Use reflow_get_template_info with:
- template: "wordmark"
```

## Integration

This MCP server integrates with the main ReFlow application, providing programmatic access to all logo generation features. It uses the same template system and parameter structure as the web interface.