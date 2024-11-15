import { mkdir, rm } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";

export class TestSetup {
  private testDir: string;

  constructor() {
    // Create unique test directory name
    this.testDir = join(tmpdir(), `fatduck-test-${Date.now()}`);
  }

  async setup() {
    // Create test directory
    await mkdir(this.testDir, { recursive: true });
    process.chdir(this.testDir);
    return this.testDir;
  }

  async cleanup() {
    // Remove test directory and all contents
    await rm(this.testDir, { recursive: true, force: true });
  }

  getPath(...paths: string[]) {
    return join(this.testDir, ...paths);
  }
}
