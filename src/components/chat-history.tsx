"use client"

import { Button } from "./ui/button"
import { PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Message } from 'ai'
import { ChatList } from './chat-list'

interface Chat {
  id: string
  messages?: Message[]
}

interface ChatHistoryProps {
  currentChatId?: string
}

export function ChatHistory({ currentChatId }: ChatHistoryProps) {
  const router = useRouter()
  const [chats, setChats] = useState<Chat[]>([])

  useEffect(() => {
    // Load chats from localStorage
    const savedChats = localStorage.getItem('chats')
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats)
        setChats(parsedChats)
      } catch (error) {
        console.error('Failed to parse chats:', error)
        setChats([])
      }
    }
  }, [])

  const handleNewChat = () => {
    const newId = Date.now().toString()
    const newChat: Chat = {
      id: newId,
      messages: [],
    }

    const updatedChats = [newChat, ...chats]
    setChats(updatedChats)
    localStorage.setItem('chats', JSON.stringify(updatedChats))
    router.push(`/chat/${newId}`)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <Button 
          className="w-full" 
          size="sm"
          onClick={handleNewChat}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>
      
      <ChatList chats={chats} />
    </div>
  )
}
