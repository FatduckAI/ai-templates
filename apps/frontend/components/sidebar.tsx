"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DocsSidebarProps {
  items: {
    title: string;
    items: {
      title: string;
      href: string;
      description?: string;
      badge?: string;
      isCategory?: boolean;
    }[];
  }[];
}

export function DocsSidebar({ items }: DocsSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="w-full">
      {items.map((section) => (
        <div key={section.title} className="py-8">
          <h4 className="mb-2 text-sm font-semibold">{section.title}</h4>
          <div className="grid grid-flow-row auto-rows-max gap-2">
            {section.items.map((item) =>
              item.isCategory ? (
                <h5
                  key={item.title}
                  className="mt-4 mb-2 px-2 text-sm font-medium text-muted-foreground"
                >
                  {item.title}
                </h5>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col gap-1 rounded-md p-2 hover:bg-muted",
                    pathname === item.href
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge
                        variant={
                          item.badge.startsWith("extends")
                            ? "outline"
                            : "default"
                        }
                        className="text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  {item.description && (
                    <span className="text-xs text-muted-foreground line-clamp-2">
                      {item.description}
                    </span>
                  )}
                </Link>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
