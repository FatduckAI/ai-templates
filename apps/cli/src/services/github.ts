import { Octokit } from "@octokit/rest";
import chalk from "chalk";
import { access, readFile, readdir } from "fs/promises";
import { join, resolve } from "path";

export class GitHubService {
  private octokit: Octokit;
  private readonly REPO_OWNER = "FatduckAI";
  private readonly REPO_NAME = "ai-templates";
  private readonly REPO_PATH = "packages/core/src";
  private readonly BRANCH = "master";
  private readonly LOCAL_PATH: string | null;
  private readonly DEBUG: boolean;

  private readonly FILE_NAMES = {
    messageHandler: "message-handler",
    commandHandler: "command-handler",
    callbackHandler: "callback-handler",
  };

  constructor(options: { debug?: boolean } = {}) {
    this.octokit = new Octokit();
    this.DEBUG = options.debug || process.env.FATDUCK_DEBUG === "true" || false;
    this.LOCAL_PATH = this.DEBUG
      ? resolve(process.cwd(), "../../packages/core/src")
      : null;
  }

  public async getComponentType(
    componentName: string
  ): Promise<"prompt" | "tool" | "client" | undefined> {
    if (this.DEBUG) {
      console.log(
        chalk.dim(`[DEBUG] Checking component type for: ${componentName}`)
      );
    }

    // Check for client
    const clientPath = `clients/${componentName}/${componentName}.ts`;
    if (await this.exists(clientPath)) {
      if (this.DEBUG) {
        console.log(chalk.dim(`[DEBUG] Found as client: ${componentName}`));
      }
      return "client";
    }

    // Check for prompt
    if (
      (await this.exists(`prompts/base/${componentName}.ts`)) ||
      (await this.exists(`prompts/specialized/${componentName}.ts`))
    ) {
      return "prompt";
    }

    // Check for tool
    if (await this.exists(`tools/${componentName}/${componentName}.ts`)) {
      return "tool";
    }

    return undefined;
  }

  async getFile(componentPath: string): Promise<string> {
    if (this.DEBUG) {
      console.log(chalk.dim(`[DEBUG] Getting file: ${componentPath}`));
    }

    const componentName =
      componentPath.split("/").pop()?.replace(".ts", "") || componentPath;
    const componentType = await this.getComponentType(componentName);

    if (this.DEBUG) {
      console.log(
        chalk.dim(
          `[DEBUG] Detected component type: ${componentType || "unknown"}`
        )
      );
    }

    if (!componentType) {
      throw new Error(
        `Could not determine component type for "${componentName}"`
      );
    }

    let content: string | null = null;
    switch (componentType) {
      case "client":
        content = await this.tryPath(
          `clients/${componentName}/${componentName}.ts`
        );
        if (content) {
          const client = this.extractClientSource(content);
          if (client) {
            content = client;
          }
        }
        break;
      case "prompt":
        content =
          (await this.tryPath(`prompts/base/${componentName}.ts`)) ||
          (await this.tryPath(`prompts/specialized/${componentName}.ts`));
        if (content) {
          const template = this.extractTemplate(content);

          if (template) {
            content = template;
          }
        }
        break;
      case "tool":
        if (this.DEBUG) {
          console.log(
            chalk.dim(
              `[DEBUG] Trying path: tools/${componentName}/${componentName}.ts`
            )
          );
        }
        content = await this.tryPath(
          `tools/${componentName}/${componentName}.ts`
        );
        break;
    }

    if (content) {
      return content;
    }

    throw new Error(`Component "${componentName}" not found`);
  }

  private extractClientSource(content: string): string | null {
    // For clients, extract just the code inside the template literal
    const match = content.match(
      /export\s+const\s+\w+_CLIENT\s*=\s*`([\s\S]+?)`\s*;?\s*$/
    );
    if (match) {
      // Return just the code content from inside the backticks
      return match[1];
    }
    return null;
  }

  private extractTemplate(content: string): string | null {
    // Find const NAME_TEMPLATE = `...`
    const match = content.match(/const\s+(\w+_TEMPLATE)\s*=\s*`([\s\S]+?)`/);
    if (match) {
      const [_, variableName, templateContent] = match;
      return `export const ${variableName} = \`${templateContent}\`;\n`;
    }
    return null;
  }

