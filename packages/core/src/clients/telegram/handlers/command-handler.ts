export const COMMAND_HANDLER = `import { Context } from "telegraf";

export class CommandHandler {
  async handleStart(ctx: Context) {
    try {
      await ctx.reply(
        'Welcome! 👋\n\n' +
        'I am your Telegram bot. Here are some things I can do:\n\n' +
        '/help - Show available commands\n' +
        'You can also send me any message to get started!'
      );
    } catch (error) {
      console.error('Error handling start command:', error);
      await ctx.reply('Sorry, there was an error processing your command.');
    }
  }

  async handleHelp(ctx: Context) {
    try {
      await ctx.reply(
        'Available commands:\n\n' +
        '/start - Start the bot\n' +
        '/help - Show this help message\n\n' +
        'You can also send me any message to get started!'
      );
    } catch (error) {
      console.error('Error handling help command:', error);
      await ctx.reply('Sorry, there was an error processing your command.');
    }
  }
}`;
