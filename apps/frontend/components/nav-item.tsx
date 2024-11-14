import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavItemProps {
  item: {
    href: string;
    label: string;
    badge?: string;
    icon?: React.ComponentType<{ className?: string }>;
    description?: string;
  };
  active?: boolean;
}

export function NavItem({ item, active }: NavItemProps) {
  const Icon = item.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted",
              active && "bg-muted font-medium"
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            <span className="truncate">{item.label}</span>
            {item.badge && (
              <Badge variant="outline" className="ml-auto">
                {item.badge}
              </Badge>
            )}
          </Link>
        </TooltipTrigger>
        {item.description && (
          <TooltipContent side="right" className="max-w-[300px]">
            <p>{item.description}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
