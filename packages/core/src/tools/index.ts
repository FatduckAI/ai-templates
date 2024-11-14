import { Tool } from "../types";
import { btcPriceTool } from "./btc-price";

export const tools: Tool[] = [btcPriceTool];

export function getToolById(id: string): Tool | undefined {
  return tools.find((tool) => tool.id === id);
}
