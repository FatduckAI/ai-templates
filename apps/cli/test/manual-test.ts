import { FatDuckCLI } from "../src/cli";
import { TestSetup } from "./helper";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runTests() {
  const cli = new FatDuckCLI();
  const testSetup = new TestSetup();
  const testDir = await testSetup.setup();

  console.log("\n📁 Created test directory:", testDir);

  try {
    // Initialize first
    console.log("\n🧪 Testing init command...");
    await cli.parse(["node", "fatduck", "init"]);
    await sleep(500);

    // Add prompt
    /* console.log("\n🧪 Testing prompt addition...");
    process.stdout.write("\n"); // Add newline before spinner
    await cli.parse(["node", "fatduck", "add", "tweet", "-y"]);
    await sleep(500); */

    // Add tool
    console.log("\n🧪 Testing tool addition...");
    process.stdout.write("\n"); // Add newline before spinner
    await cli.parse(["node", "fatduck", "add", "btc-price", "-y"]);
    await sleep(500);

    // Add client
    /* console.log("\n🧪 Testing client addition...");
    process.stdout.write("\n"); // Add newline before spinner
    await cli.parse(["node", "fatduck", "add", "telegram", "-y"]);
    await sleep(500); */

    // List components
    console.log("\n🧪 Testing list command...");
    process.stdout.write("\n"); // Add newline before spinner
    await cli.parse(["node", "fatduck", "list"]);
    await sleep(500); // Wait for list output to complete
    /*
    console.log("\n✨ All tests completed successfully!");
    console.log("\n📁 Test files are in:", testDir);
    console.log("To clean up run:");
    console.log(`rm -rf "${testDir}"`); */
  } catch (error) {
    console.error("\n❌ Test failed:", error);
    process.exit(1);
  }
}

console.log("🚀 Starting manual CLI tests...");
runTests().catch(console.error);
