import { defineConfig } from 'tsdown'

export default defineConfig({
  name: 'database',
  entry: 'src/index.ts',
  platform: 'node',
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: true,
  deps: {
    onlyBundle: [],
  },
})
