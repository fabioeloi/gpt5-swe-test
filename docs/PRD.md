# PRD — Trello-like POC with Native Generative AI (BYO OpenAI-Compatible)

Owner: Product & Platform Team  
Version: 0.9 (POC)  
Date: 2025-08-08  
License: Apache-2.0 (OSS)

## 1) Executive summary

Build a lightweight, internal, Trello-like board app to explore AI-assisted work management. The POC focuses on core Kanban features (boards, lists, cards, drag-and-drop) plus native generative AI that users can enable via their own OpenAI-compatible endpoint (e.g., OpenAI, Azure OpenAI, OpenRouter, vLLM/Ollama). Ship fast with an OSS stack, strong DevOps foundations (IaC, CI/CD, observability), and clean Domain-Driven Design (DDD). Test-first (TDD) and deploy to a managed dev environment using Terraform.

## 2) Goals and non-goals

Goals (POC scope)

- Core Kanban features: boards, lists, cards, labels, due dates, assignees, comments.
- Drag-and-drop card movement with optimistic UI updates.
- Native AI assistant for: card creation from natural language, card summaries, checklist generation, auto-label suggestions.
- BYO OpenAI-compatible endpoint configuration at org level; optional per-user overrides. No vendor lock-in.
- Secure-by-default: API keys kept server-side, env or secret manager; opt-in data sharing to AI.
- OSS-first stack and licensing (Apache-2.0 by default).
- Modern SDLC: Agile, DDD, TDD, IaC, CI/CD, containerized, observability.

Non-goals (POC)

- Enterprise SSO and granular RBAC beyond basic roles (Admin/Member/Viewer) — outline only.
- Full real-time multi-user collaboration (presence, conflict resolution). Basic updates only.
- File attachments at scale; use links instead of storage.
- Extensive mobile apps. Target responsive web only.
- Complex automations and power-ups; provide minimal webhooks.

## 3) Personas and primary use cases

Personas

- Team Member: plans tasks, updates status, asks AI to summarize/extract next steps.
- Team Lead/PM: creates boards/templates, seeds backlogs via AI from goals/meeting notes.
- Platform Engineer: manages deployment, secrets, IaC, CI/CD.

Primary use cases

1. Create a board with lists (To Do / Doing / Done) and cards with labels/due dates.
2. Use AI to generate initial backlog from a goal statement.
3. Use AI to summarize a long card description or thread into action items/checklist.
4. Suggest labels or due dates based on card text.
5. Search/filter by text, label, assignee, due date.

## 4) Scope (MVP vs. Next)

MVP

- Auth: email/password (local) + Admin invite flow; roles: Admin/Member/Viewer.
- Boards, lists, cards CRUD; drag-and-drop; labels, due dates, assignees, comments.
- AI features: suggest tasks from prompt -> cards; summarize card; generate checklist; suggest labels.
- BYO AI config: org-level endpoint URL, API key, model name; server-side stored; per-user override optional.
- REST API with OpenAPI spec; server and UI validation.
- PostgreSQL persistence; migrations.
- Dockerized services; local dev via Docker Compose.
- CI: lint, typecheck, unit/integration tests, build images; CD: dev env deploy via Terraform.
- Observability: structured logs, basic tracing hooks, health/readiness.

Next (post-POC)

- SSO (OIDC/SAML), fine-grained RBAC, audit trails.
- Real-time collaboration via WebSockets and Redis pub/sub; presence and activity indicators.
- Attachments via S3-compatible storage; content scanning.
- Advanced AI: board-wide summarization, goal alignment, recurrence, AI agents for triage.
- GitOps (ArgoCD) and multi-env promotion; feature flags.

## 5) Functional requirements

5.1 Boards & lists & cards

- Create/rename/delete boards; invite users; set visibility (private/internal).
- Create/rename/delete lists within a board; order lists.
- Create/update/delete cards; move cards across lists via DnD; reorder within list.
- Card fields: title, description (markdown), labels (color/name), due date, assignees, checklist, comments.
- Filtering: by text, label, assignee, due window.

5.2 AI capabilities (native)

- Generate cards from a natural language prompt (e.g., "Create a sprint backlog for X").
- Summarize a card description or comment thread.
- Generate a checklist of actionable steps from description.
- Suggest labels and due dates based on text.
- Streaming responses where provider supports it.
- Configurable safety: optional PII redaction; opt-in data sharing flag per request.

5.3 Auth and roles

- Local accounts for POC (email/password; email verification optional).
- Roles: Admin (manage org/AI config), Member (CRUD boards/cards), Viewer (read-only).

5.4 API

- REST endpoints with JSON; OpenAPI 3 spec generated.
- Pagination and rate limits on list endpoints.
- Server-side validation; consistent error model.

5.5 Observability

- Health: /health (liveness), /ready (readiness).
- Structured logs with correlation IDs; minimal traces via OpenTelemetry.

## 6) Non-functional requirements

