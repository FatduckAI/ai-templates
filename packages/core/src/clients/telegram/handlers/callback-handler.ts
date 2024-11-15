export const CALLBACK_HANDLER_TEMPLATE = `import { Context } from "telegraf";

export class CallbackHandler {
  async handle(ctx: Context) {
    try {
      if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) {
        return;
      }

      const data = ctx.callbackQuery.data;
      
      // Handle different callback data
      switch (data) {
        case 'example_callback':
          await ctx.reply('You clicked an example callback!');
          break;
          
        default:
          await ctx.reply('Unknown callback action');
      }

      // Answer the callback query to remove loading state
      await ctx.answerCbQuery();
      
    } catch (error) {
      console.error('Error handling callback:', error);
      await ctx.answerCbQuery('Error processing callback');
    }
  }
}`;
