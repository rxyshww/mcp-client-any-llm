'use client';

import { Button } from "@/components/ui/button";
import { Bot, MessageSquare, Sparkles } from "lucide-react";

const examples = [
  {
    title: "Explain quantum computing",
    description: "Learn about quantum computing principles and applications",
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    title: "Code review assistance",
    description: "Get help reviewing your code and finding improvements",
    icon: <Bot className="h-4 w-4" />,
  },
  {
    title: "Debug your code",
    description: "Help identify and fix bugs in your code",
    icon: <MessageSquare className="h-4 w-4" />,
  },
];

export function ExampleButtons() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {examples.map((example, i) => (
        <Button
          key={i}
          variant="outline"
          className="h-auto w-full flex flex-col items-start gap-2 p-4 overflow-hidden"
          onClick={() => {
            const input = document.querySelector('input');
            if (input) {
              input.value = example.title;
              input.focus();
            }
          }}
        >
          <div className="flex items-center gap-2 w-full">
            {example.icon}
            <span className="font-medium truncate">{example.title}</span>
          </div>
          <span className="text-sm text-muted-foreground text-left line-clamp-2">
            {example.description}
          </span>
        </Button>
      ))}
    </div>
  );
}
