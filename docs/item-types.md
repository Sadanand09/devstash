# Item Types Reference

DevStash ships with 7 system item types. These are seeded on first run and cannot be modified by users. Custom user-created types are a Pro roadmap feature.

---

## Type Overview

| Type | Icon (Lucide) | Hex Color | Content Kind | Pro Only |
|---|---|---|---|---|
| **Snippet** | `Code` | `#3b82f6` (Blue) | text | No |
| **Prompt** | `Sparkles` | `#8b5cf6` (Purple) | text | No |
| **Command** | `Terminal` | `#f97316` (Orange) | text | No |
| **Note** | `StickyNote` | `#fde047` (Yellow) | text | No |
| **Link** | `Link` | `#10b981` (Emerald) | url | No |
| **File** | `File` | `#6b7280` (Gray) | file | Yes |
| **Image** | `Image` | `#ec4899` (Pink) | file | Yes |

---

## Per-Type Details

### Snippet (`#3b82f6`)
- **Purpose:** Store reusable code fragments — hooks, patterns, boilerplate, utilities.
- **Content kind:** text
- **Key fields:** `content` (code body), `language` (syntax highlighting — e.g. `typescript`, `dockerfile`)
- **URL pattern:** `/items/snippets`
- **Notes:** Most common type. Markdown editor with syntax highlighting. Supports `language` field for per-snippet highlighting.

### Prompt (`#8b5cf6`)
- **Purpose:** Save AI prompts — system messages, review prompts, generation templates.
- **Content kind:** text
- **Key fields:** `content` (prompt text)
- **URL pattern:** `/items/prompts`
- **Notes:** Designed for AI-first developers. Content is plain or markdown text. AI Prompt Optimizer (Pro) can refine these.

### Command (`#f97316`)
- **Purpose:** Store shell commands, one-liners, and CLI recipes.
- **Content kind:** text
- **Key fields:** `content` (the command string)
- **URL pattern:** `/items/commands`
- **Notes:** Typically short, single-line or chained commands. Displayed with monospace styling.

### Note (`#fde047`)
- **Purpose:** Free-form developer notes — explanations, checklists, meeting notes, documentation fragments.
- **Content kind:** text
- **Key fields:** `content` (markdown text)
- **URL pattern:** `/items/notes`
- **Notes:** Full markdown editor support. Most flexible text type.

### Link (`#10b981`)
- **Purpose:** Bookmark useful URLs — documentation, tools, references, articles.
- **Content kind:** url
- **Key fields:** `url` (the bookmarked URL), `description` (optional context)
- **URL pattern:** `/items/links`
- **Notes:** The only type that uses the `url` field instead of `content`. `content` field is null for links.

### File (`#6b7280`) — Pro
- **Purpose:** Upload and store files — context files, configs, templates, documents.
- **Content kind:** file
- **Key fields:** `fileUrl` (Cloudflare R2 URL), `fileName` (original name), `fileSize` (bytes)
- **URL pattern:** `/items/files`
- **Notes:** Stored in Cloudflare R2. `content` field is null; file metadata is in `fileUrl`, `fileName`, `fileSize`.

### Image (`#ec4899`) — Pro
- **Purpose:** Upload and store images — screenshots, diagrams, UI mockups.
- **Content kind:** file
- **Key fields:** `fileUrl` (Cloudflare R2 URL), `fileName` (original name), `fileSize` (bytes)
- **URL pattern:** `/items/images`
- **Notes:** Same storage mechanism as File type. Displayed with image preview in the UI.

---

## Classification Summary

### By content kind

| Kind | Types | Primary field |
|---|---|---|
| **text** | Snippet, Prompt, Command, Note | `content` |
| **file** | File, Image | `fileUrl`, `fileName`, `fileSize` |
| **url** | Link | `url` |

### Shared properties (all types)

Every item, regardless of type, has these fields:

| Field | Description |
|---|---|
| `title` | Required display name |
| `description` | Optional short summary |
| `isFavorite` | Star/unstar toggle |
| `isPinned` | Pin to top of lists |
| `language` | Syntax highlighting hint (primarily for snippets) |
| `lastUsedAt` | Tracks recent usage |
| `tags` | Many-to-many relation with `Tag` |
| `collections` | Many-to-many relation with `Collection` via `ItemCollection` |

### Display differences

- **Color-coded borders:** Each item card shows a left border in its type's hex color.
- **Collection colors:** Collections derive their background color from the dominant item type they contain.
- **Syntax highlighting:** Only relevant for `snippet` type (uses `language` field).
- **URL rendering:** `link` items show a clickable URL; other types do not.
- **File preview:** `image` items render a preview; `file` items show filename and size.
- **Markdown rendering:** `note` and `prompt` types render markdown in the detail view.

---

## Database Model

The `ItemType` model in Prisma:

```prisma
model ItemType {
  id       String  @id @default(cuid())
  name     String  // "snippet" | "prompt" | "command" | "note" | "file" | "image" | "link"
  icon     String  // Lucide icon name
  color    String  // hex color
  isSystem Boolean @default(false)

  userId String?
  user   User?   @relation(fields: [userId], references: [id], onDelete: Cascade)

  items Item[]

  @@unique([name, userId])
  @@index([userId])
}
```

- System types have `isSystem: true` and are created during seeding.
- Each item links to its type via `itemTypeId` → `ItemType.id`.
- Custom user types (roadmap) will have `isSystem: false` and a non-null `userId`.

---

*Generated: 2026-03-26*
