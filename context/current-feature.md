# Current Feature: Auth Credentials - Email/Password Provider

<!-- Feature name and short description -->

## Status

In Progress

## Goals

- Add Credentials provider for email/password authentication with registration
- Use bcryptjs for password hashing
- Add password field to User model via Prisma migration
- Update `auth.config.ts` with Credentials provider placeholder (`authorize: () => null`)
- Update `auth.ts` to override Credentials with actual bcrypt validation logic
- Create registration API route at `POST /api/auth/register` (name, email, password, confirmPassword)
- Validate passwords match, check for existing user, hash password, create user
- Ensure GitHub OAuth still works alongside credentials

## Notes

### Credentials Provider in Split Pattern
- `auth.config.ts`: Add Credentials provider with `authorize: () => null` placeholder
- `auth.ts`: Override the Credentials provider with actual bcrypt validation logic

### Registration API Route
- `POST /api/auth/register`
- Accept: name, email, password, confirmPassword
- Validate passwords match
- Check if user already exists
- Hash password with bcryptjs
- Create user in database
- Return success/error response

### Testing
1. Test registration via curl
2. Go to `/api/auth/signin`
3. Sign in with email/password
4. Verify redirect to `/dashboard`
5. Verify GitHub OAuth still works

### References
- Credentials provider: https://authjs.dev/getting-started/authentication/credentials

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
