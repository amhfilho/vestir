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

## Try it out (wardrobe API)

With the server running (`npm run start:dev`), upload a garment photo. The
image is stored locally, "analyzed" (mocked Claude Vision — see
[ROADMAP.md](../ROADMAP.md)), embedded (mocked), and saved to Postgres:

```bash
curl -X POST http://localhost:3000/wardrobe \
  -F "image=@/path/to/a/photo.jpg"
```

```json
{
  "id": "b4bfdbce-a392-4284-9db0-c5e6e141d912",
  "imagePath": "e4b38065-4444-47ac-98ab-47b818c172bb-photo.jpg",
  "type": "T-Shirt",
  "colors": ["white"],
  "style": "casual",
  "occasions": ["everyday", "weekend"],
  "pattern": "solid",
  "estimatedMaterial": "cotton",
  "description": "A white solid T-Shirt, casual style, suitable for everyday, weekend. Estimated material: cotton.",
  "createdAt": "2026-07-27T23:28:45.947Z",
  "updatedAt": "2026-07-27T23:28:45.947Z"
}
```

List everything in the wardrobe:

```bash
curl http://localhost:3000/wardrobe
```

Fetch one garment by id (the `id` from the upload response):

```bash
curl http://localhost:3000/wardrobe/b4bfdbce-a392-4284-9db0-c5e6e141d912
```

Only create and read are implemented so far (see `ROADMAP.md` status) —
update/delete aren't part of Phase 1's scope yet.
