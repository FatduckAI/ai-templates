"use client";

import { CreditCard, Search, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  CommandItem,
  CommandDialog as ShadcnCommandDialog,
  CommandEmpty as ShadcnCommandEmpty,
  CommandGroup as ShadcnCommandGroup,
  CommandInput as ShadcnCommandInput,
  CommandItem as ShadcnCommandItem,
  CommandList as ShadcnCommandList,
  CommandSeparator as ShadcnCommandSeparator,
} from "@/components/ui/command";

interface Tool {
  name: string;
  category: string;
  description: string;
  href: string;
}

interface Prompt {
  name: string;
  category: string;
  description: string;
  href: string;
}

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  // Example data - in real app, this could come from your registry
  const tools: Tool[] = [
    {
      name: "btc-price",
      category: "Crypto",
      description: "Get current Bitcoin price",
      href: "/registry/tools/btc-price",
    },
    {
      name: "sentiment",
      category: "Analysis",
      description: "Analyze text sentiment",
      href: "/registry/tools/sentiment",
    },
  ];

  const prompts: Prompt[] = [
    {
      name: "tweet",
      category: "Social",
      description: "Generate engaging tweets",
      href: "/registry/prompts/tweet",
    },
    {
      name: "blog-post",
      category: "Content",
      description: "Create blog post outline",
      href: "/registry/prompts/blog-post",
    },
  ];

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-[0.5rem] text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">
          Search prompts and tools...
        </span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <ShadcnCommandDialog open={open} onOpenChange={setOpen}>
        <ShadcnCommandInput placeholder="Type a command or search..." />
        <ShadcnCommandList>
          <ShadcnCommandEmpty>No results found.</ShadcnCommandEmpty>
          <ShadcnCommandGroup heading="Tools">
            {tools.map((tool) => (
              <CommandItem
                key={tool.name}
                value={tool.name}
                onSelect={() => {
                  runCommand(() => router.push(tool.href));
                }}
              >
                <Search className="mr-2 h-4 w-4" />
                <span>{tool.name}</span>
                <span className="ml-2 text-muted-foreground">
                  {tool.description}
                </span>
              </CommandItem>
            ))}
          </ShadcnCommandGroup>
          <ShadcnCommandSeparator />
          <ShadcnCommandGroup heading="Prompts">
            {prompts.map((prompt) => (
              <CommandItem
                key={prompt.name}
                value={prompt.name}
                onSelect={() => {
                  runCommand(() => router.push(prompt.href));
                }}
              >
                <Search className="mr-2 h-4 w-4" />
                <span>{prompt.name}</span>
                <span className="ml-2 text-muted-foreground">
                  {prompt.description}
                </span>
              </CommandItem>
            ))}
          </ShadcnCommandGroup>
          <ShadcnCommandSeparator />
          <ShadcnCommandGroup heading="Navigation">
            <ShadcnCommandItem
              onSelect={() => {
                runCommand(() => router.push("/docs"));
              }}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Documentation
            </ShadcnCommandItem>
            <ShadcnCommandItem
              onSelect={() => {
                runCommand(() => router.push("/examples"));
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              Examples
            </ShadcnCommandItem>
          </ShadcnCommandGroup>
        </ShadcnCommandList>
      </ShadcnCommandDialog>
    </>
  );
}
