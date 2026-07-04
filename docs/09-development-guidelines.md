# 09 - Development Guidelines

## 1. Development Workflow
We follow a systematic workflow to implement features:
1.  **Requirement Clarification**: Align with specifications in functional requirements.
2.  **Database Migration**: Update `schema.prisma` and generate PostgreSQL migrations if needed.
3.  **API Design**: Define DTOs and routes in Swagger-like specifications.
4.  **Backend Implementation**: Write NestJS logic, service methods, and integration tests.
5.  **Frontend Integration**: Create React UI layouts, state management slices, and validate inputs.
6.  **Verification**: Write automated unit and E2E tests before submission.

---

## 2. Git Branching Strategy (GitHub Flow)
We use a lightweight, branch-based workflow:
*   `main`: Holds the current production-ready code. Must never be committed to directly.
*   Feature Branches: Branched from `main` using naming conventions:
    *   `feat/feature-name` (e.g., `feat/google-oauth`)
    *   `fix/bug-name` (e.g., `fix/transaction-rounding`)
    *   `docs/doc-updates`
*   **PR Merging**: Code is merged into `main` via Pull Requests. Rebase-merge is preferred to maintain a clean git history.

---

## 3. Environment Setup

### Prerequisites
*   Node.js 18+ (LTS)
*   Docker & Docker Compose

### Local Infrastructure Setup
To start PostgreSQL and Redis dependencies locally, run:
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Installation & Initialization
1.  **Backend**:
    ```bash
    cd backend
    npm install
    npx prisma migrate dev --name init
    npx prisma db seed
    npm run start:dev
    ```
2.  **Frontend**:
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```

---

## 4. Commit Message Conventions
We follow the **Conventional Commits** specification:
*   `feat: add google oauth login support`
*   `fix: fix transaction filter pagination bug`
*   `docs: update api endpoint guidelines`
*   `test: add playwright tests for budgets`
*   `refactor: optimize transaction querying`

---

## 5. Tooling & Linters
*   **Code Formatting**: Prettier is configured workspace-wide. Runs automatically on save or commit.
*   **Linting**: ESLint configurations enforce rules in both frontend and backend projects.
*   **Pre-commit Hooks**: Husky runs Prettier formatting and ESLint checks on changed files before permitting commits.
