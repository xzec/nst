import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    name: 'seed',
    entry: 'src/scripts/seed.ts',
    platform: 'node',
    outDir: 'dist/seed',
    deps: {
      onlyBundle: [],
    },
  },
  {
    name: 'post-migrate',
    entry: 'src/scripts/post-migrate.ts',
    platform: 'node',
    outDir: 'dist/post-migrate',
    deps: {
      onlyBundle: [],
    },
  },
])
