import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    name: 'seed',
    entry: 'src/scripts/seed.ts',
    platform: 'node',
    outDir: 'dist/seed',
    outputOptions: {
      file: 'dist/seed/index.mjs',
    },
    deps: {
      onlyBundle: [],
    },
  },
  {
    name: 'post-migrate',
    entry: 'src/scripts/post-migrate.ts',
    platform: 'node',
    outDir: 'dist/post-migrate',
    outputOptions: {
      file: 'dist/post-migrate/index.mjs',
    },
    deps: {
      onlyBundle: [],
    },
  },
])
