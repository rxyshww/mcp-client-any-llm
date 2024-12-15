"use client"

import { ScrollArea } from "./ui/scroll-area"
import { ThemeToggle } from "./theme-toggle"
import { useParams } from "next/navigation"

interface ChatLayoutProps {
  children: React.ReactNode
  sidebar: React.ReactNode
}

export function ChatLayout({ children, sidebar }: ChatLayoutProps) {
  const params = useParams()
  const chatId = params?.id as string

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-[280px] flex-shrink-0 border-r bg-muted/40">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-semibold">Chats</h2>
            <ThemeToggle />
          </div>
          <ScrollArea className="flex-1">
            {typeof sidebar === 'function' ? sidebar({ currentChatId: chatId }) : sidebar}
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  )
}
