# DevStash

A developer knowledge hub for snippets, prompts, commands, notes, files, images, links and custom item types.

## Context Files

Read these for full project context:

- @context/project-overview.md: Features, data models, tech stack, UI/UX
- @context/coding-standards.md: Code conventions and patterns
- @context/ai-interaction.md : Workflow and communication guidelines
- @context/current-feature.md: What we are currently working on

## Tech Stack

- Next.js 16 (App Router, Server Components)
- TypeScript (strict)
- Prisma + Neon PostgreSQL
- NextAuth v5 (Email + GitHub)
- Tailwind CSS v4 + shadcn/ui
- Cloudflare R2 (file storage)
- OpenAI gpt-5-nano
- Stripe (payments)

## Neon Database

- Project: `weathered-thunder-99567429` (devstash)
- Default branch: `br-blue-wildflower-anmqtosy` (development)
- Always use the development branch for all Neon MCP operations
- NEVER use the main/production branch (`br-long-unit-an0pli7p`) unless explicitly told to

## Quick Commands

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run lint       # Run ESLint
npm run test       # Run unit tests (Vitest)
npm run test:watch # Run tests in watch mode