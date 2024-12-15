import { type Message } from 'ai'
import { cn } from "@/lib/utils"
import { Bot, User } from "lucide-react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface ChatMessagesProps {
  messages: Message[]
}

function extractCodeBlocks(content: string) {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const parts: Array<{ type: 'text' | 'code'; content: string; language?: string }> = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex, match.index),
      });
    }

    // Add code block
    parts.push({
      type: 'code',
      language: match[1] || 'text',
      content: match[2].trim(),
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.slice(lastIndex),
    });
  }

  return parts;
}

function MessageContent({ content }: { content: string }) {
  const parts = extractCodeBlocks(content);

  return (
    <div className="space-y-4">
      {parts.map((part, index) => {
        if (part.type === 'code') {
          return (
            <div key={index} className="rounded-md overflow-hidden">
              <SyntaxHighlighter
                language={part.language}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: '0.375rem',
                }}
              >
                {part.content}
              </SyntaxHighlighter>
            </div>
          );
        }
        return (
          <div key={index} className="text-sm leading-relaxed whitespace-pre-wrap">
            {part.content}
          </div>
        );
      })}
    </div>
  );
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex gap-3 max-w-3xl mx-auto p-4 rounded-lg",
            message.role === "assistant" 
              ? "bg-secondary/50" 
              : "bg-primary/5"
          )}
        >
          <div className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center",
            message.role === "assistant" ? "bg-secondary" : "bg-primary/10"
          )}>
            {message.role === "assistant" ? (
              <Bot className="h-4 w-4" />
            ) : (
              <User className="h-4 w-4" />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <div className="font-medium">
              {message.role === "assistant" ? "Assistant" : "You"}
            </div>
            <MessageContent content={message.content} />
          </div>
        </div>
      ))}
    </div>
  )
}
