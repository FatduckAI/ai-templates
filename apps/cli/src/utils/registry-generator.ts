import { readFile } from "fs/promises";
import * as glob from "glob";
import { join } from "path";
import { Registry } from "../types.js";

export async function generateRegistry(): Promise<Registry> {
  const registry: Registry = {};
  const corePackagePath = "../../packages/core/src";

  // Scan prompts
  const promptFiles = await glob.sync("prompts/**/*.ts", {
    cwd: join(__dirname, corePackagePath),
  });

  for (const file of promptFiles) {
    const content = await readFile(
      join(__dirname, corePackagePath, file),
      "utf-8"
    );
    const id = file.split("/").pop()?.replace(".ts", "");

    if (!id) continue;

    registry[id] = {
      name: extractName(content),
      file: `packages/core/src/${file}`,
      type: "prompt",
      category: file.includes("/base/") ? "base" : "specialized",
      dependencies: extractDependencies(content),
    };
  }

  // Scan tools
  const toolFiles = await glob.sync("tools/**/*.ts", {
    cwd: join(__dirname, corePackagePath),
  });

  for (const file of toolFiles) {
    const content = await readFile(
      join(__dirname, corePackagePath, file),
      "utf-8"
    );
    const id = file.split("/").pop()?.replace(".ts", "");

    if (!id) continue;

    registry[id] = {
      name: extractName(content),
      file: `packages/core/src/${file}`,
      type: "tool",
      dependencies: extractDependencies(content),
    };
  }

  return registry;
}

function extractName(content: string): string {
  const nameMatch = content.match(/name: ["'](.+?)["']/);
  return nameMatch ? nameMatch[1] : "";
}

function extractDependencies(content: string): string[] {
  const depsMatch = content.match(/dependencies:\s*\[(.*?)\]/s);
  if (!depsMatch) return [];

  return depsMatch[1]
    .split(",")
    .map((dep) => dep.trim())
    .filter(Boolean);
}
