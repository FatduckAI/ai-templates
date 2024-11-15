import chalk from "chalk";
import { Command } from "commander";
import { readFileSync } from "fs";
import { resolve } from "path";
import { AddHandler } from "./handlers/add";
import { InitHandler } from "./handlers/init";
import { ListHandler } from "./handlers/list";
import { GitHubService } from "./services/github";
import { PackageManagerService } from "./services/package-manager";

export class FatDuckCLI {
  private program: Command;
  private packageManager: PackageManagerService;
  private github: GitHubService;

  constructor() {
    this.program = new Command()
      .name("fatduck")
      .description(
        chalk.cyan("🦆 Add AI prompts, tools, and clients to your project")
      )
      .version(this.getVersion());

    this.packageManager = new PackageManagerService();
    this.github = new GitHubService();

    this.setupCommands();
  }

  private getVersion(): string {
    const pkg = JSON.parse(
      readFileSync(resolve(__dirname, "../package.json"), "utf-8")
    );
    return pkg.version || "0.0.0";
  }

  private setupCommands() {
    this.program
      .command("init")
      .description("Initialize FatDuck in your project")
      .action(async () => {
        const handler = new InitHandler(this.packageManager, this.github);
        await handler.handle();
      });

    this.program
      .command("add <component>")
      .description("Add a prompt, tool, or client to your project")
      .option("-y, --yes", "Skip confirmation prompt", false)
      .option("-f, --force", "Override existing files", false)
      .action(async (componentName: string, options) => {
        const handler = new AddHandler(this.packageManager, this.github);
        await handler.handle(componentName, options);
      });

    this.program
      .command("list")
      .description("List all available components")
      .action(async () => {
        const handler = new ListHandler(this.github);
        await handler.handle();
      });
  }

  public async parse(args: string[]) {
    return this.program.parse(args);
  }
}
