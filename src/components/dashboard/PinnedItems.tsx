"use client";

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
import { items, itemTypes, tags } from "@/lib/mock-data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: LinkIcon,
};

export function PinnedItems() {
  const pinnedItems = items.filter((i) => i.isPinned);

  if (pinnedItems.length === 0) return null;

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Pin className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Pinned</h2>
      </div>

      <div className="flex flex-col gap-3">
        {pinnedItems.map((item) => {
          const type = itemTypes.find((t) => t.id === item.itemTypeId);
          const Icon = type ? iconMap[type.icon] : null;
          const itemTags = tags.filter((t) => item.tagIds.includes(t.id));
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
                {itemTags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {itemTags.map((tag) => (
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
