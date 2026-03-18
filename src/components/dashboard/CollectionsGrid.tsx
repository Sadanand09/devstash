"use client";

import Link from "next/link";
import {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link as LinkIcon,
  Star,
} from "lucide-react";
import { collections, items, itemTypes } from "@/lib/mock-data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: LinkIcon,
};

function getDominantType(collectionItemIds: string[]) {
  const collectionItems = items.filter((i) =>
    collectionItemIds.includes(i.id)
  );
  if (collectionItems.length === 0) return null;

  const typeCounts: Record<string, number> = {};
  for (const item of collectionItems) {
    typeCounts[item.itemTypeId] = (typeCounts[item.itemTypeId] || 0) + 1;
  }

  const dominantTypeId = Object.entries(typeCounts).sort(
    (a, b) => b[1] - a[1]
  )[0][0];
  return itemTypes.find((t) => t.id === dominantTypeId) ?? null;
}

function getCollectionTypeIcons(collectionItemIds: string[]) {
  const collectionItems = items.filter((i) =>
    collectionItemIds.includes(i.id)
  );
  const typeIds = [...new Set(collectionItems.map((i) => i.itemTypeId))];
  return typeIds
    .map((id) => itemTypes.find((t) => t.id === id))
    .filter(Boolean);
}

export function CollectionsGrid() {
  const recentCollections = [...collections]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 6);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Collections</h2>
        <Link
          href="/collections"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recentCollections.map((col) => {
          const dominant = getDominantType(col.itemIds);
          const typeIcons = getCollectionTypeIcons(col.itemIds);

          return (
            <Link
              key={col.id}
              href={`/collections/${col.id}`}
              className="group rounded-xl border border-border p-4 transition-colors hover:border-muted-foreground/30"
              style={{
                backgroundColor: dominant
                  ? `${dominant.color}08`
                  : undefined,
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{col.name}</h3>
                    {col.isFavorite && (
                      <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {col.itemIds.length} items
                  </p>
                </div>
              </div>

              {col.description && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-1">
                  {col.description}
                </p>
              )}

              <div className="mt-3 flex gap-1.5">
                {typeIcons.map((type) => {
                  if (!type) return null;
                  const Icon = iconMap[type.icon];
                  if (!Icon) return null;
                  return (
                    <span key={type.id} style={{ color: type.color }}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                  );
                })}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}