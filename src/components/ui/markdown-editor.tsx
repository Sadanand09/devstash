"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";

type MarkdownEditorProps = {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
};

export function MarkdownEditor({
  value,
  onChange,
  readOnly = false,
  placeholder,
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<"write" | "preview">(
    readOnly ? "preview" : "write"
  );
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#1e1e1e] px-4 py-2.5">
        <div className="flex items-center gap-1">
          {!readOnly && (
            <>
              <button
                type="button"
                onClick={() => setTab("write")}
                className={`rounded px-2.5 py-1 text-xs transition-colors ${
                  tab === "write"
                    ? "bg-[#2d2d2d] text-[#cccccc]"
                    : "text-[#858585] hover:text-[#cccccc]"
                }`}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setTab("preview")}
                className={`rounded px-2.5 py-1 text-xs transition-colors ${
                  tab === "preview"
                    ? "bg-[#2d2d2d] text-[#cccccc]"
                    : "text-[#858585] hover:text-[#cccccc]"
                }`}
              >
                Preview
              </button>
            </>
          )}
          {readOnly && (
            <span className="text-xs text-[#858585]">markdown</span>
          )}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-[#858585] transition-colors hover:bg-[#2d2d2d] hover:text-[#cccccc]"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Body */}
      {tab === "write" ? (
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="w-full resize-none bg-[#1e1e1e] px-4 py-3 font-mono text-sm text-[#cccccc] placeholder:text-[#555555] focus:outline-none"
          style={{ height: calculateHeight(value), maxHeight: 400, minHeight: 80 }}
        />
      ) : (
        <div
          className="markdown-preview overflow-y-auto bg-[#1e1e1e] px-4 py-3 text-sm text-[#cccccc]"
          style={{ maxHeight: 400, minHeight: 80 }}
        >
          {value ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {value}
            </ReactMarkdown>
          ) : (
            <p className="text-[#555555]">Nothing to preview</p>
          )}
        </div>
      )}
    </div>
  );
}

function calculateHeight(value: string): number {
  const lineCount = (value || "").split("\n").length;
  const lineHeight = 20;
  const padding = 24;
  const computed = lineCount * lineHeight + padding;
  return Math.min(400, Math.max(80, computed));
}
