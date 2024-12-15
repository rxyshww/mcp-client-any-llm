import { createOpenAI } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";

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

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log("Chat API Request:", messages);

    let currentToolCalls: any[] = [];

    const result = streamText({
      model: openai("gpt-4"),
      messages,
      tools: {
        weather: weatherTool,
        time: timeTool,
      },
      maxSteps: 3,
      onError: (error) => {
        console.error("Stream error:", error);
        currentToolCalls = []; // 重置工具调用列表
      },
      onComplete: () => {
        currentToolCalls = []; // 重置工具���用列表
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
