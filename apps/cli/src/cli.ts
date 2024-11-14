import chalk from "chalk";
import { Command } from "commander";
import { mkdir, writeFile } from "fs/promises";
import ora from "ora";
import { join } from "path";
import * as prompts from "prompts";
import { Registry } from "./types.js";
import { getGitHubFile } from "./utils/github.js";
import { generateRegistry } from "./utils/registry-generator.js";

export class FatDuckCLI {
  protected program: Command;
  protected registry: Registry = {};

  constructor() {
    this.program = new Command()
      .name("fatduck")
      .description("Add AI prompts and tools to your project")
      .version("0.0.1");

    this.setupCommands();
  }

  private setupCommands() {
    this.program
      .command("add <component>")
      .description("Add a prompt or tool to your project")
      .option("-y, --yes", "Skip confirmation prompt", false)
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

  private async handleAddCommand(
    componentName: string,
    options: { yes: boolean }
  ) {
    const spinner = ora(`Looking for ${componentName}...`).start();

    try {
      const component = this.registry[componentName];

      if (!component) {
        spinner.fail(chalk.red(`Component "${componentName}" not found`));
        return;
      }

      if (!options.yes) {
        const { proceed } = await prompts({
          type: "confirm",
          name: "proceed",
          message: `Add ${component.name} to your project?`,
          initial: true,
        });

        if (!proceed) {
          spinner.info("Operation cancelled");
          return;
        }
      }

      // Create directory
      const baseDir = component.type === "tool" ? "ai/tools" : "ai/prompts";
      await mkdir(baseDir, { recursive: true });

      // Fetch file content from GitHub
      const content = await getGitHubFile({
        path: component.file,
        organization: "fatduckai",
        repository: "ai-templates",
        branch: "main",
      });

      // Extract template
      const template = this.extractTemplate(content);

      // Write file
      const filePath = join(process.cwd(), baseDir, `${componentName}.ts`);
      await writeFile(filePath, template);

      spinner.succeed(
        chalk.green(`Added ${component.name} to ${baseDir}/${componentName}.ts`)
      );

      // If there are dependencies, suggest installing them
      if (component.dependencies?.length) {
        console.log("\nDependencies:");
        component.dependencies.forEach((dep) => {
          console.log(chalk.yellow(`fatduck add ${dep}`));
        });
      }
    } catch (error) {
      spinner.fail(chalk.red(`Failed to add ${componentName}`));
      console.error(error);
    }
  }

  private async handleListCommand() {
    console.log("\nAvailable components:\n");

    // List prompts
    console.log(chalk.blue.bold("Prompts:"));
    console.log(chalk.cyan("  Base:"));
    this.listComponents("prompt", "base");
    console.log(chalk.cyan("\n  Specialized:"));
    this.listComponents("prompt", "specialized");

    // List tools
    console.log(chalk.blue.bold("\nTools:"));
    this.listComponents("tool");
  }

  private listComponents(type: string, category?: string) {
    Object.entries(this.registry)
      .filter(([_, item]) => {
        if (category) {
          return item.type === type && item.category === category;
        }
        return item.type === type;
      })
      .forEach(([id, item]) => {
        console.log(`  ${chalk.green(id)} - ${item.name}`);
      });
  }

  private extractTemplate(content: string): string {
    const templateMatch = content.match(/const \w+_TEMPLATE = `([\s\S]*?)`/);
    return templateMatch ? templateMatch[1].trim() : content;
  }

  public async parse(args: string[]) {
    this.registry = await generateRegistry();
    return this.program.parse(args);
  }
}
