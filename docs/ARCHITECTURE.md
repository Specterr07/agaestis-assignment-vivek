# System Architecture & Technical Design

## 1. High-Level Architecture Overview
The system follows a classic decoupled **Client-Server 3-Tier Architecture**:
1. **Presentation Layer (Frontend):** React + TypeScript (Vite), Tailwind CSS, Lucide Icons, Headless UI / Radix component primitives, Axios, and custom data-fetching hook `useEmployees` with server-side pagination.
2. **Application / API Layer (Backend):** Node.js + Express + TypeScript structured with Controller-Service pattern (with Prisma Client acting as the data access engine), Zod request schemas, CORS, Morgan logger, and Global Error Handler.
3. **Data Layer (Database):** PostgreSQL 16 (Docker Compose) with Prisma ORM for type-safe database queries, schema migrations, and automated seeding.

```
+--------------------------------------------------------------+
|                    CLIENT (Vite + React + TS)                |
|  - Components: EmployeeTable, EmployeeModal, SearchFilterBar |
|  - Server-Side Query Hook: `useEmployees` (debounced 300ms)  |
|  - Query Params: page, limit, sortBy, sortOrder, dateRange   |
|  - Styling: Tailwind CSS + Responsive Design Tokens          |
+------------------------------+-------------------------------+
                               |
                        HTTP / REST (JSON)
                               |
+------------------------------v-------------------------------+
|                    SERVER (Node.js + Express + TS)           |
|  - Middlewares: CORS, Morgan Logger, Error Handler           |
|  - Routing: /api/v1/employees                                |
|  - Validation: Zod Query & Body Schemas                      |
|  - Service: Builds Prisma WHERE, ORDER BY, SKIP, TAKE        |
+------------------------------+-------------------------------+
                               |
                     Prisma Engine / TCP (5432)
                               |
+------------------------------v-------------------------------+
|                  DATABASE (PostgreSQL 16)                    |
|  - SQL: SELECT ... WHERE ... ORDER BY ... LIMIT 10 OFFSET 0  |
|  - B-Tree Indexes on email, role, department, status, date   |
|  - In-memory Buffer Cache (shared_buffers)                   |
+--------------------------------------------------------------+
```

---

## 2. API Contract Specifications

### 2.1 Standard Paginated Envelope (`GET /api/v1/employees`)

#### Request Query Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `page` | integer | No | `1` | Current page number (1-indexed) |
| `limit` | integer | No | `10` | Page size (1 to 100) |
| `sortBy` | string | No | `createdAt` | Field to sort: `name`, `createdAt`, `status` |
| `sortOrder`| string | No | `desc` | Direction: `asc` or `desc` |
| `statusPriority` | string | No | `default` | Priority status: `ACTIVE`, `ON_LEAVE`, `TERMINATED` |
| `search` | string | No | `""` | Search text across name, email, role |
| `department` | string | No | `ALL` | Department filter |
| `startDate` | string | No | `""` | Filter join date on or after `YYYY-MM-DD` |
| `endDate` | string | No | `""` | Filter join date on or before `YYYY-MM-DD` |

#### Response Envelope:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Sarah Connor",
        "email": "sarah.connor@agaetis.com",
        "role": "Lead Cloud Architect",
        "department": "Engineering",
        "status": "ACTIVE",
        "avatarUrl": "https://...",
        "phone": "+1 (555) 234-5678",
        "createdAt": "2026-11-13T06:00:00.000Z",
        "updatedAt": "2026-11-13T06:00:00.000Z",
        "deletedAt": null
      }
    ],
    "pagination": {
      "total": 48,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

### 2.2 Endpoints Table
| Method | Endpoint | Description | Request Body | Status Codes |
|--------|----------|-------------|--------------|--------------|
| `GET` | `/api/v1/employees` | Fetch paginated & filtered employees | None | `200 OK` |
| `GET` | `/api/v1/employees/:id` | Fetch single employee | None | `200 OK`, `404 Not Found` |
| `POST` | `/api/v1/employees` | Create employee | `{ name, email, role, department?, status? }` | `201 Created`, `400`, `409` |
| `PUT` | `/api/v1/employees/:id` | Update employee | `{ name, email, role, department?, status? }` | `200 OK`, `400`, `404`, `409` |
| `DELETE`| `/api/v1/employees/:id` | Delete employee | None | `200 OK`, `404 Not Found` |
| `GET` | `/api/v1/health` | System health check | None | `200 OK` |
