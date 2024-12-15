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
  description: "Get the weather in a location",
  parameters: z.object({
    location: z.string().describe("The location to get the weather for"),
  }),
  execute: async ({ location }) => {
    // Mock weather data for demonstration
    const temperature = 72 + Math.floor(Math.random() * 21) - 10;
    return {
      location,
      temperature,
      unit: "Fahrenheit",
      conditions: "Partly cloudy",
    };
  },
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log("Chat API Request:", messages);

    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages,
      tools: {
        weather: weatherTool,
      },
      maxSteps: 5, // Allow multiple steps for tool interaction
    });

    return result.toDataStreamResponse({
      getErrorMessage: (error) => {
        console.error("Tool execution error:", error);
        return "An error occurred while processing your request.";
      },
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
