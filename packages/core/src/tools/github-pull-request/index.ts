import { z } from "zod";
import { type Tool } from "../../types";
import {
  getLatestPR,
  githubPullRequestToolSource,
} from "./github-pull-request";

export const githubPullRequestTool: Tool = {
  id: "github-pull-request",
  type: "tool", // Added missing type property
  name: "Github Pull Request",
  description: "Get details of the most recent merged pull request",
  category: "github",
  configSchema: z.object({
    owner: z.string(),
    repo: z.string(),
  }),
  outputSchema: z.object({
    number: z.number(),
    title: z.string(),
    author: z.string(),
    mergeSha: z.string(),
    fileCount: z.number(),
    additions: z.number(),
    deletions: z.number(),
  }),
  handler: async ({ config }) => {
    const pr = await getLatestPR(
      process.env.GITHUB_TOKEN as string,
      config.owner as string,
      config.repo as string
    );
    return {
      number: pr.number,
      title: pr.title,
      author: pr.author,
      mergeSha: pr.mergeSha,
      fileCount: pr.fileCount,
      additions: pr.additions,
      deletions: pr.deletions,
    };
  },
  source: githubPullRequestToolSource,
};
