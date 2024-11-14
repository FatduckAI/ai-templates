import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { groupByCategory } from "@/lib/utils";
import { basePrompts, specializedPrompts, tools } from "@fatduckai/core";
import Link from "next/link";

export function RegistryOverview() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Base Prompts</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {basePrompts.map((prompt) => (
            <Link key={prompt.id} href={`/registry/prompts/${prompt.id}`}>
              <Card className="p-4 hover:bg-muted/50 transition-colors">
                <h3 className="font-medium mb-1">{prompt.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {prompt.description}
                </p>
                <div className="flex gap-2">
                  <Badge>base</Badge>
                  {prompt.version && (
                    <Badge variant="outline">v{prompt.version}</Badge>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Specialized Prompts</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {specializedPrompts.map((prompt) => (
            <Link key={prompt.id} href={`/registry/prompts/${prompt.id}`}>
              <Card className="p-4 hover:bg-muted/50 transition-colors">
                <h3 className="font-medium mb-1">{prompt.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {prompt.description}
                </p>
                <div className="flex gap-2">
                  <Badge variant="secondary">specialized</Badge>
                  <Badge variant="outline">extends: {prompt.extends}</Badge>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Tools</h2>
        {Object.entries(groupByCategory(tools)).map(
          ([category, categoryTools]) => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-medium mb-3 capitalize">
                {category}
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {categoryTools.map((tool) => (
                  <Link key={tool.id} href={`/registry/tools/${tool.id}`}>
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <h4 className="font-medium mb-1">{tool.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {tool.description}
                      </p>
                      <Badge variant="outline">{category}</Badge>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )
        )}
      </section>
    </div>
  );
}
