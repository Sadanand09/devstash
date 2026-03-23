import Link from "next/link";
import { Star } from "lucide-react";
import { iconMap } from "@/lib/icon-map";
import { getRecentCollections } from "@/lib/db/collections";

export async function CollectionsGrid() {
  const collections = await getRecentCollections(6);

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
        {collections.map((col) => {
          return (
            <Link
              key={col.id}
              href={`/collections/${col.id}`}
              className="group rounded-xl border border-border p-4 transition-colors hover:border-muted-foreground/30"
              style={{
                backgroundColor: col.dominantType
                  ? `${col.dominantType.color}08`
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
                    {col.itemCount} items
                  </p>
                </div>
              </div>

              {col.description && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-1">
                  {col.description}
                </p>
              )}

              <div className="mt-3 flex gap-1.5">
                {col.typeIcons.map((type) => {
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