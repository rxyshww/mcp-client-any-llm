import { createOpenAI } from "@ai-sdk/openai";
import { ChatOpenAI } from "@langchain/openai";
import { streamText, tool, createDataStreamResponse, jsonSchema } from "ai";
import { z } from "zod";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { generateSystemPrompt } from "../../../lib/prompt";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { convertToOpenAITools } from "./utils";
import { LangChainAdapter } from "ai";
import {
  ListResourcesResultSchema,
  CallToolResultSchema,
} from "@modelcontextprotocol/sdk/types";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE,
});

// Define weather tool
const weatherTool = tool({
  name: "weather",
  description: "获取指定位置的天气信息",
  parameters: z.object({
    location: z.string().describe("要查询天气的位置"),
  }),
  execute: async ({ location }) => {
    // Mock weather data for demonstration
    const temperature = 72 + Math.floor(Math.random() * 21) - 10;
    const result = {
      location,
      temperature,
      unit: "Fahrenheit",
      conditions: "晴朗",
    };
    console.log("Weather tool result:", result);
    return result;
  },
});

// Define time tool
const timeTool = tool({
  name: "time",
  description: "获取指定时区的当前时间",
  parameters: z.object({
    timezone: z.string().optional().describe("时区，默认为 UTC+8"),
  }),
  execute: async ({ timezone = "Asia/Shanghai" }) => {
    const result = {
      timezone,
      time: new Date().toLocaleString("zh-CN", { timeZone: timezone }),
    };
    console.log("Time tool result:", result);
    return result;
  },
});

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
  console.log("responseContent", responseContent);
  // 如果响应内容是数组
  if (Array.isArray(responseContent)) {
    return responseContent
      .filter((item) => item?.type === "text")
      .map((item) => item?.text || "No content")
      .join("\n");
  }
  // 如果不是数组，转换为字符串
  return JSON.stringify(responseContent);
}

const allTools2 = [...tools, ...tools2].reduce((acc, cur) => {
  const key = cur?.name;
  if (key) {
    acc[key] = {
      description: cur?.description,
      parameters: jsonSchema(cur?.inputSchema),
      execute: async (params) => {
        const curClient = toolClientMap[key];
        console.log("curClient", curClient, params, key);
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
          throw new Error(
            (result?.content?.[0]?.text as string) || "Tool execution failed"
          );
        }
        return formatToolResponse(result.content);
      },
    };
  }
  return acc;
}, {} as any);

// const allTools2 = convertToOpenAITools([...tools, ...tools2]);

console.log("allTools2", allTools2);

// 在创建MCP客户端之后，添加以下代码
const allTools = {
  weather: {
    description: "获取指定位置的天气信息",
    parameters: jsonSchema({
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "要查询天气的位置",
        },
      },
    }),
    execute: async (params) => {
      console.log("Executing weather tool", params);
      return `${params.location}天气: 72°F, 晴朗`;
    },
  },
  time: {
    description: "获取指定时区的当前时间",
    parameters: jsonSchema({
      type: "object",
      properties: {
        timezone: {
          type: "string",
          description: "时区，默认为 UTC+8",
        },
      },
    }),
    execute: async (params) => {
      console.log("Executing weather tool", params);
      return `${params.location}天气: 72°F, 晴朗`;
    },
  },
  filesystem: {
    description: "访问本地文件系统",
    parameters: jsonSchema({
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "文件或目录路径",
        },
        operation: {
          type: "string",
          enum: ["read", "write", "list"],
          description: "操作类型",
        },
      },
    }),
    execute: async (params) => {
      console.log("Executing weather tool", params);
      return `${params.location}天气: 72°F, 晴朗`;
    },
  },
  postgresql: {
    description: "访问PostgreSQL数据库",
    parameters: jsonSchema({
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "SQL查询语句",
        },
      },
    }),
    execute: async (params) => {
      console.log("Executing weather tool", params);
      return `${params.location}天气: 72°F, 晴朗`;
    },
  },
};

// 生成系统提示
const systemPrompt = generateSystemPrompt(allTools);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log("Chat API Request:", messages);

    // 在消息数组开头添加系统提示
    const messagesWithSystem = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    // const model = new ChatOpenAI({
    //   model: "gpt-4o-mini",
    //   temperature: 0,
    //   configuration: {
    //     baseURL: process.env.OPENAI_API_BASE,
    //   },
    // }).bindTools(allTools2);

    // // const result = await model.invoke(messagesWithSystem);
    // // console.log("Chat API Response:", result);

    // const stream = await model.stream(messagesWithSystem);

    // const response = createDataStreamResponse({
    //   status: 200,
    //   statusText: "OK",
    //   headers: {
    //     "Custom-Header": "value",
    //   },
    //   async execute(dataStream) {
    //     for await (const chunk of stream) {
    //       console.log("Stream chunk:", chunk.content);
    //       dataStream.writeData(chunk.content);
    //     }
    //   },
    //   onError: (error) => `Custom error: ${error.message}`,
    // });

    // return response;

    // for await (const chunk of stream) {
    //   console.log("Stream chunk:", chunk);
    // }

    // return LangChainAdapter.toDataStreamResponse(stream);

    console.log("allTools2", allTools2);

    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: messagesWithSystem, // 使用包含系统提示的消息数组
      tools: allTools2,
      maxSteps: 3,
    });

    return result.toDataStreamResponse({
      getErrorMessage: (error) => {
        console.error("工具执行错误:", error);
        return "处理请求时发生错误。";
      },
    });
  } catch (error) {
    console.error("Chat API 错误:", error);
    return new Response(JSON.stringify({ error: "处理聊天请求失败" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
