export const MESSAGE_HANDLER = `import { Context } from "telegraf";

export class MessageHandler {
  async handle(ctx: Context) {
    try {
      // Skip handling if it's not a text message
      if (!ctx.message || !('text' in ctx.message)) {
        return;
      }

      const message = ctx.message.text;
      
      // Basic echo response for now
      await ctx.reply('Received your message');
      
    } catch (error) {
      console.error('Error handling message:', error);
      await ctx.reply('Sorry, there was an error processing your message.');
    }
  }
}`;
