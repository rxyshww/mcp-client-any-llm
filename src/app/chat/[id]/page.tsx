"use client"

import { ChatHistory } from "@/components/chat-history"
import { ChatInput } from "@/components/chat-input"
import { ChatLayout } from "@/components/chat-layout"
import { ChatMessage } from "@/components/chat-message"
import { useState } from "react"

const initialMessages = [
  {
    role: "assistant" as const,
    content:
      "Hello! I'm your AI coding assistant. I can help you with programming questions, code reviews, and explanations. How can I help you today?",
  },
  {
    role: "user" as const,
    content: "Can you show me an example of a binary search tree implementation in TypeScript?",
  },
  {
    role: "assistant" as const,
    content: `I'll show you a basic implementation of a Binary Search Tree in TypeScript. Here's an example:

\`\`\`typescript
class TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(value: number) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  root: TreeNode | null;

  constructor() {
    this.root = null;
  }

  insert(value: number): void {
    const newNode = new TreeNode(value);

    if (!this.root) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (current.left === null) {
          current.left = newNode;
          break;
        }
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = newNode;
          break;
        }
        current = current.right;
      }
    }
  }

  search(value: number): boolean {
    let current = this.root;
    
    while (current !== null) {
      if (value === current.value) {
        return true;
      }
      if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    
    return false;
  }
}

// Example usage:
const bst = new BinarySearchTree();
bst.insert(10);
bst.insert(5);
bst.insert(15);
bst.insert(2);
bst.insert(7);

console.log(bst.search(7));  // true
console.log(bst.search(9));  // false
\`\`\`

This implementation includes:

1. A \`TreeNode\` class that represents each node in the tree
2. A \`BinarySearchTree\` class with basic \`insert\` and \`search\` methods
3. The \`insert\` method maintains the BST property where left child is smaller and right child is larger
4. The \`search\` method efficiently finds values by traversing left or right based on the value

Would you like me to explain any part of this implementation in more detail?`,
  },
]

export default function ChatPage() {
  const [messages, setMessages] = useState(initialMessages)

  const handleSendMessage = (content: string) => {
    // Add user message
    setMessages((prev) => [...prev, { role: "user" as const, content }])

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant" as const,
          content: "This is a simulated response. In a real implementation, this would come from your AI backend.",
        },
      ])
    }, 1000)
  }

  return (
    <ChatLayout sidebar={<ChatHistory />}>
      <div className="flex-1 overflow-y-auto">
        {messages.map((message, i) => (
          <ChatMessage key={i} message={message} />
        ))}
      </div>
      <ChatInput onSend={handleSendMessage} />
    </ChatLayout>
  )
}
