"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ItemCreateDialog } from "@/components/dashboard/ItemCreateDialog";

type ItemTypeHeaderProps = {
  label: string;
  typeName: string;
};

export function ItemTypeHeader({ label, typeName }: ItemTypeHeaderProps) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{label}</h1>
        <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          New {label.replace(/s$/, "")}
        </Button>
      </div>
      <ItemCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        initialType={typeName}
      />
    </>
  );
}
