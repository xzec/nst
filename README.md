# Nx Nest Drizzle

Personal project with aim to explore modern Nest.js development and learn more about DDD.

Inspired by?
- [nestjs-boilerplate](https://github.com/oNo500/nestjs-boilerplate)
- Domain errors, errors as values, and Result-based error handling with oxide.ts [domain-driven-hexagon](https://github.com/Sairyss/domain-driven-hexagon?tab=readme-ov-file)

## Structure
```
📂 apps
┗ 📂 api ················· 👈 Nest.js API
📂 libs
┗ 📂 database ············ 👈️ Drizzle schema, seeds & migrations
```

This project is a monorepo powered by `pnpm` and `nx`.

## Getting started

- See [package.json](./package.json) for recommended pnpm and Node versions.
- Run `pnpm install`
- Create `.env` files in
    - root: [.env.sample](./.env.sample),
    - apps/api/: [.env.sample](./apps/api/.env.sample) (see also [env.schema.ts](./apps/api/src/common/config/env.schema.ts)).
- Start a database using `docker compose --env-file .env.development up -d db` ([docker-compose.yml](./docker-compose.yml))
- Run migrations with `pnpm nx run db:migrate`
- Run seeders with `pnpm nx run db:seed`

## Testing


### Unit

- Powered by `vitest`
- Config: [vitest.config.ts](./apps/api/vitest.config.ts)
- Run: `pnpm nx run api:test` 

### End-to-end

- Powered by `vitest`, `supertest` and `testcontainers`
- Config: [vitest.config.e2e.ts](./apps/api/vitest.config.e2e.ts)
- Run: `pnpm nx run api:test:e2e`
