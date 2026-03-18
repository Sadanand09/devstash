import { prisma } from "@/lib/db";

// TODO: Replace with actual authenticated user lookup once auth is implemented
const DEMO_USER_EMAIL = "demo@devstash.io";

async function getDemoUserId() {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true },
  });
  return user?.id ?? null;
}

export async function getPinnedItems() {
  const userId = await getDemoUserId();
  if (!userId) return [];

  return prisma.item.findMany({
    where: { userId, isPinned: true },
    orderBy: { createdAt: "desc" },
    include: {
      itemType: true,
      tags: true,
    },
  });
}

export async function getRecentItems(limit = 10) {
  const userId = await getDemoUserId();
  if (!userId) return [];

  return prisma.item.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      itemType: true,
      tags: true,
    },
  });
}

export async function getItemTypesWithCounts() {
  const userId = await getDemoUserId();
  if (!userId) return [];

  const itemTypes = await prisma.itemType.findMany({
    where: {
      OR: [{ isSystem: true }, { userId }],
    },
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          items: { where: { userId } },
        },
      },
    },
  });

  return itemTypes.map((type) => ({
    id: type.id,
    name: type.name,
    icon: type.icon,
    color: type.color,
    isSystem: type.isSystem,
    count: type._count.items,
  }));
}

export async function getStats() {
  const userId = await getDemoUserId();
  if (!userId) {
    return { totalItems: 0, totalCollections: 0, favoriteItems: 0, favoriteCollections: 0 };
  }

  const [totalItems, totalCollections, favoriteItems, favoriteCollections] =
    await Promise.all([
      prisma.item.count({ where: { userId } }),
      prisma.collection.count({ where: { userId } }),
      prisma.item.count({ where: { userId, isFavorite: true } }),
      prisma.collection.count({ where: { userId, isFavorite: true } }),
    ]);

  return { totalItems, totalCollections, favoriteItems, favoriteCollections };
}