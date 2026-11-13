# Engineering Best Practices: Frontend & Backend

## 1. Frontend Best Practices (React + TypeScript)

### 1.1 State Management & Data Fetching
- **Centralized Axios Client:** Never use bare `fetch()` or ad-hoc `axios.post` in components. All requests flow through `src/api/client.ts` with standardized base URL and error interceptors.
- **Dedicated API Service Module:** Keep endpoint functions isolated in `src/api/employeeApi.ts`.
- **Loading & Error Skeletons:** Render skeleton placeholder rows during data loading and toast alerts for mutation results.
- **Defensive Error Handling:** If a mutation fails (e.g. duplicate email conflict), display an inline form error or toast notification and preserve user form input so no progress is lost.

### 1.2 Component Design
- **Single Responsibility:** Container components fetch data; presentational components render props.
- **Controlled Forms with Validation:** Validate inputs on submit using Zod or lightweight checks before dispatching API calls.
- **Accessibility:** Use proper semantic HTML (`<dialog>`, `<button>`, `<label htmlFor="...">`), ensure tab indexing, and support keyboard shortcuts (Esc to close modal, Enter to submit).
- **Zero Inline Styles:** Leverage Tailwind CSS classes for all styling to guarantee consistency and minimal bundle size.

---

## 2. Backend Best Practices (Node.js + Express + Prisma)

### 2.1 Error Handling & Resilience
- **Global Error Middleware:** Centralize error handling in `src/middlewares/errorHandler.middleware.ts`. Never let unhandled promise rejections crash the server process.
- **AppError Pattern:** Use a custom `AppError` class carrying HTTP status code and machine-readable error codes (`NOT_FOUND`, `DUPLICATE_EMAIL`, `VALIDATION_ERROR`).
- **Prisma Error Catching:** Catch known Prisma errors:
  - Code `P2002` (Unique constraint failed on `email`): Map directly to HTTP `409 Conflict` with a clear message: `"An employee with this email already exists"`.
  - Code `P2025` (Record to update/delete not found): Map to HTTP `404 Not Found`.

### 2.2 Security & Defensive Coding
- **CORS Configuration:** Explicitly allow frontend origin (`http://localhost:5173`) with allowed methods (`GET, POST, PUT, DELETE, OPTIONS`).
- **Input Sanitization:** Use Zod schemas on all incoming `req.body` and `req.params`. Strip unexpected fields.
- **Parameterized Queries:** Use Prisma ORM queries to guarantee zero SQL injection risks.
- **Environment Isolation:** Read all credentials from `.env` via a typed `config.ts` validator.

### 2.3 Code Organization
- **No Business Logic in Controllers:** Controllers extract parameters, call services, and return standard JSON envelopes.
- **Health Check Probe:** Provide a `GET /api/v1/health` endpoint verifying database connectivity.
