import { Octokit } from "@octokit/rest";

type PRDetails = {
  number: number;
  title: string;
  author: string;
  mergeSha?: string;
  fileCount: number;
  additions: number;
  deletions: number;
};

export async function getLatestPR(
  githubToken: string,
  owner: string,
  repo: string
): Promise<PRDetails> {
  const octokit = new Octokit({ auth: githubToken });

  // Get the most recent closed PR
  const { data: prs } = await octokit.pulls.list({
    owner,
    repo,
    state: "closed",
    sort: "updated",
    direction: "desc",
    per_page: 1,
    base: "master",
  });

  if (prs.length === 0 || !prs[0].merged_at) {
    throw new Error("No merged PRs found");
  }

  const pr = prs[0];

  // Get PR details including file changes
  const { data: prDetails } = await octokit.pulls.get({
    owner,
    repo,
    pull_number: pr.number,
  });

  return {
    number: pr.number,
    title: pr.title,
    author: pr.user?.login || "unknown",
    mergeSha: pr.merge_commit_sha || undefined,
    fileCount: prDetails.changed_files,
    additions: prDetails.additions,
    deletions: prDetails.deletions,
  };
}

export const githubPullRequestToolSource = `import { Octokit } from "@octokit/rest";

type PRDetails = {
  number: number;
  title: string;
  author: string;
  mergeSha?: string;
  fileCount: number;
  additions: number;
  deletions: number;
};

export async function getLatestPR(
  githubToken: string,
  owner: string,
  repo: string
): Promise<PRDetails> {
  const octokit = new Octokit({ auth: githubToken });

  // Get the most recent closed PR
  const { data: prs } = await octokit.pulls.list({
    owner,
    repo,
    state: "closed",
    sort: "updated",
    direction: "desc",
    per_page: 1,
    base: "master",
  });

  if (prs.length === 0 || !prs[0].merged_at) {
    throw new Error("No merged PRs found");
  }

  const pr = prs[0];
  
  // Get PR details including file changes
  const { data: prDetails } = await octokit.pulls.get({
    owner,
    repo,
    pull_number: pr.number,
  });

  return {
    number: pr.number,
    title: pr.title,
    author: pr.user?.login || "unknown",
    mergeSha: pr.merge_commit_sha || undefined,
    fileCount: prDetails.changed_files,
    additions: prDetails.additions,
    deletions: prDetails.deletions,
  };
}
`;
