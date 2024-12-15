import { Button } from "./ui/button"
import { SendHorizontal } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    onSend(input)
    setInput("")
  }

  return (
    <div className="border-t bg-background p-4">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 max-w-3xl mx-auto"
      >
        <div className="relative flex-1">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className={cn(
              "w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background",
              "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
            rows={1}
            disabled={disabled}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
        </div>
        <Button type="submit" size="icon" disabled={disabled}>
          <SendHorizontal className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
      <div className="mt-2 text-xs text-center text-muted-foreground">
        <kbd className="px-1 py-0.5 text-xs border rounded-md">Enter</kbd> to send,{" "}
        <kbd className="px-1 py-0.5 text-xs border rounded-md">Shift + Enter</kbd>{" "}
        for new line
      </div>
    </div>
  )
}
