import { beforeEach, describe, expect, mock, test } from "bun:test";
import { FatDuckCLI } from "./cli.js";

// Mock fs operations
mock.module("fs/promises", () => ({
  mkdir: () => Promise.resolve(),
  writeFile: () => Promise.resolve(),
}));

// Mock core package functions
mock.module("@fatduckai/core", () => ({
  getPromptById: (id: string) =>
    id === "test-prompt"
      ? {
          id: "test-prompt",
          name: "Test Prompt",
          type: "base",
          template: "test template",
        }
      : null,
  getToolById: (id: string) =>
    id === "test-tool"
      ? {
          id: "test-tool",
          name: "Test Tool",
          type: "tool",
          handler: () => Promise.resolve({}),
        }
      : null,
}));

// Mock prompts
mock.module("prompts", () => () => Promise.resolve({ proceed: true }));

describe("FatDuckCLI", () => {
  let cli: FatDuckCLI;

  beforeEach(() => {
    cli = new FatDuckCLI();
  });

  test("should add a prompt successfully", async () => {
    const result = await cli.parse([
      "node",
      "fatduck",
      "add",
      "test-prompt",
      "-y",
    ]);
    expect(result).toBeTruthy();
  });

  test("should add a tool successfully", async () => {
    const result = await cli.parse([
      "node",
      "fatduck",
      "add",
      "test-tool",
      "-y",
    ]);
    expect(result).toBeTruthy();
  });

  test("should handle component not found", async () => {
    const result = await cli.parse([
      "node",
      "fatduck",
      "add",
      "nonexistent",
      "-y",
    ]);
    expect(result).toBeTruthy();
  });
});
