'use client';

import { Message } from 'ai';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

interface ChatListProps {
  chats: {
    id: string;
    messages?: Message[];
  }[];
}

function generateChatTitle(messages?: Message[]): string {
  if (!messages || messages.length === 0) return 'New Chat';
  
  // Find the first user message
  const firstUserMessage = messages.find(m => m.role === 'user');
  if (!firstUserMessage) return 'New Chat';
  
  // Use the first user message as the title, but truncate it
  const title = firstUserMessage.content.split('\n')[0]; // Get first line
  return title.length > 30 ? title.substring(0, 30) + '...' : title;
}

export function ChatList({ chats }: ChatListProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-2 p-4">
      <Link
        href="/chat"
        className={cn(
          'flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-secondary/80 transition-colors',
          'bg-secondary text-secondary-foreground'
        )}
      >
        <MessageSquare className="h-4 w-4" />
        New Chat
      </Link>
      
      {chats.map((chat) => (
        <Link
          key={chat.id}
          href={`/chat/${chat.id}`}
          className={cn(
            'flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-muted/80 transition-colors',
            pathname === `/chat/${chat.id}` ? 'bg-muted' : 'transparent'
          )}
        >
          <MessageSquare className="h-4 w-4" />
          <span className="truncate">{generateChatTitle(chat.messages)}</span>
        </Link>
      ))}
    </div>
  );
}
