import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";
import ws from "ws";
import "dotenv/config";

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.itemCollection.deleteMany();
  await prisma.item.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.itemType.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create user
  const hashedPassword = await bcrypt.hash("12345678", 12);
  const user = await prisma.user.create({
    data: {
      email: "demo@devstash.io",
      name: "Demo User",
      isPro: false,
      emailVerified: new Date(),
    },
  });

  // Store hashed password in account for credentials provider
  await prisma.account.create({
    data: {
      userId: user.id,
      type: "credentials",
      provider: "credentials",
      providerAccountId: user.id,
      access_token: hashedPassword,
    },
  });

  console.log(`Created user: ${user.email}`);

  // Create system item types
  const typeData = [
    { name: "snippet", icon: "Code", color: "#3b82f6" },
    { name: "prompt", icon: "Sparkles", color: "#8b5cf6" },
    { name: "command", icon: "Terminal", color: "#f97316" },
    { name: "note", icon: "StickyNote", color: "#fde047" },
    { name: "file", icon: "File", color: "#6b7280" },
    { name: "image", icon: "Image", color: "#ec4899" },
    { name: "link", icon: "Link", color: "#10b981" },
  ] as const;

  const types: Record<string, string> = {};
  for (const t of typeData) {
    const itemType = await prisma.itemType.create({
      data: {
        name: t.name,
        icon: t.icon,
        color: t.color,
        isSystem: true,
        userId: user.id,
      },
    });
    types[t.name] = itemType.id;
  }

  console.log(`Created ${typeData.length} item types`);

  // Create tags
  const tagNames = [
    "react",
    "typescript",
    "hooks",
    "docker",
    "git",
    "ai",
    "css",
    "devops",
    "shell",
    "productivity",
  ];
  const tags: Record<string, string> = {};
  for (const name of tagNames) {
    const tag = await prisma.tag.create({
      data: { name, userId: user.id },
    });
    tags[name] = tag.id;
  }

  console.log(`Created ${tagNames.length} tags`);

  // --- Collection: React Patterns ---
  const reactPatterns = await prisma.collection.create({
    data: {
      name: "React Patterns",
      description: "Reusable React patterns and hooks",
      userId: user.id,
      isFavorite: true,
    },
  });

  const reactItems = await Promise.all([
    prisma.item.create({
      data: {
        title: "useDebounce Hook",
        contentType: "snippet",
        language: "typescript",
        content: `import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}`,
        description: "Debounce any rapidly changing value with a configurable delay",
        isPinned: true,
        userId: user.id,
        itemTypeId: types.snippet,
        tags: { connect: [{ id: tags.react }, { id: tags.hooks }, { id: tags.typescript }] },
      },
    }),
    prisma.item.create({
      data: {
        title: "useLocalStorage Hook",
        contentType: "snippet",
        language: "typescript",
        content: `import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}`,
        description: "Persist state to localStorage with automatic serialization",
        userId: user.id,
        itemTypeId: types.snippet,
        tags: { connect: [{ id: tags.react }, { id: tags.hooks }, { id: tags.typescript }] },
      },
    }),
    prisma.item.create({
      data: {
        title: "Compound Component Pattern",
        contentType: "snippet",
        language: "typescript",
        content: `import { createContext, useContext, useState, ReactNode } from "react";

interface ToggleContextType {
  on: boolean;
  toggle: () => void;
}

const ToggleContext = createContext<ToggleContextType | null>(null);

function useToggle() {
  const ctx = useContext(ToggleContext);
  if (!ctx) throw new Error("useToggle must be used within Toggle");
  return ctx;
}

function Toggle({ children }: { children: ReactNode }) {
  const [on, setOn] = useState(false);
  return (
    <ToggleContext.Provider value={{ on, toggle: () => setOn((p) => !p) }}>
      {children}
    </ToggleContext.Provider>
  );
}

Toggle.On = ({ children }: { children: ReactNode }) => {
  const { on } = useToggle();
  return on ? <>{children}</> : null;
};

Toggle.Off = ({ children }: { children: ReactNode }) => {
  const { on } = useToggle();
  return on ? null : <>{children}</>;
};

Toggle.Button = () => {
  const { on, toggle } = useToggle();
  return <button onClick={toggle}>{on ? "ON" : "OFF"}</button>;
};

export { Toggle };`,
        description: "Compound component pattern with shared context for flexible composition",
        userId: user.id,
        itemTypeId: types.snippet,
        tags: { connect: [{ id: tags.react }, { id: tags.typescript }] },
      },
    }),
  ]);

  for (const item of reactItems) {
    await prisma.itemCollection.create({
      data: { itemId: item.id, collectionId: reactPatterns.id },
    });
  }

  // --- Collection: AI Workflows ---
  const aiWorkflows = await prisma.collection.create({
    data: {
      name: "AI Workflows",
      description: "AI prompts and workflow automations",
      userId: user.id,
      isFavorite: true,
    },
  });

  const aiItems = await Promise.all([
    prisma.item.create({
      data: {
        title: "Code Review Prompt",
        contentType: "prompt",
        content: `Review this code for:
1. Security vulnerabilities (injection, XSS, auth issues)
2. Performance problems (N+1 queries, unnecessary re-renders)
3. Logic errors and edge cases
4. Code style and readability

Be specific about line numbers and suggest fixes. Prioritize issues by severity.`,
        description: "Comprehensive code review prompt covering security, performance, and style",
        isPinned: true,
        userId: user.id,
        itemTypeId: types.prompt,
        tags: { connect: [{ id: tags.ai }, { id: tags.productivity }] },
      },
    }),
    prisma.item.create({
      data: {
        title: "Documentation Generator",
        contentType: "prompt",
        content: `Generate documentation for this code:
- Brief description of purpose
- Parameters/props with types and defaults
- Return value description
- Usage example
- Edge cases or important notes

Use JSDoc format for functions, markdown for modules.`,
        description: "Generate comprehensive documentation from code",
        userId: user.id,
        itemTypeId: types.prompt,
        tags: { connect: [{ id: tags.ai }] },
      },
    }),
    prisma.item.create({
      data: {
        title: "Refactoring Assistant",
        contentType: "prompt",
        content: `Refactor this code to improve:
- Readability: clear naming, smaller functions, less nesting
- Maintainability: single responsibility, dependency injection
- Testability: pure functions, mockable dependencies

Keep the public API unchanged. Show before/after for each change with a brief rationale.`,
        description: "Guided refactoring with focus on readability and maintainability",
        userId: user.id,
        itemTypeId: types.prompt,
        tags: { connect: [{ id: tags.ai }] },
      },
    }),
  ]);

  for (const item of aiItems) {
    await prisma.itemCollection.create({
      data: { itemId: item.id, collectionId: aiWorkflows.id },
    });
  }

  // --- Collection: DevOps ---
  const devops = await prisma.collection.create({
    data: {
      name: "DevOps",
      description: "Infrastructure and deployment resources",
      userId: user.id,
    },
  });

  const devopsItems = await Promise.all([
    prisma.item.create({
      data: {
        title: "Multi-stage Dockerfile",
        contentType: "snippet",
        language: "dockerfile",
        content: `FROM node:22-alpine AS base
RUN corepack enable

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]`,
        description: "Production-ready multi-stage Docker build for Next.js",
        userId: user.id,
        itemTypeId: types.snippet,
        tags: { connect: [{ id: tags.docker }, { id: tags.devops }] },
      },
    }),
    prisma.item.create({
      data: {
        title: "Deploy to Production",
        contentType: "command",
        content: `git checkout main && git pull origin main && docker compose -f docker-compose.prod.yml up -d --build`,
        description: "Pull latest main and deploy with Docker Compose",
        userId: user.id,
        itemTypeId: types.command,
        tags: { connect: [{ id: tags.devops }, { id: tags.docker }] },
      },
    }),
    prisma.item.create({
      data: {
        title: "GitHub Actions Documentation",
        contentType: "link",
        url: "https://docs.github.com/en/actions",
        description: "Official GitHub Actions docs — workflows, runners, and marketplace",
        userId: user.id,
        itemTypeId: types.link,
        tags: { connect: [{ id: tags.devops }] },
      },
    }),
    prisma.item.create({
      data: {
        title: "Docker Compose Docs",
        contentType: "link",
        url: "https://docs.docker.com/compose/",
        description: "Docker Compose reference for multi-container applications",
        userId: user.id,
        itemTypeId: types.link,
        tags: { connect: [{ id: tags.docker }, { id: tags.devops }] },
      },
    }),
  ]);

  for (const item of devopsItems) {
    await prisma.itemCollection.create({
      data: { itemId: item.id, collectionId: devops.id },
    });
  }

  // --- Collection: Terminal Commands ---
  const terminalCommands = await prisma.collection.create({
    data: {
      name: "Terminal Commands",
      description: "Useful shell commands for everyday development",
      userId: user.id,
    },
  });

  const terminalItems = await Promise.all([
    prisma.item.create({
      data: {
        title: "Git Interactive Rebase",
        contentType: "command",
        content: `git rebase -i HEAD~5`,
        description: "Interactively rebase the last 5 commits to squash, reorder, or edit",
        userId: user.id,
        itemTypeId: types.command,
        tags: { connect: [{ id: tags.git }, { id: tags.shell }] },
      },
    }),
    prisma.item.create({
      data: {
        title: "Docker Cleanup",
        contentType: "command",
        content: `docker system prune -af --volumes`,
        description: "Remove all unused containers, images, networks, and volumes",
        userId: user.id,
        itemTypeId: types.command,
        tags: { connect: [{ id: tags.docker }, { id: tags.shell }] },
      },
    }),
    prisma.item.create({
      data: {
        title: "Find and Kill Process on Port",
        contentType: "command",
        content: `lsof -ti:3000 | xargs kill -9`,
        description: "Kill whatever process is occupying port 3000",
        userId: user.id,
        itemTypeId: types.command,
        tags: { connect: [{ id: tags.shell }] },
      },
    }),
    prisma.item.create({
      data: {
        title: "NPM Dependency Check",
        contentType: "command",
        content: `npx npm-check-updates -u && npm install`,
        description: "Update all dependencies to their latest versions",
        userId: user.id,
        itemTypeId: types.command,
        tags: { connect: [{ id: tags.shell }, { id: tags.productivity }] },
      },
    }),
  ]);

  for (const item of terminalItems) {
    await prisma.itemCollection.create({
      data: { itemId: item.id, collectionId: terminalCommands.id },
    });
  }

  // --- Collection: Design Resources ---
  const designResources = await prisma.collection.create({
    data: {
      name: "Design Resources",
      description: "UI/UX resources and references",
      userId: user.id,
    },
  });

  const designItems = await Promise.all([
    prisma.item.create({
      data: {
        title: "Tailwind CSS Documentation",
        contentType: "link",
        url: "https://tailwindcss.com/docs",
        description: "Official Tailwind CSS docs with utility class reference",
        userId: user.id,
        itemTypeId: types.link,
        tags: { connect: [{ id: tags.css }] },
      },
    }),
    prisma.item.create({
      data: {
        title: "shadcn/ui Components",
        contentType: "link",
        url: "https://ui.shadcn.com",
        description: "Beautifully designed components built with Radix UI and Tailwind",
        userId: user.id,
        itemTypeId: types.link,
        tags: { connect: [{ id: tags.css }, { id: tags.react }] },
      },
    }),
    prisma.item.create({
      data: {
        title: "Vercel Design System",
        contentType: "link",
        url: "https://vercel.com/geist/introduction",
        description: "Vercel's Geist design system — typography, colors, and components",
        userId: user.id,
        itemTypeId: types.link,
        tags: { connect: [{ id: tags.css }] },
      },
    }),
    prisma.item.create({
      data: {
        title: "Lucide Icons",
        contentType: "link",
        url: "https://lucide.dev/icons",
        description: "Beautiful and consistent open-source icon library",
        userId: user.id,
        itemTypeId: types.link,
        tags: { connect: [{ id: tags.css }, { id: tags.react }] },
      },
    }),
  ]);

  for (const item of designItems) {
    await prisma.itemCollection.create({
      data: { itemId: item.id, collectionId: designResources.id },
    });
  }

  const totalItems =
    reactItems.length +
    aiItems.length +
    devopsItems.length +
    terminalItems.length +
    designItems.length;

  console.log(`Created 5 collections with ${totalItems} items total`);
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());