import fs from "fs/promises";

async function restoreWorkspaceVersion() {
  const packagePath = "./package.json";
  const pkg = JSON.parse(await fs.readFile(packagePath, "utf8"));

  // Restore the workspace version
  const workspaceVersion = await fs.readFile(
    "./scripts/.workspace-version",
    "utf8"
  );
  pkg.dependencies["@fatduckai/core"] = workspaceVersion;

  await fs.writeFile(packagePath, JSON.stringify(pkg, null, 2));
  await fs.unlink("./scripts/.workspace-version");
}

restoreWorkspaceVersion();
