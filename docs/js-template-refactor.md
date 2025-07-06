# JavaScript Template Refactor

## Overview
This document outlines the refactor from TypeScript to pure JavaScript templates in ReFlow.

## Motivation
- Templates are pure drawing functions with no external dependencies
- TypeScript adds no value - we don't use the type system in templates
- Runtime TS→JS compilation is complex and error-prone
- Simpler is better for a template system

## New Template Format

### Structure
```javascript
// templates/template-name.js
(function() {
  'use strict';
  
  const metadata = {
    id: 'template-name',
    name: '🎨 Template Name',
    description: 'What this template does',
    category: 'animated|static|geometric|text'
  };
  
  const parameters = {
    paramName: {
      default: 1.0,
      min: 0,
      max: 10,
      step: 0.1,
      label: 'Parameter Label'
    }
  };
  
  function draw(ctx, width, height, params, time, utils) {
    // Drawing logic here
  }
  
  return { metadata, parameters, draw };
})();
```

### Key Principles
1. **Self-contained** - Each template is an IIFE (Immediately Invoked Function Expression)
2. **No imports/exports** - Utils passed as parameter
3. **Pure functions** - No side effects, just drawing
4. **Simple parameters** - Just objects with defaults and ranges

## Migration Plan

### Phase 1: Infrastructure (Current)
- [x] Create refactor branch
- [ ] Design new template format
- [ ] Create template converter script
- [ ] Set up new template loader

### Phase 2: Template Conversion
- [ ] Convert 3 test templates (wave-bars, prism-google, wordmark)
- [ ] Verify they work correctly
- [ ] Convert remaining 30 templates
- [ ] Update template metadata

### Phase 3: Application Updates
- [ ] Remove TypeScript compilation from visualization-utils
- [ ] Update API routes to serve .js files
- [ ] Update template loading hooks
- [ ] Clean up old TypeScript infrastructure

### Phase 4: Cleanup
- [ ] Remove unused dependencies
- [ ] Update documentation
- [ ] Test all templates
- [ ] Merge to main

## Benefits
- **Faster** - No runtime compilation
- **Simpler** - Just JavaScript
- **Debuggable** - What you see is what runs
- **Portable** - Templates work anywhere JavaScript runs