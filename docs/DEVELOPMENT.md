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
