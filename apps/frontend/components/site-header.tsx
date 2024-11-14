import { CommandMenu } from "@/components/command-menu";
import { MainNav } from "@/components/main-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Icons } from "./icons";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <MainNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <CommandMenu />
          </div>
          <nav className="flex items-center space-x-2">
            {/* <Link
              href="/registry"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "w-9 px-0"
              )}
            >
              Registry
            </Link>
            <Link
              href="/docs"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "w-9 px-0"
              )}
            >
              Docs
            </Link> */}
            <Link
              href="https://github.com/yourusername/prompt-tools"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "w-9 px-0"
              )}
              target="_blank"
              rel="noreferrer"
            >
              <Icons.gitHub className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
