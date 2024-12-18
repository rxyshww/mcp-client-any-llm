# MCP Client for Any LLM

A modern web client built with Next.js that allows you to interact with various LLM models using the Model Context Protocol (MCP). This client provides a clean and intuitive interface for chatting with different AI models while maintaining conversation context.

## Features

- 🤖 Support for multiple LLM providers (OpenAI, Google, etc.)
- 💬 Clean chat interface with markdown support
- 🌙 Dark/Light mode support
- 📝 Markdown rendering with syntax highlighting
- 💾 Local conversation history
- 🔄 Real-time streaming responses

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v18 or higher)
- pnpm (recommended) or npm

## Quick Start

1. Clone the repository:
```bash
git clone <your-repo-url>
cd mcp-client-any-llm
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure environment variables:
   Create a `.env.local` file in the root directory with the following variables:

   ```env
   # Required: OpenAI API Configuration
   OPENAI_API_KEY=your_openai_api_key
   OPENAI_API_BASE_URL=https://api.openai.com/v1  # Optional: Custom base URL if using a proxy
   OPENAI_API_MODEL=gpt-3.5-turbo  # Optional: Default model to use

   # Optional: Google AI Configuration
   GOOGLE_API_KEY=your_google_api_key
   GOOGLE_API_MODEL=gemini-pro  # Default Google AI model

   # Optional: Azure OpenAI Configuration
   AZURE_OPENAI_API_KEY=your_azure_openai_key
   AZURE_OPENAI_ENDPOINT=your_azure_endpoint
   AZURE_OPENAI_MODEL=your_azure_model_deployment_name

   # Optional: Anthropic Configuration
   ANTHROPIC_API_KEY=your_anthropic_key
   ANTHROPIC_API_MODEL=claude-2  # Default Anthropic model
   ```

   Note: Only the OpenAI configuration is required by default. Other providers are optional.

4. Start the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to start chatting!

## Environment Variables

### Required Variables
- `OPENAI_API_KEY`: Your OpenAI API key

### Optional Variables
- `OPENAI_API_BASE_URL`: Custom base URL for OpenAI API (useful for proxies)
- `OPENAI_API_MODEL`: Default OpenAI model to use
- `GOOGLE_API_KEY`: Google AI API key
- `GOOGLE_API_MODEL`: Default Google AI model
- `AZURE_OPENAI_API_KEY`: Azure OpenAI API key
- `AZURE_OPENAI_ENDPOINT`: Azure OpenAI endpoint URL
- `AZURE_OPENAI_MODEL`: Azure OpenAI model deployment name
- `ANTHROPIC_API_KEY`: Anthropic API key
- `ANTHROPIC_API_MODEL`: Default Anthropic model

## Technology Stack

- [Next.js 15](https://nextjs.org/) - React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - UI Components
- [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk) - MCP SDK
- [React Markdown](https://github.com/remarkjs/react-markdown) - Markdown Rendering

## Development

To run the development server:

```bash
pnpm dev
```

For production build:

```bash
pnpm build
pnpm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Add your license information here]
