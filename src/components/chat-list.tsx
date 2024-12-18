'use client';

import { Message } from 'ai';
import Link from 'next/link';
import { MessageSquare, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ConfirmDialog } from './ui/confirm-dialog';
import { Button } from './ui/button';

interface ChatListProps {
  chats: {
    id: string;
    messages?: Message[];
    title?: string;
  }[];
  onDeleteChat?: (chatId: string) => void;
}

function generateChatTitle(messages?: Message[]): string {
  if (!messages || messages.length === 0) return 'New Chat';
  
  // 找到第一条用户消息
  const userMessage = messages.find(m => m.role === 'user')?.content
  if (!userMessage) return 'New Chat';
  
  // 使用第一行作为标题
  const title = userMessage.split('\n')[0];
  return title.length > 30 ? title.substring(0, 30) + '...' : title;
}

export function ChatList({ chats, onDeleteChat }: ChatListProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);

  // 处理删除确认
  const handleConfirmDelete = () => {
    if (!chatToDelete) return;

    // 调用父组件的删除方法
    onDeleteChat?.(chatToDelete);
    
    // 关闭对话框
    setChatToDelete(null);
  };

  return (
    <>
      <div className="flex flex-col gap-2 p-4">
        {chats.map((chat) => {
          // 优先使用保存的标题，如果没有则生成一个
          const chatTitle = chat.title || generateChatTitle(chat.messages);
          
          return (
            <div
              key={chat.id}
              className="flex items-center gap-2"
            >
              <Link
                href={`/chat/${chat.id}`}
                className={cn(
                  'flex flex-1 items-center gap-2 rounded-lg px-4 py-2 hover:bg-muted/80 transition-colors',
                  pathname === `/chat/${chat.id}` ? 'bg-muted' : 'transparent'
                )}
              >
                <MessageSquare className="h-4 w-4" />
                <span className="truncate">{chatTitle}</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 p-0"
                onClick={(e) => {
                  e.preventDefault();
                  setChatToDelete(chat.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        isOpen={!!chatToDelete}
        onClose={() => setChatToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="删除聊天记录"
        description="确定要删除这个聊天记录吗？此操作无法撤销。"
      />
    </>
  );
}
