import {
  Client,
  isPrompt,
  isTool,
  RegistryItemType,
  SpecializedPrompt,
  Tool,
} from "@/types/registry";

import { getPromptById, getToolById } from "@fatduckai/core";

export async function getRegistryItem(
  type: string,
  id: string
): Promise<RegistryItemType | null> {
  try {
    if (type === "prompts") {
      return (await getPromptById(id)) || null;
    }

    if (type === "tools") {
      return (await getToolById(id)) || null;
    }

    return null;
  } catch (error) {
    console.error("Error fetching registry item:", error);
    return null;
  }
}

// Utility for grouping items by category
export function groupByCategory<T extends { category: string }>(
  items: T[]
): Record<string, T[]> {
  return items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

// Generates example usage code for prompts and tools
import { BaseAIItem } from "@/types/registry";

// Generates example usage code for prompts and tools
export function getUsageExample(
  item: BaseAIItem | SpecializedPrompt | Tool | Client
): string {
  if (isPrompt(item)) {
    return `import { PromptBuilder } from '@fatduckai/ai'

const builder = new PromptBuilder(\`${item.template}\`)

// Example usage with variables
const result = await builder
  .withContext({
    ${Object.entries(item.variables || {})
      .map(([key]) => `${key}: "example-value"`)
      .join(",\n    ")}
  })
  .build()`;
  } else if (isTool(item)) {
    return `import { ${item.name} } from '@/ai/tools/${item.id}'

    ${item.source}
const result = await ${item.name}.handler({})`;
  }

  return "";
}
