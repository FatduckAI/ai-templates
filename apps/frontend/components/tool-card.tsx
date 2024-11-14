"use client";

import { CopyBlock } from "@/components/copy-block";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getUsageExample } from "@/lib/registry";
import { cn } from "@/lib/utils";
import { Tool } from "@/types/registry";
import { specializedPrompts, tools } from "@fatduckai/core";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";

interface ToolCardProps {
  toolId: string;
  showCompatibility?: boolean;
  className?: string;
}

// Helper function to get type name from Zod schema
function getSchemaType(schema: z.ZodType<any>): string {
  if (schema instanceof z.ZodString) return "string";
  if (schema instanceof z.ZodNumber) return "number";
  if (schema instanceof z.ZodBoolean) return "boolean";
  if (schema instanceof z.ZodEnum) {
    return schema._def.values.map((v: string) => `"${v}"`).join(" | ");
  }
  if (schema instanceof z.ZodArray) {
    const innerType = getSchemaType(schema._def.type);
    return `${innerType}[]`;
  }
  if (schema instanceof z.ZodObject) {
    return "object";
  }
  return "unknown";
}

export function ToolCard({
  toolId,
  showCompatibility = true,
  className,
}: ToolCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tool = tools.find((t) => t.id === toolId);

  if (!tool) return null;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{tool.name}</h3>
              <Badge variant="outline">{tool.category}</Badge>
              {tool.version && (
                <Badge variant="secondary">v{tool.version}</Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {tool.description}
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/registry/tools/${tool.id}`}>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full justify-start"
            >
              {isOpen ? (
                <ChevronDown className="mr-2 h-4 w-4" />
              ) : (
                <ChevronRight className="mr-2 h-4 w-4" />
              )}
              {isOpen ? "Hide" : "Show"} details
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4">
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Quick Usage</h4>
              <CopyBlock
                content={getUsageExample(tool)}
                language="typescript"
                className="text-xs"
              />
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Configuration</h4>
              <ConfigPreview schema={tool.configSchema} />
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Output Type</h4>
              <OutputPreview schema={tool.outputSchema} />
            </div>

            {showCompatibility && <ToolCompatibility tool={tool} />}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </Card>
  );
}

interface ConfigPreviewProps {
  schema: z.ZodType<any>;
}

function ConfigPreview({ schema }: ConfigPreviewProps) {
  const shape = schema instanceof z.ZodObject ? schema.shape : {};

  return (
    <div className="rounded-md bg-muted p-3">
      <code className="text-xs">
        {`interface Config {`}
        {Object.entries(shape).map(([key, value]) => (
          <div key={key} className="pl-2">
            {`${key}: ${getSchemaType(value as z.ZodType)}`}
          </div>
        ))}
        {`}`}
      </code>
    </div>
  );
}

function OutputPreview({ schema }: { schema: z.ZodType<any> }) {
  const shape = schema instanceof z.ZodObject ? schema.shape : {};

  return (
    <div className="rounded-md bg-muted p-3">
      <code className="text-xs">
        {`interface Output {`}
        {Object.entries(shape).map(([key, value]) => (
          <div key={key} className="pl-2">
            {`${key}: ${getSchemaType(value as z.ZodType)}`}
          </div>
        ))}
        {`}`}
      </code>
    </div>
  );
}

interface ToolCompatibilityProps {
  tool: Tool;
}

function ToolCompatibility({ tool }: ToolCompatibilityProps) {
  const compatiblePrompts = specializedPrompts.filter((p) =>
    p.suggestedTools.includes(tool.id)
  );

  if (compatiblePrompts.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Compatible With</h4>
      <div className="space-y-2">
        {compatiblePrompts.map((prompt) => (
          <Link
            key={prompt.id}
            href={`/registry/prompts/${prompt.id}`}
            className="block"
          >
            <Card className="p-2 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{prompt.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Extends: {prompt.extends}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
