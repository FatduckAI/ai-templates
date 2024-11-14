# @fatduckai/cli

Command-line interface for managing AI prompts and tools in your FatDuck AI projects.

## 🚀 Quick Start

## 📦 Installation

### Global Installation

```bash
# Using npm
npm install -g @fatduckai/cli

# Using bun
bun install -g @fatduckai/cli

# Now you can use the CLI directly
fatduckai add tweet
```

### Local Installation

```bash
# Using npm
npm install --save-dev @fatduckai/cli

# Using bun
bun add -d @fatduckai/cli
```

## 🛠️ Commands

### `add <component>`

Add a prompt or tool to your project.

```bash
fatduckai add tweet              # Add the tweet prompt
fatduckai add btc-price         # Add the Bitcoin price tool
fatduckai add tweet --yes       # Skip confirmation prompt
```

The command will:

1. Create the appropriate directory structure (`ai/prompts` or `ai/tools`)
2. Generate a TypeScript file with the component configuration
3. Show usage instructions

### Help

```bash
# Show general help
fatduckai --help

# Show help for a specific command
fatduckai add --help
```

## 📁 Project Structure

When you add components, they are organized in the following structure:

```
your-project/
├── ai/
│   ├── prompts/
│   │   └── tweet.ts
│   └── tools/
│       └── btc-price.ts
```

## 🧪 Development

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/fatduckai
cd packages/cli

# Install dependencies
bun install
```

### Build

```bash
# Build the project
bun run build
```

### Testing

```bash
# Run unit tests
bun test

# Run manual test script
bun run test/manual-test.ts
```

### Development Mode

```bash
# Run CLI in development mode
bun run dev add tweet
```

## 📝 Example Usage

### Adding and Using a Prompt

1. Add the tweet prompt to your project:

```bash
fatduckai add tweet
```

2. Use the prompt in your code:

```typescript
import { tweet } from "./ai/prompts/tweet";

// Use the prompt with your AI service
const result = await ai.generate(tweet.template, {
  topic: "AI advancements",
  tone: "professional",
  includeHashtags: true,
  includeEmojis: true,
});
```

### Adding and Using a Tool

1. Add the Bitcoin price tool:

```bash
fatduckai add btc-price
```

2. Use the tool in your code:

```typescript
import { btcPrice } from "./ai/tools/btc-price";

const price = await btcPrice.handler({
  config: {
    currency: "USD",
    precision: 2,
  },
});
```

## 🔧 Configuration

The CLI will respect any `.fatduckrc` or `fatduck.config.js` file in your project root. Example configuration:

```json
{
  "outputDir": "custom/path",
  "typescript": true
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
