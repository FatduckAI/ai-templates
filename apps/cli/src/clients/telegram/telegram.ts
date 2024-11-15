import { Telegraf } from "telegraf";
import { CallbackHandler } from "./handlers/callbackHandler";
import { CommandHandler } from "./handlers/commandHandler";
import { MessageHandler } from "./handlers/message-handler";

export interface TelegramConfig {
  token: string;
  allowGroups?: boolean;
  commands?: string[];
}

export class TelegramClient {
  private bot: Telegraf;
  private messageHandler: MessageHandler;
  private commandHandler: CommandHandler;
  private callbackHandler: CallbackHandler;

  constructor(config: TelegramConfig) {
    if (!config.token) {
      throw new Error("TELEGRAM_BOT_TOKEN is required");
    }

    this.bot = new Telegraf(config.token);
    this.messageHandler = new MessageHandler();
    this.commandHandler = new CommandHandler();
    this.callbackHandler = new CallbackHandler();

    this.setupMiddleware();
    this.setupHandlers();
  }

  private setupMiddleware() {
    // Log all updates
    this.bot.use(async (ctx, next) => {
      const start = Date.now();
      await next();
      const ms = Date.now() - start;
      console.log("Response time: %sms", ms);
    });
  }

  private setupHandlers() {
    // Handle messages
    this.bot.on("message", (ctx) => this.messageHandler.handle(ctx));

    // Handle commands
    this.bot.command("start", (ctx) => this.commandHandler.handleStart(ctx));
    this.bot.command("help", (ctx) => this.commandHandler.handleHelp(ctx));

    // Handle callback queries
    this.bot.on("callback_query", (ctx) => this.callbackHandler.handle(ctx));
  }

  public async start() {
    try {
      await this.bot.launch();
      console.log("🚀 Telegram bot started successfully");

      // Enable graceful shutdown
      process.once("SIGINT", () => this.stop("SIGINT"));
      process.once("SIGTERM", () => this.stop("SIGTERM"));
    } catch (error) {
      console.error("Failed to start Telegram bot:", error);
      throw error;
    }
  }

  public stop(signal?: string) {
    if (signal) {
      console.log('Received signal');
    }
    this.bot.stop();
  }
}
