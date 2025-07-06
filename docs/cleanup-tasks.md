# Cleanup Tasks - Post JS Template Migration

## Overview
This document tracks remaining cleanup tasks after the JavaScript template migration is complete.

## 🗑️ Files/Directories to Remove

### 1. Old TypeScript Templates Directory
- [ ] `/templates/` - Entire directory with 33 TypeScript template files
  - Contains old TS templates like `apex-vercel.ts`, `architectural-grid.ts`, etc.
  - These have all been migrated to JavaScript or are no longer needed
  - **Action**: Delete entire directory

### 2. Unused API Routes
- [ ] `/app/api/template-source/[templateId]/route.ts` - Old template source API
  - Check if this is still being used anywhere
  - **Action**: Likely delete if not used

### 3. Migration/Conversion Scripts
- [ ] `/scripts/convert-templates.js` - Template conversion script
  - [ ] `/scripts/clean-template-exports.ts` - Export cleaning script
  - These were used during migration and are no longer needed
  - **Action**: Delete after confirming migration is complete

### 4. Unused Hooks
- [ ] `/lib/hooks/useTemplateCode.ts` - Check if still used
  - **Action**: Review usage and delete if obsolete

### 5. Old Template Presets
- [ ] `/lib/template-presets.ts` - Check if this is still needed
  - **Action**: Review and potentially remove or update

## 📝 Files to Review/Update

### 1. Documentation
- [ ] `/docs/template-development-guide.md` - Ensure it reflects JS templates only
- [ ] `/docs/template-quick-reference.md` - Update examples to JS format
- [ ] `/docs/js-template-architecture.md` - Review for accuracy
- [ ] `/docs/js-template-refactor.md` - Consider archiving as historical reference
- [ ] `/examples/ai-prompt-templates.md` - Update any template examples

### 2. Template Store
- [ ] `/lib/stores/templateStore.ts` - Review and simplify now that we only have JS templates
  - Remove any TypeScript template handling code
  - Simplify the store structure

### 3. Template Utils Package
- [ ] Review `/packages/template-utils/` for any TypeScript-specific code
  - Ensure examples use JavaScript templates
  - Update documentation

## 🔍 Code References to Clean

### 1. Import Statements
- [ ] Search for any remaining imports from `/templates/`
- [ ] Search for references to old template system files

### 2. Type Definitions
- [ ] Remove any TypeScript template type definitions
- [ ] Update interfaces to reflect JS-only templates

### 3. Configuration
- [ ] Check `tsconfig.json` for any template-specific paths
- [ ] Review build configuration for template handling

## ✅ Verification Steps

1. **Run template verification**
   ```bash
   node scripts/verify-templates-simple.js
   ```

2. **Check for broken imports**
   ```bash
   # Search for old template imports
   grep -r "from.*templates/" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" .
   ```

3. **Test all templates in UI**
   - Load each template in the studio
   - Verify parameters work correctly
   - Check animations and rendering

4. **Build verification**
   ```bash
   pnpm build
   ```

## 🚀 Future Improvements

1. **Template Gallery**
   - Create a visual gallery showing all templates
   - Add preview images/GIFs for each template

2. **Template Categories**
   - Better organize templates by use case
   - Add tags for easier discovery

3. **Template Documentation**
   - Create individual docs for each template
   - Add parameter explanations and examples

4. **Performance Monitoring**
   - Add metrics for template rendering performance
   - Create benchmarks for optimization

## 📅 Timeline

- **Phase 1** (Immediate): Remove old files and directories
- **Phase 2** (This week): Update documentation and clean code references
- **Phase 3** (Next sprint): Implement improvements and monitoring

## Notes

- Keep the verification scripts (`verify-templates.js`, `verify-templates-simple.js`) as they're useful for testing
- The JS template system is now the single source of truth
- All templates use the modern namespaced utility functions from `@reflow/template-utils`