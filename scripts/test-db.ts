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

  // Test connection with a raw query
  const result = await prisma.$queryRaw`SELECT 1 as connected`;
  console.log("Connection test:", result);

  // Count rows in each table
  const [users, items, itemTypes, collections, tags] = await Promise.all([
    prisma.user.count(),
    prisma.item.count(),
    prisma.itemType.count(),
    prisma.collection.count(),
    prisma.tag.count(),
  ]);

  console.log("\nTable row counts:");
  console.log(`  Users:       ${users}`);
  console.log(`  Items:       ${items}`);
  console.log(`  ItemTypes:   ${itemTypes}`);
  console.log(`  Collections: ${collections}`);
  console.log(`  Tags:        ${tags}`);

  console.log("\nDatabase connection successful!");
}

main()
  .catch((e) => {
    console.error("Database connection failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });