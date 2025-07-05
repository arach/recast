// SWC WASM TypeScript Compiler
import type { Options } from '@swc/wasm-web';

let swc: any = null;

export async function initializeCompiler() {
  if (swc) return swc;
  
  // Dynamic import to avoid loading WASM until needed
  const swcModule = await import('@swc/wasm-web');
  await swcModule.default();
  swc = swcModule;
  
  return swc;
}

export async function compileTypeScript(code: string): Promise<string> {
  const compiler = await initializeCompiler();
  
  const options: Options = {
    jsc: {
      parser: {
        syntax: 'typescript',
        tsx: false,
        decorators: false,
        dynamicImport: true
      },
      target: 'es2020',
      loose: false,
      externalHelpers: false
    },
    module: {
      type: 'es6'
    },
    sourceMaps: false,
    isModule: true
  };
  
  try {
    const result = await compiler.transform(code, options);
    return result.code;
  } catch (error) {
    console.error('SWC compilation error:', error);
    throw error;
  }
}

// Cache compiled templates
const compiledCache = new Map<string, string>();

export async function compileTemplate(templateId: string, code: string): Promise<string> {
  const cacheKey = `${templateId}-${code.length}`;
  
  if (compiledCache.has(cacheKey)) {
    return compiledCache.get(cacheKey)!;
  }
  
  const compiled = await compileTypeScript(code);
  compiledCache.set(cacheKey, compiled);
  
  return compiled;
}