'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function HomeChatInput() {
  const [input, setInput] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 创建新的聊天
    const newId = Date.now().toString();
    const chats = JSON.parse(localStorage.getItem('chats') || '[]');
    
    // 添加新聊天到列表
    const newChat = {
      id: newId,
      messages: [{
        id: Date.now().toString(),
        content: input.trim(),
        role: 'user'
      }],
      title: input.trim()
    };
    
    chats.unshift(newChat);
    localStorage.setItem('chats', JSON.stringify(chats));
    
    // 触发更新事件
    window.dispatchEvent(new CustomEvent('chatsUpdated'));
    
    // 重定向到新的聊天页面
    router.push(`/chat/${newId}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-2xl w-full mx-auto p-4">
      <Input
        placeholder="输入你的问题..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" size="icon">
        <SendHorizontal className="h-4 w-4" />
      </Button>
    </form>
  );
}
