import { CopyBlock } from "@/components/copy-block";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUsageExample } from "@/lib/registry";
import {
  RegistryItemType,
  isPrompt,
  isSpecializedPrompt,
} from "@/types/registry";
import { isTool } from "@fatduckai/core";
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
          <TabsTrigger value="code">Code</TabsTrigger>
          {isSpecializedPrompt(item) && (
            <TabsTrigger value="tools">Compatible Tools</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="usage" className="space-y-4">
          <div className="rounded-md border p-4">
            <h3 className="mb-2 font-medium">Installation</h3>
            <CopyBlock content={`npx fatduck add ${item.id}`} language="bash" />
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

        <TabsContent value="code" className="space-y-4">
          {isPrompt(item) && (
            <div className="rounded-md border p-4">
              <h3 className="mb-2 font-medium">Copy Code</h3>
              <CopyBlock content={item.template} language="json" />
            </div>
          )}
          {isTool(item) && (
            <div className="rounded-md border p-4">
              <h3 className="mb-2 font-medium">Copy Code</h3>
              <CopyBlock
                content={item.handler.toString()}
                language="typescript"
              />
            </div>
          )}
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
