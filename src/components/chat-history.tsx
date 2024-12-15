"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { MessageSquare, Plus, Trash } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useChatList } from "@/hooks/use-chat-list"
import { useEffect } from "react"

interface ChatHistoryProps {
  currentChatId?: string
}

export function ChatHistory({ currentChatId }: ChatHistoryProps) {
  const router = useRouter()
  const { chats, isLoaded, addChat, updateChat, deleteChat } = useChatList()

  const createNewChat = () => {
    const newChat = addChat()
    router.push(`/chat/${newChat.id}`)
  }

  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    deleteChat(id)
    if (id === currentChatId) {
      router.push('/')
    }
  }

  // Update chat title when messages change
  useEffect(() => {
    if (!currentChatId || !isLoaded) return

    const currentChat = chats.find(chat => chat.id === currentChatId)
    if (!currentChat?.messages.length) return

    const firstUserMessage = currentChat.messages.find(m => m.role === 'user')?.content
    if (!firstUserMessage) return

    const newTitle = firstUserMessage.split('\n')[0]
    const truncatedTitle = newTitle.length > 30 ? newTitle.substring(0, 30) + '...' : newTitle

    updateChat(currentChatId, { title: truncatedTitle })
  }, [currentChatId, chats, updateChat, isLoaded])

  if (!isLoaded) {
    return (
      <div className="flex h-full flex-col gap-2 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-10 rounded-lg bg-accent/50" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-accent/20" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="px-4 py-2">
        <Button
          onClick={createNewChat}
          variant="outline"
          className="w-full justify-start gap-2"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>
      
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 p-2">
          {chats.map((chat) => (
            <Link
              key={chat.id}
              href={`/chat/${chat.id}`}
              className={cn(
                "group flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
                chat.id === currentChatId ? "bg-accent" : "transparent"
              )}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate">{chat.title}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100"
                onClick={(e) => handleDeleteChat(chat.id, e)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
