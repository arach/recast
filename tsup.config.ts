import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['core/wave-generator.ts'],
  format: ['cjs', 'esm'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
})