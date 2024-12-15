import { createOpenAI } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { generateSystemPrompt } from "../../../lib/prompt";

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

// 读取MCP配置
const mcpConfig = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "claude_desktop_config.json"),
    "utf-8"
  )
);

const filesystemClient = new Client(
  {
    name: "filesystem-client",
    version: "1.0.0",
  },
  {
    capabilities: {},
  }
);

const postgresqlClient = new Client(
  {
    name: "postgresql-client",
    version: "1.0.0",
  },
  {
    capabilities: {},
  }
);

// 连接MCP服务器
await filesystemClient.connect(filesystemTransport);
await postgresqlClient.connect(postgresqlTransport);

// 定义文件系统工具
const filesystemTool = tool({
  name: "filesystem",
  description: "访问本地文件系统",
  parameters: z.object({
    path: z.string().describe("文件或目录路径"),
    operation: z.enum(["read", "write", "list"]).describe("操作类型"),
  }),
  execute: async ({ path: filePath, operation }) => {
    try {
      const result = await filesystemClient.request({
        method: "tools/call",
        params: {
          name: operation,
          arguments: { path: filePath },
        },
      });
      return result;
    } catch (error) {
      console.error("文件系统操作错误:", error);
      throw error;
    }
  },
});

// 定义数据库工具
const postgresqlTool = tool({
  name: "postgresql",
  description: "访问PostgreSQL数据库",
  parameters: z.object({
    query: z.string().describe("SQL查询语句"),
  }),
  execute: async ({ query }) => {
    try {
      const result = await postgresqlClient.request({
        method: "tools/call",
        params: {
          name: "query",
          arguments: { sql: query },
        },
      });
      return result;
    } catch (error) {
      console.error("数据库查询错误:", error);
      throw error;
    }
  },
});

// 在创建MCP客户端之后，添加以下代码
const allTools = {
  weather: {
    name: "weather",
    description: "获取指定位置的天气信息",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "要查询天气的位置",
        },
      },
    },
  },
  time: {
    name: "time",
    description: "获取指定时区的当前时间",
    parameters: {
      type: "object",
      properties: {
        timezone: {
          type: "string",
          description: "时区，默认为 UTC+8",
        },
      },
    },
  },
  filesystem: {
    name: "filesystem",
    description: "访问本地文件系统",
    parameters: {
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
    },
  },
  postgresql: {
    name: "postgresql",
    description: "访问PostgreSQL数据库",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "SQL查询语句",
        },
      },
    },
  },
};

// 生成系统提示
const systemPrompt = generateSystemPrompt(allTools);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log("Chat API Request:", messages);

    let currentToolCalls: any[] = [];

    // 在消息数组开头添加系统提示
    const messagesWithSystem = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    const result = streamText({
      model: openai("gpt-4"),
      messages: messagesWithSystem, // 使用包含系统提示的消息数组
      tools: {
        weather: weatherTool,
        time: timeTool,
        filesystem: filesystemTool,
        postgresql: postgresqlTool,
      },
      maxSteps: 3,
      onError: (error) => {
        console.error("Stream error:", error);
        currentToolCalls = [];
      },
      onComplete: () => {
        currentToolCalls = [];
      },
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
