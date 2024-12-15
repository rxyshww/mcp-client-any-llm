"use client";

import { useChat } from "ai/react";
import { ChatLayout } from "@/components/chat-layout";
import { ChatPanel } from "@/components/chat-panel";
import { ChatMessages } from "@/components/chat-messages";
import { ChatHistory } from "@/components/chat-history";
import { useChatStorage } from "@/hooks/use-chat-storage";
import { useChatList } from "@/hooks/use-chat-list";
import { useEffect } from "react";
import React from "react";

export default function ChatPage({ params }: { params: { id: string } }) {
  const unwrappedParams = React.use(params);
  const chatStorage = useChatStorage(unwrappedParams.id);
  const { updateChat, isLoaded: isChatsLoaded } = useChatList();

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      id: unwrappedParams.id,
      initialMessages: chatStorage.messages,
      onFinish: (message) => {
        chatStorage.updateMessage(message.id, message);
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
      chatStorage.addMessage(lastMessage);

      // Update the chat list with the latest message
      updateChat(unwrappedParams.id, {
        lastMessage: lastMessage.content,
        messages: messages,
      });
    }
  }, [messages, chatStorage, unwrappedParams.id, updateChat, isChatsLoaded]);

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
        />
      </div>
    </ChatLayout>
  );
}
