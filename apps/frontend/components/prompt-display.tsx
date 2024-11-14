import { CopyBlock } from "@/components/copy-block";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BaseAIItem, SpecializedPrompt, Tool } from "@/types/registry";

interface PromptDisplayProps {
  item: BaseAIItem | SpecializedPrompt | Tool;
}

export function PromptDisplay({ item }: PromptDisplayProps) {
  if (!("template" in item)) {
    return null;
  }

  // Generate the importable prompt code
  const promptCode = `import { ${item.id} } from "@/ai/prompts/${item.id}";

export const ${item.id} = {
  ${item.template}
}`;

  // Generate the usage example
  const usageCode = `import { ${item.id} } from "@/prompts/${item.id}";
`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{item.name}</h1>
          <p className="text-lg text-muted-foreground">{item.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={item.type === "base" ? "default" : "secondary"}>
            {item.type}
          </Badge>
          {item.type === "specialized" && (
            <Badge variant="outline">
              extends: {(item as SpecializedPrompt).extends}
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="installation">
        <TabsList>
          <TabsTrigger value="installation">Installation</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          {item.type === "specialized" && (
            <TabsTrigger value="tools">Compatible Tools</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="installation" className="space-y-4">
          <div className="rounded-md border p-4">
            <h3 className="mb-2 font-medium">Create prompt file</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Copy and paste the following code into{" "}
              <code className="text-sm">prompts/{item.id}.ts</code>
            </p>
            <CopyBlock content={promptCode} language="typescript" />
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <div className="rounded-md border p-4">
            <h3 className="mb-2 font-medium">Usage Example</h3>
            <CopyBlock content={usageCode} language="typescript" />
          </div>
        </TabsContent>

        {item.type === "specialized" && (
          <TabsContent value="tools" className="space-y-4">
            <div className="rounded-md border p-4">
              <h3 className="mb-2 font-medium">Compatible Tools</h3>
              <ul className="list-disc list-inside">
                {(item as SpecializedPrompt).suggestedTools.map((toolId) => (
                  <li key={toolId}>{toolId}</li>
                ))}
              </ul>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
