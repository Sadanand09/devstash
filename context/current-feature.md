# Current Feature

Forgot Password: Password reset flow using existing VerificationToken model and Resend email

## Status

In Progress

## Goals

- Add "Forgot password?" link on the sign-in page below the password field
- Create `/forgot-password` page with email input form
- Create `POST /api/auth/forgot-password` route that generates a reset token (reusing VerificationToken model) and sends a password reset email via Resend
- Create `/reset-password` page that accepts a token query param, validates it, and shows a new password form
- Create `POST /api/auth/reset-password` route that verifies the token, hashes the new password with bcrypt, updates the user, and deletes the token
- Add `sendPasswordResetEmail()` to `src/lib/email.ts` for the reset email template
- Add `generatePasswordResetToken()` and `verifyPasswordResetToken()` to `src/lib/tokens.ts` (reuse VerificationToken model, but keep functions separate from email verification for clarity)
- Show success/error states on both pages with appropriate messaging
- Only allow reset for users who registered with credentials (have a hashed password)

## Notes

- Reuse the existing `VerificationToken` Prisma model (identifier, token, expires) - no schema changes needed
- Reuse the existing Resend integration in `src/lib/email.ts`
- Follow the same patterns as the email verification flow (token generation, email sending, token verification page)
- Token expiry: 1 hour (shorter than email verification's 24 hours for security)
- Password requirements: match whatever the register page uses

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
