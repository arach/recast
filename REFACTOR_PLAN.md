# Reflow Refactoring Plan

## Current Architecture Issues

### 1. Monolithic Page Component (950+ lines)
- All state management in `app/page.tsx`
- 60+ state variables
- Business logic mixed with UI
- Complex prop drilling

### 2. Parameter Confusion
- Core parameters (frequency, amplitude, etc.)
- Custom parameters (template-specific)
- Universal controls (colors)
- No clear hierarchy or ownership

### 3. State Synchronization Problems
- Multiple sources of truth
- Complex update patterns
- Text override bugs
- URL sync complexity

## Proposed Architecture

### 1. State Management with Zustand

```
┌─────────────────────────────────────────────────┐
│                  App State                       │
├─────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐             │
│  │ Logo Store  │  │ Preset Store │             │
│  └─────────────┘  └──────────────┘             │
│  ┌─────────────┐  ┌──────────────┐             │
│  │  UI Store   │  │ Params Store │             │
│  └─────────────┘  └──────────────┘             │
└─────────────────────────────────────────────────┘
```

### 2. Clear Domain Models

```typescript
interface Logo {
  id: string
  templateId: string
  parameters: Parameters
  position: Position
}

interface Parameters {
  // Strongly typed, no more Record<string, any>
  core: CoreParameters
  style: StyleParameters
  content: ContentParameters
}
```

### 3. Service Layer

```
Services/
├── PresetService      // Load/apply presets
├── ParameterService   // Validate/merge parameters
├── ExportService      // Handle exports
└── URLService         // URL sync
```

## Migration Steps

### Phase 1: Create Zustand Stores
1. Create `logoStore` for logo instances
2. Create `uiStore` for UI state
3. Create `parameterStore` for active parameters
4. Create `presetStore` for templates/presets

### Phase 2: Extract Services
1. Move preset loading logic to PresetService
2. Move parameter parsing to ParameterService
3. Move URL sync to URLService

### Phase 3: Refactor Components
1. Break down page.tsx into smaller components
2. Connect components to stores (no prop drilling)
3. Move business logic to services/stores

### Phase 4: Type Safety
1. Define proper interfaces for all data structures
2. Remove all `Record<string, any>` usage
3. Add validation at boundaries

## Key Principles

1. **Single Source of Truth**: Each piece of state has one owner
2. **Unidirectional Data Flow**: Clear flow from stores to components
3. **Separation of Concerns**: UI, State, Business Logic separated
4. **Type Safety**: Everything properly typed
5. **Testability**: Pure functions, mockable services

## Expected Benefits

1. **Fix parameter preservation**: Clear ownership of parameters
2. **Easier debugging**: Predictable state updates
3. **Better performance**: Selective re-renders
4. **Maintainability**: Smaller, focused modules
5. **Extensibility**: Easy to add new features

## Next Steps

1. Set up Zustand stores structure
2. Define TypeScript interfaces
3. Start migrating state piece by piece
4. Test each migration step