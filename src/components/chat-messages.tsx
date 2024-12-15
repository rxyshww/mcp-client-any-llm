"use client";

import React from "react";
import { type Message } from "ai";
import { cn } from "@/lib/utils";
import { Bot, User, Wrench } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

interface ChatMessagesProps {
  messages: (Message & {
    toolInvocations?: Array<{
      tool: string;
      args: any;
    }>;
  })[];
}

const BlockContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="my-4">{children}</div>;
};

function ToolCallMessage({ tool, args }: { tool: string; args: any }) {
  return (
    <div className="flex gap-4 max-w-3xl mx-auto p-4 bg-muted/30 rounded-lg border border-border">
      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <Wrench className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-sm">调用工具: {tool}</p>
        <pre className="mt-2 text-sm bg-muted p-2 rounded-md overflow-x-auto">
          {JSON.stringify(args, null, 2)}
        </pre>
      </div>
    </div>
  );
}

function MessageContent({
  content,
  toolInvocations,
}: {
  content: string;
  toolInvocations?: Array<{
    toolName: string;
    args: any;
  }>;
}) {
  return (
    <div className="space-y-4">
      {toolInvocations?.map((call, index) => (
        <ToolCallMessage key={index} tool={call.toolName} args={call.args} />
      ))}
      <article className="prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "text";

              if (inline) {
                return (
                  <code
                    className="px-1.5 py-0.5 rounded-md bg-muted font-mono text-sm"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }

              return (
                <BlockContent>
                  <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    PreTag="div"
                    className="relative rounded-md overflow-hidden"
                    customStyle={{
                      margin: 0,
                      borderRadius: "0.375rem",
                      padding: "1.5rem 1rem",
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                </BlockContent>
              );
            },
            p({ children }) {
              return (
                <p className="leading-7 [&:not(:first-child)]:mt-4">
                  {children}
                </p>
              );
            },
            a({ children, ...props }) {
              return (
                <a
                  className="text-primary hover:underline underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                >
                  {children}
                </a>
              );
            },
            ul({ children }) {
              return (
                <BlockContent>
                  <ul className="list-disc pl-6 space-y-2">{children}</ul>
                </BlockContent>
              );
            },
            ol({ children }) {
              return (
                <BlockContent>
                  <ol className="list-decimal pl-6 space-y-2">{children}</ol>
                </BlockContent>
              );
            },
            li({ children }) {
              return <li className="leading-7">{children}</li>;
            },
            h1({ children }) {
              return (
                <BlockContent>
                  <h1 className="text-2xl font-bold tracking-tight">
                    {children}
                  </h1>
                </BlockContent>
              );
            },
            h2({ children }) {
              return (
                <BlockContent>
                  <h2 className="text-xl font-semibold tracking-tight">
                    {children}
                  </h2>
                </BlockContent>
              );
            },
            h3({ children }) {
              return (
                <BlockContent>
                  <h3 className="text-lg font-semibold tracking-tight">
                    {children}
                  </h3>
                </BlockContent>
              );
            },
            table({ children }) {
              return (
                <BlockContent>
                  <div className="w-full overflow-y-auto">
                    <table className="w-full border-collapse border border-border">
                      {children}
                    </table>
                  </div>
                </BlockContent>
              );
            },
            thead({ children }) {
              return <thead className="bg-muted/50">{children}</thead>;
            },
            tr({ children }) {
              return (
                <tr className="border-b border-border m-0 p-0">{children}</tr>
              );
            },
            th({ children }) {
              return (
                <th className="border border-border px-4 py-2 text-left font-semibold">
                  {children}
                </th>
              );
            },
            td({ children }) {
              return (
                <td className="border border-border px-4 py-2 text-left">
                  {children}
                </td>
              );
            },
            blockquote({ children }) {
              return (
                <BlockContent>
                  <blockquote className="border-l-4 border-primary pl-6 italic">
                    {children}
                  </blockquote>
                </BlockContent>
              );
            },
            hr() {
              return (
                <BlockContent>
                  <hr className="border-border" />
                </BlockContent>
              );
            },
            img({ alt, src, ...props }) {
              return (
                <BlockContent>
                  <img
                    className="rounded-lg border border-border"
                    alt={alt}
                    src={src}
                    {...props}
                  />
                </BlockContent>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex gap-4 max-w-3xl mx-auto p-6 rounded-lg",
            message.role === "assistant" ? "bg-secondary/50" : "bg-primary/5"
          )}
        >
          <div
            className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
              message.role === "assistant" ? "bg-secondary" : "bg-primary/10"
            )}
          >
            {message.role === "assistant" ? (
              <Bot className="h-4 w-4" />
            ) : (
              <User className="h-4 w-4" />
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <MessageContent
              content={message.content}
              toolInvocations={message.toolInvocations}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
