import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

async function updateDependencyVersion() {
  console.log("Running prepack script...");
  try {
    // Get the directory of the current script
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Construct absolute paths
    const packagePath = path.resolve(__dirname, "../package.json");
    console.log("CLI package.json path:", packagePath);

    const pkg = JSON.parse(await fs.readFile(packagePath, "utf8"));
    console.log(
      "Current @fatduckai/core version:",
      pkg.dependencies["@fatduckai/core"]
    );

    // Store the original version
    const workspaceVersionPath = path.resolve(__dirname, ".workspace-version");
    await fs.writeFile(
      workspaceVersionPath,
      pkg.dependencies["@fatduckai/core"]
    );

    // Try multiple possible locations for the core package.json
    const possibleCorePaths = [
      path.resolve(__dirname, "../../core/package.json"),
      path.resolve(__dirname, "../../../packages/core/package.json"),
      path.resolve(__dirname, "../../../core/package.json"),
      path.resolve(process.cwd(), "../core/package.json"),
      path.resolve(process.cwd(), "../../packages/core/package.json"),
    ];

    let corePkg;
    let foundCorePath;

    for (const corePath of possibleCorePaths) {
      try {
        console.log("Trying core package.json path:", corePath);
        const contents = await fs.readFile(corePath, "utf8");
        corePkg = JSON.parse(contents);
        foundCorePath = corePath;
        break;
      } catch (err) {
        console.log(`Not found at ${corePath}`);
        continue;
      }
    }

    if (!corePkg) {
      throw new Error(
        "Could not find core package.json in any expected location"
      );
    }

    console.log("Found core package.json at:", foundCorePath);

    // Update to the actual version for publishing
    pkg.dependencies["@fatduckai/core"] = corePkg.version;
    console.log(
      "Updated @fatduckai/core version:",
      pkg.dependencies["@fatduckai/core"]
    );

    await fs.writeFile(packagePath, JSON.stringify(pkg, null, 2));
    console.log("Prepack completed successfully");
  } catch (error) {
    console.error("Error in prepack script:", error);
    process.exit(1);
  }
}

updateDependencyVersion();
