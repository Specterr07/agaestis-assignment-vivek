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

## 4. Enhanced Sorting, Filtering & Bonus Features

### 4.1 Alphabetical Sorting on Employee Name
- Clickable "Employee" table header.
- Toggles 3 states: A ➔ Z (Ascending), Z ➔ A (Descending), and Default.
- Uses `localeCompare` for accent-safe alphabetical sorting.

### 4.2 Status Sort Cycle
- Clickable "Status" table header cycling sequentially:
  `Default` ➔ `Active First` ➔ `On Leave First` ➔ `Terminated First` ➔ `Default`.
- Clear visual indicator showing current priority status.

### 4.3 Joined Date Sorting & Responsive Date Selector
- **Joined Date Sort:** Clickable header cycling Newest First ➔ Oldest First ➔ Default.
- **Date Selector Filter:** Mobile-responsive date picker (From date / To date) with timezone-safe day boundaries and instant reset button.

### 4.4 Live Search & Department Filter Chips
- Live instant search across Name, Email, and Role with 0ms perceived latency.
- Filter chips for All, Engineering, Design, Product, and HR & Operations.
- Top metric cards for quick workforce analytics.
