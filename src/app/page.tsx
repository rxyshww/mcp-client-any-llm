import { ChatHistory } from "@/components/chat-history"
import { ChatLayout } from "@/components/chat-layout"
import { Button } from "@/components/ui/button"
import { Bot, MessageSquare, Sparkles } from "lucide-react"
import Link from "next/link"

const examples = [
  {
    title: "Explain quantum computing",
    description: "Learn about quantum computing principles and applications",
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    title: "Code review assistance",
    description: "Get help reviewing your code and finding improvements",
    icon: <Bot className="h-4 w-4" />,
  },
  {
    title: "Debug your code",
    description: "Help identify and fix bugs in your code",
    icon: <MessageSquare className="h-4 w-4" />,
  },
]

export default function Home() {
  return (
    <ChatLayout sidebar={<ChatHistory />}>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Welcome to AI Chat Assistant</h1>
            <p className="text-muted-foreground">
              Your intelligent coding companion. Ask questions, get explanations,
              and receive help with your code.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {examples.map((example, i) => (
              <Link key={i} href="/chat/new">
                <Button
                  variant="outline"
                  className="h-auto w-full flex flex-col items-start gap-2 p-4"
                >
                  <div className="flex items-center gap-2">
                    {example.icon}
                    <span className="font-medium">{example.title}</span>
                  </div>
                  <span className="text-sm text-muted-foreground text-left">
                    {example.description}
                  </span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </ChatLayout>
  )
}
