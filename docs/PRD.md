# Product Requirements Document (PRD)

## 1. Project Overview
**Product Name:** Enterprise Employee Directory  
**Client / Context:** Ágaetis Technologies Technical Assessment  
**Time Limit:** 1.5 Hours (Target Delivery: ~1 Hour)  
**Primary Goal:** Build a responsive, robust, and clean Employee Directory web application allowing users to view, add, edit, and delete employee records with modern UI/UX standards, high performance, and future-proof database architecture.

---

## 2. Target Audience & Personas
- **HR Managers / Team Leads:** Need quick visibility into company talent, ability to onboard new hires, update employee roles, and offboard employees.
- **System Administrators / Evaluators:** Need clear architecture, clean code, predictable API contracts, secure inputs, and effortless setup.

---

## 3. Core Functional Requirements (MVP)

### 3.1 Employee Listing (`GET /api/v1/employees`)
- Display all employees in a structured, interactive table/list.
- Columns: Avatar/Initials, Full Name, Email, Job Role, Department, Status Badge, Join Date (`created_at`), and Action Buttons.
- Loading states (Skeleton loader) and Empty states ("No employees found").
- HTTP Status: `200 OK`.

### 3.2 Add Employee (`POST /api/v1/employees`)
- Modal/Form to capture:
  - `name`: Full Name (required, min 2 chars, max 100 chars).
  - `email`: Work Email (required, valid email format, unique).
  - `role`: Job Title/Role (required, e.g., Senior Software Engineer, UI Designer).
  - `department`: Department (optional/default: "Engineering", "Design", "Product", "Operations", "HR").
  - `status`: Employment Status (default: "ACTIVE").
- Instant form validation with clear inline error messages.
- Axios POST request to backend; updates table on success.
- HTTP Status: `201 Created` on success, `400 Bad Request` on validation failure, `409 Conflict` on duplicate email.
- Visual toast notification on success/error.

### 3.3 Edit Employee (`PUT /api/v1/employees/:id`)
- Click "Edit" action button opens modal populated with existing employee data.
- Allows updating `name`, `email`, `role`, `department`, and `status`.
- Validates inputs before sending `PUT` request via Axios.
- HTTP Status: `200 OK` on success, `400 Bad Request` on validation failure, `404 Not Found` if ID does not exist, `409 Conflict` if email belongs to another employee.
- Updates table and triggers success toast notification.

### 3.4 Delete Employee (`DELETE /api/v1/employees/:id`)
- Click "Delete" action button triggers a confirmation dialog to prevent accidental deletion.
- On confirmation, sends `DELETE` request via Axios.
- HTTP Status: `200 OK` on success, `404 Not Found` if ID does not exist.
- Removes item from directory and displays success toast.

---

## 4. Bonus Features (Included in Scope)
1. **Live Search & Filter (Hybrid Strategy):**
   - **Backend:** Supports optional server-side query parameters (`?search=`, `?role=`, `?department=`, `?page=`, `?limit=`).
   - **Frontend:** Provides instant client-side filtering via `useMemo` for zero-latency, flicker-free real-time search across Name, Email, and Role.
2. **Department Badges:** Color-coded badges for clean visual differentiation (Engineering: Blue, Design: Purple, Product: Amber, HR: Green).
3. **Pagination & Sorting:** UI pagination controls for large lists and sorting by Join Date or Name.
4. **Stats Overview:** Top metric cards showing Total Employees, Active Workforce, and Department counts.
5. **Modern Enterprise UI:** Polished styling using a modern Component Library (Tailwind CSS + Headless UI / Radix primitives + Lucide icons).

---

## 5. Non-Functional Requirements
- **Performance:** Sub-10ms API responses locally (benefiting from PostgreSQL RAM buffer cache); smooth 60fps frontend interactions.
- **Reliability & Data Integrity:** Database uniqueness constraints on email; transactions for mutations; sanitized inputs.
- **Security:** Input validation with Zod (Frontend & Backend); CORS whitelisting; parameterized queries via Prisma ORM to eliminate SQL injection.
- **Maintainability:** Modular architecture, clean separation of concerns, typed end-to-end with TypeScript.
- **Accessibility (a11y):** Keyboard navigable dialogs, accessible ARIA attributes on modals and buttons.

---

## 6. Acceptance Criteria
- [ ] Backend runs on port `5000` with CORS enabled.
- [ ] Database contains seeded records upon initialization for easy evaluation.
- [ ] All CRUD endpoints work accurately and return standard JSON responses.
- [ ] Frontend runs on Vite (`localhost:5173`) and communicates via Axios.
- [ ] Form validates empty fields and duplicate/invalid emails gracefully (`409 Conflict`).
- [ ] Confirmation prompt safeguards delete action.
- [ ] Search works dynamically without screen flickering.
