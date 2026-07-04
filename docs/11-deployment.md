# 11 - Deployment Specification

This document details the configuration required to build, package, and deploy the Personal Finance Manager MVP.

## 1. Containerization (Docker)
The system is divided into two separate container definitions coordinated by a production Docker Compose orchestrator.

### 1.1. Dockerfile Definitions
*   **Backend Dockerfile (`docker/backend.Dockerfile`)**: Uses multi-stage builds (`node:18-alpine`).
    1.  *Stage 1: Build*: Installs packages, generates Prisma Client, and transpiles TypeScript code.
    2.  *Stage 2: Production*: Copies built artifacts and generated node modules. Runs with `NODE_ENV=production`.
*   **Frontend Dockerfile (`docker/frontend.Dockerfile`)**: Uses multi-stage builds.
    1.  *Stage 1: Build*: Compiles React assets using Vite.
    2.  *Stage 2: Production*: Serves static HTML/JS/CSS assets via an **Nginx** alpine image.

---

## 2. Nginx Reverse Proxy Config (`docker/nginx.conf`)
Nginx acts as the single entry point, routing incoming external traffic to the correct internal container.

```nginx
server {
    listen 80;
    server_name localhost;

    # Frontend Routing
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API Routing
    location /api/v1/ {
        proxy_pass http://backend:5000/api/v1/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 3. CI/CD Workflow (GitHub Actions)
Located in `.github/workflows/ci-cd.yml`.

1.  **Trigger**: Triggers on code push or pull request to the `main` branch.
2.  **Lint & Test Stage**:
    *   Spins up Node environment, installs dependencies, and runs tests.
3.  **Build Stage**:
    *   Builds Docker images for `frontend` and `backend`.
    *   Pushes tagged images to the target container registry (e.g., GHCR).
4.  **Deploy Stage**:
    *   Triggers a webhook on the host VPS server to pull latest images and restart containers:
    ```bash
    docker-compose -f docker-compose.prod.yml pull
    docker-compose -f docker-compose.prod.yml up -d
    ```

---

## 4. Backups & Database Health Checks
*   **Health Checks**: PostgreSQL containers use standard `pg_isready` command health evaluations. Nginx uses HTTP ping endpoint checking for the backend (`/api/v1/health`).
*   **Backup Strategy**: Daily cron jobs execute pg_dump utilities on the PostgreSQL database and write compressed sql archives to local backups volumes.
    *   *Backup Script*: `scripts/db-backup.sh`