  private async tryPath(path: string): Promise<string | null> {
    // Only try local path in debug mode
    if (this.DEBUG && this.LOCAL_PATH) {
      try {
        const localPath = join(this.LOCAL_PATH, path);
        const content = await readFile(localPath, "utf-8");
        console.log(
          chalk.dim(`[DEBUG] Found file in local path: ${localPath}`)
        );
        return content;
      } catch (error) {
        console.log(
          chalk.dim(`[DEBUG] Not found in local path, trying GitHub`)
        );
      }
    }

    // Try GitHub
    try {
      const response = await this.octokit.repos.getContent({
        owner: this.REPO_OWNER,
        repo: this.REPO_NAME,
        path: `${this.REPO_PATH}/${path}`,
        ref: this.BRANCH,
      });

      if ("content" in response.data) {
        if (this.DEBUG) {
          console.log(chalk.dim(`[DEBUG] Found file in GitHub: ${path}`));
        }
        return Buffer.from(response.data.content, "base64").toString();
      }
    } catch (error) {
      if (this.DEBUG) {
        console.log(chalk.dim(`[DEBUG] Error fetching from GitHub:`, error));
      }
    }
    return null;
  }

  private async exists(path: string): Promise<boolean> {
    if (this.DEBUG) {
      console.log(chalk.dim(`[DEBUG] Checking existence: ${path}`));
    }

    // Only check local path in debug mode
    if (this.DEBUG && this.LOCAL_PATH) {
      try {
        const localPath = join(this.LOCAL_PATH, path);
        await access(localPath);
        console.log(chalk.dim(`[DEBUG] Found in local path: ${localPath}`));
        return true;
      } catch {
        console.log(
          chalk.dim(`[DEBUG] Not found in local path, trying GitHub`)
        );
      }
    }

    // Check GitHub
    try {
      const response = await this.octokit.repos.getContent({
        owner: this.REPO_OWNER,
        repo: this.REPO_NAME,
        path: `${this.REPO_PATH}/${path}`,
        ref: this.BRANCH,
      });
      if (this.DEBUG) {
        console.log(chalk.dim(`[DEBUG] Found in GitHub: ${path}`));
      }
      return true;
    } catch {
      if (this.DEBUG) {
        console.log(chalk.dim(`[DEBUG] Not found in GitHub: ${path}`));
      }
      return false;
    }
  }

