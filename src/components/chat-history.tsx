"use client"

import { Button } from "./ui/button"
import { PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { Message } from 'ai'
import { ChatList } from './chat-list'

interface Chat {
  id: string
  messages?: Message[]
  title?: string
}

interface ChatHistoryProps {
  currentChatId?: string
}

export function ChatHistory({ currentChatId }: ChatHistoryProps) {
  const router = useRouter()
  const [chats, setChats] = useState<Chat[]>([])

  // 加载聊天列表
  const loadChats = useCallback(() => {
    const savedChats = localStorage.getItem('chats')
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats)
        setChats(parsedChats)
      } catch (error) {
        console.error('Failed to parse chats:', error)
        setChats([])
      }
    } else {
      setChats([])
    }
  }, [])

  // 初始加载
  useEffect(() => {
    loadChats()
  }, [loadChats])

  // 监听更新事件
  useEffect(() => {
    const handleChatsUpdated = () => {
      loadChats()
    }

    window.addEventListener('chatsUpdated', handleChatsUpdated)
    return () => window.removeEventListener('chatsUpdated', handleChatsUpdated)
  }, [loadChats])

  const handleNewChat = () => {
    const newId = Date.now().toString()
    const newChat: Chat = {
      id: newId,
      messages: [],
      title: 'New Chat'
    }

    const updatedChats = [newChat, ...chats]
    setChats(updatedChats)
    localStorage.setItem('chats', JSON.stringify(updatedChats))
    router.push(`/chat/${newId}`)
  }

  const handleDeleteChat = useCallback((chatId: string) => {
    const updatedChats = chats.filter(chat => chat.id !== chatId)
    setChats(updatedChats)
    localStorage.setItem('chats', JSON.stringify(updatedChats))
    
    if (chatId === currentChatId) {
      // 如果还有其他聊天，导航到第一个聊天
      if (updatedChats.length > 0) {
        router.push(`/chat/${updatedChats[0].id}`)
      } else {
        // 如果没有聊天了，回到首页
        router.push('/')
      }
    }
  }, [chats, currentChatId, router])

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
      
      <ChatList chats={chats} onDeleteChat={handleDeleteChat} />
    </div>
  )
}
