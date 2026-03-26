import { notFound } from "next/navigation";
import { getItemsByType } from "@/lib/db/items";
import { ItemCard } from "@/components/dashboard/ItemCard";

const TYPE_LABELS: Record<string, string> = {
  snippet: "Snippets",
  prompt: "Prompts",
  command: "Commands",
  note: "Notes",
  file: "Files",
  image: "Images",
  link: "Links",
};

export default async function ItemsPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  const label = TYPE_LABELS[type];
  if (!label) notFound();

  const items = await getItemsByType(type);

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">{label}</h1>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No {label.toLowerCase()} yet.
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
