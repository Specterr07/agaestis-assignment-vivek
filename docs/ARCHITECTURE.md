# System Architecture & Technical Design

## 1. High-Level Architecture Overview
The system follows a classic decoupled **Client-Server 3-Tier Architecture**:
1. **Presentation Layer (Frontend):** React + TypeScript (Vite), Tailwind CSS, Lucide Icons, Headless UI / Radix component primitives, Axios, and custom data-fetching hook `useEmployees`.
2. **Application / API Layer (Backend):** Node.js + Express + TypeScript structured with Controller-Service pattern (with Prisma Client acting as the data access engine), Zod request schemas, CORS, Morgan logger, and Global Error Handler.
3. **Data Layer (Database):** PostgreSQL 16 (Docker Compose) with Prisma ORM for type-safe database queries, schema migrations, and automated seeding.

```
+--------------------------------------------------------------+
|                    CLIENT (Vite + React + TS)                |
|  - Components: EmployeeTable, EmployeeModal, SearchFilterBar |
|  - State & Fetching: Axios Client + `useEmployees` Hook      |
|  - Real-time Client Filter: `useMemo` (zero-latency search)   |
|  - Styling: Tailwind CSS + Design Tokens                     |
+------------------------------+-------------------------------+
                               |
                        HTTP / REST (JSON)
                               |
+------------------------------v-------------------------------+
|                    SERVER (Node.js + Express + TS)           |
|  - Middlewares: CORS, Morgan Logger, Error Handler           |
|  - Routing: /api/v1/employees                                |
|  - Validation: Zod Request Schemas                           |
|  - Controllers -> Services -> Prisma Client                  |
|  - Server-side Filtering: ?search=, ?role=, ?department=     |
+------------------------------+-------------------------------+
                               |
                     Prisma Engine / TCP (5432)
                               |
+------------------------------v-------------------------------+
|                  DATABASE (PostgreSQL 16)                    |
|  - Table: employees                                          |
|  - Unique constraints, B-Tree Indexes, Timestamps            |
|  - In-memory Buffer Cache (shared_buffers)                   |
+--------------------------------------------------------------+
```

---

## 2. Directory Layout & Organization

```
agaetis-assignment/
├── docs/                             # Single Source of Truth
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── TECH_STACK_AND_DECISIONS.md
│   ├── DATABASE_SCHEMA.md
│   ├── DESIGN_TOKENS_AND_UI.md
│   ├── NAMING_CONVENTIONS.md
│   ├── BEST_PRACTICES.md
│   ├── TASKS.md
│   └── AGENT_GUIDELINES.md
├── docker-compose.yml                # PostgreSQL 16 service definition
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma             # Data models & relations
│   │   └── seed.ts                   # Seed script for instant demo data
│   ├── src/
│   │   ├── config/                   # Environment variables, DB client
│   │   ├── controllers/              # HTTP request/response handlers
│   │   ├── services/                 # Core business logic & Prisma queries
│   │   ├── routes/                   # Express route declarations
│   │   ├── validations/              # Zod validation schemas
│   │   ├── middlewares/              # Error handling, validate middleware
│   │   ├── types/                    # Backend TypeScript interfaces
│   │   └── server.ts                 # Express app bootstrap & listener
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/                      # Axios client instance & endpoints
│   │   ├── components/               # Presentation & container components
│   │   │   ├── ui/                   # Reusable atomic UI (Button, Modal, Input, Badge)
│   │   │   ├── EmployeeTable.tsx     # Directory data table
│   │   │   ├── EmployeeModal.tsx     # Unified Add/Edit employee dialog
│   │   │   ├── DeleteModal.tsx       # Delete confirmation modal
│   │   │   ├── SearchFilterBar.tsx   # Search input & department filters
│   │   │   ├── StatsOverview.tsx     # Metrics cards
│   │   │   └── Header.tsx            # Navigation & brand bar
│   │   ├── hooks/                    # Custom hooks (useEmployees.ts)
│   │   ├── types/                    # Shared frontend TypeScript models
│   │   ├── App.tsx                   # Main layout container
│   │   ├── main.tsx                  # React DOM root
│   │   └── index.css                 # Tailwind directives & CSS variables
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── tsconfig.json
└── README.md                         # Quickstart setup instructions
```

---

## 3. API Contract Specifications

### 3.1 Standard Envelopes

#### Success Response:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional human-readable feedback"
}
```

#### Paginated Response (When `page` or `limit` query param is provided):
```json
{
  "success": true,
  "data": {
    "items": [ ... ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

#### Error Response:
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Validation failed",
    "details": [
      { "field": "email", "message": "Email is already in use" }
    ]
  }
}
```

### 3.2 Endpoints Table
| Method | Endpoint | Description | Request Body | Query Params | Status Codes |
|--------|----------|-------------|--------------|--------------|--------------|
| `GET` | `/api/v1/employees` | Fetch employees (all or filtered) | None | `search`, `role`, `department`, `page`, `limit` | `200 OK` |
| `GET` | `/api/v1/employees/:id` | Fetch single employee | None | None | `200 OK`, `404 Not Found` |
| `POST` | `/api/v1/employees` | Create employee | `{ name, email, role, department?, status? }` | None | `201 Created`, `400 Bad Request`, `409 Conflict` |
| `PUT` | `/api/v1/employees/:id` | Update employee | `{ name, email, role, department?, status? }` | None | `200 OK`, `400 Bad Request`, `404 Not Found`, `409 Conflict` |
| `DELETE`| `/api/v1/employees/:id` | Delete employee | None | None | `200 OK`, `404 Not Found` |
| `GET` | `/api/v1/health` | System health check | None | None | `200 OK` |
