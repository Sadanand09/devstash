"use client";

import { useItemDrawer } from "@/components/dashboard/ItemDrawerProvider";
import type { CardData } from "@/components/dashboard/ItemDrawerProvider";

export function ClickableItem({
  item,
  children,
  className,
}: {
  item: CardData;
  children: React.ReactNode;
  className?: string;
}) {
  const { openItem } = useItemDrawer();

  return (
    <button
      type="button"
      onClick={() => openItem(item.id, item)}
      className={`w-full cursor-pointer text-left ${className ?? ""}`}
    >
      {children}
    </button>
  );
}
