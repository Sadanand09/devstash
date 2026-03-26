"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CodeEditor } from "@/components/ui/code-editor";
import { Label } from "@/components/ui/label";
import { createItem } from "@/actions/items";
import { toast } from "sonner";
import { iconMap } from "@/lib/icon-map";

const ITEM_TYPES = [
  { name: "snippet", icon: "Code", color: "#3b82f6", label: "Snippet" },
  { name: "prompt", icon: "Sparkles", color: "#8b5cf6", label: "Prompt" },
  { name: "command", icon: "Terminal", color: "#f97316", label: "Command" },
  { name: "note", icon: "StickyNote", color: "#fde047", label: "Note" },
  { name: "link", icon: "Link", color: "#10b981", label: "Link" },
] as const;

const CONTENT_TYPES = ["snippet", "prompt", "command", "note"];
const LANGUAGE_TYPES = ["snippet", "command"];
const URL_TYPES = ["link"];

type ItemCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialType?: string;
};

export function ItemCreateDialog({ open, onOpenChange, initialType = "" }: ItemCreateDialogProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [typeName, setTypeName] = useState<string>(initialType);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("");
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState("");

  function reset() {
    setTypeName(initialType);
    setTitle("");
    setDescription("");
    setContent("");
    setLanguage("");
    setUrl("");
    setTags("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!typeName || !title.trim()) return;

    setSaving(true);
    const tagsArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const result = await createItem({
      typeName,
      title,
      description: description || null,
      content: content || null,
      url: url || null,
      language: language || null,
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

    toast.success("Item created");
    reset();
    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) reset();
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New Item</DialogTitle>
            <DialogDescription>
              Create a new item in your collection.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {/* Type Selector */}
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Type
              </Label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {ITEM_TYPES.map((type) => {
                  const Icon = iconMap[type.icon];
                  const selected = typeName === type.name;
                  return (
                    <button
                      key={type.name}
                      type="button"
                      onClick={() => setTypeName(type.name)}
                      className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors ${
                        selected
                          ? "border-foreground/30 bg-accent"
                          : "border-border hover:bg-accent/50"
                      }`}
                    >
                      {Icon && (
                        <Icon className="h-3.5 w-3.5" />
                      )}
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="create-title" className="text-sm font-medium text-muted-foreground">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="create-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
                placeholder="e.g. React useEffect cleanup"
                autoFocus
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="create-description" className="text-sm font-medium text-muted-foreground">
                Description
              </Label>
              <Textarea
                id="create-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1"
                rows={2}
                placeholder="Brief description..."
              />
            </div>

            {/* Content — snippet, prompt, command, note */}
            {CONTENT_TYPES.includes(typeName) && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Content
                </Label>
                {LANGUAGE_TYPES.includes(typeName) ? (
                  <div className="mt-1">
                    <CodeEditor
                      value={content}
                      onChange={(v) => setContent(v)}
                      language={language || "plaintext"}
                    />
                  </div>
                ) : (
                  <Textarea
                    id="create-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-1 font-mono text-sm"
                    rows={6}
                    placeholder={
                      typeName === "prompt"
                        ? "Write your prompt..."
                        : "Write your note..."
                    }
                  />
                )}
              </div>
            )}

            {/* Language — snippet, command */}
            {LANGUAGE_TYPES.includes(typeName) && (
              <div>
                <Label htmlFor="create-language" className="text-sm font-medium text-muted-foreground">
                  Language
                </Label>
                <Input
                  id="create-language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="mt-1"
                  placeholder="e.g. typescript, bash"
                />
              </div>
            )}

            {/* URL — link */}
            {URL_TYPES.includes(typeName) && (
              <div>
                <Label htmlFor="create-url" className="text-sm font-medium text-muted-foreground">
                  URL <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="create-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="mt-1"
                  type="url"
                  placeholder="https://..."
                />
              </div>
            )}

            {/* Tags */}
            <div>
              <Label htmlFor="create-tags" className="text-sm font-medium text-muted-foreground">
                Tags
              </Label>
              <Input
                id="create-tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="mt-1"
                placeholder="react, hooks, utils"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Comma-separated
              </p>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="submit"
              disabled={saving || !typeName || !title.trim()}
            >
              {saving ? "Creating..." : "Create Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
