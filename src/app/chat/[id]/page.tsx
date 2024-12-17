"use client";

import { useChat } from "ai/react";
import { useEffect, use } from "react";
import { useChatStorage } from "@/hooks/use-chat-storage";
import { useChatList } from "@/hooks/use-chat-list";
import { ChatHistory } from "@/components/chat-history";
import { ChatLayout } from "@/components/chat-layout";
import { ChatMessages } from "@/components/chat-messages";
import { ChatPanel } from "@/components/chat-panel";

export default function ChatPage({ params }: { params: { id: string } }) {
  const unwrappedParams = { id: decodeURIComponent(use(params).id) };
  const chatStorage = useChatStorage(unwrappedParams.id);
  const { updateChat, isLoaded: isChatsLoaded } = useChatList();

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    id: unwrappedParams.id,
    initialMessages: chatStorage.messages,
    onFinish: (message) => {
      chatStorage.updateMessage(message.id, message);
    },
  });

  useEffect(() => {
    if (!isChatsLoaded) return;

    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage &&
      !chatStorage.messages.find((m) => m.id === lastMessage.id)
    ) {
      chatStorage.addMessage(lastMessage);

      if (messages.length === 1) {
        updateChat({
          id: unwrappedParams.id,
          title: lastMessage.content,
          lastMessage: new Date().toISOString(),
        });
      }
    }
  }, [messages, chatStorage, unwrappedParams.id, updateChat, isChatsLoaded]);

  return (
    <ChatLayout sidebar={<ChatHistory currentChatId={unwrappedParams.id} />}>
      <div className="flex h-screen flex-col">
        <ChatMessages messages={messages} />
        <ChatPanel
          id={unwrappedParams.id}
          messages={messages}
          isLoading={isLoading}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </ChatLayout>
  );
}
