"use client"

import { ChatHistory } from "@/components/chat-history"
import { ChatInput } from "@/components/chat-input"
import { ChatLayout } from "@/components/chat-layout"
import { ChatMessages } from "@/components/chat-messages"
import { useChat } from 'ai/react'
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

export default function ChatPage() {
  const { id } = useParams()
  const [title, setTitle] = useState<string>('New Chat')

  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat({
    api: '/api/chat',
    id: id as string,
    onFinish: () => {
      // 更新标题和存储
      updateChatTitle()
    }
  })

  // 更新聊天标题的函数
  const updateChatTitle = () => {
    if (!messages.length) return

    // 找到第一条用户消息
    const userMessage = messages.find(m => m.role === 'user')?.content
    if (!userMessage) return

    // 使用第一行作为标题
    const newTitle = userMessage.split('\n')[0]
    const truncatedTitle = newTitle.length > 30 ? newTitle.substring(0, 30) + '...' : newTitle

    // 更新本地状态
    setTitle(truncatedTitle)

    // 更新 localStorage
    const chats = JSON.parse(localStorage.getItem('chats') || '[]')
    const chatIndex = chats.findIndex((c: any) => c.id === id)
    
    if (chatIndex !== -1) {
      chats[chatIndex] = {
        ...chats[chatIndex],
        messages: messages,
        title: truncatedTitle
      }
      localStorage.setItem('chats', JSON.stringify(chats))
      
      // 强制更新左侧列表
      window.dispatchEvent(new CustomEvent('chatsUpdated'))
    }
  }

  // 初始化聊天记录
  useEffect(() => {
    const chats = JSON.parse(localStorage.getItem('chats') || '[]')
    const existingChat = chats.find((c: any) => c.id === id)
    
    if (!existingChat) {
      // 如果是新聊天，添加到列表
      chats.unshift({ 
        id, 
        messages: [],
        title: 'New Chat'
      })
      localStorage.setItem('chats', JSON.stringify(chats))
    } else {
      // 如果是已存在的聊天，加载标题
      setTitle(existingChat.title || 'New Chat')
    }
  }, [id])

  // 监听消息变化，更新标题
  useEffect(() => {
    if (messages.length > 0) {
      updateChatTitle()
    }
  }, [messages])

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
