import { defineConfig } from 'tsdown'

export default defineConfig({
  name: 'database',
  entry: { index: 'src/index.ts', utils: 'src/utils/index.ts' },
  platform: 'node',
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: true,
  shims: true,
  deps: {
    onlyBundle: [],
  },
})
