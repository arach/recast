# Zustand Migration Guide

## Overview
This guide outlines our incremental migration from prop-drilling to Zustand state management.

## Migration Principles
1. **Keep the app working** - No breaking changes during migration
2. **Incremental adoption** - Migrate one component at a time
3. **Parallel systems** - Old and new can coexist temporarily
4. **Test as we go** - Verify each step works before proceeding

## Phase 1: Foundation (Current)
✅ Created Zustand stores (logoStore, uiStore, parameterStore, templateStore)
✅ Created TypeScript types to replace `Record<string, any>`
✅ Created service layer for business logic
✅ Built test page to verify stores work
✅ Created ControlsPanelV2 as proof of concept

## Phase 2: Bridge Components
Create wrapper components that connect old props to new stores:

### 2.1 Create StoreInitializer
- Syncs initial page.tsx state with Zustand stores
- Maintains backward compatibility

### 2.2 Create PropToStoreSync
- Listens to prop changes and updates stores
- Ensures old components still work

### 2.3 Update MigrationWrapper
- Add store initialization from URL params
- Sync store changes back to parent component

## Phase 3: Component Migration
Migrate components from bottom-up (leaves first):

### 3.1 Controls Panel
- [x] Create ControlsPanelV2 using stores
- [ ] Add feature flag to switch between v1/v2
- [ ] Test thoroughly with all templates
- [ ] Remove old version once stable

### 3.2 Logo Canvas
- [ ] Create LogoCanvasV2 using stores
- [ ] Handle animation state from uiStore
- [ ] Remove logo prop dependency

### 3.3 Template Selector
- [ ] Create TemplateSelectorV2
- [ ] Use templateStore for templates/presets
- [ ] Remove onSelect prop

### 3.4 Export Panel
- [ ] Create ExportPanelV2
- [ ] Use logoStore for selected logo
- [ ] Remove prop dependencies

## Phase 4: Page Migration
Once all child components are migrated:

### 4.1 Create page.v2.tsx
- Uses only Zustand stores
- No local state for logos/parameters
- Clean, simple component

### 4.2 Feature Flag Switch
- Environment variable to toggle v1/v2
- A/B test if needed
- Gradual rollout

### 4.3 Cleanup
- Remove old page.tsx
- Remove prop-based components
- Remove temporary bridges

## Current Status
- ✅ Phase 1 Complete
- 🏗️ Phase 2 In Progress
- ⏳ Phase 3 Planned
- ⏳ Phase 4 Planned

## Next Steps
1. Create StoreInitializer component
2. Test with main app
3. Add feature flag system
4. Begin component migration

## Testing Strategy
- Unit tests for stores
- Integration tests for bridges
- Visual regression tests
- User acceptance testing

## Rollback Plan
- Feature flags allow instant rollback
- Git branches preserve old code
- Parallel systems ensure no data loss