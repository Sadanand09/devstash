"use client";

import { createContext, useContext, useState, useCallback } from "react";

export type CardData = {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: Date;
  itemType: {
    name: string;
    icon: string;
    color: string;
  };
  tags: { id: string; name: string }[];
};

type ItemDrawerContextType = {
  selectedItemId: string | null;
  cardData: CardData | null;
  openItem: (id: string, card: CardData) => void;
  close: () => void;
};

const ItemDrawerContext = createContext<ItemDrawerContextType | null>(null);

export function ItemDrawerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [cardData, setCardData] = useState<CardData | null>(null);

  const openItem = useCallback((id: string, card: CardData) => {
    setCardData(card);
    setSelectedItemId(id);
  }, []);

  const close = useCallback(() => {
    setSelectedItemId(null);
    setCardData(null);
  }, []);

  return (
    <ItemDrawerContext.Provider value={{ selectedItemId, cardData, openItem, close }}>
      {children}
    </ItemDrawerContext.Provider>
  );
}

export function useItemDrawer() {
  const ctx = useContext(ItemDrawerContext);
  if (!ctx) throw new Error("useItemDrawer must be used within ItemDrawerProvider");
  return ctx;
}
