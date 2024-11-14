import fs from "fs/promises";

async function updateDependencyVersion() {
  const packagePath = "./package.json";
  const pkg = JSON.parse(await fs.readFile(packagePath, "utf8"));

  // Store the original version
  await fs.writeFile(
    "./scripts/.workspace-version",
    pkg.dependencies["@fatduckai/core"]
  );

  // Update to the actual version for publishing
  const corePkgPath = "../core/package.json";
  const corePkg = JSON.parse(await fs.readFile(corePkgPath, "utf8"));
  pkg.dependencies["@fatduckai/core"] = corePkg.version;

  await fs.writeFile(packagePath, JSON.stringify(pkg, null, 2));
}

updateDependencyVersion();
