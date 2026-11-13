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
- **Decision:** Choose **Vite + React + TypeScript**.
- **Rationale:** A standalone Vite frontend provides an isolated SPA environment that communicates cleanly over standard CORS REST endpoints with an independent Node/Express backend.

### ADR 002: Prisma ORM over Raw SQL / Knex
- **Decision:** Choose **Prisma ORM**.
- **Rationale:** Prisma offers zero-cost TypeScript generation directly from `schema.prisma`. It eliminates typing mismatches between DB and server.

### ADR 003: Layered Backend Architecture (Route - Controller - Service)
- **Decision:** Enforce 3 distinct backend layers without unnecessary repository wrapper classes.

### ADR 004: Component Design Pattern (Headless UI + Tailwind)
- **Decision:** Use Tailwind CSS coupled with Headless UI/Radix primitives and Lucide-React icons.

### ADR 005: Future-Proof Database Schema Design
- **Decision:** Extend schema with `updated_at`, `department`, `status`, and indexes while keeping core fields backward compatible.

### ADR 006: Native Caching (PostgreSQL Buffer Cache + HTTP ETags) vs. Redis
- **Decision:** Rely on PostgreSQL internal `shared_buffers` and Express weak `ETag`s. Reject external Redis over-engineering.

### ADR 007: Frontend State Management via Custom Hook (`useEmployees`) vs. TanStack Query
- **Decision:** Dedicated React custom hook (`useEmployees`) with Axios.

### ADR 008: Server-Side Sorting & Pagination Architecture
- **Context:** Deciding between client-side data slicing vs full server-side processing for sorting, filtering, and pagination.
- **Decision:** Implement **end-to-end Server-Side Sorting & Pagination**.
- **Rationale:** 
  1. **Algorithmic Accuracy:** Server-side sorting guarantees that sorting by Name (A–Z) or Date evaluates across the entire database before slicing pages via `LIMIT` and `OFFSET`. Client-side sorting on paginated data results in page-isolated sort bugs.
  2. **Scalability:** Offloads sorting to PostgreSQL's indexed B-Tree engine (`idx_employees_created_at`, `idx_employees_role`, `idx_employees_status`), keeping browser memory usage constant regardless of dataset size.
  3. **Debounced Network Calls:** Keystroke input in the search bar is debounced by 300ms, minimizing network roundtrips while preserving responsive UI feel.
