import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

async function restoreWorkspaceVersion() {
  console.log("Running postpack script...");
  try {
    // Get the directory of the current script
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Construct absolute paths
    const packagePath = path.resolve(__dirname, "../package.json");
    const workspaceVersionPath = path.resolve(__dirname, ".workspace-version");

    const pkg = JSON.parse(await fs.readFile(packagePath, "utf8"));

    // Restore the workspace version
    const workspaceVersion = await fs.readFile(workspaceVersionPath, "utf8");
    console.log("Restoring workspace version:", workspaceVersion);

    pkg.dependencies["@fatduckai/core"] = workspaceVersion;

    await fs.writeFile(packagePath, JSON.stringify(pkg, null, 2));
    await fs.unlink(workspaceVersionPath);
    console.log("Postpack completed successfully");
  } catch (error) {
    console.error("Error in postpack script:", error);
    process.exit(1);
  }
}

restoreWorkspaceVersion();
