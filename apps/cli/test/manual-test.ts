import { FatDuckCLI } from "../src/cli";

async function runTests() {
  const cli = new FatDuckCLI();

  console.log("\n🧪 Testing prompt addition:");
  await cli.parse(["node", "fatduck", "add", "tweet", "-y"]);

  console.log("\n🧪 Testing tool addition:");
  await cli.parse(["node", "fatduck", "add", "btc-price", "-y"]);

  console.log("\n🧪 Testing nonexistent component:");
  await cli.parse(["node", "fatduck", "add", "nonexistent", "-y"]);

  console.log("\n🧪 Testing help command:");
  await cli.parse(["node", "fatduck", "--help"]);
}

console.log("🚀 Starting manual CLI tests...");
runTests()
  .then(() => {
    console.log("\n✅ Manual tests completed");
  })
  .catch((error) => {
    console.error("\n❌ Test failed:", error);
  });
