# Trello-like POC with Native Generative AI (BYO OpenAI-Compatible)

This repository hosts a POC for a Trello-like app with native generative AI integration using a user-provided OpenAI-compatible endpoint. It follows OSS-first practices and modern SDLC (Agile, DDD, TDD, IaC, CI/CD, DevOps).

- Product Requirements: see `docs/PRD.md`.
- License: Apache-2.0 (see `LICENSE`).

## Quickstart

- Prereqs: Node 20+, Docker Desktop
- Copy `.env.example` to `.env` and adjust values
- Local dev (split terminals):
  - API: `cd apps/api && npm install && npm run start:dev`
  - Web: `cd ../web && npm install && npm run dev`
- Or use Docker Compose: `docker compose up --build`

Services:

- Web: <http://localhost:3000>
- API: <http://localhost:4000/health>, AI chat: POST <http://localhost:4000/ai/chat>

See `docs/DEVELOPMENT.md` for details.

Seed and Boards page:

- Seed demo data: see `docs/DEVELOPMENT.md` (Prisma seed)
- Boards UI: <http://localhost:3000/boards>

AI endpoint:

- Configure AI vars in `.env`, then POST to `/ai/chat` (server proxies to your OpenAI-compatible endpoint). See `docs/DEVELOPMENT.md`.

## docs

- `docs/PRD.md` — Comprehensive PRD covering scope, architecture, AI integration, security, IaC, CI/CD, and testing.
- `docs/DEVELOPMENT.md` — Local setup, Docker, and service endpoints.

## license

Apache License 2.0 — see `LICENSE`.
