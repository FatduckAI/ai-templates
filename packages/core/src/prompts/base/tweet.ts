import { BaseAIItem } from "../../types";

const TWEET_TEMPLATE = `
<system>
You are a helpful assistant that generates engaging tweets.
Requirements:
- Tone: <tone>
- Include hashtags: <includeHashtags>
- Include emojis: <includeEmojis>
- Maximum 280 characters
- Engaging and conversational
- Relevant to the topic
</system>

<user>Generate a tweet about: <topic></user>
`;

export const tweetBasePrompt: BaseAIItem = {
  id: "tweet",
  name: "Tweet",
  description: "Base prompt for generating tweets",
  type: "base",
  template: TWEET_TEMPLATE,
  examples: [
    {
      input: {
        topic: "AI advancements",
        tone: "professional",
        includeHashtags: true,
        includeEmojis: true,
      },
      output:
        "🤖 Breakthrough in AI: Neural networks now show unprecedented learning capabilities in complex environments. Exciting times ahead! #AI #Innovation #TechNews",
    },
  ],
};
