# Implementation Task Breakdown & Time-Boxed Roadmap

**Overall Target:** Complete entire system (Database, Backend, Frontend, Documentation, Verification) in ~60 minutes.

---

## Stage 1: SDLC Foundations, Documentation & Expert Review [DONE]
- [x] Analyze assignment PDF requirements (Ágaetis Technologies).
- [x] Establish SDLC framework ("Think - Plan - Code").
- [x] Author all 9 specification docs in `docs/`.
- [x] Multi-disciplinary expert review (Frontend, Backend, Database) & document refinements applied.

---

## Stage 2: Database & Docker Infrastructure [DONE]
- [x] Created `docker-compose.yml` for PostgreSQL 16.
- [x] Started PostgreSQL 16 container and verified port 5432 readiness.
- [x] Configured `backend/prisma/schema.prisma` with future-proofed Employee model.
- [x] Pushed schema to PostgreSQL database (`prisma db push`).
- [x] Created and ran `backend/prisma/seed.ts` with 8 diverse sample employee records.

---

## Stage 3: Backend REST API Development [DONE]
- [x] Setup Express server with CORS, Morgan logging, and JSON body parser.
- [x] Created Zod schemas for employee validation (`employee.schema.ts`).
- [x] Implemented `employee.service.ts` for all CRUD operations.
- [x] Implemented `employee.controller.ts` with standard response envelopes.
- [x] Implemented route mapping (`GET`, `POST`, `PUT`, `DELETE`, `GET /health`).
- [x] Implemented `errorHandler.middleware.ts` catching Prisma `P2002` duplicate email error -> `409 Conflict`.
- [x] Verified all endpoints via automated HTTP testing.

---

## Stage 4: Frontend Application [DONE]
- [x] Initialized Vite React + TypeScript project with Tailwind CSS.
- [x] Configured Tailwind theme, Lucide React icons, and design tokens.
- [x] Setup Axios client (`src/api/client.ts`) with base URL & interceptors.
- [x] Implemented `src/api/employeeApi.ts` for type-safe API calls.
- [x] Built custom hook `useEmployees.ts` for data fetching & state management.
- [x] Built UI Components (Header, StatsOverview, SearchFilterBar, EmployeeTable, EmployeeModal, DeleteModal, Toast).
- [x] Verified production build passes with zero TypeScript errors.

---

## Stage 5: Verification, Polish & Handover [DONE]
- [x] End-to-end verification of full CRUD (Add -> List -> Search -> Edit -> Delete).
- [x] Edge cases check (duplicate email error 409, empty fields, special characters).
- [x] Responsive layout check on desktop and mobile viewports.
- [x] Comprehensive root `README.md` with 1-step setup guide and API reference.
- [x] Initialized Git repository and created initial commit following Conventional Commits.

---

## Stage 6: UI Refinements (Alphabetical Sort, Status Cycle, Date Selector & Dropdown) [DONE]
- [x] Alphabetical sorting on Employee column.
- [x] Status sort cycle (`default` -> `active` -> `on leave` -> `terminated`).
- [x] Joined Date sort (Newest / Oldest / Default).
- [x] Mobile-responsive Date Selector with timezone-safe day boundaries.
- [x] Refactored Department filter to Dropdown menu.

---

## Stage 7: Full Server-Side Sorting & Pagination Pipeline [DONE]
- [x] Updated backend types and schemas to support pagination (`page`, `limit`) and dynamic sorting (`sortBy`, `sortOrder`, `statusPriority`).
- [x] Updated `EmployeeService.getEmployees` to perform SQL `WHERE`, `ORDER BY`, `LIMIT`, and `OFFSET`.
- [x] Updated frontend `employeeApi.getEmployees` and `useEmployees` hook with debounced search (300ms) and reactive server queries.
- [x] Implemented responsive Pagination Bar in `EmployeeTable` with Previous/Next buttons and page numbers.
- [x] Verified full server-side sort & pagination end-to-end with 16 seeded records across multiple pages.
