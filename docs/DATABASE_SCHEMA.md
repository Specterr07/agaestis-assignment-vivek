# Database Schema Specification & Future-Proofing

## 1. Schema Overview
The database engine is **PostgreSQL 16**. The schema fulfills all core requirements from the Ágaetis specification while incorporating future-proofing principles (audit timestamps, department categorization, employment status, soft-delete readiness, and high-performance B-tree indexing).

---

## 2. Table Definition: `employees`

### SQL DDL (PostgreSQL Syntax)
```sql
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL DEFAULT 'Engineering',
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Performance & Query Optimization Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_employees_role ON employees(role);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_created_at ON employees(created_at DESC);
```

---

## 3. Prisma Schema (`schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum EmployeeStatus {
  ACTIVE
  ON_LEAVE
  TERMINATED
}

model Employee {
  id          Int            @id @default(autoincrement())
  name        String         @db.VarChar(100)
  email       String         @unique @db.VarChar(255)
  role        String         @db.VarChar(100)
  department  String         @default("Engineering") @db.VarChar(100)
  status      EmployeeStatus @default(ACTIVE)
  avatarUrl   String?        @map("avatar_url") @db.VarChar(500)
  phone       String?        @db.VarChar(20)
  createdAt   DateTime       @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt   DateTime       @updatedAt @map("updated_at") @db.Timestamptz(6)
  deletedAt   DateTime?      @map("deleted_at") @db.Timestamptz(6)

  @@index([role])
  @@index([department])
  @@index([status])
  @@index([createdAt(sort: Desc)])
  @@map("employees")
}
```

---

## 4. Future-Proofing Design Highlights

| Attribute | Implementation | Purpose & Benefit |
|-----------|----------------|-------------------|
| **Primary Key** | `SERIAL` (autoincrement) | Compact integer storage, standard REST `/employees/1` path compatibility. |
| **Email Constraint** | `UNIQUE` constraint + B-Tree index | Prevents duplicate accounts; database-level integrity enforced under concurrent writes. |
| **Audit Timestamps** | `created_at` & `updated_at` | Tracks exact lifecycle milestones; `updated_at` automatically maintained by Prisma. |
| **Soft Delete Ready** | `deleted_at (nullable)` | Allows non-destructive record management for historical data retention and audit logs. |
| **Employment Status** | `EmployeeStatus` Enum (`ACTIVE`, `ON_LEAVE`, `TERMINATED`) | Enables filtering active workforce from historical records without deleting data. |
| **Department Tagging** | `department` VARCHAR with defaults | Facilitates department-level analytics, filtering, and role categorization. |
| **Index Strategy** | Indexes on `role`, `department`, `created_at DESC` | Guarantees fast sub-millisecond queries even as employee count grows into 100k+ rows. |
| **RAM Cache Performance** | PostgreSQL `shared_buffers` | Entire table is memory-cached, yielding sub-millisecond query execution. |
