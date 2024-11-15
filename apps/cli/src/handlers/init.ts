import chalk from "chalk";
import { mkdir, writeFile } from "fs/promises";
import ora, { Ora } from "ora";
import { join } from "path";
import { GitHubService } from "../services/github";
import { PackageManagerService } from "../services/package-manager";

export class InitHandler {
  constructor(
    private packageManager: PackageManagerService,
    private github: GitHubService
  ) {}

  async handle() {
    const spinner = ora({
      text: "Initializing FatDuck...",
      spinner: "dots",
    }).start();

    try {
      const pkgManager = await this.packageManager.detect();
      spinner.info(`Using ${pkgManager} as package manager`);

      await this.createDirectoryStructure();
      await this.packageManager.initializePackageJson(spinner, pkgManager);
      await this.createLogicIndex(spinner);

      spinner.succeed(chalk.green("FatDuck initialized successfully"));
      this.printDirectoryStructure();
    } catch (error) {
      spinner.fail(chalk.red("Failed to initialize FatDuck"));
      console.error(error);
    }
  }

  private async createDirectoryStructure() {
    await mkdir("ai/prompts", { recursive: true });
    await mkdir("ai/tools", { recursive: true });
    await mkdir("src/clients", { recursive: true });
    await mkdir("src/clients/logic", { recursive: true });
  }

  private async createLogicIndex(spinner: Ora) {
    try {
      const logicIndexContent = await this.github.getFile(
        "clients/logic/index.ts"
      );
      const logicIndexPath = join(process.cwd(), "src/clients/logic/index.ts");
      await writeFile(logicIndexPath, logicIndexContent);
    } catch (error) {
      spinner.warn("Could not fetch logic index template, using default");
      await writeFile(
        join(process.cwd(), "src/clients/logic/index.ts"),
        "export * from './messageHandler';\n// Export other handlers as they are added"
      );
    }
  }

  private printDirectoryStructure() {
    console.log("\nCreated directory structure:");
    console.log(
      chalk.cyan(`  ai/
  ├── prompts/
  └── tools/
  src/
  ├── clients/
  │   ├── logic/
  │   │   └── index.ts
  │   └── telegram/`)
    );
  }
}
