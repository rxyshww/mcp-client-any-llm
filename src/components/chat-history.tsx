"use client"

import { Button } from "./ui/button"
import { PlusCircle, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface ChatHistoryProps {
  currentChatId?: string
}

const mockChats = [
  { id: 1, title: "How to implement a binary search tree?" },
  { id: 2, title: "Explain React hooks" },
  { id: 3, title: "What is the difference between var, let, and const?" },
  { id: 4, title: "How to center a div?" },
]

export function ChatHistory({ currentChatId }: ChatHistoryProps) {
  const router = useRouter()

  const handleNewChat = () => {
    const newId = Date.now()
    router.push(`/chat/${newId}`)
  }

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <Button 
        className="w-full" 
        size="sm"
        onClick={handleNewChat}
      >
        <PlusCircle className="w-4 h-4 mr-2" />
        New Chat
      </Button>

      <div className="space-y-2 overflow-hidden">
        {mockChats.map((chat) => (
          <Button
            key={chat.id}
            variant="ghost"
            className={cn(
              "w-full justify-start text-left font-normal",
              "overflow-hidden text-ellipsis whitespace-nowrap",
              currentChatId === String(chat.id) && "bg-accent"
            )}
            onClick={() => router.push(`/chat/${chat.id}`)}
          >
            <MessageSquare className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{chat.title}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
