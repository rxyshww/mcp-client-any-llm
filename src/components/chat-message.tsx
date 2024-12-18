"use client"

import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import { User, Bot } from "lucide-react"
import { CodeBlock } from "./code-block"
import { useTheme } from "next-themes"

interface ChatMessageProps {
  message: {
    role: "user" | "assistant"
    content: string
  }
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { theme } = useTheme()

  return (
    <div
      className={cn(
        "flex w-full items-start gap-4 p-8",
        message.role === "assistant" && "bg-muted/50"
      )}
    >
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow">
        {message.role === "user" ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>
      <div className="flex-1 space-y-2">
        <ReactMarkdown
          className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          components={{
            pre({ children }) {
              return <div className="not-prose">{children}</div>
            },
            code({ children, className }) {
              const language = className ? className.replace("language-", "") : "text"
              const code = String(children).replace(/\n$/, "")
              
              return (
                <CodeBlock
                  code={code}
                  language={language}
                  theme={theme as "light" | "dark"}
                />
              )
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
