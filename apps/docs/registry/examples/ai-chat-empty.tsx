"use client"

import * as React from "react"
import { CodeIcon, DatabaseIcon, PaletteIcon, RotateCcwIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  AiChat,
  AiChatAvatar,
  AiChatEmptyState,
  AiChatLoading,
  AiChatMessage,
  AiChatMessageContent,
  AiChatMessages,
  AiChatPrompt,
  AiChatPromptFooter,
  AiChatSubmit,
  AiChatTextarea,
} from "@/registry/ui/ai-chat"
import {
  AiPromptSuggestionItem,
  AiPromptSuggestions,
} from "@/registry/ui/ai-prompt-suggestions"

const SUGGESTIONS = [
  {
    icon: <CodeIcon />,
    title: "重构状态管理",
    prompt: "把基于 Context 的全局状态迁移到 Zustand，并保留持久化。",
  },
  {
    icon: <DatabaseIcon />,
    title: "分析慢查询",
    prompt: "这条三表 JOIN 加 ORDER BY 的查询很慢，应该怎么建索引？",
  },
  {
    icon: <PaletteIcon />,
    title: "设计暗色主题",
    prompt: "为后台系统设计一套对比度达标的暗色主题色板。",
  },
]

export default function AiChatEmpty() {
  const [prompt, setPrompt] = React.useState("")
  const [question, setQuestion] = React.useState<string | null>(null)

  function send(text: string) {
    if (!text.trim()) return
    setQuestion(text.trim())
    setPrompt("")
  }

  return (
    <AiChat className="mx-auto h-[480px] max-w-2xl">
      <AiChatMessages className="flex flex-col [&>[role=log]]:flex-1">
        {question ? (
          <>
            <AiChatMessage role="user">
              <AiChatMessageContent role="user">{question}</AiChatMessageContent>
            </AiChatMessage>
            <AiChatMessage role="assistant">
              <AiChatAvatar />
              <AiChatMessageContent>
                <AiChatLoading />
              </AiChatMessageContent>
            </AiChatMessage>
          </>
        ) : (
          <AiChatEmptyState className="max-w-lg flex-1">
            <h3 className="text-base font-medium text-foreground">
              今天想处理什么？
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              直接描述任务，或从下面的常用场景开始。
            </p>
            <AiPromptSuggestions className="mt-6 sm:grid-cols-3 lg:grid-cols-3">
              {SUGGESTIONS.map((item) => (
                <AiPromptSuggestionItem
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                  description={item.prompt}
                  promptText={item.prompt}
                  onSelectPrompt={setPrompt}
                />
              ))}
            </AiPromptSuggestions>
          </AiChatEmptyState>
        )}
      </AiChatMessages>

      <AiChatPrompt
        onSubmit={(event) => {
          event.preventDefault()
          send(prompt)
        }}
      >
        <AiChatPromptFooter>
          {question ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="新对话"
              onClick={() => setQuestion(null)}
            >
              <RotateCcwIcon />
            </Button>
          ) : null}
          <AiChatTextarea
            value={prompt}
            placeholder="输入问题，Shift + Enter 换行"
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault()
                event.currentTarget.form?.requestSubmit()
              }
            }}
          />
          <AiChatSubmit disabled={!prompt.trim()} />
        </AiChatPromptFooter>
      </AiChatPrompt>
    </AiChat>
  )
}
