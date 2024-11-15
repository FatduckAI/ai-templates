import chalk from "chalk";
import { access, constants, mkdir, writeFile } from "fs/promises";
import ora, { Ora } from "ora";
import { dirname, join } from "path";
import prompts from "prompts";
import { GitHubService } from "../services/github";
import { PackageManagerService } from "../services/package-manager";

interface AddOptions {
  yes: boolean;
  force: boolean;
}

export class AddHandler {
  private readonly CLIENT_DEPENDENCIES: Record<string, Record<string, string>> =
    {
      telegram: { telegraf: "latest" },
      // Add other client dependencies here
    };

  constructor(
    private packageManager: PackageManagerService,
    private github: GitHubService
  ) {}

  async handle(componentName: string, options: AddOptions) {
    const spinner = ora({
      text: "Loading registry components...\n",
      spinner: "dots",
    }).start();

    try {
      const componentType = await this.github.getComponentType(componentName);

      if (!componentType) {
        spinner.fail(chalk.red(`Component "${componentName}" not found`));
        return;
      }

      if (componentType === "client") {
        const clientFiles = await this.getClientFiles(componentName);
        await this.addClient(componentName, clientFiles, options, spinner);
        return;
      }

      // Handle prompt or tool
      const content = await this.github.getFile(componentName);
      spinner.succeed(`Found ${componentName} as ${componentType}`);
      await this.handlePromptOrTool(
        componentName,
        content,
        componentType,
        options,
        spinner
      );
    } catch (error) {
      spinner.fail(chalk.red(`Failed to add ${componentName}`));
      console.error(error);
    }
  }

  private async handlePromptOrTool(
    componentName: string,
    content: string,
    type: "prompt" | "tool",
    options: AddOptions,
    spinner: Ora
  ) {
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

    const targetDir = `ai/${type}s`;
    await mkdir(targetDir, { recursive: true });
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

    await writeFile(filePath, content);
    spinner.succeed(chalk.green(`Added ${componentName} to ${filePath}`));
  }

  private async getClientFiles(
    clientName: string
  ): Promise<Array<{ path: string; content: string }>> {
    const clientFiles = [];
    try {
      // Get the client implementation
      const clientContent = await this.github.getFile(
        `clients/${clientName}/${clientName}.ts`
      );
      clientFiles.push({
        path: `${clientName}.ts`,
        content: clientContent,
      });

      // Get associated handlers and utilities
      try {
        const handlersDir = await this.github.listDirectory(
          `clients/${clientName}/handlers`
        );

        for (const file of handlersDir) {
          if (
            "name" in file &&
            file.type === "file" &&
            file.name.endsWith(".ts")
          ) {
            const handlerContent = await this.github.getFile(
              `clients/${clientName}/handlers/${file.name}`
            );
            clientFiles.push({
              path: `handlers/${file.name}`,
              content: handlerContent,
            });
          }
        }
      } catch {
        // No handlers directory or other error, continue
      }
      return clientFiles;
    } catch (error) {
      throw new Error(`Client ${clientName} not found`);
    }
  }

  private async addClient(
    clientName: string,
    files: Array<{ path: string; content: string }>,
    options: AddOptions,
    spinner: Ora
  ) {
    try {
      spinner.succeed(`Found ${clientName} client template`);

      if (!options.yes) {
        const response = await prompts({
          type: "confirm",
          name: "proceed",
          message: `Add ${clientName} client to your project?`,
          initial: true,
        });

        if (!response.proceed) {
          console.log(chalk.yellow("Operation cancelled"));
          return;
        }
      }

      // Detect package manager
      const packageManager = await this.packageManager.detect();
      spinner.info(`Using ${packageManager} as package manager`);

      // Create client directory
      const clientDir = join(process.cwd(), "src/clients", clientName);
      await mkdir(clientDir, { recursive: true });
      await mkdir(join(clientDir, "handlers"), { recursive: true });

      // Write all files
      for (const file of files) {
        const filePath = join(clientDir, file.path);

        try {
          await access(filePath, constants.F_OK);
          if (!options.force) {
            const response = await prompts({
              type: "confirm",
              name: "override",
              message: `${filePath} already exists. Override?`,
              initial: false,
            });

            if (!response.override) {
              console.log(chalk.yellow(`Skipping ${filePath}`));
              continue;
            }
          }
        } catch {
          /* File doesn't exist, continue */
        }

        await mkdir(dirname(filePath), { recursive: true });
        await writeFile(filePath, file.content);
        spinner.succeed(chalk.green(`Added ${filePath}`));
      }

      // Install dependencies
      if (this.CLIENT_DEPENDENCIES[clientName]) {
        try {
          await this.packageManager.installDependencies(
            spinner,
            packageManager,
            this.CLIENT_DEPENDENCIES[clientName]
          );

          console.log(chalk.green(`\n${clientName} client added successfully`));

          // Show post-installation instructions
          if (clientName === "telegram") {
            console.log(chalk.yellow("\nDon't forget to:"));
            console.log("1. Set up your environment variables:");
            console.log(chalk.cyan("  TELEGRAM_BOT_TOKEN=your_bot_token_here"));
          }
        } catch (error) {
          spinner.fail("Failed to update dependencies");
          console.error(error);
        }
      }
    } catch (error) {
      spinner.fail(chalk.red(`Failed to add ${clientName} client`));
      console.error(error);
    }
  }
}
