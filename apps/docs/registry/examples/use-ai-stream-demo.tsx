"use client"

import * as React from "react"

import {
  type AiStreamToolPart,
  useAiStream,
} from "@/registry/hooks/use-ai-stream"
import { Button } from "@/registry/ui/button"
import {
  AiReasoning,
  AiReasoningContent,
  AiReasoningTrigger,
} from "@/registry/ui/ai-reasoning"
import { AiStream } from "@/registry/ui/ai-stream"
import {
  AiTool,
  AiToolCode,
  AiToolContent,
  AiToolLabel,
  AiToolSection,
  AiToolTrigger,
  type AiToolStatus,
} from "@/registry/ui/ai-tool"

const demoChunks = [
  { type: "start", messageId: "zonix-demo" },
  {
    type: "reasoning-delta",
    id: "reasoning-1",
    delta: "先读取页面结构，再核对组件库已有能力。",
  },
  {
    type: "tool-input-start",
    toolCallId: "call-1",
    toolName: "read_project_files",
  },
  {
    type: "tool-input-delta",
    toolCallId: "call-1",
    inputTextDelta: '{"path":"app/login"}',
  },
  {
    type: "tool-input-available",
    toolCallId: "call-1",
    toolName: "read_project_files",
    input: { path: "app/login" },
  },
  {
    type: "tool-output-available",
    toolCallId: "call-1",
    output: { files: 6 },
  },
  { type: "text-start", id: "text-1" },
  {
    type: "text-delta",
    id: "text-1",
    delta: "已读取 6 个相关文件。",
  },
  {
    type: "text-delta",
    id: "text-1",
    delta: "登录逻辑可以保留，只需要重组表单层级与移动端间距。",
  },
  { type: "text-end", id: "text-1" },
  { type: "finish", usage: { inputTokens: 412, outputTokens: 96 } },
] as const

function createDemoResponse() {
  const encoder = new TextEncoder()
  let index = 0
  let cancelled = false

  return new Response(
    new ReadableStream<Uint8Array>({
      async pull(controller) {
        await new Promise((resolve) => window.setTimeout(resolve, 260))
        if (cancelled) return

        const chunk = demoChunks[index]
        const data = chunk ? JSON.stringify(chunk) : "[DONE]"
        controller.enqueue(encoder.encode(`data: ${data}\n\n`))
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

function getToolStatus(part: AiStreamToolPart): AiToolStatus {
  switch (part.state) {
    case "approval-requested":
      return "approval"
    case "output-available":
      return "success"
    case "output-error":
      return "error"
    case "output-denied":
      return "denied"
    case "input-streaming":
    case "input-available":
    case "approval-responded":
      return "running"
  }
}

export default function UseAiStreamDemo() {
  const {
    text,
    reasoning,
    toolParts,
    status,
    error,
    isStreaming,
    consume,
    reset,
  } = useAiStream()

  const play = React.useCallback(() => {
    reset()
    void consume(createDemoResponse())
  }, [consume, reset])

  return (
    <div className="mx-auto w-full max-w-xl space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <div className="text-sm font-medium">UI Message Stream</div>
          <div className="text-muted-foreground text-xs">
            {status === "streaming" ? "正在接收 SSE 分片" : "等待播放"}
          </div>
        </div>
        <Button type="button" size="sm" disabled={isStreaming} onClick={play}>
          {isStreaming ? "接收中…" : "播放协议流"}
        </Button>
      </div>

      {reasoning ? (
        <AiReasoning isStreaming={isStreaming} defaultOpen>
          <AiReasoningTrigger />
          <AiReasoningContent>
            <AiStream isStreaming={isStreaming}>{reasoning}</AiStream>
          </AiReasoningContent>
        </AiReasoning>
      ) : null}

      {toolParts.map((part) => (
        <AiTool key={part.toolCallId} status={getToolStatus(part)}>
          <AiToolTrigger name={part.toolName} />
          <AiToolContent>
            <AiToolSection>
              <AiToolLabel>输入</AiToolLabel>
              <AiToolCode>
                {part.input === undefined
                  ? part.inputText
                  : JSON.stringify(part.input, null, 2)}
              </AiToolCode>
            </AiToolSection>
            {part.output !== undefined ? (
              <AiToolSection>
                <AiToolLabel>结果</AiToolLabel>
                <AiToolCode>{JSON.stringify(part.output, null, 2)}</AiToolCode>
              </AiToolSection>
            ) : null}
          </AiToolContent>
        </AiTool>
      ))}

      {text ? (
        <AiStream className="text-sm leading-7" isStreaming={isStreaming}>
          {text}
        </AiStream>
      ) : !isStreaming ? (
        <p className="text-muted-foreground text-sm">
          播放一段包含推理、工具调用和正文的 Zonix 协议流。
        </p>
      ) : null}

      {error ? (
        <p role="alert" className="text-destructive text-sm">
          {error.message}
        </p>
      ) : null}
    </div>
  )
}
