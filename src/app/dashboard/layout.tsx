import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getItemTypesWithCounts } from "@/lib/db/items";
import {
  getFavoriteCollections,
  getSidebarCollections,
} from "@/lib/db/collections";
import { auth } from "@/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [itemTypes, favoriteCollections, recentCollections, session] =
    await Promise.all([
      getItemTypesWithCounts(),
      getFavoriteCollections(),
      getSidebarCollections(),
      auth(),
    ]);

  const user = session?.user
    ? {
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
      }
    : null;

  return (
    <DashboardShell
      sidebarData={{ itemTypes, favoriteCollections, recentCollections }}
      user={user}
    >
      {children}
    </DashboardShell>
  );
}