- Availability: Dev env target 99% during POC.
- Performance: P50 UI action < 150ms (local), API p95 < 400ms for CRUD; AI latencies depend on provider.
- Security: Secrets not logged; SDLC secrets scanning; HTTPS-only in hosted env; CSRF protection; input validation.
- Privacy: AI calls opt-in; redact emails/IDs when enabled; configurable data retention.
- Accessibility: WCAG 2.1 AA basics (keyboard nav, contrast, ARIA labels).
- Internationalization: English only (POC), externalized strings.

## 7) Architecture (DDD, high-level)

Bounded contexts

- Identity Context: users, orgs, roles, sessions.
- Boards Context: boards, lists, cards, labels, checklists.
- Collaboration Context: comments, events, notifications (MVP: comments only).
- AI Assistant Context: AI providers, prompts, safety filters, policy.

Tech stack (OSS)

- Frontend: Next.js (React, TypeScript, App Router), TailwindCSS, react-beautiful-dnd.
- Backend: NestJS (TypeScript), class-validator, Swagger, OpenTelemetry.
- Database: PostgreSQL (Prisma ORM).
- Cache/pub-sub (Next): Redis (for rate limit, sessions, later websockets).
- AI integration: OpenAI-compatible SDK (e.g., openai v4, or fetch) with configurable baseURL.
- Containerization: Docker; local dev via Docker Compose.
- IaC: Terraform (AWS by default); modules for network, RDS, ECS/ECR, secrets.
- CI/CD: GitHub Actions; unit/integration tests, image build/push, Terraform plan/apply to dev.
- Observability: OTEL SDKs; logs shipped to CloudWatch (AWS) or Loki; metrics via Prometheus (optional).

Logical components

- Web App (Next.js): UI, SSR for board pages, API proxy when needed.
- API Service (NestJS): domain logic, REST, auth, AI orchestration.
- Postgres: persistence.
- Optional Redis: rate limiting, sessions, future real-time.

## 8) Data model (POC)

Core entities

- User: id, email, name, role, createdAt, updatedAt.
- Organization: id, name, aiConfigId?, createdAt, updatedAt.
- AIConfig: id, baseUrl, apiKey (encrypted), model, requestPolicy (redaction on/off), timeoutMs.
- Board: id, orgId, name, description, ownerId, createdAt, updatedAt.
- List: id, boardId, name, order.
- Card: id, listId, title, description, order, dueDate?, archived, createdBy, assignees[], labels[], createdAt, updatedAt.
- Comment: id, cardId, authorId, body, createdAt.
- ChecklistItem: id, cardId, text, done, order.

Note: Store apiKey encrypted at rest; prefer cloud secret manager for non-local deploys.

## 9) API design (selected endpoints)

Auth

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout

Boards

- GET /api/boards
- POST /api/boards
- GET /api/boards/:id
- PATCH /api/boards/:id
- DELETE /api/boards/:id

Lists

- POST /api/boards/:boardId/lists
- PATCH /api/lists/:id
- DELETE /api/lists/:id

Cards

- POST /api/lists/:listId/cards
- GET /api/cards/:id
- PATCH /api/cards/:id
- DELETE /api/cards/:id
- POST /api/cards/:id/move  (targetListId, order)

Comments & Checklist

- POST /api/cards/:id/comments
- POST /api/cards/:id/checklist
- PATCH /api/checklist/:itemId

AI (BYO)

- POST /api/ai/cards-from-prompt { prompt }
- POST /api/ai/summarize-card { cardId | text }
- POST /api/ai/generate-checklist { cardId | text }
- POST /api/ai/suggest-labels { cardId | text }

Common

- GET /health, GET /ready

Error model

```json
{ "error": { "code": "string", "message": "string", "details": "any" } }
```

## 10) AI integration (BYO OpenAI-compatible)

Configuration

- Org-level: baseUrl, apiKey, model; stored server-side (env or secret manager).
- Optional per-user override for experimentation; must be enabled by Admin.
- Env vars: AI_BASE_URL, AI_API_KEY, AI_MODEL, AI_TIMEOUT_MS, AI_REDACTION=on|off.

Providers (examples)

- OpenAI (api.openai.com), Azure OpenAI (per-deployment base URL), OpenRouter (openrouter.ai), Local (vLLM/Ollama base URL).

Contracts

- Use standard chat-completions or responses API; support streaming (SSE) when available.
- Implement provider-agnostic adapter; retry/backoff; circuit breaker for failures.

Safety & privacy

- Opt-in on every AI action; UI toggle + policy banner.
- Optional redaction of emails/IDs/order numbers via regex before sending to AI.
- Blocklist/allowlist for model names can be configured by Admin.

Testing

- Hermetic mock of OpenAI-compatible API for unit/integration tests.
- Golden tests for prompt templates and output shapes.

## 11) Security & compliance

