import {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link as LinkIcon,
  Pin,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getPinnedItems } from "@/lib/db/items";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: LinkIcon,
};

export async function PinnedItems() {
  const pinnedItems = await getPinnedItems();

  if (pinnedItems.length === 0) return null;

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Pin className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Pinned</h2>
      </div>

      <div className="flex flex-col gap-3">
        {pinnedItems.map((item) => {
          const type = item.itemType;
          const Icon = type ? iconMap[type.icon] : null;
          const date = new Date(item.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

          return (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:border-muted-foreground/30"
              style={{
                borderLeftWidth: "3px",
                borderLeftColor: type?.color ?? undefined,
              }}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: type ? `${type.color}15` : undefined }}
              >
                {Icon && (
                  <span style={{ color: type?.color }}>
                    <Icon className="h-5 w-5" />
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-medium">{item.title}</h3>
                  {item.isFavorite && (
                    <Star className="h-3.5 w-3.5 shrink-0 fill-yellow-500 text-yellow-500" />
                  )}
                </div>
                {item.description && (
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {item.description}
                  </p>
                )}
                {item.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <Badge key={tag.id} variant="secondary">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

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