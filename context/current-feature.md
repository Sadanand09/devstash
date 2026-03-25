# Current Feature: Profile Page

<!-- Feature name and short description -->

## Status

In Progress

## Goals

- Create profile page at `/profile` route (protected, requires authentication)
- Display user info: email, name, avatar (GitHub or initials), account creation date
- Show usage stats: total items, total collections, breakdown by item type
- Add change password action (email/password users only, not GitHub OAuth)
- Add delete account action with confirmation dialog

## Notes

- Avatar logic: Use GitHub avatar from OAuth if available, otherwise generate initials from name/email
- Change password button should only appear for credentials-based users
- Delete account needs confirmation dialog to prevent accidental deletion
- Item type breakdown should show counts for each type (snippets, prompts, notes, commands, links, files, images)
- Follow existing codebase patterns for data fetching and components

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
