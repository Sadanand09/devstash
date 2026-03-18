// Mock data for dashboard UI until database is implemented

// ── Item Types ──────────────────────────────────────────────

export type ItemType = {
  id: string;
  name: string;
  icon: string;
  color: string;
  isSystem: boolean;
};

export const itemTypes: ItemType[] = [
  { id: "type-snippet", name: "snippet", icon: "Code", color: "#3b82f6", isSystem: true },
  { id: "type-prompt", name: "prompt", icon: "Sparkles", color: "#8b5cf6", isSystem: true },
  { id: "type-command", name: "command", icon: "Terminal", color: "#f97316", isSystem: true },
  { id: "type-note", name: "note", icon: "StickyNote", color: "#fde047", isSystem: true },
  { id: "type-file", name: "file", icon: "File", color: "#6b7280", isSystem: true },
  { id: "type-image", name: "image", icon: "Image", color: "#ec4899", isSystem: true },
  { id: "type-link", name: "link", icon: "Link", color: "#10b981", isSystem: true },
];

// ── Tags ────────────────────────────────────────────────────

export type Tag = {
  id: string;
  name: string;
};

export const tags: Tag[] = [
  { id: "tag-1", name: "react" },
  { id: "tag-2", name: "auth" },
  { id: "tag-3", name: "hooks" },
  { id: "tag-4", name: "python" },
  { id: "tag-5", name: "git" },
  { id: "tag-6", name: "typescript" },
  { id: "tag-7", name: "api" },
  { id: "tag-8", name: "css" },
  { id: "tag-9", name: "docker" },
  { id: "tag-10", name: "testing" },
];

// ── Items ───────────────────────────────────────────────────

export type Item = {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  url: string | null;
  language: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  itemTypeId: string;
  tagIds: string[];
  collectionIds: string[];
  createdAt: string;
  updatedAt: string;
};

