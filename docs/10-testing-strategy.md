# 10 - Testing Strategy

This document outlines the testing architecture and standards for the Personal Finance Manager MVP.

## 1. Testing Pyramid

```
   / \      E2E Testing (Playwright)
  /   \     Integration Testing (NestJS Controllers + Supertest + Prisma Mock/Test DB)
 /     \    Unit Testing (Jest + React Testing Library)
/_______\
```

---

## 2. Unit Testing

### 2.1. Backend (NestJS + Jest)
*   **Scope**: Services, Pipes, Guards, and Helpers.
*   **Guidelines**:
    *   Mock all database access via Prisma Client mock providers.
    *   Focus on logical branch paths, validation constraints, and business calculation coverage.
    *   *Example Test File Structure*: `src/modules/transactions/transactions.service.spec.ts`

### 2.2. Frontend (React + React Testing Library + Jest)
*   **Scope**: Feature components, calculation helpers, and custom hooks.
*   **Guidelines**:
    *   Mock Redux state configurations and RTK Query hooks.
    *   Verify component renders, state transitions, validation message updates, and form submissions.
    *   *Example Test File Structure*: `src/features/transactions/TransactionForm.spec.tsx`

---

## 3. Integration Testing (Backend + Database)
*   **Scope**: API Endpoint controllers and Prisma database interactions.
*   **Execution Strategy**:
    *   Spin up an ephemeral PostgreSQL instance in Docker.
    *   Run Prisma migrations to construct the test schema.
    *   Use **Supertest** to fire real HTTP requests against the NestJS app instance and verify DB writes.
    *   Roll back or truncate tables between test suites.

---

## 4. End-to-End (E2E) Testing (Playwright)
*   **Scope**: Complete user journeys (Register -> Login -> Add Account -> Create Transaction -> Check Budget Alerts).
*   **Execution Strategy**:
    *   Playwright boots up chromium/firefox engines.
    *   Executes tests against live local or staging environments.
    *   Seeds a clean test user account before each suite runs.
    *   *Example Test Location*: `tests/e2e/auth.spec.ts`

---

## 5. Coverage Goals & Quality Gates
*   **Minimum Coverage Thresholds**:
    *   *Backend Services*: 80% Statement and Branch coverage.
    *   *Frontend Features*: 75% Statement coverage.
*   **Quality Gates**: Coverage reports are compiled on every PR. Commits fail CI checks if coverage percentages drop below target limits.
