# Item CRUD Architecture

A unified CRUD system for all 7 item types using one dynamic route, shared components, and centralized mutations/queries.

---

## File Structure

```
src/
├── actions/
│   └── items.ts                    # All item mutations (create, update, delete)
│
├── lib/db/
│   └── items.ts                    # All item queries (already exists, extend)
│
├── app/dashboard/items/
│   └── [type]/
│       └── page.tsx                # Dynamic route — renders any item type
│
├── components/items/
│   ├── ItemsPageHeader.tsx         # Title, icon, color, "New Item" button
│   ├── ItemList.tsx                # Grid/list of ItemCard components
│   ├── ItemCard.tsx                # Single item card (colored border, actions)
│   ├── ItemDrawer.tsx              # Slide-in drawer for create/edit
│   ├── ItemForm.tsx                # Unified form — adapts fields by type
│   ├── ItemContent.tsx             # Type-specific content display
│   ├── DeleteItemDialog.tsx        # Confirmation dialog for delete
│   └── ItemEmptyState.tsx          # Empty state per type
```

---

## Routing: `/items/[type]`

A single dynamic route handles all 7 types.

### `src/app/dashboard/items/[type]/page.tsx`

```
URL: /dashboard/items/snippet
                       ↑ params.type
```

**Flow:**
1. Extract `params.type` (e.g. `"snippet"`)
2. Validate type exists via DB lookup (`getItemTypeByName(type)`)
3. If invalid → `notFound()`
4. Fetch items for that type → `getItemsByType(type)`
5. Render `ItemsPageHeader` + `ItemList`

```tsx
// Server component
export default async function ItemsPage({ params }: { params: { type: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const itemType = await getItemTypeByName(params.type, session.user.id);
  if (!itemType) notFound();

  const items = await getItemsByType(itemType.id, session.user.id);

  return (
    <>
      <ItemsPageHeader itemType={itemType} />
      <Suspense fallback={<ItemListSkeleton />}>
        <ItemList items={items} itemType={itemType} />
      </Suspense>
    </>
  );
}
```

**Valid type slugs:** `snippet`, `prompt`, `command`, `note`, `file`, `image`, `link`

---

## Mutations: `src/actions/items.ts`

All mutations live in one server action file. Each action validates auth, input, and calls Prisma.

### Actions

| Action | Purpose | Key inputs |
|---|---|---|
| `createItem` | Create new item | `title`, `contentType`, `itemTypeId`, + type-specific fields |
| `updateItem` | Edit existing item | `id` + changed fields |
| `deleteItem` | Delete item | `id` |
| `toggleFavorite` | Toggle `isFavorite` | `id` |
| `togglePin` | Toggle `isPinned` | `id` |
| `updateLastUsed` | Touch `lastUsedAt` | `id` |

### Action pattern

```tsx
"use server";

export async function createItem(formData: FormData) {
  // 1. Auth check
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // 2. Extract & validate input
  const title = formData.get("title") as string;
  const itemTypeId = formData.get("itemTypeId") as string;
  const contentType = formData.get("contentType") as string;
  // ...type-specific fields

  // 3. DB operation
  const item = await prisma.item.create({
    data: {
      title,
      contentType,
      itemTypeId,
      userId: session.user.id,
      content: contentType === "text" ? formData.get("content") as string : null,
      url: contentType === "url" ? formData.get("url") as string : null,
      language: formData.get("language") as string | null,
      description: formData.get("description") as string | null,
    },
  });

  // 4. Revalidate & return
  revalidatePath(`/dashboard/items/${typeName}`);
  return { success: true, item };
}
```

### Content type determines which fields are set

| contentType | `content` | `url` | `fileUrl`/`fileName`/`fileSize` |
|---|---|---|---|
| `text` | set | null | null |
| `url` | null | set | null |
| `file` | null | null | set |

---

## Queries: `src/lib/db/items.ts`

Extend the existing file with new query functions.

### Existing (keep as-is)

- `getPinnedItems()` — dashboard pinned items
- `getRecentItems(limit)` — dashboard recent items
- `getItemTypesWithCounts()` — sidebar counts
- `getStats()` — dashboard stats

### New queries to add

| Function | Purpose | Used by |
|---|---|---|
| `getItemTypeByName(name, userId)` | Look up an item type by slug | Page route validation |
| `getItemsByType(typeId, userId)` | Fetch all items for a type | Items list page |
| `getItemById(id, userId)` | Fetch single item with relations | Edit drawer, detail view |
| `searchItems(query, userId, typeId?)` | Full-text search | Search feature |

### Query pattern

