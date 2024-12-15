import { ChatHistory } from "@/components/chat-history"
import { ChatLayout } from "@/components/chat-layout"
import { StartChatButton } from "@/components/start-chat-button"
import { Brain, Code2, Sparkles, Zap, MessageSquare, Workflow } from "lucide-react"

const features = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "智能对话",
    description: "基于先进的语言模型，提供智能、自然的对话体验"
  },
  {
    icon: <Code2 className="w-8 h-8" />,
    title: "代码理解",
    description: "深入理解代码逻辑，提供准确的技术解答和建议"
  },
  {
    icon: <Workflow className="w-8 h-8" />,
    title: "流程优化",
    description: "帮助优化开发流程，提高编码效率和代码质量"
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "即时响应",
    description: "快速响应您的问题，提供实时的技术支持"
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "上下文理解",
    description: "准确理解对话上下文，提供连贯的交互体验"
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "创新解决方案",
    description: "提供创新的解决方案，激发新的开发思路"
  }
];

export default function Home() {
  return (
    <ChatLayout sidebar={<ChatHistory />}>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {/* Hero Section */}
          <div className="py-20 px-8 text-center bg-gradient-to-b from-background to-secondary/20">
            <div className="max-w-3xl mx-auto space-y-6">
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                AI Chat Assistant
              </h1>
              <p className="text-xl text-muted-foreground">
                您的智能编程助手，随时为您提供专业的技术支持和解决方案
              </p>
              <div className="pt-4">
                <StartChatButton />
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="py-16 px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                为什么选择 AI Chat Assistant
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow"
                  >
                    <div className="text-primary mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="py-8 px-8 border-t">
            <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
              <p>AI Chat Assistant - 您的智能编程伙伴</p>
            </div>
          </div>
        </div>
      </div>
    </ChatLayout>
  )
}
