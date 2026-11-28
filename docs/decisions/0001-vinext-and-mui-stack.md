# 0001. Vinext and MUI Stack

- Status: Accepted
- Date: 2026-11-28

## Context

The conventions prefer TanStack Start with shadcn/ui for TypeScript web applications. This app was built with the Next.js App Router and MUI, and its routes in `src/app/`, server handlers in `src/app/api/`, and components all depend on those APIs.

## Decision

Keep the Next.js App Router code and MUI, running on [Vinext](https://github.com/cloudflare/vinext) with Vite and the `cf` CLI on Cloudflare Workers. Migrating to TanStack Start and shadcn/ui would mean rewriting every route and component for no change in behavior.

## Consequences

- Routing, layouts, and fonts follow Next.js conventions through `vinext`, and `vinext` generates route types into `.next/types`.
- Components use MUI with Emotion instead of shadcn/ui. See [`DESIGN.md`](../../DESIGN.md).
- Revisit this decision if the app needs a major rewrite.
