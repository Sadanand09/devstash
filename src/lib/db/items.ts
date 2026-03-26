import { prisma } from "@/lib/db";
import { getDemoUserId } from "@/lib/db/auth";

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

export async function getItemsByType(typeName: string) {
  const userId = await getDemoUserId();
  if (!userId) return [];

  return prisma.item.findMany({
    where: {
      userId,
      itemType: { name: typeName },
    },
    orderBy: { createdAt: "desc" },
    include: {
      itemType: true,
      tags: true,
    },
  });
}

export async function getItemById(id: string, userId: string) {
  return prisma.item.findFirst({
    where: { id, userId },
    include: {
      itemType: true,
      tags: true,
      collections: {
        include: {
          collection: { select: { id: true, name: true } },
        },
      },
    },
  });
}

export type UpdateItemData = {
  title: string;
  description: string | null;
  content: string | null;
  url: string | null;
  language: string | null;
  tags: string[];
};

export async function updateItem(
  id: string,
  userId: string,
  data: UpdateItemData
) {
  // Verify ownership before updating
  const existing = await prisma.item.findFirst({
    where: { id, userId },
    select: { id: true },
  });
  if (!existing) throw new Error("Item not found");

  return prisma.item.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      content: data.content,
      url: data.url,
      language: data.language,
      tags: {
        set: [],
        connectOrCreate: data.tags.map((name) => ({
          where: { name_userId: { name, userId } },
          create: { name, userId },
        })),
      },
    },
    include: {
      itemType: true,
      tags: true,
      collections: {
        include: {
          collection: { select: { id: true, name: true } },
        },
      },
    },
  });
}

export async function deleteItem(id: string, userId: string) {
  // Verify ownership before deleting
  const existing = await prisma.item.findFirst({
    where: { id, userId },
    select: { id: true },
  });
  if (!existing) throw new Error("Item not found");

  return prisma.item.delete({ where: { id } });
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
