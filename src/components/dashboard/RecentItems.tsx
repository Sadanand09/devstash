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
import { Badge } from "@/components/ui/badge";
import { getRecentItems } from "@/lib/db/items";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: LinkIcon,
};

export async function RecentItems() {
  const recentItems = await getRecentItems(10);

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold">Recent Items</h2>

      <div className="flex flex-col gap-2">
        {recentItems.map((item) => {
          const type = item.itemType;
          const Icon = type ? iconMap[type.icon] : null;
          const date = new Date(item.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

          return (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-lg border border-border px-4 py-3 transition-colors hover:border-muted-foreground/30"
              style={{
                borderLeftWidth: "3px",
                borderLeftColor: type?.color ?? undefined,
              }}
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
                style={{ backgroundColor: type ? `${type.color}15` : undefined }}
              >
                {Icon && (
                  <span style={{ color: type?.color }}>
                    <Icon className="h-4 w-4" />
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-medium">{item.title}</h3>
                  {item.isFavorite && (
                    <Star className="h-3 w-3 shrink-0 fill-yellow-500 text-yellow-500" />
                  )}
                  {item.isPinned && (
                    <span className="text-[10px] text-muted-foreground">
                      📌
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="truncate text-xs text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </div>

              {item.tags.length > 0 && (
                <div className="hidden flex-wrap gap-1 sm:flex">
                  {item.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag.id} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}

              <span className="shrink-0 text-xs text-muted-foreground">
                {date}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}