# 08 - System Architecture

This document describes the high-level architecture of the Personal Finance Manager MVP.

## 1. System Overview Diagram (Textual)
```
       [Client Browser]
              │ (React Single Page App)
              ▼
    [Nginx Reverse Proxy]
              │
      ┌───────┴────────┐
      ▼                ▼
[NestJS Backend]  [Static Frontend Assets]
  │   │   │
  │   │   └──> [Redis Cache] (Rate limiting, Session details)
  │   ▼
  │ [Prisma ORM] ──> [PostgreSQL Database]
  ▼
[AI Service Layer] ──> [OpenAI API] (or self-hosted LLM wrapper)
```

---

## 2. Backend Modular Design
The backend is structured into autonomous modules to simplify code navigation and future service splits:

*   **`CoreModule`**: Manages globally shared resources, databases, configurations, and general middlewares.
*   **`AuthModule`**: Handles user registrations, passport-jwt strategies, OAuth integrations, and credential validation.
*   **`LedgerModule`**: Integrates `AccountsModule`, `TransactionsModule`, and `CategoriesModule` for ledger operations.
*   **`PlanningModule`**: Covers `BudgetsModule` and `GoalsModule`.
*   **`AnalyticsModule`**: Contains `ReportsModule` for data aggregates and trends.
*   **`AiModule`**: Operates LLM interactions, prompts, data mapping, and conversation histories.

---

## 3. Caching & Storage Architecture (Redis & PostgreSQL)
*   **PostgreSQL**: Serves as the primary system of record. High-integrity data (Transactions, Users, Budgets) is stored here.
*   **Redis**:
    *   *Rate Limiting*: Tracks user IPs and account login attempts (throttling requests exceeding 100 requests per minute).
    *   *Session Metadata*: Holds temporary verification tokens and blacklisted JWT IDs to invalidate sessions during logouts.

---

## 4. AI Assistant Context Builder & Abstraction
The AI module operates as an isolated component inside the backend codebase.

```
[User Chat Prompt] ──> [Context Builder] ──> [AI Provider Interface] ──> [OpenAI Service]
                            ▲
                            │ (Fetch User Data via Internal Services)
                     [Prisma Services]
```

1.  **Context Builder**: When a prompt is received, the AI module makes internal service calls to compile current account balances, monthly budget progress, and recent transaction logs for the requesting user.
2.  **Interface Wrapper**: The `AiProvider` interface exposes a single async method: `generateResponse(prompt: string, context: FinancialContext): Promise<string>`.
3.  **Configurable Backend**: The NestJS configuration resolver reads from environmental settings to bind this interface to either the `OpenAiProvider` (cloud) or a local self-hosted mock `LlmProvider` service instance.
