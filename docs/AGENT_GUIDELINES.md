# AI Agent Guidelines & SDLC Operational Rules

This document governs the operational protocol for any AI agent (Antigravity, Cursor, Claude Code, Copilot, etc.) contributing to this repository.

---

## 1. The Core SDLC Rule: **THINK -> PLAN -> CODE**

No code should be generated or modified before going through the three fundamental phases:

```
+-------------------------------------------------------------+
| 1. THINK                                                    |
|  - Read all relevant documentation under `docs/`.           |
|  - Understand the requirement, scope, and technical context.|
|  - Identify existing patterns, types, and constraints.      |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
| 2. PLAN                                                     |
|  - Break the task into atomic, verifiable steps.             |
|  - Check database impact and API contract compatibility.    |
|  - Confirm component reuse and design token consistency.    |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
| 3. CODE                                                     |
|  - Write type-safe, cleanly formatted, and tested code.     |
|  - Follow naming conventions (`docs/NAMING_CONVENTIONS.md`). |
|  - Adhere to engineering best practices (`docs/BEST_...`).  |
|  - Update `docs/TASKS.md` upon completion.                  |
+-------------------------------------------------------------+
```

---

## 2. Mandatory Reading Order for Agents
Before implementing any feature or resolving any issue, agents MUST read:
1. `docs/PRD.md`: Feature requirements and acceptance criteria.
2. `docs/ARCHITECTURE.md`: Module boundaries and data flows.
3. `docs/DATABASE_SCHEMA.md`: Schema models and query constraints.
4. `docs/DESIGN_TOKENS_AND_UI.md`: Styling tokens and component rules.
5. `docs/NAMING_CONVENTIONS.md`: File and variable naming rules.
6. `docs/BEST_PRACTICES.md`: Engineering safety and coding conventions.
7. `docs/TASKS.md`: Current progress status and outstanding tasks.

---

## 3. Strict Rules of Engagement
1. **Docs as Single Source of Truth:** If an agent alters a data schema or introduces an API endpoint, it **must** update the corresponding document under `docs/`.
2. **No Ad-Hoc Styling:** Never write inline `style={{...}}`. Always use Tailwind utility classes aligned with `docs/DESIGN_TOKENS_AND_UI.md`.
3. **Always Validate Inputs:** Backend routes handling mutations must validate payloads via Zod schemas.
4. **Always Intercept Errors:** Frontend API calls must be wrapped and handled gracefully via toast notifications and loading indicators.
5. **Preserve Backward Compatibility:** Never delete or rename database columns without migration scripts.
