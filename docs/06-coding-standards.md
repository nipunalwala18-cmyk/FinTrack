# 06 - Coding Standards

## 1. Naming Conventions

*   **Variables, Functions & Methods**: `camelCase` (e.g., `calculateTotalBalance`, `getUserById`).
*   **Classes, Interfaces, Components & Types**: `PascalCase` (e.g., `AccountController`, `AuthService`, `TransactionCard`).
*   **Database Schema Columns & Tables**: `snake_case` (e.g., `user_id`, `created_at`).
*   **Directories & Route Segments**: `kebab-case` (e.g., `savings-goals`, `/api/v1/auth/reset-password`).
*   **Environment Variables**: `UPPER_SNAKE_CASE` (e.g., `DATABASE_URL`, `JWT_SECRET`).

---

## 2. File Naming Patterns

*   **NestJS Modules**:
    *   Controllers: `[name].controller.ts`
    *   Services: `[name].service.ts`
    *   Modules: `[name].module.ts`
    *   DTOs: `[action]-[name].dto.ts` (e.g., `create-transaction.dto.ts`)
*   **React Components**:
    *   Components: `[ComponentName].tsx`
    *   Hooks: `use[HookName].ts`
    *   Slices: `[sliceName]Slice.ts` (e.g., `authSlice.ts`)

---

## 3. General Architecture & Design Rules

### Single Responsibility Principle (SRP)
Each class, function, or file must have a single responsibility.
*   *Backend*: Controllers must handle only HTTP parsing and delegation. All business logic must be isolated in Services.
*   *Frontend*: Components should focus on UI rendering and call Hooks or RTK Query slices to fetch/mutate data.

### TypeScript Strict Rules
*   Do not use the `any` keyword. If a type is unknown, use `unknown`.
*   All function signatures must explicitly state parameter types and return types.
*   `strict: true` must be enabled in both frontend and backend `tsconfig.json` configurations.

### Error Handling & Logging
*   **Backend**: Use NestJS Global Filters (`HttpExceptionFilter`) to catch and transform errors into standard structures. Log exceptions using the standard NestJS `Logger` (backed by Winston for production file outputs).
*   **Frontend**: Use Error Boundary wrappers to catch client exceptions gracefully. Provide clear snackbar alerts for API failure states.

### Dependency Injection
*   Backend dependencies must be injected via NestJS Dependency Injection. Avoid creating class instances manually with `new` for services or utilities.
