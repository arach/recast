# Architecture Decisions

## Build Tool: Webpack (not Turbopack)

**Date**: June 2025  
**Status**: Decided  
**Decision**: Use Next.js with webpack bundler

### Context
- Turbopack is Next.js's new Rust-based bundler, promising faster builds
- Better Auth uses better-sqlite3 for local database storage
- Native modules like better-sqlite3 require special handling

### Decision Drivers
1. **Compatibility**: better-sqlite3 doesn't work with Turbopack currently
2. **Stability**: Webpack is battle-tested, Turbopack is still experimental  
3. **Authentication is Core**: Can't compromise on auth functionality
4. **Minimal Performance Impact**: Dev server starts in ~1.5s with webpack

### Consequences
- ✅ Full compatibility with all dependencies
- ✅ Stable, predictable development experience
- ✅ Better Auth works perfectly
- ❌ Slightly slower HMR than Turbopack would provide
- ❌ Missing out on Turbopack's improved caching

### Future Consideration
Revisit when Turbopack has better native module support or Better Auth provides alternative database adapters that don't require native bindings.