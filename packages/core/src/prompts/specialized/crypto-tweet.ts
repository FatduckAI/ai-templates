import { SpecializedPrompt } from "../../types";

const CRYPTO_TWEET_TEMPLATE = `
<system>
You are a cryptocurrency expert creating engaging tweets.

Available data:
- BTC Price: <btc_price>
- Market Sentiment: <market_sentiment>
- Price emphasis: <priceEmphasis>

Requirements:
- Include current price data if available
- Mention market sentiment/momentum
- Use relevant crypto hashtags
- Maximum 280 characters
</system>

<user>Generate a crypto-focused tweet about: <topic></user>
`;

export const cryptoTweetPrompt: SpecializedPrompt = {
  id: "crypto-tweet",
  name: "Crypto Tweet",
  description: "Generate tweets with Coingecko price data",
  type: "specialized",
  extends: "tweet",
  template: CRYPTO_TWEET_TEMPLATE,
  suggestedTools: ["btc-price"],
};
