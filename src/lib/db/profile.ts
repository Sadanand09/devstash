import { prisma } from "@/lib/db";

export async function getUserProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      password: true,
      createdAt: true,
      accounts: {
        select: { provider: true },
      },
    },
  });
}

export async function getProfileStats(userId: string) {
  const [totalItems, totalCollections, itemTypeBreakdown] = await Promise.all([
    prisma.item.count({ where: { userId } }),
    prisma.collection.count({ where: { userId } }),
    prisma.itemType.findMany({
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
    }),
  ]);

  return {
    totalItems,
    totalCollections,
    itemTypeBreakdown: itemTypeBreakdown.map((type) => ({
      name: type.name,
      icon: type.icon,
      color: type.color,
      count: type._count.items,
    })),
  };
}

export async function deleteUserAccount(userId: string) {
  await prisma.user.delete({ where: { id: userId } });
}
