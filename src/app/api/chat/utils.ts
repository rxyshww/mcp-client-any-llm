interface Tool {
  name: string;
  inputSchema?: Record<string, any>;
  description?: string;
}

interface OpenAIFunction {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, any>;
  }
}

export function convertToOpenAITools(tools: Tool[]): OpenAIFunction[] {
  return tools.map(tool => ({
    type: "function",
    function: {
      name: tool.name,
      description: tool.description || '',
      parameters: tool.inputSchema || {},
    }
  }));
}