  async listDirectory(
    path: string
  ): Promise<Array<{ name: string; type: string; category?: string }>> {
    if (this.DEBUG) {
      console.log(chalk.dim(`[DEBUG] Listing directory: ${path}`));
    }

    const results = [];

    // Only try local path in debug mode
    if (this.DEBUG && this.LOCAL_PATH) {
      try {
        if (path === "prompts") {
          // Handle base prompts
          try {
            const basePath = join(this.LOCAL_PATH, "prompts/base");
            const baseEntries = await readdir(basePath, {
              withFileTypes: true,
            });
            const basePrompts = baseEntries
              .filter(
                (file) =>
                  file.isFile() &&
                  file.name.endsWith(".ts") &&
                  file.name !== "index.ts"
              )
              .map((file) => ({
                name: file.name.replace(".ts", ""),
                type: "prompt",
                category: "base",
              }));
            results.push(...basePrompts);
          } catch (error) {
            if (this.DEBUG) {
              console.log(chalk.dim(`[DEBUG] No base prompts found locally`));
            }
          }

          // Handle specialized prompts
          try {
            const specializedPath = join(
              this.LOCAL_PATH,
              "prompts/specialized"
            );
            const specializedEntries = await readdir(specializedPath, {
              withFileTypes: true,
            });
            const specializedPrompts = specializedEntries
              .filter(
                (file) =>
                  file.isFile() &&
                  file.name.endsWith(".ts") &&
                  file.name !== "index.ts"
              )
              .map((file) => ({
                name: file.name.replace(".ts", ""),
                type: "prompt",
                category: "specialized",
              }));
            results.push(...specializedPrompts);
          } catch (error) {
            if (this.DEBUG) {
              console.log(
                chalk.dim(`[DEBUG] No specialized prompts found locally`)
              );
            }
          }
        } else if (path === "clients") {
          const clientsPath = join(this.LOCAL_PATH, "clients");
          const entries = await readdir(clientsPath, { withFileTypes: true });
          const clientDirs = entries
            .filter((entry) => entry.isDirectory() && entry.name !== "logic")
            .map((entry) => ({
              name: entry.name,
              type: "client",
            }));
          results.push(...clientDirs);
        } else if (path === "tools") {
          const toolsPath = join(this.LOCAL_PATH, "tools");
          const entries = await readdir(toolsPath, { withFileTypes: true });
          const toolDirs = entries
            .filter((entry) => entry.isDirectory() && entry.name !== "index.ts")
            .map((entry) => ({
              name: entry.name,
              type: "tool",
            }));
          results.push(...toolDirs);
        }
      } catch (error) {
        if (this.DEBUG) {
          console.log(
            chalk.dim(`[DEBUG] Error reading local directory: ${error}`)
          );
        }
      }
    }

    // Always try GitHub
    try {
      if (path === "prompts") {
        // Get base prompts from GitHub
        try {
          const baseResponse = await this.octokit.repos.getContent({
            owner: this.REPO_OWNER,
            repo: this.REPO_NAME,
            path: `${this.REPO_PATH}/prompts/base`,
            ref: this.BRANCH,
          });

          if (Array.isArray(baseResponse.data)) {
            const githubBasePrompts = baseResponse.data
              .filter(
                (item) =>
                  item.type === "file" &&
                  item.name.endsWith(".ts") &&
                  item.name !== "index.ts"
              )
              .map((item) => ({
                name: item.name.replace(".ts", ""),
                type: "prompt",
                category: "base",
              }));

            // Merge avoiding duplicates
            const existingNames = new Set(results.map((r) => r.name));
            githubBasePrompts.forEach((prompt) => {
              if (!existingNames.has(prompt.name)) {
                results.push(prompt);
              }
            });
          }
        } catch (error) {
          if (this.DEBUG) {
            console.log(chalk.dim(`[DEBUG] No base prompts found on GitHub`));
          }
        }

        // Get specialized prompts from GitHub
        try {
          const specializedResponse = await this.octokit.repos.getContent({
            owner: this.REPO_OWNER,
            repo: this.REPO_NAME,
            path: `${this.REPO_PATH}/prompts/specialized`,
            ref: this.BRANCH,
          });

          if (Array.isArray(specializedResponse.data)) {
            const githubSpecializedPrompts = specializedResponse.data
              .filter(
                (item) =>
                  item.type === "file" &&
                  item.name.endsWith(".ts") &&
                  item.name !== "index.ts"
              )
              .map((item) => ({
                name: item.name.replace(".ts", ""),
                type: "prompt",
                category: "specialized",
              }));

            // Merge avoiding duplicates
            const existingNames = new Set(results.map((r) => r.name));
            githubSpecializedPrompts.forEach((prompt) => {
              if (!existingNames.has(prompt.name)) {
                results.push(prompt);
              }
            });
          }
        } catch (error) {
          if (this.DEBUG) {
            console.log(
              chalk.dim(`[DEBUG] No specialized prompts found on GitHub`)
            );
          }
        }
      } else {
        // Handle clients and tools as before
        const response = await this.octokit.repos.getContent({
          owner: this.REPO_OWNER,
          repo: this.REPO_NAME,
          path: `${this.REPO_PATH}/${path}`,
          ref: this.BRANCH,
        });

        if (Array.isArray(response.data)) {
          if (path === "clients") {
            const githubClients = response.data
              .filter((item) => item.type === "dir" && item.name !== "logic")
              .map((item) => ({
                name: item.name,
                type: "client",
              }));

            // Merge avoiding duplicates
            const existingNames = new Set(results.map((r) => r.name));
            githubClients.forEach((client) => {
              if (!existingNames.has(client.name)) {
                results.push(client);
              }
            });
          } else if (path === "tools") {
            const githubTools = response.data
              .filter((item) => item.type === "dir" && item.name !== "index.ts")
              .map((item) => ({
                name: item.name,
                type: "tool",
              }));

            // Merge avoiding duplicates
            const existingNames = new Set(results.map((r) => r.name));
            githubTools.forEach((tool) => {
              if (!existingNames.has(tool.name)) {
                results.push(tool);
              }
            });
          }
        }
      }
    } catch (error) {
      if (this.DEBUG) {
        console.log(chalk.dim(`[DEBUG] Error fetching from GitHub: ${error}`));
      }
    }

    return results;
  }
}
