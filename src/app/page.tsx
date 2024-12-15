import { ChatHistory } from "@/components/chat-history"
import { ChatLayout } from "@/components/chat-layout"
import { ExampleButtons } from "@/components/example-buttons"
import { HomeChatInput } from "@/components/home-chat-input"
import Link from "next/link"

export default function Home() {
  return (
    <ChatLayout sidebar={<ChatHistory />}>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-2xl w-full space-y-8">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Welcome to AI Chat Assistant</h1>
              <p className="text-muted-foreground">
                Your intelligent coding companion. Ask questions, get explanations,
                and receive help with your code.
              </p>
            </div>
            <ExampleButtons />
          </div>
        </div>
        <HomeChatInput />
      </div>
    </ChatLayout>
  )
}
