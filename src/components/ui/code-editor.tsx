"use client";

import { useCallback, useRef } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

type CodeEditorProps = {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
};

export function CodeEditor({
  value,
  onChange,
  language = "plaintext",
  readOnly = false,
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [copied, setCopied] = useState(false);

  const handleMount: OnMount = useCallback((ed) => {
    editorRef.current = ed;
  }, []);

  function handleCopy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Map common language names to Monaco language IDs
  const monacoLang = mapLanguage(language);

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      {/* macOS-style header */}
      <div className="flex items-center justify-between bg-[#1e1e1e] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <div className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          {language && language !== "plaintext" && (
            <span className="ml-2 text-xs text-[#858585]">{language}</span>
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

      {/* Monaco Editor */}
      <Editor
        value={value}
        language={monacoLang}
        onChange={(v) => onChange?.(v ?? "")}
        onMount={handleMount}
        theme="vs-dark"
        options={{
          readOnly,
          minimap: { enabled: false },
          lineNumbers: readOnly ? "off" : "on",
          scrollBeyondLastLine: false,
          wordWrap: "on",
          fontSize: 13,
          fontFamily: "var(--font-mono, 'Fira Code', 'Cascadia Code', monospace)",
          padding: { top: 12, bottom: 12 },
          renderLineHighlight: readOnly ? "none" : "line",
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
          scrollbar: {
            vertical: "auto",
            horizontal: "auto",
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
          contextmenu: false,
          domReadOnly: readOnly,
          automaticLayout: true,
        }}
        height={calculateHeight(value)}
      />
    </div>
  );
}

function calculateHeight(value: string): string {
  const lineCount = (value || "").split("\n").length;
  const lineHeight = 20;
  const padding = 24; // top + bottom padding
  const computed = lineCount * lineHeight + padding;
  const min = 80;
  const max = 400;
  return `${Math.min(max, Math.max(min, computed))}px`;
}

function mapLanguage(lang: string): string {
  const lower = (lang || "").toLowerCase();
  const map: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    jsx: "javascript",
    tsx: "typescript",
    py: "python",
    rb: "ruby",
    sh: "shell",
    bash: "shell",
    zsh: "shell",
    yml: "yaml",
    md: "markdown",
  };
  return map[lower] ?? (lower || "plaintext");
}
