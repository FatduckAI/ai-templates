import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { basePrompts, specializedPrompts, tools } from "@fatduckai/core";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function MainNav() {
  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Image src="/tinyDucky.png" alt="AI Templates" width={32} height={32} />
        <span className="hidden font-bold sm:inline-block">AI Templates</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-full justify-start space-x-2 px-2 py-1"
            >
              <span>Prompts</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem className="font-semibold">
                Base Prompts
              </DropdownMenuItem>
              {basePrompts.map((prompt) => (
                <DropdownMenuItem key={prompt.id}>
                  <Link
                    href={`/registry/prompts/${prompt.id}`}
                    className="w-full"
                  >
                    {prompt.name}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem className="font-semibold">
                Specialized Prompts
              </DropdownMenuItem>
              {specializedPrompts.map((prompt) => (
                <DropdownMenuItem key={prompt.id}>
                  <Link
                    href={`/registry/prompts/${prompt.id}`}
                    className="w-full"
                  >
                    {prompt.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-full justify-start space-x-2 px-2 py-1"
            >
              <span>Tools</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              {Object.entries(
                tools.reduce((acc, tool) => {
                  if (!acc[tool.category]) {
                    acc[tool.category] = [];
                  }
                  acc[tool.category].push(tool);
                  return acc;
                }, {} as Record<string, typeof tools>)
              ).map(([category, categoryTools]) => (
                <DropdownMenuGroup key={category}>
                  <DropdownMenuItem className="font-semibold">
                    {category}
                  </DropdownMenuItem>
                  {categoryTools.map((tool) => (
                    <DropdownMenuItem key={tool.id}>
                      <Link
                        href={`/registry/tools/${tool.id}`}
                        className="w-full"
                      >
                        {tool.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </div>
  );
}
