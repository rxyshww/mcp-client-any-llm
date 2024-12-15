"use client"

import { ChatHistory } from "@/components/chat-history"
import { ChatInput } from "@/components/chat-input"
import { ChatLayout } from "@/components/chat-layout"
import { ChatMessages } from "@/components/chat-messages"
import { useChat } from 'ai/react'
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"

export default function ChatPage() {
  const { id } = useParams()
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat({
    api: '/api/chat',
    id: id as string,
    onFinish: (message) => {
      // Update chat in localStorage with new messages
      const chats = JSON.parse(localStorage.getItem('chats') || '[]')
      const chatIndex = chats.findIndex((c: any) => c.id === id)
      if (chatIndex !== -1) {
        chats[chatIndex].messages = messages
        localStorage.setItem('chats', JSON.stringify(chats))
      }
    }
  })

  // Initialize chat in localStorage if it doesn't exist
  useEffect(() => {
    const chats = JSON.parse(localStorage.getItem('chats') || '[]')
    if (!chats.find((c: any) => c.id === id)) {
      chats.unshift({ id, messages: [] })
      localStorage.setItem('chats', JSON.stringify(chats))
    }
  }, [id])

  return (
    <ChatLayout sidebar={<ChatHistory currentChatId={id as string} />}>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          <ChatMessages messages={messages} />
          
          {isLoading && (
            <div className="flex items-center justify-center gap-2 p-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => stop()}
              >
                Stop generating
              </Button>
            </div>
          )}
        </div>

        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <ChatInput 
              value={input}
              onChange={handleInputChange}
              placeholder="Type a message..."
              disabled={isLoading}
            />
          </form>
        </div>
      </div>
    </ChatLayout>
  )
}
