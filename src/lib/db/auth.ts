import { prisma } from "@/lib/db";

// TODO: Replace with actual authenticated user lookup once auth is implemented
const DEMO_USER_EMAIL = "demo@devstash.io";

export async function getDemoUserId() {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true },
  });
  return user?.id ?? null;
}
