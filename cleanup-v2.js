#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read page.tsx
const pagePath = path.join(__dirname, 'app/page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

// Replace feature flag conditionals for CodeEditorPanel
content = content.replace(
  /\{\/\* Use new Zustand-based CodeEditor.*?\*\/\}\s*\{FeatureFlags\.isZustandCanvasEnabled\(\) \? \([\s\S]*?\) : \([\s\S]*?\)\}/,
  '<CodeEditorPanel />'
);

// Replace feature flag conditionals for CanvasArea
content = content.replace(
  /\{\/\* Use new Zustand-based CanvasArea.*?\*\/\}\s*\{FeatureFlags\.isZustandCanvasEnabled\(\) \? \([\s\S]*?\) : \([\s\S]*?\)\}/,
  '<CanvasArea />'
);

// Replace feature flag conditionals for ControlsPanel
content = content.replace(
  /\{\/\* Use new Zustand-based ControlsPanel.*?\*\/\}\s*\{FeatureFlags\.isZustandControlsEnabled\(\) \? \([\s\S]*?\) : \([\s\S]*?\)\}/,
  '<ControlsPanel />'
);

// Remove DebugFeatureFlags component
content = content.replace(/\s*\{\/\* Debug feature flags \*\/\}\s*<DebugFeatureFlags \/>/g, '');

// Remove imports
content = content.replace(/import { FeatureFlags } from '@\/lib\/feature-flags'\n/g, '');
content = content.replace(/import { DebugFeatureFlags } from '@\/components\/DebugFeatureFlags'\n/g, '');

// Write back
fs.writeFileSync(pagePath, content);

console.log('✅ Cleaned up V2 references in page.tsx');