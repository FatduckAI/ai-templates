import { z } from "zod";
import { type Tool } from "../../types";
import { btcPriceToolSource, fetchBTCPriceData } from "./btc-price";

export const btcPriceTool: Tool = {
  id: "btc-price",
  type: "tool", // Added missing type property
  name: "Bitcoin Price",
  description: "Get current Bitcoin price",
  category: "crypto",
  configSchema: z.object({
    currency: z.enum(["USD", "EUR", "GBP"]).default("USD"),
    precision: z.number().min(0).max(2).default(2),
  }),
  outputSchema: z.object({
    price: z.string(),
    currency: z.enum(["USD", "EUR", "GBP"]),
    timestamp: z.string(),
  }),
  handler: async ({ config }) => {
    const { currentPrice } = await fetchBTCPriceData();
    return {
      price: currentPrice.toFixed(config.precision as number),
      currency: config.currency,
      timestamp: new Date().toISOString(),
    };
  },
  source: btcPriceToolSource,
};
