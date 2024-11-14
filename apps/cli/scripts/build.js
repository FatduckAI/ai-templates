import { execSync } from "child_process";
import fs from "fs/promises";
import path from "path";

async function buildCLI() {
  try {
    console.log("Starting build...");

    // Run bun build command
    execSync("bun build ./src/index.ts --outdir ./dist --target node", {
      stdio: "inherit",
    });

    console.log("Build completed, adding shebang...");

    // Add shebang to the output file
    const outputFile = path.join("./dist", "index.js");
    const content = await fs.readFile(outputFile, "utf8");
    await fs.writeFile(outputFile, `#!/usr/bin/env node\n${content}`);

    // Make it executable
    await fs.chmod(outputFile, 0o755);

    console.log("Build process completed successfully!");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

buildCLI();
