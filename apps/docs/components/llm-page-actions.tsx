"use client"

import * as React from "react"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"
import {
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  ExternalLinkIcon,
  MessageSquareTextIcon,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { cn } from "@/registry/lib/utils"

export interface LLMPageActionsProps {
  markdownUrl: string
}

export function LLMPageActions({ markdownUrl }: LLMPageActionsProps) {
  const reduceMotion = useReducedMotion()
  const [copied, setCopied] = React.useState(false)

  async function copyMarkdown() {
    const response = await fetch(markdownUrl)
    const markdown = await response.text()
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  function getAbsoluteMarkdownUrl() {
    return new URL(markdownUrl, window.location.origin).toString()
  }

  const buttonClass =
    "inline-flex h-8 items-center justify-center gap-1.5 border border-fd-border bg-fd-secondary/50 px-2.5 text-xs font-medium text-fd-muted-foreground outline-none transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground focus-visible:ring-2 focus-visible:ring-fd-ring"

  return (
    <div
      data-slot="llm-page-actions"
      className="mt-3 flex items-center border-b border-fd-border pb-4"
    >
      <div className="inline-flex overflow-hidden rounded-md shadow-xs">
        <button
          type="button"
          className={cn(buttonClass, "rounded-l-md border-r-0")}
          onClick={copyMarkdown}
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              key={copied ? "copied" : "copy"}
              className="flex items-center gap-1.5"
              initial={reduceMotion ? false : { opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -3 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.18, ease: [0.22, 1, 0.36, 1] }
              }
            >
              {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
              {copied ? "已复制" : "复制 Markdown"}
            </motion.span>
          </AnimatePresence>
        </button>

        <DropdownMenuPrimitive.Root>
          <DropdownMenuPrimitive.Trigger
            aria-label="更多 LLM 页面操作"
            className={cn(buttonClass, "w-8 rounded-r-md px-0")}
          >
            <ChevronDownIcon className="size-3.5" />
          </DropdownMenuPrimitive.Trigger>
          <DropdownMenuPrimitive.Portal>
            <DropdownMenuPrimitive.Content
              align="end"
              sideOffset={6}
              className="z-50 min-w-48 rounded-md border border-fd-border bg-fd-popover p-1 text-fd-popover-foreground shadow-lg"
            >
              <DropdownMenuPrimitive.Item asChild>
                <a
                  href={markdownUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex cursor-default items-center gap-2 rounded-sm px-2.5 py-2 text-sm outline-none transition-colors focus:bg-fd-accent focus:text-fd-accent-foreground"
                >
                  <ExternalLinkIcon className="size-4 text-fd-muted-foreground" />
                  查看 Markdown
                </a>
              </DropdownMenuPrimitive.Item>
              <DropdownMenuPrimitive.Item
                className="flex cursor-default items-center gap-2 rounded-sm px-2.5 py-2 text-sm outline-none transition-colors focus:bg-fd-accent focus:text-fd-accent-foreground"
                onSelect={() => {
                  const prompt = `阅读这篇文档并回答我的问题：${getAbsoluteMarkdownUrl()}`
                  window.open(
                    `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }}
              >
                <MessageSquareTextIcon className="size-4 text-fd-muted-foreground" />
                在 ChatGPT 中打开
              </DropdownMenuPrimitive.Item>
            </DropdownMenuPrimitive.Content>
          </DropdownMenuPrimitive.Portal>
        </DropdownMenuPrimitive.Root>
      </div>
    </div>
  )
}
