set dotenv-load

# Accept the shared setup mode. No containers need to stay running.
setup mode="": install
    just migrate --local

install:
    bun install --frozen-lockfile

start:
    bun run dev

build:
    bun run build

check:
    bun run check

migrate *args:
    bun run db:migrate {{ args }}

deploy: install build
    bun run deploy
