# Vestir backend

NestJS API for Vestir. See [../ROADMAP.md](../ROADMAP.md) for the app spec, architecture, and phase plan.

## Setup

```bash
docker compose up -d   # from the repo root — local Postgres + pgvector (port 5434)
cp .env.example .env
npm install
npx prisma migrate dev
npm run start:dev
```

Server runs on `http://localhost:3000` by default.

## Tests

```bash
npm test          # unit tests — no DB required
npm run test:e2e  # e2e tests — requires the local Postgres above, migrated
```
