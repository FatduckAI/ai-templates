import { z } from "zod";
import { Client } from "../../types";
import { TELEGRAM_CLIENT } from "./telegram";

export const telegramClient: Client = {
  id: "telegram",
  name: "Telegram",
  type: "client",
  description: "Send messages to Telegram",
  category: "chat",
  configSchema: z.object({
    token: z.string(),
    chatId: z.string(),
  }),
  handler: async ({ config }) => {
    //const client = new TelegramClient(config);
    //return client;
  },
  source: TELEGRAM_CLIENT,
};
