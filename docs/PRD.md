# Product Requirements Document (PRD)

## 1. Project Overview
**Product Name:** Enterprise Employee Directory  
**Client / Context:** Ágaetis Technologies Technical Assessment  
**Time Limit:** 1.5 Hours (Target Delivery: ~1 Hour)  
**Primary Goal:** Build a responsive, robust, and clean Employee Directory web application allowing users to view, add, edit, and delete employee records with modern UI/UX standards, high performance, and future-proof database architecture.

---

## 2. Target Audience & Personas
- **HR Managers / Team Leads:** Need quick visibility into company talent, ability to onboard new hires, update employee roles, filter by join dates, sort workforce by status, and offboard employees.
- **System Administrators / Evaluators:** Need clear architecture, clean code, predictable API contracts, secure inputs, and effortless setup.

---

## 3. Core Functional Requirements (MVP)

### 3.1 Employee Listing & Server-Side Pagination (`GET /api/v1/employees`)
- Display all employees in a structured, interactive table/list.
- Full server-side query processing using PostgreSQL indexes:
  - `page`: Current page number (integer, default: 1).
  - `limit`: Items per page (integer, default: 10, max: 100).
  - `sortBy`: Column to sort by (`name`, `createdAt`, `status`).
  - `sortOrder`: Direction (`asc`, `desc`).
  - `search`: Case-insensitive text search matching name, email, or role.
  - `department`: Filter by department (e.g. Engineering, Design, Product, HR).
  - `startDate` & `endDate`: Timezone-safe date boundaries for join dates.
- Standard Paginated Response:
  ```json
  {
    "success": true,
    "data": {
      "items": [ ... ],
      "pagination": {
        "total": 48,
        "page": 1,
        "limit": 10,
        "totalPages": 5
      }
    }
  }
  ```
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

## 4. Enhanced Sorting, Filtering & Bonus Features

### 4.1 Server-Side Alphabetical Sorting on Employee Name
- Clickable "Employee" table header.
- Toggles 3 states: A ➔ Z (`sortBy=name&sortOrder=asc`), Z ➔ A (`sortBy=name&sortOrder=desc`), and Default (`sortBy=createdAt&sortOrder=desc`).
- Uses PostgreSQL database collation for true alphabetical ordering across entire dataset.

### 4.2 Server-Side Status Sort Cycle
- Clickable "Status" table header cycling sequentially:
  `Default` ➔ `Active First` ➔ `On Leave First` ➔ `Terminated First` ➔ `Default`.
- Database evaluates priority ranking using indexed status enums.

### 4.3 Joined Date Sorting & Responsive Date Selector
- **Joined Date Sort:** Clickable header cycling Newest First ➔ Oldest First ➔ Default.
- **Date Selector Filter:** Mobile-responsive date picker (From date / To date) with server-side SQL date range filtering (`createdAt >= startDate AND createdAt <= endDate`).

### 4.4 Live Search & Department Filter Dropdown
- Live debounced search across Name, Email, and Role.
- Department dropdown for All, Engineering, Design, Product, and HR & Operations.
- Full pagination controls (`Previous`, `Page X of Y`, `Next`) at table footer.
