"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  ChevronDown,
  Star,
  Folder,
  PanelLeft,
  LogOut,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/dashboard/SidebarProvider";
import { UserAvatar } from "@/components/UserAvatar";
import { iconMap } from "@/lib/icon-map";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/components/dashboard/DashboardShell";

export type SidebarItemType = {
  id: string;
  name: string;
  icon: string;
  color: string;
  isSystem: boolean;
  count: number;
};

export type SidebarFavoriteCollection = {
  id: string;
  name: string;
};

export type SidebarRecentCollection = {
  id: string;
  name: string;
  itemCount: number;
  dominantColor: string;
};

export type SidebarData = {
  itemTypes: SidebarItemType[];
  favoriteCollections: SidebarFavoriteCollection[];
  recentCollections: SidebarRecentCollection[];
};

const TYPE_ORDER: Record<string, { order: number; label: string }> = {
  snippet: { order: 0, label: "Snippets" },
  prompt:  { order: 1, label: "Prompts" },
  command: { order: 2, label: "Commands" },
  note:    { order: 3, label: "Notes" },
  file:    { order: 4, label: "Files" },
  image:   { order: 5, label: "Images" },
  link:    { order: 6, label: "Links" },
};

function SidebarContent({ data, user }: { data: SidebarData; user: SessionUser }) {
  const { collapsed } = useSidebar();
  const { favoriteCollections, recentCollections } = data;
  const itemTypes = [...data.itemTypes].sort(
    (a, b) => (TYPE_ORDER[a.name]?.order ?? 99) - (TYPE_ORDER[b.name]?.order ?? 99)
  );

  if (collapsed) {
    return (
      <div className="flex h-full flex-col items-center py-3">
        {itemTypes.map((type) => {
          const Icon = iconMap[type.icon];
          return (
            <Link
              key={type.id}
              href={`/items/${type.name}`}
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
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer" aria-label="User menu">
              <UserAvatar name={user?.name} image={user?.image} size="sm" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end">
              <DropdownMenuItem onClick={() => window.location.href = "/profile"}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/sign-in" })}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
              return (
                <Link
                  key={type.id}
                  href={`/items/${type.name}`}
                  className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {Icon && (
                    <span className="shrink-0" style={{ color: type.color }}>
                      <Icon className="h-4 w-4" />
                    </span>
                  )}
                  <span>{TYPE_ORDER[type.name]?.label ?? type.name}</span>
                  {(type.name === "file" || type.name === "image") && (
                    <Badge variant="secondary" className="h-4 px-1.5 text-[10px] font-semibold tracking-wide">
                      PRO
                    </Badge>
                  )}
                  <span className="ml-auto text-xs tabular-nums text-muted-foreground/60">
                    {type.count}
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
          {favoriteCollections.length > 0 && (
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
          )}

          {/* Recent Collections */}
          <div className="mt-3">
            <span className="px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
              Recent
            </span>
            <nav className="mt-1 flex flex-col gap-0.5">
              {recentCollections.map((col) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.id}`}
                  className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: col.dominantColor }}
                  />
                  <span className="truncate">{col.name}</span>
                  <span className="ml-auto text-xs tabular-nums text-muted-foreground/60">
                    {col.itemCount}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* View all collections */}
          <Link
            href="/collections"
            className="mt-2 block px-2 py-1.5 text-xs text-muted-foreground/60 transition-colors hover:text-foreground"
          >
            View all collections
          </Link>
        </CollapsibleContent>
      </Collapsible>

      {/* User Avatar Area */}
      <div className="mt-auto border-t border-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full cursor-pointer items-center gap-3 rounded-md p-1 hover:bg-muted">
            <UserAvatar name={user?.name} image={user?.image} />
            <div className="flex-1 overflow-hidden text-left">
              <p className="truncate text-sm font-medium">
                {user?.name ?? "Guest"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.email ?? ""}
              </p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start">
            <DropdownMenuItem onClick={() => window.location.href = "/profile"}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/sign-in" })}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function Sidebar({ data, user }: { data: SidebarData; user: SessionUser }) {
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
        <SidebarContent data={data} user={user} />
      </div>
    </aside>
  );
}

export function MobileSidebarContent({ data, user }: { data: SidebarData; user: SessionUser }) {
  return <SidebarContent data={data} user={user} />;
}