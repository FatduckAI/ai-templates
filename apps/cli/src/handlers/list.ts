import chalk from "chalk";
import ora from "ora";
import { GitHubService } from "../services/github";

export class ListHandler {
  constructor(private github: GitHubService) {}

  async handle() {
    const spinner = ora({
      text: "Loading components...",
      spinner: "dots",
    }).start();

    try {
      // Get all components
      const prompts = await this.github.listDirectory("prompts");
      const tools = await this.github.listDirectory("tools");
      const clients = await this.github.listDirectory("clients");

      spinner.succeed("Components loaded successfully");

      if (!prompts.length && !tools.length && !clients.length) {
        console.log(chalk.yellow("\nNo components available"));
        return;
      }

      console.log("\nAvailable components:\n");

      if (prompts.length) {
        console.log(chalk.blue.bold("Prompts:"));
        prompts.forEach((prompt) => {
          const label = prompt.category ? ` (${prompt.category})` : "";
          console.log(`  ${chalk.green(prompt.name)}${chalk.dim(label)}`);
        });
      }

      if (tools.length) {
        console.log(chalk.blue.bold("\nTools:"));
        tools.forEach((tool) => {
          console.log(`  ${chalk.green(tool.name)}`);
        });
      }

      if (clients.length) {
        console.log(chalk.blue.bold("\nClients:"));
        clients.forEach((client) => {
          console.log(`  ${chalk.green(client.name)}`);
        });
        console.log(
          chalk.dim("\nAdd a client with:"),
          chalk.cyan("npx fatduck add <client-name>")
        );
      }
    } catch (error) {
      spinner.fail(`Failed to load components: ${(error as Error).message}`);
    }
  }
}
