import { Button } from "@/components/ui/button"
import { ChatInput } from "@/components/chat-input"
import { Loader2 } from "lucide-react"

interface ChatPanelProps {
  id: string
  isLoading: boolean
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export function ChatPanel({
  id,
  isLoading,
  input,
  handleInputChange,
  handleSubmit
}: ChatPanelProps) {
  return (
    <div className="border-t">
      <div className="container mx-auto max-w-4xl py-4">
        {isLoading && (
          <div className="flex items-center justify-center gap-2 pb-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <Button variant="outline" size="sm">
              Stop generating
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <ChatInput
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message..."
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  )
}
