"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  Pin,
  Copy,
  Pencil,
  Trash2,
  Tag,
  FolderOpen,
  Save,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CodeEditor } from "@/components/ui/code-editor";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { iconMap } from "@/lib/icon-map";
import { useItemDrawer } from "@/components/dashboard/ItemDrawerProvider";
import { updateItem, deleteItem } from "@/actions/items";
import { toast } from "sonner";

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

type EditFormState = {
  title: string;
  description: string;
  content: string;
  url: string;
  language: string;
  tags: string;
};

const CONTENT_TYPES = ["snippet", "prompt", "command", "note"];
const LANGUAGE_TYPES = ["snippet", "command"];
const URL_TYPES = ["link"];

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
  const router = useRouter();
  const [detail, setDetail] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [form, setForm] = useState<EditFormState>({
    title: "",
    description: "",
    content: "",
    url: "",
    language: "",
    tags: "",
  });

  useEffect(() => {
    if (!selectedItemId) {
      setDetail(null);
      setEditing(false);
      return;
    }

    setLoading(true);
    setDetail(null);
    setEditing(false);
    fetch(`/api/items/${selectedItemId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setDetail(data))
      .catch(() => setDetail(null))
      .finally(() => setLoading(false));
  }, [selectedItemId]);

  function enterEditMode() {
    if (!cardData) return;
    setForm({
      title: cardData.title,
      description: cardData.description ?? "",
      content: detail?.content ?? "",
      url: detail?.url ?? "",
      language: detail?.language ?? "",
      tags: cardData.tags.map((t) => t.name).join(", "),
    });
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
  }

  async function handleSave() {
    if (!selectedItemId || !form.title.trim()) return;

    setSaving(true);
    const tagsArray = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const result = await updateItem(selectedItemId, {
      title: form.title,
      description: form.description || null,
      content: form.content || null,
      url: form.url || null,
      language: form.language || null,
      tags: tagsArray,
    });

    setSaving(false);

    if (!result.success) {
      const errorMsg =
        typeof result.error === "string"
          ? result.error
          : "Validation failed. Check your inputs.";
      toast.error(errorMsg);
      return;
    }

    toast.success("Item updated");
    setEditing(false);

    // Refresh detail data from the returned item
    const item = result.data;
    setDetail({
      content: item.content,
      contentType: item.contentType,
      url: item.url,
      language: item.language,
      createdAt: item.createdAt as unknown as string,
      updatedAt: item.updatedAt as unknown as string,
      collections: item.collections,
    });

    router.refresh();
  }

  async function handleDelete() {
    if (!selectedItemId) return;
    setDeleting(true);
    const result = await deleteItem(selectedItemId);
    setDeleting(false);
    setDeleteOpen(false);

    if (!result.success) {
      toast.error(result.error ?? "Failed to delete item");
      return;
    }

    toast.success("Item deleted");
    close();
    router.refresh();
  }

  const type = cardData?.itemType;
  const typeName = type?.name.toLowerCase() ?? "";
  const Icon = type ? iconMap[type.icon] : null;

  return (
    <Sheet open={!!selectedItemId} onOpenChange={(open) => !open && close()}>
      <SheetContent side="right" showCloseButton className="w-full overflow-y-auto sm:w-[40%]">
        {!cardData ? (
          <SheetTitle className="sr-only">Item drawer</SheetTitle>
        ) : (
          <>
            {/* Header */}
            <div className="space-y-4 p-6 pb-0">
              {editing ? (
                <div>
                  <Label htmlFor="edit-title" className="text-sm font-medium text-muted-foreground">
                    Title
                  </Label>
                  <Input
                    id="edit-title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="mt-1 text-lg font-bold"
                  />
                </div>
              ) : (
                <SheetTitle className="text-xl font-bold">
                  {cardData.title}
                </SheetTitle>
              )}
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
                {!editing && detail?.language && (
                  <Badge variant="secondary">{detail.language}</Badge>
                )}
              </div>
            </div>

            {/* Action Bar */}
            {editing ? (
              <div className="flex items-center gap-2 border-b border-border px-6 py-3">
                <Button
                  size="sm"
                  className="gap-1.5"
                  disabled={saving || !form.title.trim()}
                  onClick={handleSave}
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5"
                  disabled={saving}
                  onClick={cancelEdit}
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            ) : (
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5"
                  onClick={enterEditMode}
                  disabled={loading}
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                <div className="flex-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-destructive hover:text-destructive"
                  disabled={deleting}
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete item</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete &quot;{cardData.title}&quot;. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {deleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}

            {/* Body */}
            <div className="space-y-6 p-6">
              {/* Description */}
              {editing ? (
                <div>
                  <Label htmlFor="edit-description" className="text-sm font-medium text-muted-foreground">
                    Description
                  </Label>
                  <Textarea
                    id="edit-description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="mt-1"
                    rows={3}
                  />
                </div>
              ) : (
                cardData.description && (
                  <div>
                    <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                      Description
                    </h3>
                    <p className="text-sm">{cardData.description}</p>
                  </div>
                )
              )}

              {/* Detail sections */}
              {editing ? (
                <>
                  {/* Content — snippet, prompt, command, note */}
                  {CONTENT_TYPES.includes(typeName) && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Content
                      </Label>
                      {LANGUAGE_TYPES.includes(typeName) ? (
                        <div className="mt-1">
                          <CodeEditor
                            value={form.content}
                            onChange={(v) => setForm({ ...form, content: v })}
                            language={form.language || "plaintext"}
                          />
                        </div>
                      ) : (
                        <Textarea
                          id="edit-content"
                          value={form.content}
                          onChange={(e) => setForm({ ...form, content: e.target.value })}
                          className="mt-1 font-mono text-sm"
                          rows={8}
                        />
                      )}
                    </div>
                  )}

                  {/* Language — snippet, command */}
                  {LANGUAGE_TYPES.includes(typeName) && (
                    <div>
                      <Label htmlFor="edit-language" className="text-sm font-medium text-muted-foreground">
                        Language
                      </Label>
                      <Input
                        id="edit-language"
                        value={form.language}
                        onChange={(e) => setForm({ ...form, language: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  )}

                  {/* URL — link */}
                  {URL_TYPES.includes(typeName) && (
                    <div>
                      <Label htmlFor="edit-url" className="text-sm font-medium text-muted-foreground">
                        URL
                      </Label>
                      <Input
                        id="edit-url"
                        value={form.url}
                        onChange={(e) => setForm({ ...form, url: e.target.value })}
                        className="mt-1"
                        type="url"
                      />
                    </div>
                  )}

                  {/* Tags */}
                  <div>
                    <Label htmlFor="edit-tags" className="text-sm font-medium text-muted-foreground">
                      Tags
                    </Label>
                    <Input
                      id="edit-tags"
                      value={form.tags}
                      onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      className="mt-1"
                      placeholder="tag1, tag2, tag3"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Comma-separated
                    </p>
                  </div>

                  {/* Non-editable details */}
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
                </>
              ) : loading ? (
                <DetailSkeleton />
              ) : detail ? (
                <>
                  {/* Content */}
                  {detail.content && (
                    <div>
                      <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                        Content
                      </h3>
                      {LANGUAGE_TYPES.includes(typeName) ? (
                        <CodeEditor
                          value={detail.content}
                          language={detail.language || "plaintext"}
                          readOnly
                        />
                      ) : (
                        <pre className="overflow-x-auto rounded-lg bg-muted/50 p-4 text-sm">
                          <code>{detail.content}</code>
                        </pre>
                      )}
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

              {/* Tags — view mode only (edit mode has its own input) */}
              {!editing && cardData.tags.length > 0 && (
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

              {/* Collections — view mode only */}
              {!editing && detail && detail.collections.length > 0 && (
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

              {/* Details — view mode */}
              {!editing && (
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
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
