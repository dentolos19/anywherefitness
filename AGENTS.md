# Agent Instructions

Anywhere Fitness is a health and fitness community app with a social feed, advertisements, and workout tracking. It was built for Code Overflow 2023 and now runs on Cloudflare Workers.

## Commands

- `just setup`: Install dependencies and apply local D1 migrations.
- `just install`: Install dependencies from the frozen lockfile.
- `just start`: Run the development server on port 3000.
- `just build`: Create the Cloudflare build output.
- `just check`: Lint, format, and type check with Bun.
- `just test`: Run the Bun tests in `tests/`.
- `just migrate`: Apply D1 migrations locally, or remotely with `--remote`.
- `just deploy`: Build, migrate the remote D1 database, and deploy the Worker. Set `environment=production` to use `.env.production`.

## Stack

Vinext (Next.js App Router on Vite) on Cloudflare Workers, React 19, MUI, Drizzle ORM on D1, R2 for uploads, Mapbox GL, and Bun.

## Rules

- Keep the Next.js App Router and MUI instead of migrating to TanStack Start and shadcn/ui. See [0001](docs/decisions/0001-vinext-and-mui-stack.md).
- Import from `src/` with the `#/` alias, such as `#/lib/database`.
- Define the database schema in [`src/lib/database/schema.ts`](src/lib/database/schema.ts) and generate migrations into `migrations/` with `bun run db:generate`.
- Declare Worker bindings and secrets in [`cloudflare.config.ts`](cloudflare.config.ts), and list each secret in `.env.template`.

## Documentation

- [Product Specifications](PRODUCT.md)
- [Design System](DESIGN.md)
- [Documentation Guidelines](docs/README.md)
- [Cloudflare Development](docs/guides/cloudflare.md)
