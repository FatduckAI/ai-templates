import { ToolCard } from "@/components/tool-card";
import { groupByCategory } from "@/lib/utils";
import { tools } from "@fatduckai/core";

export default function ToolsPage() {
  const categorizedTools = groupByCategory(tools);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Tools</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Browse our collection of utility functions and integrations for
          enhancing AI responses.
        </p>
      </div>

      {Object.entries(categorizedTools).map(([category, categoryTools]) => (
        <section key={category}>
          <h2 className="text-2xl font-semibold mb-4 capitalize">{category}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {categoryTools.map((tool) => (
              <ToolCard
                key={tool.id}
                toolId={tool.id}
                showCompatibility={true}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
