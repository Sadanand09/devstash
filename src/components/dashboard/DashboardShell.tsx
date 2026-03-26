"use client";

import Link from "next/link";
import { Search, Plus, PanelLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarProvider, useSidebar } from "@/components/dashboard/SidebarProvider";
import { Sidebar, MobileSidebarContent } from "@/components/dashboard/Sidebar";
import type { SidebarData } from "@/components/dashboard/Sidebar";
import { ItemDrawerProvider } from "@/components/dashboard/ItemDrawerProvider";
import { ItemDrawer } from "@/components/dashboard/ItemDrawer";

export type SessionUser = {
  name: string | null;
  email: string | null;
  image: string | null;
} | null;

function DashboardContent({
  children,
  sidebarData,
  user,
}: {
  children: React.ReactNode;
  sidebarData: SidebarData;
  user: SessionUser;
}) {
  const { mobileOpen, setMobileOpen } = useSidebar();

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      {/* Top Bar */}
      <header className="flex h-14 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>

          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
              D
            </div>
            <span className="text-lg font-semibold">DevStash</span>
          </Link>
        </div>

        <div className="relative hidden w-full max-w-md sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search items..." className="pl-9" />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:inline-flex">
            <Plus className="mr-1.5 h-4 w-4" />
            New Collection
          </Button>
          <Button size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">New Item</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </header>

      {/* Body: Sidebar + Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar data={sidebarData} user={user} />

        {/* Mobile Sidebar (Sheet/Drawer) */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" showCloseButton className="w-72 p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex h-full flex-col pt-4">
              <MobileSidebarContent data={sidebarData} user={user} />
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

export function DashboardShell({
  children,
  sidebarData,
  user,
}: {
  children: React.ReactNode;
  sidebarData: SidebarData;
  user: SessionUser;
}) {
  return (
    <SidebarProvider>
      <ItemDrawerProvider>
        <DashboardContent sidebarData={sidebarData} user={user}>
          {children}
        </DashboardContent>
        <ItemDrawer />
      </ItemDrawerProvider>
    </SidebarProvider>
  );
}