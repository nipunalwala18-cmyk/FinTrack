# 05 - Project Structure

The project uses a monorepo-ready layout separating frontend and backend configurations, with centralized configurations for database models, docker environments, testing environments, and documentation.

## 1. Project Directory Layout

```
personal-finance-manager/
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── accounts/
│   │   │   ├── transactions/
│   │   │   ├── categories/
│   │   │   ├── budgets/
│   │   │   ├── goals/
│   │   │   ├── reports/
│   │   │   ├── notifications/
│   │   │   └── ai/
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   └── tsconfig.json
├── database/
│   ├── migrations/
│   └── seeds/
│       └── seed.ts
├── docker/
│   ├── backend.Dockerfile
│   ├── frontend.Dockerfile
│   └── nginx.conf
├── docs/
│   ├── 01-functional-requirements.md
│   ├── 02-ui-ux.md
│   ├── 03-database-schema.md
│   ├── 04-api-specification.md
│   └── ... (documentation files)
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── accounts/
│   │   │   ├── transactions/
│   │   │   ├── budgets/
│   │   │   └── ai/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── scripts/
│   ├── db-backup.sh
│   └── deploy.sh
├── tests/
│   ├── e2e/
│   │   └── auth.spec.ts
│   └── jest.config.ts
├── docker-compose.yml
├── package.json
└── README.md
```

---

## 2. Directory Explanations

*   **`.github/workflows`**: Houses YAML workflows for GitHub Actions CI/CD pipelines (compiling codes, running tests, compiling Docker images).
*   **`backend`**: Contains the NestJS framework project code.
    *   `src/modules`: Individual NestJS modules encapsulating services, controllers, data transfer objects (DTOs), and domain entities.
    *   `src/prisma`: Prisma ORM definitions, schemas, and client generators.
*   **`database`**: Dedicated SQL migration files and typescript seed configurations.
*   **`docker`**: Dedicated Dockerfiles and Nginx routing rules to build services for production.
*   **`docs`**: Holds the markdown documentation suite.
*   **`frontend`**: Built on React, TypeScript, and Vite.
    *   `src/components`: Reusable layout structures and custom widgets (e.g. Buttons, Modals, Forms).
    *   `src/features`: Logic and specific state sub-slices (Redux toolkit endpoints) grouped by application domains.
    *   `src/store`: Application-wide Redux store assembly.
*   **`scripts`**: Utility scripts to perform tasks like database backups and remote deployments.
*   **`tests`**: Framework-level End-to-End (E2E) testing configurations using Playwright.
