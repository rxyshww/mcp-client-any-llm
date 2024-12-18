"use client"

import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { useState, useEffect } from "react"
import { getHighlighter } from "shikiji"

let highlighter: any = null

interface CodeBlockProps {
  code: string
  language: string
  theme?: "light" | "dark"
}

const initHighlighter = async () => {
  if (!highlighter) {
    highlighter = await getHighlighter({
      themes: ["github-dark", "github-light"],
      langs: ["typescript", "javascript", "python", "bash", "json", "markdown", "yaml", "tsx", "jsx"],
    })
  }
  return highlighter
}

export function CodeBlock({ code, language, theme = "dark" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [isHighlighterReady, setIsHighlighterReady] = useState(!!highlighter)
  const [html, setHtml] = useState("")

  useEffect(() => {
    if (!isHighlighterReady) {
      initHighlighter().then((h) => {
        setIsHighlighterReady(true)
        setHtml(h.codeToHtml(code, {
          lang: language,
          theme: theme === "light" ? "github-light" : "github-dark",
        }))
      })
    } else if (highlighter) {
      setHtml(highlighter.codeToHtml(code, {
        lang: language,
        theme: theme === "light" ? "github-light" : "github-dark",
      }))
    }
  }, [code, language, theme, isHighlighterReady])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <div
        className="rounded-lg [&>pre]:my-0 [&>pre]:max-h-[400px] [&>pre]:overflow-auto [&>pre]:p-4 [&>pre]:font-mono"
        dangerouslySetInnerHTML={{ __html: html || `<pre><code>${code}</code></pre>` }}
      />
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-8 w-8 bg-background/50 backdrop-blur-sm"
        onClick={copyToClipboard}
      >
        {copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        <span className="sr-only">Copy code</span>
      </Button>
    </div>
  )
}
