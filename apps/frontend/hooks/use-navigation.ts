import { NavigationState, NavItem } from "@/types/registry";
import { basePrompts, specializedPrompts, tools } from "@fatduckai/core";

export function useNavigation(): NavigationState {
  const basePromptsNav = basePrompts.map((prompt) => ({
    href: `/registry/prompts/${encodeURIComponent(prompt.id)}`,
    label: prompt.name,
  }));

  const specializedPromptsNav = specializedPrompts.map((prompt) => ({
    href: `/registry/prompts/${encodeURIComponent(prompt.id)}`,
    label: prompt.name,
    badge: prompt.extends,
  }));

  const toolsNav = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push({
      href: `/registry/tools/${tool.id}`,
      label: tool.name,
    });
    return acc;
  }, {} as Record<string, NavItem[]>);

  return {
    basePromptsNav,
    specializedPromptsNav,
    toolsNav,
  };
}