- Secrets management: .env for local; AWS SSM Parameter Store/Secrets Manager for cloud.
- Least privilege IAM for CI/CD, runtime services.
- HTTPS/TLS termination at ALB; HSTS.
- CSRF protection, secure cookies, session hardening.
- Audit logs for admin AI config changes (post-POC: full audit trails).
- Dependency scanning (SCA) and secret scanning in CI.

## 12) DevOps, IaC, environments

Environments

- Local: Docker Compose (web, api, postgres, optional redis).
- Dev (shared): AWS via Terraform (VPC + RDS Postgres + ECS Fargate/ECR + ALB + SSM).

IaC (Terraform)

- Modules: network, database, registry, compute, secrets, observability.
- Pipelines run terraform init/validate/plan on PRs; apply on main for dev.

Observability

- Logs: JSON to stdout; ship to CloudWatch in dev.
- Traces: OTEL collectors optional; route to AWS X-Ray or self-hosted Jaeger.
- Metrics: basic service metrics; health endpoints monitored.

Runbooks

- Rotate AI keys, update models, disable AI globally, rollback deployments.

## 13) CI/CD (GitHub Actions)

Pipelines

- PR: lint, typecheck, unit tests (frontend/backend), integration tests (API + mock AI), build docker images, terraform validate/plan (no apply).
- Main: all above + push images to ECR + terraform apply to dev.

Quality gates

- Lint and typecheck must pass.
- Unit test coverage target: backend 80%, frontend 70% (POC-level).
- OpenAPI schema generated and checked.

## 14) Testing strategy (TDD)

- Unit tests: domain services, entities, adapters (AI provider mock), validators.
- Integration tests: REST endpoints against ephemeral Postgres and mock AI.
- E2E (smoke): Playwright flows (create board, create cards, move card, AI generate checklist).
- Contract tests: ensure OpenAPI schema matches server behavior.

## 15) UX overview

- Clean board view: horizontal lists with vertical cards; drag-and-drop.
- Card details drawer: description markdown, labels, due date, assignees, checklist, comments.
- AI actions: in card drawer (summarize, checklist, suggest labels) and board-level (generate backlog).
- Settings: org AI configuration page with test-connection feature.

Accessibility & performance

- Keyboard support for moving cards (alternative to DnD), focus styles, aria-live for updates.
- Lazy-load long lists; virtualize large boards (post-POC if needed).

## 16) Milestones and timeline (Agile)

Sprint 0 (1 week): Foundations

- Repo bootstrapping, OSS license, CI scaffolding, Docker Compose, Terraform baseline, health endpoints.

Sprint 1 (2 weeks): Core Kanban

- Auth (local), Boards/Lists/Cards CRUD, DnD, labels/due dates/assignees, comments, filters.

Sprint 2 (2 weeks): AI MVP

- AI adapter, org-level BYO configuration, card generation from prompt, summaries, checklists, label suggestions.
- Tests with mock AI; observability and basic rate limiting.

Sprint 3 (1 week): Hardening & Dev deploy

- CI/CD to dev (ECR/ECS/RDS), docs, runbooks, acceptance testing.

## 17) Acceptance criteria

- A user can create a board, lists, and at least 10 cards; move cards via DnD; filter by label.
- Admin can configure AI base URL, API key, and model; test connection succeeds for OpenAI-compatible endpoints.
- AI can: (a) generate 5+ cards from a prompt, (b) summarize a card, (c) produce a checklist, (d) suggest at least 1 label.
- CI passes: lint, typecheck, unit/integration tests; images build; Terraform plan clean.
- Dev environment reachable over HTTPS; healthchecks green; logs visible.

## 18) Risks and mitigations

- Provider variability (rate limits, API quirks): adopt adapter layer, retries, timeouts, circuit breakers.
- Data leakage to AI: default opt-out; redaction; admin controls; strict logging.
- Scope creep: keep post-POC features out; clear milestones.
- Performance on large boards: virtualize later; set POC data size limits.

## 19) Open questions

- Should per-user BYO API keys be enabled in POC or post-POC only?
- Preferred cloud for dev env (AWS/GCP/Azure)? Defaulting to AWS.
- Any corporate compliance requirements (DLP, logging retention) we must meet in POC?

## 20) Appendix

20.1 Example AI prompt templates (conceptual)

- Backlog from goal: "You are an agile planner..." -> output as JSON array of { title, description, labels, checklist? }.
- Card summary: "Summarize the following description..." -> bullet list of key points.
- Checklist generation: "Extract actionable steps..." -> ordered bullet list.

20.2 Environment variables (summary)

- AI_BASE_URL, AI_API_KEY, AI_MODEL, AI_TIMEOUT_MS, AI_REDACTION, DATABASE_URL, NODE_ENV.

20.3 Licensing

- Apache-2.0 for code; third-party libs under their respective OSS licenses.

---

This PRD specifies an OSS-based, AI-enabled Trello-like POC aligned with Agile, DDD, TDD, IaC, CI/CD, and DevOps practices.



