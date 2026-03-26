import { cache } from "react";
import { prisma } from "@/lib/db";

// TODO: Replace with actual authenticated user lookup once auth is implemented
const DEMO_USER_EMAIL = "demo@devstash.io";

// cache() deduplicates within a single React server render pass,
// so multiple DB functions calling this in the same request share one query
export const getDemoUserId = cache(async () => {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true },
  });
  return user?.id ?? null;
});
