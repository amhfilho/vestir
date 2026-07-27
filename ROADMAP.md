# Vestir

A personal app that suggests outfits based on your own wardrobe, powered by AI vision, embeddings, and generative image models.

> Non-commercial side project, built for learning AI-assisted development.

## How it works

The app is built around a 3-phase pipeline:

1. **Garment analysis** — upload a photo of a clothing item; Claude's vision model extracts structured metadata (type, colors, style, occasion, pattern, estimated material), which is embedded and stored for semantic search.
2. **Outfit suggestions** — an AI agent picks garments from your wardrobe for a given occasion, mood, or weather, and explains its choices.
3. **Image generation** — a generated preview image shows what the suggested outfit looks like on you.

## Tech stack

| Layer | Choice |
|---|---|
| Backend | Node.js + [NestJS](https://nestjs.com/) (TypeScript) |
| Database | PostgreSQL + [pgvector](https://github.com/pgvector/pgvector) |
| ORM | [Prisma](https://www.prisma.io/) |
| Object storage | Cloudflare R2 (S3-compatible) |
| Vision / analysis | Claude API (multimodal) |
| Embeddings | OpenAI `text-embedding-3` or Claude embeddings |
| Agent framework | LangChain.js + Claude API |
| Image generation | Replicate (Flux Dev + IP-Adapter + ControlNet) |
| Frontend | Next.js (later phase) |

## Architecture

### Phase 0 — Setup development environment
1. Initialize git repository
2. Create basic skeleton/scaffolding for phase 1
3. Install required libraries
4. "Hello World" — confirm the environment works end to end
5. Initial README with basic setup instructions (update as phases are completed)

### Phase 1 — Garment analysis
When a garment photo is uploaded:
1. Image is stored in R2. *(during development: local disk)*
2. Claude API (vision) extracts JSON metadata: `type`, `colors[]`, `style`, `occasion[]`, `pattern`, `estimated_material`. *(during development: mocked)*
3. An embedding is generated from the textual description. *(during development: mocked)*
4. Everything is persisted in PostgreSQL, with the embedding stored via pgvector. *(during development: local Docker container)*
5. Unit tests and manual validation.

### Phase 1.1 — Cloud and external services
1. Set up R2 for image storage
2. Set up Claude API (vision)
3. Set up embedding generation
4. Set up a cloud provider for application hosting
   - 4.1. Discuss cloud provider options
   - 4.2. Set up and deploy

### Phase 2 — Suggestion agent
A LangChain.js agent with tools (`search_wardrobe`, `get_user_style_profile`, `search_fashion_rules`) takes context — occasion, mood, weather — and returns 3 outfit suggestions, each with garment IDs and reasoning.

### Phase 3 — Image generation
Replicate (Flux Dev + IP-Adapter + ControlNet) combines a reference photo of the user with the suggested garments to generate a 1024×1024 webp preview image.

## Project structure

```
vestir/
├── backend/
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── wardrobe/        # garment CRUD
│   │   ├── outfits/         # outfit suggestions
│   │   ├── images/          # image generation endpoints
│   │   ├── claude-vision/   # garment analysis service
│   │   ├── embeddings/      # embedding generation service
│   │   ├── agent/           # LangChain.js suggestion agent
│   │   ├── image-gen/       # Replicate integration
│   │   └── prisma/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── .env.example
├── frontend/                # Next.js (later phase)
└── docker-compose.yml
```

## Status

- [ ] Phase 0: dev environment setup
- [ ] Phase 1: upload endpoint + Claude Vision analysis (mocked)
- [ ] Phase 1: PostgreSQL schema + pgvector (local)
- [ ] Phase 1: wardrobe CRUD
- [ ] Phase 1.1: real R2, Claude Vision, embeddings + cloud deploy
- [ ] Phase 2: LangChain.js agent
- [ ] Phase 3: Replicate integration

## Getting started

```bash
cd backend
cp .env.example .env   # fill in DB, R2, Claude/OpenAI/Replicate credentials
npm install
npx prisma migrate dev
npm run start:dev
```

## License

Personal project — no license granted for reuse yet.
