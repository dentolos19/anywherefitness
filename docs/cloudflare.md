# Cloudflare development

`just setup` installs dependencies and applies the local D1 migrations. `just start` runs the app and `just build` creates the Cloudflare build output. The new local D1 state lives in `.cloudflare/state`; existing `.wrangler/state` data remains on disk.

`just check` uses Bun's linter, formatter and type checker. `bun run types` generates the Worker bindings in `.cloudflare/types`.

`just deploy` builds the Worker, applies remote D1 migrations, and uploads every key in `.env` as a secret with the deployment. To select another file, run `just environment=production deploy` for `.env.production`. Keep `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` in the process environment, outside the selected file. GitHub Actions creates `.env` from Production values and runs `just deploy`; the recipe migrates the existing D1 database before uploading the Worker and stops if migration fails.
