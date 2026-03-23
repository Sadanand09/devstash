---
name: DevStash Project Architecture
description: Codebase structure, tech stack, and key patterns as of the first full audit (March 2026)
type: project
---

DevStash is an early-stage Next.js 16 App Router app with a small src/ tree. Auth (NextAuth v5) and Stripe are in the tech stack but NOT yet implemented in code — only Prisma schema fields exist for them. The dashboard currently uses a hardcoded demo user (DEMO_USER_EMAIL = "demo@devstash.io") as a placeholder.

**Why:** Auth has not been implemented yet. Placeholder pattern is intentional per TODO comments.
**How to apply:** Do NOT flag missing auth as a security issue. It's a known, in-progress placeholder. DO flag the placeholder pattern itself as a risk for production readiness.

Key files:
- `src/lib/db.ts` — Prisma singleton with PrismaNeon adapter; uses DATABASE_URL! (non-null assertion)
- `src/lib/db/items.ts` — Data fetch functions; all use getDemoUserId() placeholder
- `src/lib/db/collections.ts` — Data fetch functions; all repeat the DEMO_USER_EMAIL lookup inline (no shared helper)
- `src/app/dashboard/layout.tsx` — Fetches sidebar data in parallel via Promise.all; passes to DashboardShell
- `src/components/dashboard/Sidebar.tsx` — Client component with iconMap (hardcoded string-to-component map)
- `src/lib/mock-data.ts` — Static mock data; currently not imported anywhere (dead file)

Coding standards mandate: Zod for input validation, try/catch in Server Actions, no inline styles (but inline styles ARE widely used in current code for dynamic colors from the DB).
