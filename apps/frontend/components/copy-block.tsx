// components/copy-block.tsx
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Copy, Terminal } from "lucide-react";
import Prism from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-typescript";
import "prismjs/themes/prism-tomorrow.css"; // You can choose different themes
import * as React from "react";

interface CopyBlockProps {
  content: string;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
  variant?: "default" | "terminal";
}

export function CopyBlock({
  content,
  language = "typescript",
  className,
  showLineNumbers = false,
  variant = "default",
}: CopyBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy content:", error);
    }
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg",
        variant === "terminal" ? "bg-zinc-950" : "bg-zinc-950",
        className
      )}
    >
      {variant === "terminal" && (
        <div className="flex items-center gap-1 px-4 py-2 bg-zinc-800">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <Terminal className="w-4 h-4 ml-2 text-zinc-400" />
        </div>
      )}

      <div className="relative group">
        <pre
          className={cn(
            "p-4 overflow-x-auto",
            showLineNumbers && "line-numbers",
            variant === "terminal" && "bg-transparent"
          )}
        >
          <code className={`language-${language}`}>{content}</code>
        </pre>

        <Button
          size="icon"
          variant="ghost"
          className={cn(
            "absolute right-4 top-4 opacity-0 transition-opacity",
            "group-hover:opacity-100",
            "h-6 w-6",
            copied && "text-green-500"
          )}
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          <span className="sr-only">Copy code</span>
        </Button>
      </div>
    </div>
  );
}

// Add these styles to your globals.css
/*

*/
