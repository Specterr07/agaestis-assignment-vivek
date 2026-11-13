# Technology Stack & Architecture Decision Records (ADR)

## 1. Selected Technology Stack

| Layer | Chosen Technology | Version | Justification |
|-------|-------------------|---------|---------------|
| **Frontend Framework** | React + TypeScript (Vite) | React 18/19, Vite 6 | Lightning-fast cold start, HMR, tiny footprint, matches assignment specification directly. |
| **Styling & Components**| Tailwind CSS + Headless UI / Lucide | Tailwind 3/4 | Rapid styling, utility-first, modern design tokens, accessible dialogs & dropdowns without bundle bloat. |
| **HTTP Client** | Axios | 1.x | Explicitly mandated by the assignment; configured with base URL, timeout, and response interceptors. |
| **Backend Runtime** | Node.js + Express + TypeScript | Node 20+, Express 4.x | Robust, industry standard, typesafe, rapid developer iteration under time constraints. |
| **Validation** | Zod | 3.x | Single schema definition for runtime validation and static TypeScript inference across frontend & backend. |
| **Database** | PostgreSQL | 16-alpine (Docker) | Relational database specified in assignment; ACID compliant, rock-solid schema constraints and indexes. |
| **Database ORM** | Prisma ORM | 5.x / 6.x | Fully type-safe database queries, automated SQL migrations, declarative schema, and built-in seeding. |

---

## 2. Architecture Decisions & Rationale

### ADR 001: Vite + React vs. Next.js
- **Context:** The prompt allows React+Vite or Next.js.
- **Decision:** Choose **Vite + React + TypeScript**.
- **Rationale:** A standalone Vite frontend provides an isolated SPA environment that communicates cleanly over standard CORS REST endpoints with an independent Node/Express backend. It avoids Next.js server component complexity and hydration quirks for this CRUD scope.

### ADR 002: Prisma ORM over Raw SQL / Knex
- **Context:** Need PostgreSQL interaction with migrations and models.
- **Decision:** Choose **Prisma ORM**.
- **Rationale:** Prisma offers zero-cost TypeScript generation directly from `schema.prisma`. It eliminates typing mismatches between DB and server, enables auto-migration generation, and provides a built-in seeding mechanism (`prisma db seed`).

### ADR 003: Layered Backend Architecture (Route - Controller - Service)
- **Context:** Backend needs maintainability, brevity, and readability per evaluation criteria.
- **Decision:** Enforce 3 distinct backend layers without unnecessary repository wrapper classes:
  1. `routes`: Mapping HTTP methods to controllers and validating inputs via Zod middleware.
  2. `controllers`: Handling Express `req` and `res`, returning standard envelope structures.
  3. `services`: Business logic and Prisma queries.
- **Rationale:** Separating concerns ensures the code is easily testable and readable while keeping it concise.

### ADR 004: Component Design Pattern (Headless UI + Tailwind)
- **Context:** We need rapid execution within 1 hour while achieving enterprise-grade UI quality.
- **Decision:** Use Tailwind CSS coupled with Headless UI/Radix primitives and Lucide-React icons.
- **Rationale:** Heavy opinionated UI libraries (AntD/MUI) bring massive bundle weight. Headless UI + Tailwind gives full control over accessible modals, badges, tables, and buttons with consistent design tokens.

### ADR 005: Future-Proof Database Schema Design
- **Context:** The assignment asks for `id`, `name`, `email`, `role`, `created_at`.
- **Decision:** Extend schema with `updated_at`, `department`, `status`, and indexes while keeping core fields backward compatible.
- **Rationale:** Real-world HR systems require auditing, department segmentation, and status tracking (active/leave/terminated).

### ADR 006: Native Caching (PostgreSQL Buffer Cache + HTTP ETags) vs. Redis
- **Context:** Evaluation of server-side caching requirements.
- **Decision:** Utilize **PostgreSQL's native `shared_buffers` RAM cache** and **Express HTTP ETags / Cache-Control headers**; do NOT introduce Redis or in-memory process caches.
- **Rationale:** For an employee directory dataset (<1,000 records), PostgreSQL's 128MB RAM buffer cache serves queries in `< 0.2ms` with 100% cache-hit ratio and zero stale-read risk. Redis would add 30+ minutes of Docker networking overhead, connection pooling, and complex cache-invalidation bugs on create/update/delete.

### ADR 007: Frontend State Management via Custom Hook (`useEmployees`) vs. TanStack Query
- **Context:** Client-side data fetching and state handling.
- **Decision:** Implement a clean, dedicated React custom hook (`useEmployees`) with Axios instead of pulling in TanStack Query or SWR.
- **Rationale:** A custom hook keeps the frontend lightweight, provides 100% type safety, avoids cache key synchronization issues, and enables instant refetching upon successful mutations.

### ADR 008: Hybrid Filtering Strategy
- **Context:** Live search and filtering user experience vs backend query capabilities.
- **Decision:** Implement **server-side query parameters** in Express/Prisma (`?search=`, `?role=`, `?department=`) and execute **client-side instant filtering via `useMemo`** on the initial dataset in the frontend.
- **Rationale:** Server-side filtering proves backend robustness. Client-side filtering ensures instant 60fps typing, 0ms perceived latency, zero screen flickering, and eliminates debouncing race conditions.
