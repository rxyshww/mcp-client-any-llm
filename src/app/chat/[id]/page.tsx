"use client";

import { useChat } from "ai/react";
import { ChatLayout } from "@/components/chat-layout";
import { ChatPanel } from "@/components/chat-panel";
import { ChatMessages } from "@/components/chat-messages";
import { ChatHistory } from "@/components/chat-history";
import { useChatStorage } from "@/hooks/use-chat-storage";
import { useChatList } from "@/hooks/use-chat-list";
import { useEffect, useState } from "react";
import React from "react";

export default function ChatPage({ params }: { params: { id: string } }) {
  const unwrappedParams = React.use(params);
  const chatStorage = useChatStorage(unwrappedParams.id);
  const { updateChat, isLoaded: isChatsLoaded } = useChatList();
  const [isToolRunning, setIsToolRunning] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      id: unwrappedParams.id,
      initialMessages: chatStorage.messages,
      onFinish: (message) => {
        chatStorage.updateMessage(message.id, message);
      },
      onToolCall: () => {
        setIsToolRunning(true);
      },
      onToolEnd: () => {
        setIsToolRunning(false);
      },
      experimental_onFunctionCall: () => {
        setIsToolRunning(true);
        return undefined;
      },
    });

  useEffect(() => {
    if (!isChatsLoaded) return;

    // When a new message is added
    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage &&
      !chatStorage.messages.find((m) => m.id === lastMessage.id)
    ) {
      // 处理工具调用信息
      console.log("Processing message:", lastMessage);
      const toolCalls = (lastMessage as any).toolInvocations;
      if (toolCalls) {
        console.log("Tool calls detected:", toolCalls);
      }

      chatStorage.addMessage(lastMessage);

      // Update the chat list with the latest message
      updateChat(unwrappedParams.id, {
        lastMessage: lastMessage.content,
        messages: messages.map((msg) => ({
          ...msg,
          toolCalls: (msg as any).toolCalls,
        })),
      });
    }
  }, [messages, chatStorage, unwrappedParams.id, updateChat, isChatsLoaded]);

  console.log("Messages:", messages);

  return (
    <ChatLayout sidebar={<ChatHistory currentChatId={unwrappedParams.id} />}>
      <div className="flex h-screen flex-col">
        <ChatMessages messages={messages} />
        <ChatPanel
          id={unwrappedParams.id}
          isLoading={isLoading}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isToolRunning={isToolRunning}
        />
      </div>
    </ChatLayout>
  );
}
