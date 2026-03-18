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
  ChevronDown,
  Star,
  Folder,
  PanelLeft,
  Settings,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useSidebar } from "@/components/dashboard/SidebarProvider";
import {
  itemTypes,
  itemTypeCounts,
  collections,
  currentUser,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: LinkIcon,
};

function SidebarContent() {
  const { collapsed } = useSidebar();

  const favoriteCollections = collections.filter((c) => c.isFavorite);
  const recentCollections = [...collections]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 5);

  const userInitials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  if (collapsed) {
    return (
      <div className="flex h-full flex-col items-center py-3">
        {itemTypes.map((type) => {
          const Icon = iconMap[type.icon];
          return (
            <Link
              key={type.id}
              href={`/items/${type.name}s`}
              className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title={`${type.name}s`}
            >
              {Icon && <Icon className="h-4 w-4" />}
            </Link>
          );
        })}

        <Separator className="my-3 w-6" />

        {favoriteCollections.map((col) => (
          <Link
            key={col.id}
            href={`/collections/${col.id}`}
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title={col.name}
          >
            <Folder className="h-4 w-4" />
          </Link>
        ))}

        <div className="mt-auto">
          <Avatar size="sm">
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Item Types */}
      <Collapsible defaultOpen className="px-3 pt-3">
        <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground">
          Types
          <ChevronDown className="h-3.5 w-3.5 transition-transform in-data-panel-open:rotate-0 in-data-panel-closed:-rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <nav className="mt-1 flex flex-col gap-0.5">
            {itemTypes.map((type) => {
              const Icon = iconMap[type.icon];
              const count = itemTypeCounts[type.name] ?? 0;
              return (
                <Link
                  key={type.id}
                  href={`/items/${type.name}s`}
                  className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {Icon && (
                    <span className="shrink-0" style={{ color: type.color }}>
                      <Icon className="h-4 w-4" />
                    </span>
                  )}
                  <span className="capitalize">{type.name}s</span>
                  <span className="ml-auto text-xs tabular-nums text-muted-foreground/60">
                    {count}
                  </span>
                </Link>
              );
            })}
          </nav>
        </CollapsibleContent>
      </Collapsible>

      <Separator className="mx-3 my-2" />

      {/* Collections */}
      <Collapsible defaultOpen className="px-3">
        <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground">
          Collections
          <ChevronDown className="h-3.5 w-3.5 transition-transform in-data-panel-open:rotate-0 in-data-panel-closed:-rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          {/* Favorites */}
          <div className="mt-2">
            <span className="px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
              Favorites
            </span>
            <nav className="mt-1 flex flex-col gap-0.5">
              {favoriteCollections.map((col) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.id}`}
                  className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Star
                    className="h-3.5 w-3.5 shrink-0 fill-yellow-500 text-yellow-500"
                  />
                  <span className="truncate">{col.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* All Collections (recent) */}
          <div className="mt-3">
            <span className="px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
              All Collections
            </span>
            <nav className="mt-1 flex flex-col gap-0.5">
              {recentCollections.map((col) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.id}`}
                  className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Folder className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{col.name}</span>
                  <span className="ml-auto text-xs tabular-nums text-muted-foreground/60">
                    {col.itemIds.length}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* User Avatar Area */}
      <div className="mt-auto border-t border-border p-3">
        <div className="flex items-center gap-3">
          <Avatar size="default">
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">{currentUser.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {currentUser.email}
            </p>
          </div>
          <Button variant="ghost" size="icon-sm" className="shrink-0">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        "hidden flex-col border-r border-border transition-[width] duration-200 md:flex",
        collapsed ? "w-14" : "w-60"
      )}
    >
      {/* Toggle Button */}
      <div className={cn("flex p-2", collapsed ? "justify-center" : "justify-end")}>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <SidebarContent />
      </div>
    </aside>
  );
}

export function MobileSidebarContent() {
  return <SidebarContent />;
}
