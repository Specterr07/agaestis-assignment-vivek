import assert from 'node:assert';

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5001/api/v1';

interface TestResult {
  suite: string;
  name: string;
  status: 'PASSED' | 'FAILED';
  durationMs: number;
  error?: string;
}

const results: TestResult[] = [];

async function test(suite: string, name: string, fn: () => Promise<void>) {
  const start = Date.now();
  try {
    await fn();
    const durationMs = Date.now() - start;
    results.push({ suite, name, status: 'PASSED', durationMs });
    console.log(`  \x1b[32m✔\x1b[0m ${name} \x1b[90m(${durationMs}ms)\x1b[0m`);
  } catch (err: any) {
    const durationMs = Date.now() - start;
    results.push({ suite, name, status: 'FAILED', durationMs, error: err.message });
    console.error(`  \x1b[31m✖\x1b[0m ${name} \x1b[90m(${durationMs}ms)\x1b[0m`);
    console.error(`    \x1b[31mError:\x1b[0m ${err.message}`);
  }
}

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data };
}

async function runTestSuite() {
  console.log('\n\x1b[1m\x1b[34m=====================================================\x1b[0m');
  console.log('\x1b[1m\x1b[34m  Enterprise Employee Directory - Automated Test Suite\x1b[0m');
  console.log('\x1b[1m\x1b[34m=====================================================\x1b[0m\n');

  let createdEmployeeId: number | null = null;
  const testEmail = `test.employee.${Date.now()}@agaetis.com`;

  // ---------------------------------------------------------------------------
  // 1. HEALTH CHECK
  // ---------------------------------------------------------------------------
  console.log('\x1b[1m1. System Health & Infrastructure\x1b[0m');
  await test('Health', 'GET /health returns 200 with database CONNECTED', async () => {
    const res = await request('/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.status, 'UP');
    assert.strictEqual(res.data.database, 'CONNECTED');
  });

  // ---------------------------------------------------------------------------
  // 2. CRUD OPERATIONS
  // ---------------------------------------------------------------------------
  console.log('\n\x1b[1m2. CRUD Operations\x1b[0m');
  await test('CRUD', 'POST /employees creates new employee (201 Created)', async () => {
    const payload = {
      name: 'Automated Test Employee',
      email: testEmail,
      role: 'Quality Assurance Architect',
      department: 'Engineering',
      status: 'ACTIVE',
      phone: '+1 (555) 999-0001',
    };
    const res = await request('/employees', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.name, payload.name);
    assert.strictEqual(res.data.data.email, payload.email);
    assert.strictEqual(res.data.data.role, payload.role);
    createdEmployeeId = res.data.data.id;
    assert(createdEmployeeId !== null);
  });

  await test('CRUD', 'GET /employees/:id retrieves single employee record', async () => {
    assert(createdEmployeeId !== null);
    const res = await request(`/employees/${createdEmployeeId}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.id, createdEmployeeId);
    assert.strictEqual(res.data.data.email, testEmail);
  });

  await test('CRUD', 'PUT /employees/:id updates role and department (200 OK)', async () => {
    assert(createdEmployeeId !== null);
    const updatePayload = {
      role: 'Staff Quality Engineer',
      department: 'Engineering',
    };
    const res = await request(`/employees/${createdEmployeeId}`, {
      method: 'PUT',
      body: JSON.stringify(updatePayload),
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.role, 'Staff Quality Engineer');
  });

  await test('CRUD', 'DELETE /employees/:id removes employee record (200 OK)', async () => {
    assert(createdEmployeeId !== null);
    const res = await request(`/employees/${createdEmployeeId}`, {
      method: 'DELETE',
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);

    // Confirm it no longer exists (404 Not Found)
    const verifyRes = await request(`/employees/${createdEmployeeId}`);
    assert.strictEqual(verifyRes.status, 404);
  });

  // ---------------------------------------------------------------------------
  // 3. INTEGRITY & DUPLICATE BLOCKING
  // ---------------------------------------------------------------------------
  console.log('\n\x1b[1m3. Data Integrity & Validation\x1b[0m');
  await test('Validation', 'POST /employees blocks duplicate email (409 Conflict)', async () => {
    const dupEmail = `dup.check.${Date.now()}@agaetis.com`;
    const res1 = await request('/employees', {
      method: 'POST',
      body: JSON.stringify({
        name: 'First Person',
        email: dupEmail,
        role: 'Engineer',
      }),
    });
    assert.strictEqual(res1.status, 201);
    const cleanupId = res1.data.data.id;

    // Second attempt with same email
    const res2 = await request('/employees', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Second Person',
        email: dupEmail,
        role: 'Engineer',
      }),
    });
    assert.strictEqual(res2.status, 409);
    assert.strictEqual(res2.data.error.code, 'DUPLICATE_ENTRY');

    // Clean up
    await request(`/employees/${cleanupId}`, { method: 'DELETE' });
  });

  await test('Validation', 'POST /employees rejects empty fields and invalid emails (400 Bad Request)', async () => {
    const res = await request('/employees', {
      method: 'POST',
      body: JSON.stringify({
        name: '',
        email: 'invalid-email-format',
        role: '',
      }),
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.error.code, 'VALIDATION_ERROR');
  });

  // ---------------------------------------------------------------------------
  // 4. SEARCH FUNCTIONALITY
  // ---------------------------------------------------------------------------
  console.log('\n\x1b[1m4. Full-Text Search\x1b[0m');
  await test('Search', 'GET /employees?search=Engineer returns matching roles', async () => {
    const res = await request('/employees?search=Engineer&limit=10');
    assert.strictEqual(res.status, 200);
    assert(res.data.data.items.length > 0);
    for (const emp of res.data.data.items) {
      const match =
        emp.role.toLowerCase().includes('engineer') ||
        emp.name.toLowerCase().includes('engineer') ||
        emp.department.toLowerCase().includes('engineer');
      assert(match, `Expected ${emp.name} (${emp.role}) to match search query`);
    }
  });

  // ---------------------------------------------------------------------------
  // 5. DEPARTMENT & DATE FILTERING
  // ---------------------------------------------------------------------------
  console.log('\n\x1b[1m5. Department & Date Range Filtering\x1b[0m');
  await test('Filters', 'GET /employees?department=Design returns only Design members', async () => {
    const res = await request('/employees?department=Design&limit=10');
    assert.strictEqual(res.status, 200);
    assert(res.data.data.items.length > 0);
    for (const emp of res.data.data.items) {
      assert.strictEqual(emp.department, 'Design');
    }
  });

  await test('Filters', 'GET /employees with startDate and endDate filters by join date', async () => {
    const res = await request('/employees?startDate=2024-01-01&endDate=2026-12-31&limit=10');
    assert.strictEqual(res.status, 200);
    assert(res.data.data.items.length > 0);
    const startMs = new Date(2024, 0, 1, 0, 0, 0).getTime();
    const endMs = new Date(2026, 11, 31, 23, 59, 59).getTime();

    for (const emp of res.data.data.items) {
      const createdMs = new Date(emp.createdAt).getTime();
      assert(createdMs >= startMs && createdMs <= endMs, `Date ${emp.createdAt} out of range`);
    }
  });

  // ---------------------------------------------------------------------------
  // 6. SORTING CAPABILITIES
  // ---------------------------------------------------------------------------
  console.log('\n\x1b[1m6. Server-Side Sorting\x1b[0m');
  await test('Sorting', 'GET /employees?sortBy=name&sortOrder=asc sorts alphabetically A-Z', async () => {
    const res = await request('/employees?sortBy=name&sortOrder=asc&limit=10');
    assert.strictEqual(res.status, 200);
    const items = res.data.data.items;
    assert(items.length >= 2);
    for (let i = 0; i < items.length - 1; i++) {
      const cmp = items[i].name.localeCompare(items[i + 1].name);
      assert(cmp <= 0, `Expected "${items[i].name}" <= "${items[i + 1].name}"`);
    }
  });

  await test('Sorting', 'GET /employees?sortBy=createdAt&sortOrder=desc sorts newest first', async () => {
    const res = await request('/employees?sortBy=createdAt&sortOrder=desc&limit=10');
    assert.strictEqual(res.status, 200);
    const items = res.data.data.items;
    assert(items.length >= 2);
    for (let i = 0; i < items.length - 1; i++) {
      const time1 = new Date(items[i].createdAt).getTime();
      const time2 = new Date(items[i + 1].createdAt).getTime();
      assert(time1 >= time2, `Expected date ${items[i].createdAt} >= ${items[i + 1].createdAt}`);
    }
  });

  await test('Sorting', 'GET /employees?statusPriority=ACTIVE ranks active employees first', async () => {
    const res = await request('/employees?statusPriority=ACTIVE&limit=10');
    assert.strictEqual(res.status, 200);
    const items = res.data.data.items;
    assert.strictEqual(items[0].status, 'ACTIVE');
  });

  // ---------------------------------------------------------------------------
  // 7. PAGINATION
  // ---------------------------------------------------------------------------
  console.log('\n\x1b[1m7. Server-Side Pagination\x1b[0m');
  await test('Pagination', 'GET /employees?page=1&limit=10 returns page 1 of 20 with 200 total', async () => {
    const res = await request('/employees?page=1&limit=10');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.data.items.length, 10);
    assert.strictEqual(res.data.data.pagination.page, 1);
    assert.strictEqual(res.data.data.pagination.limit, 10);
    assert.strictEqual(res.data.data.pagination.total, 200);
    assert.strictEqual(res.data.data.pagination.totalPages, 20);
  });

  await test('Pagination', 'GET /employees?page=2&limit=10 returns different records from page 1', async () => {
    const page1Res = await request('/employees?page=1&limit=10');
    const page2Res = await request('/employees?page=2&limit=10');

    const page1Ids = page1Res.data.data.items.map((i: any) => i.id);
    const page2Ids = page2Res.data.data.items.map((i: any) => i.id);

    // No IDs should overlap between page 1 and page 2
    for (const id of page2Ids) {
      assert(!page1Ids.includes(id), `Page 2 contained item ${id} from Page 1`);
    }
  });

  // ---------------------------------------------------------------------------
  // SUMMARY REPORT
  // ---------------------------------------------------------------------------
  const passed = results.filter((r) => r.status === 'PASSED').length;
  const failed = results.filter((r) => r.status === 'FAILED').length;
  const total = results.length;

  console.log('\n\x1b[1m=====================================================\x1b[0m');
  if (failed === 0) {
    console.log(`\x1b[32m\x1b[1m  ALL ${total} TESTS PASSED SUCCESSFULLY! (100%)\x1b[0m`);
  } else {
    console.log(`\x1b[31m\x1b[1m  TEST RUN FAILED: ${failed} failed out of ${total}\x1b[0m`);
  }
  console.log('\x1b[1m=====================================================\x1b[0m\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((e) => {
  console.error('Fatal test runner error:', e);
  process.exit(1);
});
