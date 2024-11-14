import { CopyBlock } from "@/components/copy-block";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUsageExample } from "@/lib/registry";
import {
  RegistryItemType,
  isPrompt,
  isSpecializedPrompt,
} from "@/types/registry";
import { PromptEditor } from "./prompt-editor";
import { ToolCard } from "./tool-card";

interface RegistryItemProps {
  item: RegistryItemType;
}

export function RegistryItem({ item }: RegistryItemProps) {
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
          {item.version && <Badge variant="outline">v{item.version}</Badge>}
        </div>
      </div>

      <Tabs defaultValue="usage">
        <TabsList>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          {isPrompt(item) && <TabsTrigger value="editor">Editor</TabsTrigger>}
          <TabsTrigger value="examples">Examples</TabsTrigger>
          {isSpecializedPrompt(item) && (
            <TabsTrigger value="tools">Compatible Tools</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="usage" className="space-y-4">
          <div className="rounded-md border p-4">
            <h3 className="mb-2 font-medium">Installation</h3>
            <CopyBlock
              content={`npx prompt-tools add ${item.type} ${item.id}`}
              language="bash"
            />
          </div>

          <div className="rounded-md border p-4">
            <h3 className="mb-2 font-medium">Code Example</h3>
            <CopyBlock content={getUsageExample(item)} language="typescript" />
          </div>
        </TabsContent>

        {isPrompt(item) && (
          <TabsContent value="editor">
            <PromptEditor item={item} />
          </TabsContent>
        )}

        <TabsContent value="examples" className="space-y-4">
          {item.examples.map((example, index) => (
            <div key={index} className="rounded-md border p-4">
              <h3 className="mb-2 font-medium">Example {index + 1}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Input</h4>
                  <CopyBlock
                    content={JSON.stringify(
                      "input" in example ? example.input : example.config,
                      null,
                      2
                    )}
                    language="json"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Output</h4>
                  <CopyBlock
                    content={JSON.stringify(
                      "output" in example ? example.output : example.result,
                      null,
                      2
                    )}
                    language="json"
                  />
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        {isSpecializedPrompt(item) && (
          <TabsContent value="tools" className="space-y-4">
            {item.suggestedTools.map((toolId) => (
              <ToolCard key={toolId} toolId={toolId} />
            ))}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
