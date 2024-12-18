import { createOpenAI } from "@ai-sdk/openai";
import { streamText, jsonSchema } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { generateSystemPrompt } from "../../../lib/prompt";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { CallToolResultSchema } from "@modelcontextprotocol/sdk/types.js";

export const maxDuration = 30;

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  baseURL: process.env.OPENAI_API_BASE,
});

// const google = createGoogleGenerativeAI({
//   apiKey: process.env.GOOGLE_API_KEY || "",
//   baseURL: process.env.GOOGLE_API_BASE,
// });

const client = new Client(
  {
    name: "example-client",
    version: "1.0.0",
  },
  {
    capabilities: {},
  }
);

const client2 = new Client(
  {
    name: "example-client2",
    version: "1.0.0",
  },
  {
    capabilities: {},
  }
);

const transport = new StdioClientTransport({
  command: "npx",
  args: ["@modelcontextprotocol/server-puppeteer"],
});

const transport2 = new StdioClientTransport({
  command: "uvx",
  args: ["mcp-server-git"],
});

await client.connect(transport);
const { tools } = await client.listTools();

await client2.connect(transport2);
const { tools: tools2 } = await client2.listTools();

const toolClientMap: any = {};

for (const tool of tools) {
  toolClientMap[tool.name] = client;
}

for (const tool of tools2) {
  toolClientMap[tool.name] = client2;
}

function formatToolResponse(responseContent: any): string {
  if (Array.isArray(responseContent)) {
    return responseContent
      .filter((item) => item?.type === "text")
      .map((item) => item?.text || "No content")
      .join("\n");
  }
  return JSON.stringify(responseContent);
}

const allTools = [...tools, ...tools2].reduce((acc, cur) => {
  const key = cur?.name;
  if (key) {
    acc[key] = {
      description: cur?.description,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      parameters: jsonSchema(cur?.inputSchema),
      execute: async (params: Record<string, unknown>) => {
        const curClient = toolClientMap[key];
        console.log("curClient", curClient, key);
        const result = await curClient.request(
          {
            method: "tools/call",
            params: {
              name: key,
              arguments: params,
            },
          },
          CallToolResultSchema
        );

        if (result.isError) {
          // throw new Error(
          //   (result?.content?.[0]?.text as string) || "Tool execution failed"
          // );

          return `当前工具调用错误，错误信息：${result?.content?.[0]?.text}`;
        }
        console.log("result", result);

        return formatToolResponse(result.content);
      },
    };
  }
  return acc;
}, {} as Record<string, any>);

const systemPrompt = generateSystemPrompt(allTools);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const messagesWithSystem = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      // model: google("gemini-2.0-flash-exp"),
      messages: messagesWithSystem,
      tools: allTools,
      maxSteps: 8,
    });
    return result.toDataStreamResponse({
      getErrorMessage(error) {
        console.error("Chat API 错误:", error);
        console.log(
          "requestBodyValues",
          JSON.stringify(
            error?.requestBodyValues.tools?.functionDeclarations,
            null,
            2
          )
        );
        return error?.message;
      },
    });
  } catch (error: any) {
    console.error("Chat API 错误:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
