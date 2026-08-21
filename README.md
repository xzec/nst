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
- Start database using `docker compose up -d` ([docker-compose.yml](./docker-compose.yml))
- Run migrations with `pnpm nx run db:migrate`
- Run seeders with `pnpm nx run db:seed`

## Testing

### Unit

- Powered by `vitest` and `nestjs/testing`
- Test `api` project with `pnpm nx run api:test` 