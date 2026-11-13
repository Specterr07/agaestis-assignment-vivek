# Ágaetis Technologies — Enterprise Employee Directory

> **Technical Assessment Project**  
> Built with React + TypeScript (Vite), Tailwind CSS, Node.js + Express + TypeScript, Prisma ORM, and PostgreSQL 16.  
> Designed and delivered in ~1 hour following a strict **Think -> Plan -> Code** SDLC workflow.

---

## 🌟 Features

### Core Capabilities
- **Employee Directory Table:** Clean, responsive, and accessible table displaying employee avatar/initials, full name, email, job role, department badge, employment status, and join date.
- **Add Employee:** Modal form capturing `name`, `email`, `role`, `department`, `status`, and optional `avatarUrl` with real-time validation.
- **Edit Employee:** Instant-fill modal to update employee roles, contact info, and departments.
- **Delete Employee:** Protected confirmation dialog to safeguard records against accidental deletion.
- **Centralized Axios Client:** Fully typed HTTP requests with error interceptors and toast notifications.

### Bonus Features (Included)
- **Live Instant Search & Filtering:** Filter across Name, Email, and Role with 0ms perceived latency and zero screen flickering.
- **Department Filter Pills:** One-click filtering by Engineering, Design, Product, and HR & Operations.
- **Server-Side Query Support:** Backend supports `?search=`, `?role=`, `?department=`, `?page=`, `?limit=`.
- **Top Metric Cards:** Instant dashboard summary of Total Workforce, Active Workforce, and departmental headcounts.
- **Duplicate Email Prevention:** Unique constraints in PostgreSQL + Prisma with user-friendly HTTP `409 Conflict` feedback in UI.
- **Future-Proofed Schema:** Extended with `department`, `status` enum (`ACTIVE`, `ON_LEAVE`, `TERMINATED`), `updated_at`, `avatar_url`, and `deleted_at` (soft-delete ready).

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite 5, Tailwind CSS, Lucide React, Axios |
| **Backend** | Node.js 20+, Express 4.x, TypeScript, Zod, Morgan, CORS |
| **Database & ORM** | PostgreSQL 16 (Docker), Prisma ORM 5.x |
| **Architecture** | Decoupled 3-Tier Layered Architecture (Routes -> Controllers -> Services -> Prisma) |

---

## 🚀 Quick Start (One-Command Setup)

### Prerequisites
- [Docker Desktop](https://www.docker.com/) running
- [Node.js](https://nodejs.org/) (v18+) & `npm`

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd agaetis-assignment
```

### 2. Start PostgreSQL Container
```bash
docker compose up -d
```

### 3. Setup Backend (Install, Push Schema & Seed 8 Employees)
```bash
cd backend
npm install
npm run db:setup
npm run dev
```
> Backend runs at `http://localhost:5001`  
> Health check: `http://localhost:5001/api/v1/health`

### 4. Setup Frontend (In a New Terminal Tab)
```bash
cd frontend
npm install
npm run dev
```
> Frontend runs at `http://localhost:5173`

---

## 📖 Single Source of Truth Documentation Hub

All architecture, guidelines, and specifications are maintained under `docs/`:
- [`docs/PRD.md`](docs/PRD.md) — Product requirements, functional scope, and acceptance criteria.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — System design diagrams, layers, directory layout, and API contracts.
- [`docs/TECH_STACK_AND_DECISIONS.md`](docs/TECH_STACK_AND_DECISIONS.md) — Architectural Decision Records (ADRs 001 - 008).
- [`docs/DATABASE_SCHEMA.md`](docs/DATABASE_SCHEMA.md) — SQL DDL, Prisma model, indexing strategy, and future-proofing.
- [`docs/DESIGN_TOKENS_AND_UI.md`](docs/DESIGN_TOKENS_AND_UI.md) — Color palette, typography scale, and component guidelines.
- [`docs/NAMING_CONVENTIONS.md`](docs/NAMING_CONVENTIONS.md) — Standards across TypeScript, SQL, and Git commits.
- [`docs/BEST_PRACTICES.md`](docs/BEST_PRACTICES.md) — Frontend and backend engineering best practices.
- [`docs/TASKS.md`](docs/TASKS.md) — Time-boxed roadmap and completion checklist.
- [`docs/AGENT_GUIDELINES.md`](docs/AGENT_GUIDELINES.md) — AI agent protocol: **Think -> Plan -> Code**.

---

## 📡 REST API Reference

All endpoints return a standardized JSON envelope:
- Success: `{ "success": true, "data": ... }`
- Error: `{ "success": false, "error": { "code": "...", "message": "..." } }`

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/api/v1/health` | Health check & database probe | `200` |
| `GET` | `/api/v1/employees` | List employees (supports `?search=`, `?role=`, `?department=`) | `200` |
| `GET` | `/api/v1/employees/:id` | Get employee by ID | `200`, `404` |
| `POST` | `/api/v1/employees` | Add new employee | `201`, `400`, `409` |
| `PUT` | `/api/v1/employees/:id` | Update employee record | `200`, `400`, `404`, `409` |
| `DELETE`| `/api/v1/employees/:id` | Delete employee record | `200`, `404` |

---

## 🧪 Testing Edge Cases

1. **Duplicate Email Conflict (`409 Conflict`):**
   - Attempting to add or update an employee with an existing email returns an explicit `409` and displays an inline warning without resetting form state.
2. **Instant Search:**
   - Type in the search box to filter across Name, Email, and Role simultaneously with 0ms perceived lag.
3. **Empty Input Validation (`400 Bad Request`):**
   - Both client and server (Zod) block empty strings, missing fields, or invalid emails.
4. **Delete Safeguard:**
   - Clicking Delete opens a confirmation modal before triggering the API mutation.
