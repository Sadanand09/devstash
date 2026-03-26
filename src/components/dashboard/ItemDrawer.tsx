"use client";

import { useEffect, useState } from "react";
import {
  Star,
  Pin,
  Copy,
  Pencil,
  Trash2,
  Tag,
  FolderOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { iconMap } from "@/lib/icon-map";
import { useItemDrawer } from "@/components/dashboard/ItemDrawerProvider";

type ItemDetail = {
  content: string | null;
  contentType: string;
  url: string | null;
  language: string | null;
  createdAt: string;
  updatedAt: string;
  collections: {
    collection: { id: string; name: string };
  }[];
};

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-40 w-full animate-pulse rounded-lg bg-muted" />
      <div className="space-y-2">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-4 w-48 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ItemDrawer() {
  const { selectedItemId, cardData, close } = useItemDrawer();
  const [detail, setDetail] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedItemId) {
      setDetail(null);
      return;
    }

    setLoading(true);
    setDetail(null);
    fetch(`/api/items/${selectedItemId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setDetail(data))
      .catch(() => setDetail(null))
      .finally(() => setLoading(false));
  }, [selectedItemId]);

  const type = cardData?.itemType;
  const Icon = type ? iconMap[type.icon] : null;

  return (
    <Sheet open={!!selectedItemId} onOpenChange={(open) => !open && close()}>
      <SheetContent side="right" showCloseButton className="w-full overflow-y-auto sm:w-[40%]">
        {!cardData ? (
          <SheetTitle className="sr-only">Item drawer</SheetTitle>
        ) : (
          <>
            {/* Header — shows instantly from card data */}
            <div className="space-y-4 p-6 pb-0">
              <SheetTitle className="text-xl font-bold">
                {cardData.title}
              </SheetTitle>
              <div className="flex items-center gap-2">
                {Icon && (
                  <Badge
                    variant="secondary"
                    className="gap-1"
                    style={{ color: type!.color }}
                  >
                    <Icon className="h-3 w-3" />
                    {type!.name}
                  </Badge>
                )}
                {detail?.language && (
                  <Badge variant="secondary">{detail.language}</Badge>
                )}
              </div>
            </div>

            {/* Action Bar — shows instantly from card data */}
            <div className="flex items-center gap-1 border-b border-border px-6 py-3">
              <Button
                variant="ghost"
                size="sm"
                className={
                  cardData.isFavorite
                    ? "gap-1.5 text-yellow-500 hover:text-yellow-500"
                    : "gap-1.5"
                }
              >
                <Star
                  className={`h-4 w-4 ${cardData.isFavorite ? "fill-yellow-500" : ""}`}
                />
                Favorite
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5">
                <Pin className={`h-4 w-4 ${cardData.isPinned ? "fill-current" : ""}`} />
                Pin
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5">
                <Copy className="h-4 w-4" />
                Copy
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5">
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <div className="flex-1" />
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Body */}
            <div className="space-y-6 p-6">
              {/* Description — from card data, instant */}
              {cardData.description && (
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                    Description
                  </h3>
                  <p className="text-sm">{cardData.description}</p>
                </div>
              )}

              {/* Detail sections — loaded from API */}
              {loading ? (
                <DetailSkeleton />
              ) : detail ? (
                <>
                  {/* Content */}
                  {detail.content && (
                    <div>
                      <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                        Content
                      </h3>
                      <pre className="overflow-x-auto rounded-lg bg-muted/50 p-4 text-sm">
                        <code>{detail.content}</code>
                      </pre>
                    </div>
                  )}

                  {/* URL */}
                  {detail.url && (
                    <div>
                      <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                        URL
                      </h3>
                      <a
                        href={detail.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline"
                      >
                        {detail.url}
                      </a>
                    </div>
                  )}
                </>
              ) : null}

              {/* Tags — from card data, instant */}
              {cardData.tags.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <Tag className="h-3.5 w-3.5" />
                    Tags
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cardData.tags.map((tag) => (
                      <Badge key={tag.id} variant="secondary">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Collections — from API */}
              {detail && detail.collections.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <FolderOpen className="h-3.5 w-3.5" />
                    Collections
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {detail.collections.map((ic) => (
                      <Badge key={ic.collection.id} variant="outline">
                        {ic.collection.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Details — created from card data (instant), updated from API */}
              <div>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                  Details
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span>{formatDate(new Date(cardData.createdAt).toISOString())}</span>
                  </div>
                  {detail && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Updated</span>
                      <span>{formatDate(detail.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
