# DevStash — Project Overview

> A fast, searchable, AI-enhanced hub for developer knowledge & resources.

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Target Users](#target-users)
3. [Features](#features)
4. [Architecture Overview](#architecture-overview)
5. [Data Models (Draft)](#data-models-draft)
6. [Tech Stack](#tech-stack)
7. [Monetization](#monetization)
8. [UI/UX Guidelines](#uiux-guidelines)
9. [Item Type Reference](#item-type-reference)
10. [Useful Links](#useful-links)

---

## Problem Statement

Developers scatter their essentials across too many places:

| What | Where it ends up |
|---|---|
| Code snippets | VS Code, Notion, GitHub Gists |
| AI prompts | Chat histories |
| Context files | Buried in project folders |
| Useful links | Browser bookmarks |
| Documentation | Random folders |
| Commands | `.txt` files or bash history |
| Templates | GitHub Gists |

This leads to context switching, lost knowledge, and inconsistent workflows. **DevStash solves this with one fast, searchable, AI-enhanced hub.**

---

## Target Users

| User | Core Need |
|---|---|
| **Everyday Developer** | Quickly grab snippets, prompts, commands, links |
| **AI-first Developer** | Save prompts, contexts, workflows, system messages |
| **Content Creator / Educator** | Store code blocks, explanations, course notes |
| **Full-stack Builder** | Collect patterns, boilerplates, API examples |

---

## Features

### A. Items & Item Types

Items have a type. The following **system types** ship by default and cannot be modified. Users can later create custom types (Pro roadmap).

| Type | Content Kind | URL Pattern |
|---|---|---|
| `snippet` | text | `/items/snippets` |
| `prompt` | text | `/items/prompts` |
| `note` | text | `/items/notes` |
| `command` | text | `/items/commands` |
| `link` | url | `/items/links` |
| `file` | file *(Pro)* | `/items/files` |
| `image` | file *(Pro)* | `/items/images` |

Items are quick to create and access via a **slide-in drawer**.

---

### B. Collections

Users group items into named collections. An item can belong to **multiple collections**.

Example collections:
- `React Patterns` — snippets, notes
- `Context Files` — files
- `Python Snippets` — snippets
- `Interview Prep` — snippets, notes, links

---

### C. Search

Full-text search across:
- Title
- Content
- Tags
- Item type

---

### D. Authentication

- Email / password
- GitHub OAuth

> Powered by **NextAuth v5**

---

### E. Core Features

- ⭐ Favorite collections and items
- 📌 Pin items to top
- 🕐 Recently used items
- 📥 Import code from a file
- ✏️ Markdown editor for text types
- 📁 File upload for `file` and `image` types *(Pro)*
- 📤 Export data (JSON / ZIP) *(Pro)*
- 🌙 Dark mode default, light mode optional
- 🔗 Add/remove items to/from multiple collections
- 🗂️ View which collections any item belongs to

---

### F. AI Features *(Pro only)*

| Feature | Description |
|---|---|
| **Auto-tag suggestions** | AI suggests relevant tags on save |
| **Summaries** | Auto-generate a short summary for any item |
| **Explain This Code** | Get a plain-English explanation of a snippet |
| **Prompt Optimizer** | Improve and refine AI prompts |

> Uses **OpenAI `gpt-4o-mini`** model.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Next.js 16 App                      │
│                                                          │
│  ┌──────────────┐   ┌──────────────┐  ┌──────────────┐  │
│  │   Pages/SSR  │   │  API Routes  │  │  Components  │  │
│  │  (React 19)  │   │  (Backend)   │  │  (ShadCN UI) │  │
│  └──────────────┘   └──────┬───────┘  └──────────────┘  │
│                            │                             │
└────────────────────────────┼────────────────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
   ┌──────▼──────┐   ┌───────▼──────┐  ┌───────▼──────┐
   │  Neon (PG)  │   │  Cloudflare  │  │   OpenAI     │
   │  + Prisma   │   │     R2       │  │  gpt-4o-mini │
   └─────────────┘   └──────────────┘  └──────────────┘
          │
   ┌──────▼──────┐
   │  NextAuth   │
   │  v5 (Auth)  │
   └─────────────┘
```

**Layout Structure:**

```
┌──────────────────────────────────────────────┐
│  Sidebar (collapsible)  │  Main Content       │
│                         │                    │
│  • Item Types           │  Collection Cards  │
│    - Snippets           │  (color-coded)     │
│    - Prompts            │                    │
│    - Commands           │  Item Cards        │
│    - Notes              │  (color-coded      │
│    - Links              │   border)          │
│    - Files (Pro)        │                    │
│    - Images (Pro)       │  [Item Drawer →]   │
│                         │                    │
│  • Collections (latest) │                    │
└──────────────────────────────────────────────┘
```

---

## Data Models (Draft)

> ⚠️ **This is a rough draft.** Schema is subject to change. All database changes will be made via **Prisma migrations** — never `db push`.

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// --- Auth (extends NextAuth) ---

model User {
  id                   String    @id @default(cuid())
  name                 String?
  email                String?   @unique
  emailVerified        DateTime?
  image                String?
  isPro                Boolean   @default(false)
  stripeCustomerId     String?   @unique
  stripeSubscriptionId String?   @unique
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt

  accounts    Account[]
  sessions    Session[]
  items       Item[]
  collections Collection[]
  itemTypes   ItemType[]    // user-created custom types
  tags        Tag[]
}

// --- Item ---

model Item {
  id          String   @id @default(cuid())
  title       String
  contentType String   // "text" | "file" | "url"
  content     String?  // text content (null if file)
  fileUrl     String?  // Cloudflare R2 URL (null if text)
  fileName    String?  // original file name
  fileSize    Int?     // bytes
  url         String?  // for link types
  description String?
  isFavorite  Boolean  @default(false)
  isPinned    Boolean  @default(false)
  language    String?  // e.g. "typescript", for syntax highlighting
  lastUsedAt  DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  itemTypeId String
  itemType   ItemType @relation(fields: [itemTypeId], references: [id])

  tags        Tag[]            @relation("ItemTags")
  collections ItemCollection[]
}

// --- Item Type ---

model ItemType {
  id       String  @id @default(cuid())
  name     String  // "snippet" | "prompt" | "command" | etc.
  icon     String  // Lucide icon name, e.g. "Code", "Sparkles"
  color    String  // hex color, e.g. "#3b82f6"
  isSystem Boolean @default(false)

  userId String? // null for system types
  user   User?   @relation(fields: [userId], references: [id], onDelete: Cascade)

  items Item[]

  @@unique([name, userId]) // system types have unique names globally; user types unique per user
}

// --- Collection ---

model Collection {
  id            String   @id @default(cuid())
  name          String
  description   String?
  isFavorite    Boolean  @default(false)
  defaultTypeId String?  // ItemType id for hint when empty
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  items ItemCollection[]
}

// --- Join Table: Item <-> Collection ---

model ItemCollection {
  itemId       String
  collectionId String
  addedAt      DateTime @default(now())

  item       Item       @relation(fields: [itemId], references: [id], onDelete: Cascade)
  collection Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)

  @@id([itemId, collectionId])
}

// --- Tag ---

model Tag {
  id   String @id @default(cuid())
  name String

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  items Item[] @relation("ItemTags")

  @@unique([name, userId])
}

// --- NextAuth Required Models ---

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) / React 19 |
| **Language** | TypeScript |
| **Database** | [Neon](https://neon.tech/) (PostgreSQL) |
| **ORM** | [Prisma 7](https://www.prisma.io/docs) |
| **Auth** | [NextAuth v5](https://authjs.dev/) |
| **File Storage** | [Cloudflare R2](https://developers.cloudflare.com/r2/) |
| **AI** | [OpenAI API](https://platform.openai.com/docs) — `gpt-4o-mini` |
| **CSS** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Components** | [ShadCN UI](https://ui.shadcn.com/) |
| **Payments** | [Stripe](https://stripe.com/docs) |
| **Caching** | Redis *(TBD)* |

> **Migration rule:** Never use `prisma db push`. Always create and run migrations (`prisma migrate dev` → `prisma migrate deploy`).

---

## Monetization

### Free Tier
- 50 items total
- 3 collections
- All system types **except** `file` and `image`
- Basic search
- No AI features

### Pro — $8/month or $72/year
- Unlimited items
- Unlimited collections
- `file` and `image` type uploads (Cloudflare R2)
- Custom item types *(roadmap)*
- AI auto-tagging
- AI code explanation
- AI prompt optimizer
- Export as JSON / ZIP
- Priority support

> **Dev note:** During development, all users have access to Pro features. The `isPro` flag on `User` sets the foundation for gating later.

---

## UI/UX Guidelines

### Design Principles

- Modern, minimal, developer-focused
- Dark mode default; light mode optional
- Clean typography, generous whitespace
- Subtle borders and shadows
- **References:** [Notion](https://notion.so), [Linear](https://linear.app), [Raycast](https://raycast.com)
- Syntax highlighting on all code blocks

### Responsiveness

- **Desktop-first** — sidebar + main content layout
- Sidebar is collapsible on desktop
- Sidebar becomes a **drawer** on mobile

### Micro-interactions

- Smooth transitions on all state changes
- Hover states on cards
- Toast notifications for CRUD actions
- Loading skeletons on async content

---

## Item Type Reference

| Type | Icon (Lucide) | Color | Hex |
|---|---|---|---|
| Snippet | `Code` | Blue | `#3b82f6` |
| Prompt | `Sparkles` | Purple | `#8b5cf6` |
| Command | `Terminal` | Orange | `#f97316` |
| Note | `StickyNote` | Yellow | `#fde047` |
| File | `File` | Gray | `#6b7280` |
| Image | `Image` | Pink | `#ec4899` |
| Link | `Link` | Emerald | `#10b981` |

> Collections are color-coded in the main grid based on the dominant item type they contain.
> Items display color-coded **border** colors; collections display color-coded **background** colors.

---

## Useful Links

### Docs
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth v5 Docs](https://authjs.dev/)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [ShadCN UI Docs](https://ui.shadcn.com/)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Stripe Docs](https://stripe.com/docs)

### Tools & References
- [Lucide Icons](https://lucide.dev/icons/) — icon library used throughout the app
- [Prisma Migrate Guide](https://www.prisma.io/docs/orm/prisma-migrate)
- [Neon + Prisma Integration](https://neon.tech/docs/guides/prisma)
- [NextAuth GitHub Provider](https://authjs.dev/getting-started/providers/github)
- [Stripe Webhook Guide](https://stripe.com/docs/webhooks)

---

*Last updated: March 2026*