export const items: Item[] = [
  {
    id: "item-1",
    title: "useAuth Hook",
    description: "Custom authentication hook for React applications",
    content: `import { useContext } from 'react'
import { AuthContext } from './AuthContext'

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}`,
    url: null,
    language: "typescript",
    isFavorite: true,
    isPinned: true,
    itemTypeId: "type-snippet",
    tagIds: ["tag-1", "tag-2", "tag-3"],
    collectionIds: ["col-1"],
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "item-2",
    title: "API Error Handling Pattern",
    description: "Fetch wrapper with exponential backoff retry logic",
    content: `async function fetchWithRetry(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.statusText);
      return await res.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 2 ** i * 1000));
    }
  }
}`,
    url: null,
    language: "typescript",
    isFavorite: false,
    isPinned: true,
    itemTypeId: "type-snippet",
    tagIds: ["tag-6", "tag-7"],
    collectionIds: ["col-1"],
    createdAt: "2026-01-12T08:30:00Z",
    updatedAt: "2026-01-12T08:30:00Z",
  },
  {
    id: "item-3",
    title: "Explain this codebase",
    description: "Prompt for getting a high-level overview of any project",
    content: `You are an expert software engineer. Analyze the following codebase and provide:
1. A high-level architecture overview
2. Key technologies used
3. Main entry points
4. Data flow summary
Keep it concise and developer-friendly.`,
    url: null,
    language: null,
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type-prompt",
    tagIds: [],
    collectionIds: ["col-6"],
    createdAt: "2026-02-01T14:00:00Z",
    updatedAt: "2026-02-01T14:00:00Z",
  },
  {
    id: "item-4",
    title: "Git interactive rebase",
    description: "Squash last N commits into one",
    content: "git rebase -i HEAD~N",
    url: null,
    language: "bash",
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type-command",
    tagIds: ["tag-5"],
    collectionIds: ["col-5"],
    createdAt: "2026-01-20T09:00:00Z",
    updatedAt: "2026-01-20T09:00:00Z",
  },
  {
    id: "item-5",
    title: "Git stash with message",
    description: "Stash changes with a descriptive name",
    content: "git stash push -m \"description of changes\"",
    url: null,
    language: "bash",
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type-command",
    tagIds: ["tag-5"],
    collectionIds: ["col-5"],
    createdAt: "2026-01-20T09:15:00Z",
    updatedAt: "2026-01-20T09:15:00Z",
  },
  {
    id: "item-6",
    title: "Docker build & run",
    description: "Build and run a Docker container in one line",
    content: "docker build -t myapp . && docker run -p 3000:3000 myapp",
    url: null,
    language: "bash",
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type-command",
    tagIds: ["tag-9"],
    collectionIds: [],
    createdAt: "2026-02-05T11:00:00Z",
    updatedAt: "2026-02-05T11:00:00Z",
  },
  {
    id: "item-7",
    title: "Python list comprehension patterns",
    description: "Common list comprehension examples",
    content: `# Filter and transform
evens = [x * 2 for x in range(10) if x % 2 == 0]

# Nested comprehension
matrix = [[1,2,3],[4,5,6]]
flat = [x for row in matrix for x in row]

# Dict comprehension
word_lengths = {w: len(w) for w in ["hello", "world"]}`,
    url: null,
    language: "python",
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type-snippet",
    tagIds: ["tag-4"],
    collectionIds: ["col-2"],
    createdAt: "2026-01-25T16:00:00Z",
    updatedAt: "2026-01-25T16:00:00Z",
  },
  {
    id: "item-8",
    title: "React component testing notes",
    description: "Key things to remember when testing React components",
    content: `## Testing React Components

- Always test behavior, not implementation details
- Use \`screen.getByRole\` over \`getByTestId\` when possible
- Wrap state updates in \`act()\`
- Mock API calls at the network level with MSW
- Test error and loading states, not just happy paths`,
    url: null,
    language: null,
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type-note",
    tagIds: ["tag-1", "tag-10"],
    collectionIds: ["col-4"],
    createdAt: "2026-02-10T13:00:00Z",
    updatedAt: "2026-02-10T13:00:00Z",
  },
  {
    id: "item-9",
    title: "Code review prompt",
    description: "AI prompt for thorough code reviews",
    content: `Review the following code for:
1. Bugs and edge cases
2. Security vulnerabilities
3. Performance issues
4. Readability and naming
5. Missing error handling

Be specific with line numbers and suggest fixes.`,
    url: null,
    language: null,
    isFavorite: true,
    isPinned: false,
    itemTypeId: "type-prompt",
    tagIds: [],
    collectionIds: ["col-6"],
    createdAt: "2026-02-15T10:00:00Z",
    updatedAt: "2026-02-15T10:00:00Z",
  },
  {
    id: "item-10",
    title: "Tailwind CSS cheatsheet",
    description: "Quick reference for common Tailwind patterns",
    url: "https://tailwindcomponents.com/cheatsheet",
    content: null,
    language: null,
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type-link",
    tagIds: ["tag-8"],
    collectionIds: [],
    createdAt: "2026-02-18T09:00:00Z",
    updatedAt: "2026-02-18T09:00:00Z",
  },
  {
    id: "item-11",
    title: "React useReducer pattern",
    description: "Type-safe useReducer with discriminated unions",
    content: `type Action =
  | { type: 'SET_LOADING' }
  | { type: 'SET_DATA'; payload: Data }
  | { type: 'SET_ERROR'; error: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_LOADING': return { ...state, loading: true };
    case 'SET_DATA': return { loading: false, data: action.payload, error: null };
    case 'SET_ERROR': return { loading: false, data: null, error: action.error };
  }
}`,
    url: null,
    language: "typescript",
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type-snippet",
    tagIds: ["tag-1", "tag-6"],
    collectionIds: ["col-1"],
    createdAt: "2026-02-20T15:00:00Z",
    updatedAt: "2026-02-20T15:00:00Z",
  },
  {
    id: "item-12",
    title: ".cursorrules context file",
    description: "AI context file for projects",
    content: null,
    url: null,
    language: null,
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type-file",
    tagIds: [],
    collectionIds: ["col-3"],
    createdAt: "2026-03-01T10:00:00Z",
    updatedAt: "2026-03-01T10:00:00Z",
  },
  {
    id: "item-13",
    title: "CLAUDE.md context file",
    description: "AI context file for Claude Code",
    content: null,
    url: null,
    language: null,
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type-file",
    tagIds: [],
    collectionIds: ["col-3"],
    createdAt: "2026-03-01T10:30:00Z",
    updatedAt: "2026-03-01T10:30:00Z",
  },
  {
    id: "item-14",
    title: "Next.js documentation",
    description: "Official Next.js docs",
    url: "https://nextjs.org/docs",
    content: null,
    language: null,
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type-link",
    tagIds: [],
    collectionIds: [],
    createdAt: "2026-02-22T08:00:00Z",
    updatedAt: "2026-02-22T08:00:00Z",
  },
  {
    id: "item-15",
    title: "Debug prompt",
    description: "Prompt for debugging tricky issues",
    content: `I have a bug in my code. Here's what I know:

**Expected behavior:** [describe]
**Actual behavior:** [describe]
**Steps to reproduce:** [list steps]
**Code:** [paste relevant code]

Help me identify the root cause and suggest a fix.`,
    url: null,
    language: null,
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type-prompt",
    tagIds: [],
    collectionIds: ["col-6"],
    createdAt: "2026-03-05T12:00:00Z",
    updatedAt: "2026-03-05T12:00:00Z",
  },
];

