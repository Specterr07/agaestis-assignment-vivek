# Naming Conventions & Code Standards

To ensure consistency across the entire codebase and seamless multi-agent/developer collaboration, follow these conventions strictly.

## 1. File & Directory Naming

| Type | Convention | Examples |
|------|------------|----------|
| **React Components** | PascalCase `.tsx` | `EmployeeTable.tsx`, `EmployeeModal.tsx`, `Badge.tsx` |
| **React Hooks** | camelCase prefixed with `use` `.ts` | `useEmployees.ts` |
| **Backend Controllers** | camelCase with `.controller.ts` | `employee.controller.ts`, `health.controller.ts` |
| **Backend Services** | camelCase with `.service.ts` | `employee.service.ts` |
| **Backend Routes** | camelCase with `.routes.ts` | `employee.routes.ts` |
| **Backend Middlewares** | camelCase with `.middleware.ts` | `errorHandler.middleware.ts`, `validate.middleware.ts` |
| **Zod Schemas** | camelCase with `.schema.ts` | `employee.schema.ts` |
| **Type Definition Files** | camelCase with `.types.ts` | `employee.types.ts`, `api.types.ts` |
| **Configuration Files** | kebab-case or standard dotfiles | `vite.config.ts`, `tailwind.config.js`, `tsconfig.json` |

---

## 2. Code Identifiers

### TypeScript / JavaScript
- **Variables & Functions:** `camelCase` (e.g., `fetchEmployees`, `isLoading`, `handleSubmit`)
- **Constants / Enums:** `UPPER_SNAKE_CASE` (e.g., `DEFAULT_PAGE_SIZE`, `API_TIMEOUT_MS`)
- **Types / Interfaces:** `PascalCase` (e.g., `Employee`, `CreateEmployeeDto`, `ApiResponse<T>`)
- **React Props Interfaces:** `[ComponentName]Props` (e.g., `EmployeeTableProps`, `EmployeeModalProps`)

### Database (PostgreSQL & Prisma)
- **Table Names:** `snake_case` plural in SQL mapping (`employees`), `PascalCase` singular in Prisma model (`Employee`).
- **Columns / Fields:** `snake_case` in SQL (`created_at`, `avatar_url`), mapped via `@map` to `camelCase` in Prisma (`createdAt`, `avatarUrl`).
- **Foreign Keys / IDs:** `id`, `[entity]_id` (e.g., `department_id`).

### REST API Endpoints
- **Resources:** Lowercase, plural nouns: `/api/v1/employees`
- **Actions:** Standard HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`), no verbs in path (avoid `/api/v1/getEmployees`).
- **Identifiers:** URL path parameter `/:id` (e.g., `/api/v1/employees/12`).

---

## 3. Git Commit Messages
Follow the Conventional Commits specification:
- `feat: add live employee search and department filtering`
- `fix: handle duplicate email conflict error code in modal`
- `docs: update PRD and architecture guidelines`
- `refactor: extract reusable modal dialog component`
- `chore: configure prisma schema and docker-compose`
