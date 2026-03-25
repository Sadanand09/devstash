import "dotenv/config";
import ws from "ws";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const KEEP_EMAIL = "demo@devstash.io";

  const usersToDelete = await prisma.user.findMany({
    where: { email: { not: KEEP_EMAIL } },
    select: { id: true, email: true },
  });

  if (usersToDelete.length === 0) {
    console.log("No users to delete. Only the demo user exists.");
    return;
  }

  console.log(`Deleting ${usersToDelete.length} user(s):`);
  for (const u of usersToDelete) {
    console.log(`  - ${u.email ?? "(no email)"} (${u.id})`);
  }

  const ids = usersToDelete.map((u) => u.id);

  // Cascade deletes handle items, collections, tags, item types, accounts, sessions
  const result = await prisma.user.deleteMany({
    where: { id: { in: ids } },
  });

  // Clean up orphaned verification tokens (not tied to User via FK)
  await prisma.verificationToken.deleteMany({
    where: { identifier: { not: KEEP_EMAIL } },
  });

  console.log(`\nDeleted ${result.count} user(s) and all their content.`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
