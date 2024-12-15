'use client';

import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import { useRouter } from "next/navigation";

export function StartChatButton() {
  const router = useRouter();

  const handleClick = () => {
    // 创建新的聊天
    const newId = Date.now().toString();
    const chats = JSON.parse(localStorage.getItem('chats') || '[]');
    
    // 添加新聊天到列表
    const newChat = {
      id: newId,
      messages: [],
      title: 'New Chat'
    };
    
    chats.unshift(newChat);
    localStorage.setItem('chats', JSON.stringify(chats));
    
    // 触发更新事件
    window.dispatchEvent(new CustomEvent('chatsUpdated'));
    
    // 重定向到新的聊天页面
    router.push(`/chat/${newId}`);
  };

  return (
    <Button
      size="lg"
      className="w-full max-w-xs gap-2 py-6 text-lg"
      onClick={handleClick}
    >
      <MessageSquarePlus className="h-5 w-5" />
      Start New Chat
    </Button>
  );
}
