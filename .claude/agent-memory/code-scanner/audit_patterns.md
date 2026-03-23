---
name: First Full Audit Findings — March 2026
description: Recurring anti-patterns and issues identified in the initial DevStash audit
type: project
---

Patterns found in the March 2026 audit:

1. **Repeated DB lookup pattern**: `collections.ts` duplicates the DEMO_USER_EMAIL -> userId lookup in every exported function instead of using a shared helper like `items.ts` does.

2. **Unvalidated env var**: `DATABASE_URL!` uses non-null assertion in `src/lib/db.ts` — crashes at runtime with a cryptic error if the var is missing.

3. **iconMap pattern**: Both `Sidebar.tsx` and all three dashboard display components (CollectionsGrid, PinnedItems, RecentItems) define an identical `iconMap` constant. This is duplicated across 4 files.

4. **Dead file**: `src/lib/mock-data.ts` has no importers — was used during UI prototyping and is now unused.

5. **Inline styles for dynamic colors**: Coding standards say no inline styles, but the codebase consistently uses `style={{ color: type.color }}` and `style={{ backgroundColor: \`\${type.color}15\` }}` for DB-driven colors. This is intentional and unavoidable with Tailwind (can't use dynamic class names). Not a bug.

6. **N+1 pattern in getSidebarCollections**: Fetches collections with all items+itemTypes eagerly. For large collections this could be expensive, but the query is bounded by `take: limit` so it's not unbounded.

7. **Missing Suspense boundaries**: Dashboard page renders 4 async Server Components (StatsCards, CollectionsGrid, PinnedItems, RecentItems) without individual Suspense wrappers — all 4 block in parallel but there's no streaming/skeleton for individual sections.
