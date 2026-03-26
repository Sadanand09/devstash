# Current Feature — Item Drawer

Right-side slide-in drawer that opens when clicking an item card. This is the item detail view — there is no separate item page.

## Status

In Progress

## Goals

- Use shadcn Sheet component, opens from the right
- Clicking an ItemCard opens the drawer with that item's full data
- Works on both dashboard and items list pages
- Action bar with Favorite (star, yellow when active), Pin, Copy, Edit (pencil), Delete (trash, right-aligned)
- Client wrapper component to manage drawer state (pages are server components)
- Fetch full item detail on click via API route (`/api/items/[id]`), no page navigation
- Drawer shows skeleton/loading state while fetching
- Query function in `lib/db/items.ts`, API route calls it with auth check

## Notes

- Card data (title, description, tags) already fetched by server component
- Full item detail (content, collections, language, etc.) fetched on click via API
- Code editor and item-specific extras will come later — this is just the detail display
- See `context/screenshots/dashboard-ui-drawer.png` for visual reference

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
