# 15 - Contributing Guidelines

Welcome! This guide outlines how to contribute to the Personal Finance Manager MVP.

## 1. Code of Conduct
*   We prioritize constructive communication, respect, and collaborative review.
*   Ensure all comments, reviews, and pull request interactions remain professional and positive.

---

## 2. Setting Up Your Environment
To contribute to the project, follow these setup steps:
1.  **Fork and Clone**: Fork the repository and clone it to your local machine.
2.  **Infrastructure Dependencies**: Boot the database and caching layer using Docker:
    ```bash
    docker-compose -f docker-compose.dev.yml up -d
    ```
3.  **Backend Setup**:
    ```bash
    cd backend
    npm install
    npx prisma migrate dev
    npm run start:dev
    ```
4.  **Frontend Setup**:
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```

---

## 3. Style & Standards Enforcement
*   **Linters**: Always run linting prior to submitting changes:
    ```bash
    npm run lint
    ```
*   **Formatters**: Code must be formatted via Prettier. Files are automatically formatted on commit using Husky hooks.
*   **TypeScript**: Explicitly define types for all functions, properties, and parameters. Strict mode must pass compilation without warnings.

---

## 4. Testing Requirements
Any new features or bug fixes must be backed by appropriate test coverage:
*   **Backend Services**: Add unit tests in Jest (`*.spec.ts`).
*   **API Routes**: Add integration tests using Supertest.
*   **Coverage Checks**: Ensure tests pass and the coverage metrics meet the project's quality gates (80% backend services, 75% frontend features).
    ```bash
    # Run backend tests
    npm run test:cov
    ```

---

## 5. Pull Request Process
1.  Create a feature branch from `main`: `feat/my-awesome-feature`.
2.  Follow the commit formatting guidelines (Conventional Commits).
3.  Push changes and open a Pull Request (PR) targeting `main`.
4.  Complete the PR template description detailing the changes, reasoning, and testing results.
5.  Wait for review approval. At least one maintainer review is required before merging.
