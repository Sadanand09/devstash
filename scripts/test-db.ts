import "dotenv/config";
import ws from "ws";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

// Required for Node.js — Neon serverless driver uses WebSockets
neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Testing database connection...\n");

  // Test connection
  const result = await prisma.$queryRaw`SELECT 1 as connected`;
  console.log("Connection test:", result);

  // Fetch demo user with counts
  const user = await prisma.user.findUnique({
    where: { email: "demo@devstash.io" },
    include: {
      itemTypes: true,
      tags: true,
      collections: {
        include: {
          items: {
            include: {
              item: {
                include: { itemType: true, tags: true },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    console.log("No demo user found. Run `npx prisma db seed` first.");
    return;
  }

  console.log(`\nUser: ${user.name} (${user.email})`);
  console.log(`  isPro: ${user.isPro}`);
  console.log(`  emailVerified: ${user.emailVerified}`);

  console.log(`\nItem Types (${user.itemTypes.length}):`);
  for (const t of user.itemTypes) {
    console.log(`  ${t.icon.padEnd(12)} ${t.name.padEnd(10)} ${t.color}  system=${t.isSystem}`);
  }

  console.log(`\nTags (${user.tags.length}):`);
  console.log(`  ${user.tags.map((t) => t.name).join(", ")}`);

  console.log(`\nCollections (${user.collections.length}):`);
  for (const col of user.collections) {
    const fav = col.isFavorite ? " ★" : "";
    console.log(`\n  ${col.name}${fav}`);
    console.log(`  "${col.description}"`);
    for (const ic of col.items) {
      const item = ic.item;
      const tagList = item.tags.map((t) => t.name).join(", ");
      const pinned = item.isPinned ? " 📌" : "";
      console.log(`    [${item.itemType.name}] ${item.title}${pinned}`);
      if (tagList) console.log(`           tags: ${tagList}`);
    }
  }

  // Summary counts
  const totalItems = await prisma.item.count({ where: { userId: user.id } });
  const pinnedItems = await prisma.item.count({ where: { userId: user.id, isPinned: true } });
  console.log(`\nSummary: ${totalItems} items, ${pinnedItems} pinned, ${user.collections.length} collections, ${user.tags.length} tags`);
  console.log("\nDatabase verification complete!");
}

main()
  .catch((e) => {
    console.error("Database connection failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });