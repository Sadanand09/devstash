import { prisma } from "@/lib/db";
import { getDemoUserId } from "@/lib/db/auth";

export async function getFavoriteCollections() {
  const userId = await getDemoUserId();
  if (!userId) return [];

  return prisma.collection.findMany({
    where: { userId, isFavorite: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });
}

export async function getSidebarCollections(limit = 5) {
  const userId = await getDemoUserId();
  if (!userId) return [];

  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      items: {
        include: {
          item: {
            include: { itemType: true },
          },
        },
      },
    },
  });

  return collections.map((col) => {
    const colItems = col.items.map((ic) => ic.item);
    const typeCounts: Record<string, { count: number; color: string }> = {};
    for (const item of colItems) {
      if (!typeCounts[item.itemTypeId]) {
        typeCounts[item.itemTypeId] = { count: 0, color: item.itemType.color };
      }
      typeCounts[item.itemTypeId].count++;
    }

    const dominantColor =
      colItems.length > 0
        ? Object.values(typeCounts).sort((a, b) => b.count - a.count)[0].color
        : "#6b7280";

    return {
      id: col.id,
      name: col.name,
      itemCount: colItems.length,
      dominantColor,
    };
  });
}

export async function getRecentCollections(limit = 6) {
  const userId = await getDemoUserId();
  if (!userId) return [];

  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      items: {
        include: {
          item: {
            include: {
              itemType: true,
            },
          },
        },
      },
    },
  });

  return collections.map((col) => {
    const colItems = col.items.map((ic) => ic.item);
    const typeCounts: Record<string, number> = {};
    for (const item of colItems) {
      typeCounts[item.itemTypeId] = (typeCounts[item.itemTypeId] || 0) + 1;
    }

    const dominantType =
      colItems.length > 0
        ? colItems
            .map((i) => i.itemType)
            .find(
              (t) =>
                t.id ===
                Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0][0]
            ) ?? null
        : null;

    const typeIcons = [
      ...new Map(colItems.map((i) => [i.itemType.id, i.itemType])).values(),
    ];

    return {
      id: col.id,
      name: col.name,
      description: col.description,
      isFavorite: col.isFavorite,
      itemCount: colItems.length,
      dominantType,
      typeIcons,
      updatedAt: col.updatedAt,
    };
  });
}
