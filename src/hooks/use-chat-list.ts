import { useEffect, useState } from 'react'
import { type Message } from 'ai'
import { nanoid } from 'nanoid'

interface ToolCall {
  id: string
  name: string
  args: any
}

interface ExtendedMessage extends Message {
  toolCalls?: ToolCall[]
  toolResults?: any[]
}

export interface Chat {
  id: string
  title: string
  messages: ExtendedMessage[]
  lastMessage?: string
  createdAt: number
}

const STORAGE_KEY = 'chat-list'

export function useChatList() {
  const [chats, setChats] = useState<Chat[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load chats from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      setChats(stored ? JSON.parse(stored) : [])
    } catch (e) {
      console.error('Failed to parse stored chats:', e)
      setChats([])
    }
    setIsLoaded(true)
  }, [])

  // Save chats to localStorage when they change
  useEffect(() => {
    if (isLoaded && chats.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats))
    }
  }, [chats, isLoaded])

  const addChat = () => {
    const newChat: Chat = {
      id: nanoid(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now()
    }
    setChats(prev => [newChat, ...prev])
    return newChat
  }

  const updateChat = (id: string, updates: Partial<Chat>) => {
    setChats(prev => 
      prev.map(chat => 
        chat.id === id ? { ...chat, ...updates } : chat
      )
    )
  }

  const appendMessageToChat = (chatId: string, message: ExtendedMessage) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [...chat.messages, message],
              lastMessage: message.content
            }
          : chat
      )
    )
  }

  const updateLastMessage = (chatId: string, message: ExtendedMessage) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [
                ...chat.messages.slice(0, -1),
                message
              ],
              lastMessage: message.content
            }
          : chat
      )
    )
  }

  const deleteChat = (id: string) => {
    setChats(prev => prev.filter(chat => chat.id !== id))
    // Also remove chat messages from storage
    localStorage.removeItem(`chat-${id}`)
  }

  const clearChats = () => {
    setChats([])
    localStorage.removeItem(STORAGE_KEY)
    // Clear all individual chat messages
    chats.forEach(chat => {
      localStorage.removeItem(`chat-${chat.id}`)
    })
  }

  return {
    chats,
    isLoaded,
    addChat,
    updateChat,
    appendMessageToChat,
    updateLastMessage,
    deleteChat,
    clearChats
  }
}
