# Development quickstart

This repo includes a minimal Next.js web app and a NestJS API. A local Postgres is provided via Docker Compose.

Prereqs:

- Node.js 20+
- Docker Desktop

Local dev without Docker (two terminals):

```bash
# 1) Start Postgres (optional if you have your own)
docker compose up -d db

# 2) API
cd apps/api
npm install
npm run start:dev

# 3) Web
cd ../../apps/web
npm install
npm run dev
```

All-in-one with Docker Compose:

```bash
docker compose up --build
```

Services:

- Web: <http://localhost:3000>
- API: <http://localhost:4000/health>
- DB: 5432

Environment:

- Copy `.env.example` to `.env` and update values as needed.

AI settings (server-side only):

- AI_BASE_URL (default: <https://api.openai.com/v1>)
- AI_MODEL (default: gpt-4o-mini)
- AI_API_KEY (your key; never expose in the browser)

Test AI chat endpoint (example request):

```bash
curl -s http://localhost:4000/ai/chat \
	-H 'Content-Type: application/json' \
	-d '{
		"messages": [
			{ "role": "system", "content": "You are a helpful assistant." },
			{ "role": "user", "content": "Say hello in one short sentence." }
		]
	}' | jq
```

Seed demo data:

```bash
# Run after DB is up and migrations applied
cd apps/api
export DATABASE_URL=${DATABASE_URL:-"postgresql://postgres:postgres@localhost:5432/gpt5"}
npx prisma migrate dev --schema ../../prisma/schema.prisma --name init --skip-seed
npm run prisma:seed
```

Try the Boards page:

- Web: <http://localhost:3000/boards>

AI-powered suggestions in UI:

- On the board detail page, each list has a Suggest button next to the card composer.
- It calls the server-side AI proxy at `/ai/chat` to generate a short, action-oriented card title.
- Configure `AI_BASE_URL`, `AI_MODEL`, and `AI_API_KEY` in the API environment for this to work. If not configured, the Suggest action will no-op.
