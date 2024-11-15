import { BaseAIItem, SpecializedPrompt } from "../types";
import { telegramBasePrompt } from "./base/telegram";
import { tweetBasePrompt } from "./base/tweet";
import { cryptoTweetPrompt } from "./specialized/crypto-tweet";

export const basePrompts: BaseAIItem[] = [
  tweetBasePrompt,
  telegramBasePrompt,
  // Add other base prompts here
];

export const specializedPrompts: SpecializedPrompt[] = [
  cryptoTweetPrompt,
  // Add other specialized prompts here
];

export function getPromptById(
  id: string
): BaseAIItem | SpecializedPrompt | undefined {
  return [...basePrompts, ...specializedPrompts].find((p) => p.id === id);
}
