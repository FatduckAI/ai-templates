export const TWEET_TEMPLATE = `
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
