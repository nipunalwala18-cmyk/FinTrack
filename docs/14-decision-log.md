# 14 - Architectural Decision Log

This document records the major architectural decisions and trade-offs for the Personal Finance Manager MVP.

## 1. ADL-01: Choice of Backend Framework (NestJS)
*   **Decision**: Use NestJS + TypeScript for the backend services.
*   **Alternatives Considered**: Express.js, Fastify (raw), Go (Gin).
*   **Rationale**:
    *   NestJS provides a highly structured modular design out of the box, which is ideal for a growing codebase.
    *   Built-in dependency injection facilitates cleaner code isolation and unit testing.
    *   TypeScript support is standard, ensuring full type safety from the controller to the service layer.
*   **Trade-offs**: Slightly steeper learning curve and higher initial boilerplate overhead compared to a minimal Express setup.

---

## 2. ADL-02: Object-Relational Mapper (Prisma)
*   **Decision**: Use Prisma ORM.
*   **Alternatives Considered**: TypeORM, Sequelize, Raw SQL (pg).
*   **Rationale**:
    *   Prisma schema acts as a single source of truth for both migrations and TypeScript models.
    *   Strong static type safety prevents queries referencing invalid fields.
    *   Excellent developer experience (DX) and out-of-the-box auto-completions.
*   **Trade-offs**: Less control over highly complex nested SQL queries compared to raw SQL; however, raw SQL bypasses are supported when necessary.

---

## 3. ADL-03: Primary Database Engine (PostgreSQL)
*   **Decision**: Use PostgreSQL.
*   **Alternatives Considered**: MySQL, MongoDB.
*   **Rationale**:
    *   Robust support for transactions ensures ledger consistency (critical for double-entry financial logic).
    *   Native UUID support, rich index options, and strong performance profiles.
    *   Exceptional support for JSONB fields allowing storage of flexible audit logs and metadata.
*   **Trade-offs**: Requires structural migration management compared to NoSQL alternatives.

---

## 4. ADL-04: AI Service Abstraction Layer
*   **Decision**: Implement a customizable `AiProvider` interface inside the backend.
*   **Alternatives Considered**: Hardcoding OpenAI API client directly in controllers.
*   **Rationale**:
    *   Allows switching between OpenAI and local/self-hosted LLM backends simply by editing environment variables.
    *   Simplifies testing by permitting easy mock injections of AI replies.
*   **Trade-offs**: Requires writing custom wrappers and interface maps.
