import { groupByCategory } from "@/lib/utils";
import {
  basePrompts,
  clients,
  specializedPrompts,
  tools,
} from "@fatduckai/core";
import { DocsSidebar } from "./sidebar";

interface DocLayoutProps {
  children: React.ReactNode;
}

export function DocLayout({ children }: DocLayoutProps) {
  // Group tools by category
  const toolsByCategory = groupByCategory(tools);

  const sidebarItems = [
    {
      title: "Prompts",
      items: [
        // Base prompts
        ...basePrompts.map((prompt) => ({
          title: prompt.name,
          href: `/registry/prompts/${prompt.id}`,
          description: prompt.description,
          badge: "base",
        })),
        // Specialized prompts
        ...specializedPrompts.map((prompt) => ({
          title: prompt.name,
          href: `/registry/prompts/${prompt.id}`,
          description: prompt.description,
          badge: `extends: ${prompt.extends}`,
        })),
      ],
    },
    {
      title: "Tools",
      items: Object.entries(toolsByCategory).flatMap(
        ([category, categoryTools]) => [
          // Add category header
          {
            title: category,
            href: "#",
            isCategory: true,
          },
          // Add tools in this category
          ...categoryTools.map((tool) => ({
            title: tool.name,
            href: `/registry/tools/${tool.id}`,
            description: tool.description,
          })),
        ]
      ),
    },
    {
      title: "Clients",
      items: [
        ...clients.map((client) => ({
          title: client.name,
          href: `/registry/clients/${client.id}`,
          description: client.description,
          badge: "base",
        })),
      ],
    },
  ];

  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
      <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
        <DocsSidebar items={sidebarItems} />
      </aside>
      <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid">
        <div className="mx-auto w-full min-w-0">{children}</div>
      </main>
    </div>
  );
}
