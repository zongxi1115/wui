"use client"

import * as React from "react"

import { useAiStream } from "@/registry/hooks/use-ai-stream"
import { AiStream } from "@/registry/ui/ai-stream"
import { Button } from "@/registry/ui/button"

const answerChunks = [
  { type: "start", messageId: "answer-demo" },
  { type: "text-start", id: "answer" },
  { type: "text-delta", id: "answer", delta: "流式回答适合" },
  { type: "text-delta", id: "answer", delta: "边生成边展示，" },
  {
    type: "text-delta",
    id: "answer",
    delta: "用户不必等待整段内容完成。",
  },
  { type: "text-end", id: "answer" },
  {
    type: "source-url",
    sourceId: "source-1",
    url: "https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol",
    title: "AI SDK UI Stream Protocol",
  },
  { type: "finish", finishReason: "stop" },
] as const

function createAnswerResponse() {
  const encoder = new TextEncoder()
  let index = 0
  let cancelled = false

  return new Response(
    new ReadableStream<Uint8Array>({
      async pull(controller) {
        await new Promise((resolve) => window.setTimeout(resolve, 220))
        if (cancelled) return

        const chunk = answerChunks[index]
        controller.enqueue(
          encoder.encode(`data: ${chunk ? JSON.stringify(chunk) : "[DONE]"}\n\n`)
        )
        index += 1
        if (!chunk) controller.close()
      },
      cancel() {
        cancelled = true
      },
    }),
    {
      headers: {
        "content-type": "text/event-stream",
        "x-vercel-ai-ui-message-stream": "v1",
      },
    }
  )
}

export default function UseAiStreamTextDemo() {
  const { message, text, status, isStreaming, send, stop, reset } = useAiStream({
    api: "/api/assistant",
    fetch: async () => createAnswerResponse(),
  })

  const sources =
    message?.parts.filter((part) => part.type === "source-url") ?? []

  return (
    <div className="mx-auto w-full max-w-xl space-y-5">
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <p className="text-sm font-medium">文本回答</p>
          <p className="text-muted-foreground text-xs">
            send()、stop() 与来源分片
          </p>
        </div>
        <div className="flex gap-2">
          {message ? (
            <Button type="button" size="sm" variant="ghost" onClick={reset}>
              清空
            </Button>
          ) : null}
          <Button
            type="button"
            size="sm"
            variant={isStreaming ? "outline" : "default"}
            onClick={() => {
              if (isStreaming) stop()
              else void send({ prompt: "流式回答有什么用？" })
            }}
          >
            {isStreaming ? "停止生成" : "发送问题"}
          </Button>
        </div>
      </div>

      {text ? (
        <AiStream className="text-sm leading-7" isStreaming={isStreaming}>
          {text}
        </AiStream>
      ) : (
        <p className="text-muted-foreground text-sm">
          这个示例通过自定义 fetch 模拟真实接口，调用方式与线上请求一致。
        </p>
      )}

      {sources.length > 0 ? (
        <div className="border-t pt-3">
          <p className="text-muted-foreground mb-2 text-xs">来源</p>
          {sources.map((source) => (
            <a
              key={source.sourceId}
              className="text-sm underline underline-offset-4"
              href={source.url}
              rel="noreferrer"
              target="_blank"
            >
              {source.title ?? source.url}
            </a>
          ))}
        </div>
      ) : null}

      <p className="text-muted-foreground text-xs">当前状态：{status}</p>
    </div>
  )
}
