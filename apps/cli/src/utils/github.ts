interface GitHubFileOptions {
  organization: string;
  repository: string;
  path: string;
  branch?: string;
}

/**
 * Fetches a file from GitHub's raw content
 * @param options GitHub file options
 * @returns Promise with the file content
 * @throws Error if the file cannot be fetched
 */
export async function getGitHubFile({
  organization,
  repository,
  path,
  branch = "main",
}: GitHubFileOptions): Promise<string> {
  if (!organization || !repository || !path) {
    throw new Error(
      "Missing required parameters: organization, repository, or path"
    );
  }

  try {
    const url = `https://raw.githubusercontent.com/${organization}/${repository}/${branch}/${path}`;
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github.v3.raw",
        "User-Agent": "FatDuck-CLI",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`File not found: ${path}`);
      }
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`
      );
    }

    const content = await response.text();

    if (!content) {
      throw new Error(`Empty file content for: ${path}`);
    }

    return content;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch file from GitHub: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching the file");
  }
}

// Example usage:
// try {
//   const content = await getGitHubFile({
//     organization: 'fatduckai',
//     repository: 'ai-templates',
//     path: 'packages/core/src/prompts/base/tweet.ts',
//     branch: 'main'
//   });
//   console.log(content);
// } catch (error) {
//   console.error(error);
// }
