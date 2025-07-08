# Diagnostic Sharing Tool

The ReFlow debug toolbar now includes a powerful diagnostic sharing tool that allows developers to easily share logo configurations and debug information for collaboration and troubleshooting.

## Features

### 📋 Share Full Diagnostic
Generates a comprehensive diagnostic report containing:
- Current logo configuration (template, parameters, position)
- Canvas state (position, zoom, size)
- Store states (logo count, UI state)
- Environment information (browser, viewport, Node.js environment)
- Timestamp and URL for context

### 🔗 Share Logo Config  
Generates a compact diagnostic focused on the current logo:
- Template ID and name
- All parameters (core, style, content, custom)
- Logo position
- Timestamp for reference

### 📥 Import Diagnostic
Allows importing and applying diagnostic data:
- Paste JSON diagnostic data
- Automatically creates a new logo with the imported configuration
- Supports both full and compact diagnostic formats

## How to Use

### Accessing the Tool

1. **Open Debug Toolbar**: In development mode, click the bug icon (🐛) in the bottom-right corner
2. **Navigate to Utils Tab**: Click the "Utils" tab in the debug toolbar
3. **Find Diagnostic Sharing**: Scroll to the "Diagnostic Sharing" section

### Sharing a Configuration

**For Bug Reports (Full Diagnostic):**
1. Click "Share Full Diagnostic" 
2. The complete diagnostic report is copied to your clipboard
3. Paste into bug reports, GitHub issues, or team communications

**For Quick Config Sharing (Logo Config):**
1. Click "Share Logo Config"
2. A compact JSON with just the logo configuration is copied
3. Perfect for sharing parameter combinations with colleagues

### Importing a Configuration

1. Click "Import Diagnostic"
2. Paste the diagnostic JSON into the text area
3. Click "Apply" to create a new logo with those settings
4. The imported logo becomes the active selection

## Diagnostic Data Format

### Full Diagnostic Report
```json
{
  "timestamp": "2025-01-07T...",
  "url": "http://localhost:3002/",
  "version": "0.1.0",
  "selectedLogoId": "main",
  "selectedLogo": { /* Complete logo object */ },
  "templateInfo": {
    "id": "wave-bars",
    "name": "Wave Bars",
    "code": "..."
  },
  "parameters": { /* All parameters */ },
  "canvasInfo": {
    "position": { "x": 362, "y": 35 },
    "zoom": 1.0,
    "size": { "width": 1200, "height": 800 }
  },
  "environment": { /* Browser and environment info */ },
  "stores": { /* Store states */ }
}
```

### Compact Logo Config
```json
{
  "templateId": "wave-bars",
  "templateName": "Wave Bars", 
  "parameters": { /* All parameters */ },
  "position": { "x": 100, "y": 100 },
  "timestamp": "2025-01-07T...",
  "logoId": "main"
}
```

## Use Cases

### 🐛 Bug Reports
- Include full diagnostic in bug reports for complete reproduction context
- Developers can instantly recreate the exact state that caused the issue

### 🤝 Team Collaboration  
- Share interesting parameter combinations with team members
- Quickly distribute logo configurations for review or iteration

### 🧪 Testing & QA
- Save specific configurations for regression testing
- Create test cases with exact parameter sets

### 📚 Documentation
- Include diagnostic data in documentation examples
- Provide reproducible examples for tutorials

## Development Notes

The diagnostic sharing tool is only available in development mode (`NODE_ENV === 'development'`) and integrates seamlessly with the existing debug toolbar architecture.

**Files:**
- `/lib/debug/diagnostic-sharing.ts` - Core functionality
- `/components/debug/StateDebugger.tsx` - UI integration

**Key Functions:**
- `generateDiagnosticReport()` - Creates full diagnostic reports
- `generateCompactDiagnostic()` - Creates compact logo configs  
- `extractImportData()` - Parses diagnostic JSON for import
- `applyDiagnosticData()` - Applies imported data to create logos