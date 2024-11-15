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
  private readonly LOCAL_PATH: string;
  private readonly DEBUG: boolean;

  // Map of file names to their kebab-case versions
  private readonly FILE_NAMES = {
    messageHandler: "message-handler",
    commandHandler: "command-handler",
    callbackHandler: "callback-handler",
  };

  constructor(options: { localPath?: string; debug?: boolean } = {}) {
    this.octokit = new Octokit();
    this.LOCAL_PATH =
      options.localPath || resolve(process.cwd(), "../../packages/core/src");
    this.DEBUG = options.debug || process.env.FATDUCK_DEBUG === "true" || false;
  }

  public async getComponentType(
    componentName: string
  ): Promise<"prompt" | "tool" | "client" | undefined> {
    // Check for prompt first
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

    // Check for client
    if (await this.exists(`clients/${componentName}/`)) {
      return "client";
    }

    return undefined;
  }

  async getFile(componentPath: string): Promise<string> {
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
        console.log(
          chalk.dim(
            `[DEBUG] Trying GitHub: tools/${componentName}/${componentName}.ts`
          )
        );
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

  private extractTemplate(content: string): string | null {
    // Look for const SOMETHING_TEMPLATE = ` pattern
    const templateMatch = content.match(
      /const\s+(\w+_TEMPLATE)\s*=\s*`([^`]+)`/
    );

    if (templateMatch) {
      const [_, templateName, templateContent] = templateMatch;
      return `export const ${templateName} = \`${templateContent}\`;\n`;
    }

    return null;
  }

  private async exists(path: string): Promise<boolean> {
    try {
      const localPath = join(this.LOCAL_PATH, path);
      await access(localPath);
      return true;
    } catch {
      return false;
    }
  }

  private async tryPath(path: string): Promise<string | null> {
    try {
      // Try local path first
      const localPath = join(this.LOCAL_PATH, path);
      try {
        const content = await readFile(localPath, "utf-8");
        if (this.DEBUG) {
          console.log(
            chalk.dim(`[DEBUG] Found component in local path: ${localPath}`)
          );
        }
        return content;
      } catch {
        if (this.DEBUG) {
          console.log(
            chalk.dim(`[DEBUG] Not found in local path: ${localPath}`)
          );
        }
      }

      // Try GitHub
      if (this.DEBUG) {
        console.log(chalk.dim(`[DEBUG] Trying GitHub: ${path}`));
      }

      const response = await this.octokit.repos.getContent({
        owner: this.REPO_OWNER,
        repo: this.REPO_NAME,
        path: `${this.REPO_PATH}/${path}`,
        ref: this.BRANCH,
      });

      if ("content" in response.data) {
        if (this.DEBUG) {
          console.log(chalk.dim(`[DEBUG] Found component in GitHub: ${path}`));
        }
        return Buffer.from(response.data.content, "base64").toString();
      }
    } catch {
      return null;
    }
    return null;
  }

  async listDirectory(
    path: string
  ): Promise<Array<{ name: string; type: string; category?: string }>> {
    if (this.DEBUG) {
      console.log(chalk.dim(`[DEBUG] Listing directory: ${path}`));
    }

    const results = [];

    // Handle each type of component
    if (path === "prompts") {
      // List prompts
      const basePath = join(this.LOCAL_PATH, "prompts/base");
      const specializedPath = join(this.LOCAL_PATH, "prompts/specialized");

      try {
        const baseFiles = await readdir(basePath, { withFileTypes: true });
        results.push(
          ...baseFiles
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
            }))
        );
      } catch (error) {
        if (this.DEBUG) {
          console.log(
            chalk.dim(`[DEBUG] No base prompts found in: ${basePath}`)
          );
        }
      }

      try {
        const specializedFiles = await readdir(specializedPath, {
          withFileTypes: true,
        });
        results.push(
          ...specializedFiles
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
            }))
        );
      } catch (error) {
        if (this.DEBUG) {
          console.log(
            chalk.dim(
              `[DEBUG] No specialized prompts found in: ${specializedPath}`
            )
          );
        }
      }
    } else if (path === "clients") {
      // List clients
      const clientsPath = join(this.LOCAL_PATH, "clients");
      try {
        const entries = await readdir(clientsPath, { withFileTypes: true });
        results.push(
          ...entries
            .filter((entry) => entry.isDirectory() && entry.name !== "logic")
            .map((entry) => ({
              name: entry.name,
              type: "client",
            }))
        );
      } catch (error) {
        if (this.DEBUG) {
          console.log(chalk.dim(`[DEBUG] No clients found in: ${clientsPath}`));
        }
      }
    } else if (path === "tools") {
      // List tools
      const toolsPath = join(this.LOCAL_PATH, "tools");
      try {
        const entries = await readdir(toolsPath, { withFileTypes: true });

        for (const entry of entries) {
          // Skip index.ts
          if (entry.name === "index.ts") continue;

          if (entry.isDirectory()) {
            // Handle directory-based tools
            try {
              const hasImplementation = await access(
                join(toolsPath, entry.name, "btc-price.ts")
              )
                .then(() => true)
                .catch(() => false);

              const hasIndex = await access(
                join(toolsPath, entry.name, "index.ts")
              )
                .then(() => true)
                .catch(() => false);

              if (hasImplementation || hasIndex) {
                results.push({
                  name: entry.name,
                  type: "tool",
                  format: "directory",
                });
              }
            } catch (error) {
              if (this.DEBUG) {
                console.log(
                  chalk.dim(
                    `[DEBUG] Skipping invalid tool directory: ${entry.name}`
                  )
                );
              }
            }
          }
        }
      } catch (error) {
        if (this.DEBUG) {
          console.log(chalk.dim(`[DEBUG] No tools found in: ${toolsPath}`));
        }
      }
    }

    return results;
  }
}
