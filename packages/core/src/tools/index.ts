import { Tool } from "../types";
import { btcPriceTool } from "./btc-price";
import { githubPullRequestTool } from "./github-pull-request";

export const tools: Tool[] = [btcPriceTool, githubPullRequestTool];

export function getToolById(id: string): Tool | undefined {
  return tools.find((tool) => tool.id === id);
}
