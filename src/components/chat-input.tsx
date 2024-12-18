import { Button } from "./ui/button"
import { SendHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { type ChangeEvent } from "react"

interface ChatInputProps {
  value: string
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  disabled?: boolean
}

export function ChatInput({ value, onChange, disabled }: ChatInputProps) {
  return (
    <div className="relative flex-1">
      <textarea
        name="prompt"
        value={value}
        onChange={onChange}
        placeholder="Type a message..."
        className={cn(
          "w-full resize-none rounded-lg border border-input bg-background px-4 py-3 pr-14 text-sm ring-offset-background",
          "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
        rows={1}
        disabled={disabled}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            e.currentTarget.form?.requestSubmit()
          }
        }}
      />
      <Button 
        type="submit" 
        size="icon" 
        className="absolute right-2 top-1/2 -translate-y-1/2"
        disabled={disabled || !value.trim()}
      >
        <SendHorizontal className="h-4 w-4" />
        <span className="sr-only">Send message</span>
      </Button>
      
      <div className="absolute -bottom-6 left-0 right-0 text-xs text-center text-muted-foreground">
        <kbd className="px-1 py-0.5 text-xs border rounded-md">Enter</kbd> to send,{" "}
        <kbd className="px-1 py-0.5 text-xs border rounded-md">Shift + Enter</kbd>{" "}
        for new line
      </div>
    </div>
  )
}
