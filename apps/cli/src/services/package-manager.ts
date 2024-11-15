import { exec } from "child_process";
import { access, constants } from "fs/promises";
import { Ora } from "ora";
import { join } from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

export class PackageManagerService {
  async detect(): Promise<"bun" | "npm"> {
    try {
      await execAsync("bun -v");
      return "bun";
    } catch {
      return "npm";
    }
  }

  async initializePackageJson(spinner: Ora, packageManager: "bun" | "npm") {
    const packageJsonPath = join(process.cwd(), "package.json");
    try {
      await access(packageJsonPath, constants.F_OK);
      spinner.info("Found existing package.json");
    } catch {
      spinner.info(`Initializing package.json with ${packageManager}`);
      await execAsync(`${packageManager} init -y`);
    }
  }

  async installDependencies(
    spinner: Ora,
    packageManager: "bun" | "npm",
    dependencies: Record<string, string>
  ) {
    const depsArray = Object.entries(dependencies).map(
      ([name, version]) => `${name}@${version}`
    );
    const installCommand = packageManager === "bun" ? "bun add" : "npm install";

    spinner.start(`Installing dependencies with ${packageManager}`);
    try {
      await execAsync(`${installCommand} ${depsArray.join(" ")}`);
      spinner.succeed("Installed dependencies");
    } catch (error) {
      spinner.fail(`Failed to install dependencies with ${packageManager}`);
      throw error;
    }
  }
}