```tsx
export async function getItemsByType(typeId: string, userId: string) {
  return prisma.item.findMany({
    where: { itemTypeId: typeId, userId },
    include: {
      itemType: true,
      tags: true,
      collections: { include: { collection: true } },
    },
    orderBy: [
      { isPinned: "desc" },
      { createdAt: "desc" },
    ],
  });
}
```

---

## Component Responsibilities

### `ItemsPageHeader` (server component)

Displays the page title with the type's icon and color, item count, and a "New Item" button.

**Props:** `itemType: { name, icon, color }`, `count: number`

### `ItemList` (server component)

Renders a responsive grid of `ItemCard` components. Shows `ItemEmptyState` if no items.

**Props:** `items: Item[]`, `itemType: ItemType`

### `ItemCard` (client component — `"use client"`)

Single item card with:
- Colored left border (from `itemType.color`)
- Title, description preview, tags
- Favorite star, pin toggle, copy button
- Click → opens `ItemDrawer` for viewing/editing
- Dropdown menu → edit, delete, add to collection

**Props:** `item: Item & { itemType, tags }`, `onEdit`, `onDelete`

### `ItemDrawer` (client component — `"use client"`)

Slide-in sheet (ShadCN `Sheet`) for creating/editing items. Contains `ItemForm`.

**Props:** `open: boolean`, `onClose`, `itemType: ItemType`, `item?: Item` (null for create)

### `ItemForm` (client component — `"use client"`)

Unified form that adapts fields based on content kind:

| Content kind | Fields shown |
|---|---|
| **text** (snippet, prompt, command, note) | Title, Content (textarea/editor), Language (snippets only), Description, Tags |
| **url** (link) | Title, URL, Description, Tags |
| **file** (file, image) | Title, File upload, Description, Tags |

**Calls:** `createItem` or `updateItem` server actions on submit.

### `ItemContent` (server or client component)

Type-specific content rendering in detail/drawer view:

| Type | Rendering |
|---|---|
| **snippet** | Syntax-highlighted code block (using `language` field) |
| **prompt** | Markdown-rendered text |
| **command** | Monospace code block |
| **note** | Markdown-rendered text |
| **link** | Clickable URL with metadata |
| **file** | File name, size, download link |
| **image** | Image preview + file info |

### `DeleteItemDialog` (client component)

ShadCN `AlertDialog` for delete confirmation. Calls `deleteItem` server action.

### `ItemEmptyState` (server component)

Shows a type-specific empty state with icon, message, and "Create your first {type}" CTA.

---

## Where Type-Specific Logic Lives

Type-specific behavior is handled at the **component level**, not in actions or queries.

| Layer | Type-aware? | How |
|---|---|---|
| **Actions** (`actions/items.ts`) | No | Uses `contentType` field to decide which DB fields to set. Same action for all types. |
| **Queries** (`lib/db/items.ts`) | No | Filters by `itemTypeId`. Same query shape for all types. |
| **Route** (`items/[type]/page.tsx`) | Minimal | Validates type slug, passes type info to components. |
| **Components** | Yes | `ItemForm` shows different fields. `ItemContent` renders differently. `ItemCard` shows type color. |

This keeps mutations and data access generic while letting the UI adapt per type.

---

## Data Flow Summary

```
[User clicks "New Snippet"]
    ↓
ItemDrawer opens → ItemForm renders (text fields + language selector)
    ↓
[User fills form, clicks Save]
    ↓
ItemForm calls createItem(formData) server action
    ↓
createItem validates auth → creates Item in DB → revalidatePath
    ↓
Items page re-renders → getItemsByType fetches updated list
    ↓
ItemList renders new item in grid
```

```
[User visits /dashboard/items/snippet]
    ↓
page.tsx (server component)
    ↓
getItemTypeByName("snippet", userId) → validates type exists
    ↓
getItemsByType(typeId, userId) → fetches items with relations
    ↓
Renders ItemsPageHeader + ItemList with Suspense boundary
```

---

## Conventions (matching existing codebase)

- **Auth:** Use `auth()` from `@/auth` for session, `redirect("/sign-in")` if unauthenticated
- **Data fetching:** Direct Prisma calls in `lib/db/` functions, called from server components
- **Mutations:** Server actions in `src/actions/`, imported by client components
- **Revalidation:** `revalidatePath()` after mutations to refresh server component data
- **UI:** ShadCN components (Sheet, Card, Button, Badge, AlertDialog, Input, Textarea)
- **Icons:** Lucide icons via `src/lib/icon-map.ts` dynamic lookup
- **Colors:** Item type hex colors for borders (`border-l-[3px]`) and accents
- **Loading:** `Suspense` with skeleton fallbacks

---

*Generated: 2026-03-26*
