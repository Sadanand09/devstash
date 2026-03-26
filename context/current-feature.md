# Current Feature — Item Create

Add new items via a modal dialog from the "New Item" button in the top bar.

## Status

In Progress

## Goals

- ShadCN Dialog modal opened from "New Item" button in top bar
- Type selector for: snippet, prompt, command, note, link
- Dynamic fields based on selected type:
  - All types: title (required), description, tags
  - snippet/command: content, language
  - prompt/note: content
  - link: URL (required)
- `createItem` server action with Zod validation
- `createItem` query in `src/lib/db/items.ts`
- Toast on success, close modal, and refresh UI

## Notes

- Reuse existing patterns from updateItem server action and validation
- The "New Item" button (Plus icon) already exists in DashboardShell top bar but is non-functional
- Need to look up item type IDs by name when creating
- Tags should use connectOrCreate like the update flow

## History

- **2026-03-17** - Initial Next.js and Tailwind CSS setup (Next.js 16, TypeScript, Tailwind v4)
- **2026-03-18** - Dashboard UI Phase 1: ShadCN UI setup, dark mode, /dashboard route with top bar, sidebar and main placeholders
- **2026-03-18** - Dashboard UI Phase 2: Collapsible sidebar with item types, favorite/recent collections, user avatar, mobile drawer support
- **2026-03-18** - Dashboard UI Phase 3: Main content area with stats cards, recent collections grid, pinned items, and 10 recent items using mock data
- **2026-03-18** - Prisma + Neon PostgreSQL: Prisma 7 ORM setup with Neon serverless adapter, initial migration with all data models (User, Item, ItemType, Collection, Tag, NextAuth models), indexes, and cascade deletes
- **2026-03-18** - Seed Data: Seed script with demo user, 7 system item types, 10 tags, 5 collections, and 18 items for development/demos
- **2026-03-18** - Dashboard Collections: Replaced mock collection data with real Neon database queries via Prisma. Created src/lib/db/collections.ts with getRecentCollections(), converted CollectionsGrid to async server component with dominant type border colors and type icons
- **2026-03-18** - Dashboard Items: Replaced mock item data with real Neon database queries via Prisma. Created src/lib/db/items.ts with getPinnedItems(), getRecentItems(), getStats(). Converted PinnedItems, RecentItems, and StatsCards to async server components
- **2026-03-18** - Stats & Sidebar: Replaced mock sidebar data with real Neon database queries. Added getItemTypesWithCounts(), getFavoriteCollections(), getSidebarCollections() to db layer. Converted dashboard layout to server component with client DashboardShell. Sidebar now shows ordered item types with counts, favorite collections with stars, recent collections with dominant-type colored circles, and "View all collections" link
- **2026-03-23** - Pro Badge: Added subtle ShadCN PRO badge (secondary variant) next to Files and Images item types in the dashboard sidebar
- **2026-03-23** - Code Scanner Quick Wins: Added Suspense boundaries with skeleton fallbacks for independent dashboard streaming, extracted shared getDemoUserId() helper to eliminate redundant user lookups, consolidated duplicated iconMap into shared module
- **2026-03-24** - Auth Phase 1: NextAuth v5 with GitHub OAuth, Prisma adapter, JWT strategy, split config pattern for edge compatibility, proxy-based route protection for /dashboard/*, session type extension with user.id
- **2026-03-24** - Auth Phase 2: Credentials provider with email/password registration, bcrypt validation in split config pattern, POST /api/auth/register route with validation and hashing
- **2026-03-25** - Auth Phase 3: Custom /sign-in page (email/password + GitHub OAuth), /register page with validation and success toast, reusable UserAvatar component (image + initials fallback), sidebar user area with real session data and dropdown sign-out
- **2026-03-25** - Email Verification: Resend integration for verification emails on register, block sign-in for unverified users, /verify-email token verification page, /check-email confirmation page, resend verification option on sign-in, clean-users utility script
- **2026-03-25** - Email Verification Toggle: REQUIRE_EMAIL_VERIFICATION env variable to enable/disable email verification system, defaults to false for development
- **2026-03-25** - Forgot Password: Password reset flow with /forgot-password and /reset-password pages, reuses VerificationToken model, 1-hour token expiry, Resend email, email enumeration prevention, credentials-only users
- **2026-03-25** - Profile Page: /profile route with account info (avatar, email, auth method, join date), usage stats with item type breakdown, change password for credentials users, delete account with typed confirmation dialog, profile icon in sidebar dropdown
- **2026-03-25** - Rate Limiting: Upstash Redis rate limiting on auth endpoints (login, register, forgot-password, reset-password, resend-verification) with sliding window algorithm, reusable utility, 429 responses with Retry-After headers, fail-open on Redis errors
- **2026-03-26** - GitHub OAuth Fix: Server-side signIn via Server Action, proxy redirect to /sign-in, allowDangerousEmailAccountLinking for GitHub provider
- **2026-03-26** - Items List View: Dynamic /items/[type] route with type-filtered items in responsive two-column grid, reusable ItemCard component, getItemsByType() DB query, shared dashboard layout with sidebar
- **2026-03-26** - Vitest Setup + Items Grid Layout: Vitest configured for server-side unit testing (node env, src/lib/**/*.test.ts), npm run test/test:watch scripts, smoke test for cn(). Items grid updated to 3-column on large screens (1 col mobile, 2 col md, 3 col lg)
- **2026-03-26** - Item Drawer: Right-side Sheet drawer opens on item click with instant card data display and progressive API detail loading. GET /api/items/[id] with auth, getItemById() query, ItemDrawerProvider context, ClickableItem wrapper, action bar (Favorite/Pin/Copy/Edit/Delete). Cached getDemoUserId() for deduplication
- **2026-03-26** - Item Drawer Edit Mode: Inline edit mode toggled via Edit button. Save/Cancel replace action bar. Editable: title, description, tags (all types), content (snippet/prompt/command/note), language (snippet/command), URL (link). Zod validation in updateItem server action, updateItem DB query with tag disconnect/reconnect, toast feedback, router.refresh(). Unit tests for validation schema
- **2026-03-26** - Item Delete: Delete button in item drawer with ShadCN AlertDialog confirmation, deleteItem server action with auth check, deleteItem DB query with ownership verification, toast on success, drawer close and UI refresh after deletion
