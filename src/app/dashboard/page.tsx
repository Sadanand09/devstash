import { Suspense } from "react";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { CollectionsGrid } from "@/components/dashboard/CollectionsGrid";
import { PinnedItems } from "@/components/dashboard/PinnedItems";
import { RecentItems } from "@/components/dashboard/RecentItems";
import {
  StatsSkeleton,
  CollectionsSkeleton,
  ItemsSkeleton,
} from "@/components/dashboard/DashboardSkeletons";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Your developer knowledge hub</p>
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <StatsCards />
      </Suspense>
      <Suspense fallback={<CollectionsSkeleton />}>
        <CollectionsGrid />
      </Suspense>
      <Suspense fallback={<ItemsSkeleton />}>
        <PinnedItems />
      </Suspense>
      <Suspense fallback={<ItemsSkeleton />}>
        <RecentItems />
      </Suspense>
    </div>
  );
}
