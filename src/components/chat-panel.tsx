import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/chat-input";
import { Loader2, Wrench } from "lucide-react";

interface ChatPanelProps {
  id: string;
  isLoading: boolean;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isToolRunning?: boolean;
}

export function ChatPanel({
  id,
  isLoading,
  input,
  handleInputChange,
  handleSubmit,
  isToolRunning,
}: ChatPanelProps) {
  return (
    <div className="border-t">
      <div className="container mx-auto max-w-4xl py-4">
        {(isLoading || isToolRunning) && (
          <div className="flex items-center justify-center gap-2 pb-4">
            {isToolRunning ? (
              <>
                <Wrench className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">
                  正在执行工具调用...
                </span>
              </>
            ) : (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">
                  AI 正在思考...
                </span>
              </>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <ChatInput
            value={input}
            onChange={handleInputChange}
            placeholder="输入消息..."
            disabled={isLoading || isToolRunning}
          />
        </form>
      </div>
    </div>
  );
}
