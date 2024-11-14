#!/usr/bin/env node
import { Octokit } from "@octokit/rest";
import chalk from "chalk";
import { Command } from "commander";
import { constants } from "fs";
import { access, mkdir, writeFile } from "fs/promises";
import ora from "ora";
import { join } from "path";
import prompts from "prompts";

const REPO_OWNER = "FatduckAI";
const REPO_NAME = "ai-templates";
const REPO_PATH = "packages/core/src";
const BRANCH = "master";

// Get version from package.json
import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(
  readFileSync(resolve(__dirname, "../package.json"), "utf-8")
);

export class FatDuckCLI {
  private program: Command;
  private octokit: Octokit;

  constructor() {
    this.program = new Command()
      .name("fatduck")
      .description(chalk.cyan("🦆 Add AI prompts and tools to your project"))
      .version(pkg.version || "0.0.0"); // Use version from package.json

    this.octokit = new Octokit();
    this.setupCommands();
  }

  private setupCommands() {
    this.program
      .command("init")
      .description("Initialize FatDuck in your project")
      .action(async () => {
        await this.handleInitCommand();
      });

    this.program
      .command("add <component>")
      .description("Add a prompt or tool to your project")
      .option("-y, --yes", "Skip confirmation prompt", false)
      .option("-f, --force", "Override existing files", false)
      .action(async (componentName: string, options) => {
        await this.handleAddCommand(componentName, options);
      });

    this.program
      .command("list")
      .description("List all available components")
      .action(async () => {
        await this.handleListCommand();
      });
  }

  private async getGitHubFile(path: string): Promise<string> {
    try {
      const response = await this.octokit.repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: `${REPO_PATH}/${path}`,
        ref: BRANCH,
      });

      if ("content" in response.data) {
        return Buffer.from(response.data.content, "base64").toString();
      }
      throw new Error("Not a file");
    } catch (error) {
      throw new Error(`Failed to fetch file: ${error}`);
    }
  }

  private extractTemplate(content: string): string | null {
    const templateMatch = content.match(
      /const\s+(\w+)_TEMPLATE\s*=\s*`([\s\S]*?)`/
    );
    if (templateMatch) {
      const [_, name, template] = templateMatch;
      return `export const ${name}_TEMPLATE = \`${template}\`;\n`;
    }
    return null;
  }

  private async handleAddCommand(
    componentName: string,
    options: { yes: boolean; force: boolean }
  ) {
    const spinner = ora(`Looking for ${componentName}...`).start();

    try {
      // Try to fetch the component file
      let content;
      let componentPath;

      // Try prompts first
      try {
        content = await this.getGitHubFile(`prompts/base/${componentName}.ts`);
        componentPath = "prompts";
      } catch {
        // If not in prompts, try tools
        try {
          content = await this.getGitHubFile(`tools/${componentName}.ts`);
          componentPath = "tools";
        } catch {
          spinner.fail(chalk.red(`Component "${componentName}" not found`));
          return;
        }
      }

      // Extract template
      const template = this.extractTemplate(content);
      if (!template) {
        spinner.fail(chalk.red(`No template found in ${componentName}`));
        return;
      }

      spinner.succeed(`Found ${componentName}`);

      if (!options.yes) {
        const response = await prompts({
          type: "confirm",
          name: "proceed",
          message: `Add ${componentName} to your project?`,
          initial: true,
        });

        if (!response.proceed) {
          console.log(chalk.yellow("Operation cancelled"));
          return;
        }
      }

      // Create directory
      const targetDir = `ai/${componentPath}`;
      await mkdir(targetDir, { recursive: true });

      // Check if file exists
      const filePath = join(process.cwd(), targetDir, `${componentName}.ts`);
      try {
        await access(filePath, constants.F_OK);
        if (!options.force) {
          const response = await prompts({
            type: "confirm",
            name: "override",
            message: `${componentName}.ts already exists. Override?`,
            initial: false,
          });

          if (!response.override) {
            console.log(chalk.yellow("Operation cancelled"));
            return;
          }
        }
      } catch {
        /* File doesn't exist, continue */
      }

      // Write file
      await writeFile(filePath, template);
      spinner.succeed(
        chalk.green(
          `Added ${componentName} template to ${targetDir}/${componentName}.ts`
        )
      );
    } catch (error) {
      spinner.fail(chalk.red(`Failed to add ${componentName}`));
      console.error(error);
    }
  }

  private async handleListCommand() {
    const spinner = ora("Loading available components...").start();

    try {
      // Get prompts
      const prompts = [];
      try {
        const promptsResponse = await this.octokit.repos.getContent({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          path: `${REPO_PATH}/prompts/base`,
          ref: BRANCH,
        });

        if (Array.isArray(promptsResponse.data)) {
          for (const file of promptsResponse.data) {
            if (
              "name" in file &&
              file.type === "file" &&
              file.name.endsWith(".ts")
            ) {
              prompts.push(file.name.replace(".ts", ""));
            }
          }
        }
      } catch {
        /* No prompts directory */
      }

      // Get tools
      const tools = [];
      try {
        const toolsResponse = await this.octokit.repos.getContent({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          path: `${REPO_PATH}/tools`,
          ref: BRANCH,
        });

        if (Array.isArray(toolsResponse.data)) {
          for (const file of toolsResponse.data) {
            if (
              "name" in file &&
              file.type === "file" &&
              file.name.endsWith(".ts")
            ) {
              tools.push(file.name.replace(".ts", ""));
            }
          }
        }
      } catch {
        /* No tools directory */
      }

      spinner.succeed("Components loaded successfully");

      if (prompts.length === 0 && tools.length === 0) {
        console.log(chalk.yellow("\nNo components available"));
        return;
      }

      console.log("\nAvailable components:\n");

      if (prompts.length > 0) {
        console.log(chalk.blue.bold("Prompts:"));
        prompts.forEach((prompt) => {
          console.log(`  ${chalk.green(prompt)}`);
        });
      }

      if (tools.length > 0) {
        console.log(chalk.blue.bold("\nTools:"));
        tools.forEach((tool) => {
          console.log(`  ${chalk.green(tool)}`);
        });
      }
    } catch (error) {
      spinner.fail(chalk.red("Failed to load components"));
      console.error(error);
    }
  }

  private async handleInitCommand() {
    const spinner = ora("Initializing FatDuck...").start();

    try {
      // Create basic directory structure
      await mkdir("ai/prompts", { recursive: true });
      await mkdir("ai/tools", { recursive: true });

      spinner.succeed(chalk.green("FatDuck initialized successfully"));
      console.log("\nCreated directory structure:");
      console.log(
        chalk.cyan(`  ai/
  ├── prompts/
  └── tools/`)
      );
    } catch (error) {
      spinner.fail(chalk.red("Failed to initialize FatDuck"));
      console.error(error);
    }
  }

  public async parse(args: string[]) {
    return this.program.parse(args);
  }
}
