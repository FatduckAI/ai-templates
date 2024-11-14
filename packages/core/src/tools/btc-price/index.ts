import { z } from "zod";
import { type Tool } from "../../types";

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
    // Implementation remains the same
    return {
      price: "42500.00",
      currency: config.currency,
      timestamp: new Date().toISOString(),
    };
  },
  examples: [
    {
      config: {
        currency: "USD",
        precision: 2,
      },
      result: {
        price: "42500.00",
        currency: "USD",
        timestamp: new Date().toISOString(),
      },
    },
  ],
};
