import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { basePrompts, specializedPrompts } from "@fatduckai/core";
import Link from "next/link";

export default function PromptsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Prompts</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Pre-built and specialized prompts for various use cases.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Base Prompts</h2>
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
        <h2 className="text-2xl font-semibold mb-4">Specialized Prompts</h2>
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
    </div>
  );
}
