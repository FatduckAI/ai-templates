import { z } from "zod";

// Base message format for prompts
export interface PromptMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface PromptVariables {
  [key: string]: string | number | boolean;
}

export interface BaseAIItem {
  id: string;
  name: string;
  description: string;
  version?: string;
  type: "base";
  template: string;
  variables?: PromptVariables;
}

export interface SpecializedPrompt extends Omit<BaseAIItem, "type"> {
  type: "specialized";
  extends: string;
  suggestedTools: string[];
  template: string;
  variables?: PromptVariables;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  version?: string;
  type: "tool";
  category: string;
  configSchema: z.ZodType;
  outputSchema: z.ZodType;
  handler: (context: {
    config: Record<string, unknown>;
    metadata?: Record<string, unknown>;
  }) => Promise<unknown>;
  source?: string;
}

export interface PromptToolPairing {
  promptId: string;
  toolIds: string[];
  description: string;
  examples: Array<{
    tools: Record<string, unknown>;
    input: Record<string, unknown>;
    output: string;
  }>;
}

export interface Client {
  id: string;
  type: "client";
  name: string;
  description: string;
  category: string;
  configSchema: z.ZodType;
  handler: (context: {
    config: Record<string, unknown>;
    metadata?: Record<string, unknown>;
  }) => Promise<unknown>;
  source?: string;
}

export type RegistryItemType = BaseAIItem | SpecializedPrompt | Tool | Client;

export function isPrompt(
  item: RegistryItemType
): item is BaseAIItem | SpecializedPrompt {
  return item.type === "base" || item.type === "specialized";
}

export function isSpecializedPrompt(
  item: RegistryItemType
): item is SpecializedPrompt {
  return item.type === "specialized";
}

export function isTool(item: RegistryItemType): item is Tool {
  return item.type === "tool";
}