// ── Collections ─────────────────────────────────────────────

export type Collection = {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemIds: string[];
  createdAt: string;
  updatedAt: string;
};

export const collections: Collection[] = [
  {
    id: "col-1",
    name: "React Patterns",
    description: "Common React patterns and hooks",
    isFavorite: true,
    itemIds: ["item-1", "item-2", "item-8", "item-11"],
    createdAt: "2026-01-10T10:00:00Z",
    updatedAt: "2026-02-20T15:00:00Z",
  },
  {
    id: "col-2",
    name: "Python Snippets",
    description: "Useful Python code snippets",
    isFavorite: false,
    itemIds: ["item-7"],
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-01-25T16:00:00Z",
  },
  {
    id: "col-3",
    name: "Context Files",
    description: "AI context files for projects",
    isFavorite: true,
    itemIds: ["item-12", "item-13"],
    createdAt: "2026-02-01T10:00:00Z",
    updatedAt: "2026-03-01T10:30:00Z",
  },
  {
    id: "col-4",
    name: "Interview Prep",
    description: "Technical interview preparation",
    isFavorite: false,
    itemIds: ["item-8"],
    createdAt: "2026-02-05T10:00:00Z",
    updatedAt: "2026-02-10T13:00:00Z",
  },
  {
    id: "col-5",
    name: "Git Commands",
    description: "Frequently used git commands",
    isFavorite: true,
    itemIds: ["item-4", "item-5"],
    createdAt: "2026-01-20T09:00:00Z",
    updatedAt: "2026-01-20T09:15:00Z",
  },
  {
    id: "col-6",
    name: "AI Prompts",
    description: "Curated AI prompts for coding",
    isFavorite: false,
    itemIds: ["item-3", "item-9", "item-15"],
    createdAt: "2026-02-01T14:00:00Z",
    updatedAt: "2026-03-05T12:00:00Z",
  },
];

// ── Current User ────────────────────────────────────────────

export type User = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  isPro: boolean;
};

export const currentUser: User = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  image: null,
  isPro: true,
};

// ── Sidebar Counts (derived) ────────────────────────────────

export const itemTypeCounts: Record<string, number> = {
  snippet: items.filter((i) => i.itemTypeId === "type-snippet").length,
  prompt: items.filter((i) => i.itemTypeId === "type-prompt").length,
  command: items.filter((i) => i.itemTypeId === "type-command").length,
  note: items.filter((i) => i.itemTypeId === "type-note").length,
  file: items.filter((i) => i.itemTypeId === "type-file").length,
  image: items.filter((i) => i.itemTypeId === "type-image").length,
  link: items.filter((i) => i.itemTypeId === "type-link").length,
};
