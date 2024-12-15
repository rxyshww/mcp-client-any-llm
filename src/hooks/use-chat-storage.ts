import { type Message } from 'ai'
import { useEffect, useState } from 'react'

const STORAGE_KEY_PREFIX = 'chat-'

export function useChatStorage(chatId: string) {
  const storageKey = `${STORAGE_KEY_PREFIX}${chatId}`
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === 'undefined') return []
    
    const stored = localStorage.getItem(storageKey)
    if (!stored) return []
    
    try {
      return JSON.parse(stored)
    } catch (e) {
      console.error('Failed to parse stored messages:', e)
      return []
    }
  })

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(messages))
    }
  }, [messages, storageKey])

  const addMessage = (message: Message) => {
    setMessages(prev => {
      const newMessages = [...prev, message]
      return newMessages
    })
  }

  const updateMessage = (id: string, updatedMessage: Partial<Message>) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, ...updatedMessage } : msg
      )
    )
  }

  const clearMessages = () => {
    setMessages([])
    localStorage.removeItem(storageKey)
  }

  return {
    messages,
    addMessage,
    updateMessage,
    clearMessages
  }
}
