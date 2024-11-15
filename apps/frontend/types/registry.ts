import { z } from "zod";

// Base message format for prompts
export interface PromptMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// Prompt variables interface
export interface PromptVariables {
  [key: string]: string | number | boolean;
}

// Base registry item interface
export interface BaseAIItem {
  id: string;
  name: string;
  description: string;
  version?: string;
  type: "base";
  template: string;
  variables?: PromptVariables;
  examples: Array<{
    input: Record<string, unknown>;
    output: string;
    tools?: Record<string, unknown>;
  }>;
}

// Specialized prompt type
export interface SpecializedPrompt extends Omit<BaseAIItem, "type"> {
  type: "specialized";
  extends: string;
  suggestedTools: string[];
  template: string;
  variables?: PromptVariables;
}

// Tool type
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

// Prompt-Tool Pairing interface
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

// Union type for all registry items
export type RegistryItemType = BaseAIItem | SpecializedPrompt | Tool;

// Type guard for checking if an item is a prompt
export function isPrompt(
  item: RegistryItemType
): item is BaseAIItem | SpecializedPrompt {
  return item.type === "base" || item.type === "specialized";
}

// Type guard for checking if an item is a specialized prompt
export function isSpecializedPrompt(
  item: RegistryItemType
): item is SpecializedPrompt {
  return item.type === "specialized";
}

// Type guard for checking if an item is a tool
export function isTool(item: RegistryItemType): item is Tool {
  return item.type === "tool";
}

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Prompt builder configuration
export interface PromptBuilderConfig {
  validateOnBuild?: boolean;
  throwOnWarnings?: boolean;
  allowEmptyContent?: boolean;
}

// Built prompt result
export interface BuiltPrompt {
  messages: PromptMessage[];
  metadata?: Record<string, unknown>;
}

// Store interface
export interface RegistryStore {
  basePrompts: BaseAIItem[];
  specializedPrompts: SpecializedPrompt[];
  tools: Tool[];
  loading: boolean;
  error: string | null;
  fetchRegistry: () => Promise<void>;
}

// Navigation item interface
export interface NavItem {
  href: string;
  label: string;
  badge?: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
}

// Navigation state interface
export interface NavigationState {
  basePromptsNav: NavItem[];
  specializedPromptsNav: NavItem[];
  toolsNav: Record<string, NavItem[]>;
}

// Variable definition interface
export interface VariableDefinition {
  name: string;
  type: "string" | "number" | "boolean";
  description?: string;
  required?: boolean;
  default?: unknown;
}

// Prompt template metadata
export interface PromptTemplateMetadata {
  variables: VariableDefinition[];
  description?: string;
  version?: string;
}

// Utility type for type-safe tool configuration
export type ToolConfig<T extends Tool> = z.infer<T["configSchema"]>;

// Utility type for type-safe tool output
export type ToolOutput<T extends Tool> = z.infer<T["outputSchema"]>;
