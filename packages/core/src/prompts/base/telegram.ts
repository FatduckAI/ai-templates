import { BaseAIItem } from "../../types";

const TELEGRAM_TEMPLATE = `
<system>
Goal: To answer questions and provide helpful information to the user.

Personality: 
<personality>

Style:
<style>

Guidelines:
- Tone of reply: <tone>
- Generate a single reply. No hashtags, or quotes. 
- Be original and do not write something that you have said before
- Do not add commentary, just write the reply
- Keep responses concise (200 characters)
- Stick to your personality and do not break character
- Avoid using emotive actions or descriptions of physical gestures


</system>
<user>You're replying to this message with your signature style: <message>

</user>
`;

export const telegramBasePrompt: BaseAIItem = {
  id: "telegram-prompt",
  name: "Telegram Prompt",
  description: "Base prompt for generating telegram messages",
  type: "base",
  template: TELEGRAM_TEMPLATE,
};
