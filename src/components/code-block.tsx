"use client";

import { useState } from "react";

export function CodeBlock({
  code,
  language = "python",
}: {
  code: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative group rounded-lg overflow-hidden border border-[var(--code-border)] bg-[var(--code-bg)]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--code-border)] bg-[var(--card)]">
        <span className="text-xs text-[var(--muted)]">{language}</span>
        <button
          onClick={handleCopy}
          className="text-xs text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed text-[var(--fg)]">
        <code>{code}</code>
      </pre>
    </div>
  );
}
