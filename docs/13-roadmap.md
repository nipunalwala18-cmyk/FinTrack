# 13 - Roadmap

This roadmap details the engineering path to deliver the Personal Finance Manager MVP. Future expansion features (e.g., bank synchronization, mobile app, receipt OCR) are excluded to ensure a focused and rapid release.

## 1. Milestones Overview

```
Phase 1 ──> Phase 2 ──> Phase 3 ──> Phase 4 ──> Phase 5
(Base)    (Core)     (Planning)    (AI Integration)  (Prod Launch)
```

---

## 2. Phase Detail & Schedule

### Phase 1: Project Foundation (Weeks 1 - 2)
*   **Deliverables**:
    *   Set up monorepo project directories and basic dependencies.
    *   Initialize backend structure, Prisma schema generation, and PostgreSQL local migration.
    *   Establish Core Authentication (Register, Login, JWT verification setup, Google OAuth flow).
    *   Configure frontend base routing (Vite, React Router, Redux state foundation).
    *   Configure Prettier, ESLint, Husky, and basic Docker Compose configurations.

### Phase 2: Core Financial Ledger (Weeks 3 - 4)
*   **Deliverables**:
    *   Implement Accounts API (CRUD, Archive balance cache updates).
    *   Implement Categories API (system seeds and custom category management).
    *   Implement Transactions API (CRUD, Search & Filter endpoints, local attachments support).
    *   Build frontend dashboard views, transactions grids, and account card widgets.
    *   Implement CSV export and import validation utilities.

### Phase 3: Financial Planning & Reports (Weeks 5 - 6)
*   **Deliverables**:
    *   Implement Budgets Module (upsert limit, calculate current spent progress).
    *   Implement Savings Goals Module (track progress toward targets, log contributions).
    *   Create Reports Module on the backend (aggregate endpoints) and render dashboards charts using Recharts in the frontend.
    *   Set up budget alerts notifications inside the UI header.

### Phase 4: AI Assistant Integration (Week 7)
*   **Deliverables**:
    *   Establish `AiModule` abstraction interfaces.
    *   Implement context builder services to gather authenticated data securely.
    *   Create LLM chat interfaces (OpenAI client integration).
    *   Build persistent chat panel widget on the React frontend.
    *   Implement PII filters and prompt injection protections.

### Phase 5: Testing, Hardening & Production Launch (Week 8)
*   **Deliverables**:
    *   Add E2E tests using Playwright.
    *   Set up production Nginx configurations and production Docker Compose files.
    *   Configure GitHub Actions CI/CD pipelines.
    *   Complete vulnerability auditing and security tests.
    *   Deploy the MVP release to host VPS staging.
