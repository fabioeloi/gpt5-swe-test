# ADR 0001: Architecture and OSS Stack

- Status: Accepted
- Date: 2025-08-08

## Context

We need an OSS-first, web-based Trello-like POC with native BYO OpenAI-compatible AI integration and solid DevOps foundations.

## Decision

- Frontend: Next.js (React, TS, App Router), TailwindCSS, react-beautiful-dnd
- Backend: NestJS (TypeScript), class-validator, Swagger/OpenAPI
- DB: PostgreSQL with Prisma ORM
- Containerization: Docker & Compose for local
- IaC: Terraform on AWS (VPC, RDS Postgres, ECS Fargate, ECR, ALB, SSM)
- Observability: Structured logs, optional OTEL traces
- CI/CD: GitHub Actions (lint, tests, build images, terraform validate/plan; apply to dev on main)
- AI: OpenAI-compatible SDK with configurable baseURL/model/key stored server-side

## Consequences

- Pros: OSS, scalable, maintainable, avoids vendor lock-in for AI providers.
- Cons: Requires managing multiple toolchains and infra components.

## Alternatives considered

- Monolithic Node app without NestJS — simpler but less structured.
- Serverless-first (Lambda) — faster iteration but more complex local dev.

## References

- PRD sections 7, 9, 10, 12, 13.
