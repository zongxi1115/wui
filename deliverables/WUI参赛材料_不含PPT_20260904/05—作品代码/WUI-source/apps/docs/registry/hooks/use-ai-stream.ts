"use client"

import * as React from "react"

export type AiStreamStatus = "idle" | "submitted" | "streaming" | "error"

export interface AiStreamTextPart {
  type: "text"
  text: string
  state: "streaming" | "done"
  providerMetadata?: unknown
}

export interface AiStreamReasoningPart {
  type: "reasoning"
  text: string
  state: "streaming" | "done"
  providerMetadata?: unknown
}

export interface AiStreamToolApproval {
  id: string
  approved?: boolean
  reason?: string
}

export interface AiStreamToolPart {
  type: `tool-${string}` | "dynamic-tool"
  toolCallId: string
  toolName: string
  state:
    | "input-streaming"
    | "input-available"
    | "approval-requested"
    | "approval-responded"
    | "output-available"
    | "output-error"
    | "output-denied"
  input?: unknown
  /** Raw streamed input while the JSON value is still incomplete. */
  inputText?: string
  output?: unknown
  errorText?: string
  approval?: AiStreamToolApproval
  preliminary?: boolean
  providerExecuted?: boolean
  providerMetadata?: unknown
}

export interface AiStreamSourceUrlPart {
  type: "source-url"
  sourceId: string
  url: string
  title?: string
  providerMetadata?: unknown
}

export interface AiStreamSourceDocumentPart {
  type: "source-document"
  sourceId: string
  mediaType: string
  title: string
  filename?: string
  providerMetadata?: unknown
}

export interface AiStreamFilePart {
  type: "file" | "reasoning-file"
  mediaType: string
  url: string
  filename?: string
  providerMetadata?: unknown
}

export interface AiStreamDataPart<TData = unknown> {
  type: `data-${string}`
  id?: string
  data: TData
}

export interface AiStreamStepPart {
  type: "step-start"
}

export interface AiStreamCustomPart {
  type: "custom"
  kind: string
  providerMetadata?: unknown
}

export type AiStreamMessagePart<TData = unknown> =
  | AiStreamTextPart
  | AiStreamReasoningPart
  | AiStreamToolPart
  | AiStreamSourceUrlPart
  | AiStreamSourceDocumentPart
  | AiStreamFilePart
  | AiStreamDataPart<TData>
  | AiStreamStepPart
  | AiStreamCustomPart

/** Structurally compatible with a Vercel AI SDK UIMessage. */
export interface AiStreamMessage<TMetadata = unknown, TData = unknown> {
  id: string
  role: "assistant"
  parts: AiStreamMessagePart<TData>[]
  metadata?: TMetadata
  /** Preserves usage attached to Zonix's finish chunk. */
  usage?: unknown
  finishReason?: string
}

export interface AiStreamChunk {
  type: string
  [key: string]: unknown
}

export interface UseAiStreamOptions<TMetadata = unknown, TData = unknown> {
  /** Endpoint used by send(). consume() can be used without an endpoint. */
  api?: string
  /** Headers shared by send() requests. */
  headers?: HeadersInit
  /** Custom fetch implementation. */
  fetch?: typeof globalThis.fetch
  onChunk?: (chunk: AiStreamChunk) => void
  onData?: (part: AiStreamDataPart<TData>) => void
  onFinish?: (message: AiStreamMessage<TMetadata, TData>) => void
  onError?: (error: Error) => void
}

export interface AiStreamSendOptions extends Omit<
  RequestInit,
  "body" | "signal"
> {
  /** Overrides the JSON body generated from send(input). */
  body?: BodyInit | null
}

type StreamRuntime<TMetadata, TData> = {
  message: AiStreamMessage<TMetadata, TData>
  textParts: Map<string, number>
  reasoningParts: Map<string, number>
  toolParts: Map<string, number>
  toolInput: Map<string, string>
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isToolPart<TData>(
  part: AiStreamMessagePart<TData>
): part is AiStreamToolPart {
  return part.type === "dynamic-tool" || part.type.startsWith("tool-")
}

function mergeMetadata<TMetadata>(
  current: TMetadata | undefined,
  incoming: unknown
): TMetadata | undefined {
  if (incoming === undefined) return current
  if (isRecord(current) && isRecord(incoming)) {
    return { ...current, ...incoming } as TMetadata
  }
  return incoming as TMetadata
}

function cloneMessage<TMetadata, TData>(
  message: AiStreamMessage<TMetadata, TData>
): AiStreamMessage<TMetadata, TData> {
  return {
    ...message,
    parts: message.parts.map((part) => ({ ...part })),
  }
}

function createRuntime<TMetadata, TData>(): StreamRuntime<TMetadata, TData> {
  return {
    message: {
      id: globalThis.crypto.randomUUID(),
      role: "assistant",
      parts: [],
    },
    textParts: new Map(),
    reasoningParts: new Map(),
    toolParts: new Map(),
    toolInput: new Map(),
  }
}

function completeActiveParts<TMetadata, TData>(
  runtime: StreamRuntime<TMetadata, TData>
) {
  for (const index of runtime.textParts.values()) {
    const part = runtime.message.parts[index]
    if (part?.type === "text") part.state = "done"
  }
  for (const index of runtime.reasoningParts.values()) {
    const part = runtime.message.parts[index]
    if (part?.type === "reasoning") part.state = "done"
  }
  runtime.textParts.clear()
  runtime.reasoningParts.clear()
}

function addTextPart<TMetadata, TData>(
  runtime: StreamRuntime<TMetadata, TData>,
  id: string,
  type: "text" | "reasoning",
  providerMetadata?: unknown
) {
  const index = runtime.message.parts.length
  runtime.message.parts.push({
    type,
    text: "",
    state: "streaming",
    providerMetadata,
  })
  const parts = type === "text" ? runtime.textParts : runtime.reasoningParts
  parts.set(id, index)
  return index
}

function getToolPart<TMetadata, TData>(
  runtime: StreamRuntime<TMetadata, TData>,
  toolCallId: string
): AiStreamToolPart | undefined {
  const index = runtime.toolParts.get(toolCallId)
  if (index === undefined) return undefined
  const part = runtime.message.parts[index]
  return part && isToolPart(part) ? part : undefined
}

function addToolPart<TMetadata, TData>(
  runtime: StreamRuntime<TMetadata, TData>,
  chunk: AiStreamChunk,
  state: AiStreamToolPart["state"]
) {
  const toolCallId = String(chunk.toolCallId)
  const toolName = typeof chunk.toolName === "string" ? chunk.toolName : ""
  const part: AiStreamToolPart = {
    type: chunk.dynamic === true ? "dynamic-tool" : `tool-${toolName}`,
    toolCallId,
    toolName,
    state,
    input: chunk.input,
    providerExecuted:
      typeof chunk.providerExecuted === "boolean"
        ? chunk.providerExecuted
        : undefined,
    providerMetadata: chunk.providerMetadata,
  }
  const index = runtime.message.parts.length
  runtime.message.parts.push(part)
  runtime.toolParts.set(toolCallId, index)
  return part
}

function parseCompleteJson(value: string) {
  try {
    return JSON.parse(value) as unknown
  } catch {
    return undefined
  }
}

function applyChunk<TMetadata, TData>(
  runtime: StreamRuntime<TMetadata, TData>,
  chunk: AiStreamChunk
): AiStreamDataPart<TData> | undefined {
  const { message } = runtime

  switch (chunk.type) {
    case "start": {
      if (typeof chunk.messageId === "string") message.id = chunk.messageId
      message.metadata = mergeMetadata(message.metadata, chunk.messageMetadata)
      return
    }
    case "message-metadata": {
      message.metadata = mergeMetadata(message.metadata, chunk.messageMetadata)
      return
    }
    case "start-step": {
      message.parts.push({ type: "step-start" })
      return
    }
    case "finish-step": {
      completeActiveParts(runtime)
      return
    }
    case "text-start":
    case "reasoning-start": {
      const id = String(chunk.id)
      addTextPart(
        runtime,
        id,
        chunk.type === "text-start" ? "text" : "reasoning",
        chunk.providerMetadata
      )
      return
    }
    case "text-delta":
    case "reasoning-delta": {
      const id = String(chunk.id)
      const parts =
        chunk.type === "text-delta" ? runtime.textParts : runtime.reasoningParts
      // Zonix 0.3.x emits reasoning-delta without start/end chunks. Creating
      // the missing part here keeps the resulting message UIMessage-compatible.
      const index =
        parts.get(id) ??
        addTextPart(
          runtime,
          id,
          chunk.type === "text-delta" ? "text" : "reasoning",
          chunk.providerMetadata
        )
      const part = message.parts[index]
      if (part?.type === "text" || part?.type === "reasoning") {
        if (typeof chunk.delta === "string") part.text += chunk.delta
        part.providerMetadata = chunk.providerMetadata ?? part.providerMetadata
      }
      return
    }
    case "text-end":
    case "reasoning-end": {
      const id = String(chunk.id)
      const parts =
        chunk.type === "text-end" ? runtime.textParts : runtime.reasoningParts
      const index = parts.get(id)
      const part = index === undefined ? undefined : message.parts[index]
      if (part?.type === "text" || part?.type === "reasoning") {
        part.state = "done"
        part.providerMetadata = chunk.providerMetadata ?? part.providerMetadata
      }
      parts.delete(id)
      return
    }
    case "tool-input-start": {
      const toolCallId = String(chunk.toolCallId)
      runtime.toolInput.set(toolCallId, "")
      if (!getToolPart(runtime, toolCallId)) {
        addToolPart(runtime, chunk, "input-streaming")
      }
      return
    }
    case "tool-input-delta": {
      const toolCallId = String(chunk.toolCallId)
      const inputText =
        (runtime.toolInput.get(toolCallId) ?? "") +
        (typeof chunk.inputTextDelta === "string" ? chunk.inputTextDelta : "")
      runtime.toolInput.set(toolCallId, inputText)
      const part = getToolPart(runtime, toolCallId)
      if (part) {
        part.state = "input-streaming"
        part.inputText = inputText
        const input = parseCompleteJson(inputText)
        if (input !== undefined) part.input = input
      }
      return
    }
    case "tool-input-available": {
      const toolCallId = String(chunk.toolCallId)
      const part =
        getToolPart(runtime, toolCallId) ??
        addToolPart(runtime, chunk, "input-available")
      part.state = "input-available"
      part.input = chunk.input
      if (typeof chunk.toolName === "string") part.toolName = chunk.toolName
      return
    }
    case "tool-input-error": {
      const toolCallId = String(chunk.toolCallId)
      const part =
        getToolPart(runtime, toolCallId) ??
        addToolPart(runtime, chunk, "output-error")
      part.state = "output-error"
      part.input = chunk.input
      part.errorText = String(chunk.errorText ?? "Tool input failed")
      return
    }
    case "tool-output-available": {
      const part = getToolPart(runtime, String(chunk.toolCallId))
      if (part) {
        part.state = "output-available"
        part.output = chunk.output
        part.preliminary =
          typeof chunk.preliminary === "boolean" ? chunk.preliminary : undefined
      }
      return
    }
    case "tool-output-error": {
      const part = getToolPart(runtime, String(chunk.toolCallId))
      if (part) {
        part.state = "output-error"
        part.errorText = String(chunk.errorText ?? "Tool execution failed")
      }
      return
    }
    case "tool-output-denied": {
      const part = getToolPart(runtime, String(chunk.toolCallId))
      if (part) part.state = "output-denied"
      return
    }
    case "tool-approval-request": {
      const part = getToolPart(runtime, String(chunk.toolCallId))
      if (part) {
        part.state = "approval-requested"
        part.approval = { id: String(chunk.approvalId) }
      }
      return
    }
    case "tool-approval-response": {
      const approvalId = String(chunk.approvalId)
      const part = message.parts.find(
        (candidate): candidate is AiStreamToolPart =>
          isToolPart(candidate) && candidate.approval?.id === approvalId
      )
      if (part) {
        const approved = chunk.approved === true
        part.state = approved ? "approval-responded" : "output-denied"
        part.approval = {
          id: approvalId,
          approved,
          reason: typeof chunk.reason === "string" ? chunk.reason : undefined,
        }
      }
      return
    }
    case "source-url": {
      message.parts.push({
        type: "source-url",
        sourceId: String(chunk.sourceId),
        url: String(chunk.url),
        title: typeof chunk.title === "string" ? chunk.title : undefined,
        providerMetadata: chunk.providerMetadata,
      })
      return
    }
    case "source-document": {
      message.parts.push({
        type: "source-document",
        sourceId: String(chunk.sourceId),
        mediaType: String(chunk.mediaType),
        title: String(chunk.title),
        filename:
          typeof chunk.filename === "string" ? chunk.filename : undefined,
        providerMetadata: chunk.providerMetadata,
      })
      return
    }
    case "file":
    case "reasoning-file": {
      message.parts.push({
        type: chunk.type,
        mediaType: String(chunk.mediaType),
        url: String(chunk.url),
        filename:
          typeof chunk.filename === "string" ? chunk.filename : undefined,
        providerMetadata: chunk.providerMetadata,
      })
      return
    }
    case "custom": {
      message.parts.push({
        type: "custom",
        kind: String(chunk.kind),
        providerMetadata: chunk.providerMetadata,
      })
      return
    }
    case "finish": {
      completeActiveParts(runtime)
      message.metadata = mergeMetadata(message.metadata, chunk.messageMetadata)
      message.usage = chunk.usage
      message.finishReason =
        typeof chunk.finishReason === "string" ? chunk.finishReason : undefined
      return
    }
  }

  if (!chunk.type.startsWith("data-")) return

  if (chunk.type === "data-approval-required" && typeof chunk.id === "string") {
    const part = getToolPart(runtime, chunk.id)
    if (part) {
      const data = isRecord(chunk.data) ? chunk.data : undefined
      part.state = "approval-requested"
      part.approval = { id: chunk.id }
      if (data?.input !== undefined) part.input = data.input
      if (typeof data?.toolName === "string") part.toolName = data.toolName
    }
  }

  const dataPart: AiStreamDataPart<TData> = {
    type: chunk.type as `data-${string}`,
    id: typeof chunk.id === "string" ? chunk.id : undefined,
    data: chunk.data as TData,
  }
  if (chunk.transient !== true) {
    const existingIndex =
      dataPart.id === undefined
        ? -1
        : message.parts.findIndex(
            (part) =>
              part.type === dataPart.type &&
              "id" in part &&
              part.id === dataPart.id
          )
    if (existingIndex >= 0) message.parts[existingIndex] = dataPart
    else message.parts.push(dataPart)
  }
  return dataPart
}

function parseSseEvent(rawEvent: string) {
  const data = rawEvent
    .split(/\r?\n/)
    .filter((line) => line === "data" || line.startsWith("data:"))
    .map((line) => line.slice(5).replace(/^ /, ""))
    .join("\n")
  return data || undefined
}

async function* readSse(
  body: ReadableStream<Uint8Array>,
  onReader: (reader: ReadableStreamDefaultReader<Uint8Array> | null) => void
) {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""
  onReader(reader)

  try {
    while (true) {
      const { done, value } = await reader.read()
      buffer += decoder.decode(value, { stream: !done })

      let boundary = buffer.match(/\r?\n\r?\n/)
      while (boundary?.index !== undefined) {
        const rawEvent = buffer.slice(0, boundary.index)
        buffer = buffer.slice(boundary.index + boundary[0].length)
        const data = parseSseEvent(rawEvent)
        if (data !== undefined) yield data
        boundary = buffer.match(/\r?\n\r?\n/)
      }

      if (done) {
        const data = parseSseEvent(buffer)
        if (data !== undefined) yield data
        break
      }
    }
  } finally {
    onReader(null)
    reader.releaseLock()
  }
}

/**
 * Consumes a Vercel AI SDK UI Message Stream (SSE v1) without requiring the
 * `ai` package. The returned message parts can be rendered by WUI AI
 * components or other UIMessage-compatible renderers.
 */
export function useAiStream<TMetadata = unknown, TData = unknown>(
  options: UseAiStreamOptions<TMetadata, TData> = {}
) {
  const [message, setMessage] = React.useState<AiStreamMessage<
    TMetadata,
    TData
  > | null>(null)
  const [status, setStatus] = React.useState<AiStreamStatus>("idle")
  const [error, setError] = React.useState<Error | null>(null)
  const runtimeRef = React.useRef<StreamRuntime<TMetadata, TData> | null>(null)
  const readerRef =
    React.useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null)
  const controllerRef = React.useRef<AbortController | null>(null)
  const requestRef = React.useRef(0)
  const optionsRef = React.useRef(options)
  optionsRef.current = options

  const cancelCurrent = React.useCallback((updateState: boolean) => {
    requestRef.current += 1
    controllerRef.current?.abort()
    controllerRef.current = null
    void readerRef.current?.cancel()
    readerRef.current = null
    if (updateState && runtimeRef.current) {
      completeActiveParts(runtimeRef.current)
      setMessage(cloneMessage(runtimeRef.current.message))
    }
    if (updateState) setStatus("idle")
  }, [])

  React.useEffect(() => () => cancelCurrent(false), [cancelCurrent])

  const consumeResponse = React.useCallback(
    async (response: Response, requestId: number) => {
      try {
        if (!response.ok) {
          throw new Error(
            `AI stream request failed: ${response.status} ${response.statusText}`
          )
        }
        if (!response.body) throw new Error("AI stream response has no body")

        const runtime = createRuntime<TMetadata, TData>()
        runtimeRef.current = runtime
        setMessage(cloneMessage(runtime.message))
        setError(null)
        setStatus("streaming")

        let abortedByChunk = false
        for await (const data of readSse(response.body, (reader) => {
          if (requestRef.current === requestId) readerRef.current = reader
        })) {
          if (requestRef.current !== requestId) return runtime.message
          if (data === "[DONE]") break

          const chunk = JSON.parse(data) as AiStreamChunk
          if (!isRecord(chunk) || typeof chunk.type !== "string") {
            throw new Error("AI stream received an invalid chunk")
          }
          if (chunk.type === "error") {
            throw new Error(String(chunk.errorText ?? "AI stream failed"))
          }
          if (chunk.type === "abort") {
            abortedByChunk = true
            break
          }

          const dataPart = applyChunk(runtime, chunk)
          optionsRef.current.onChunk?.(chunk)
          if (dataPart) optionsRef.current.onData?.(dataPart)
          setMessage(cloneMessage(runtime.message))
        }

        if (requestRef.current !== requestId) return runtime.message
        completeActiveParts(runtime)
        const finalMessage = cloneMessage(runtime.message)
        setMessage(finalMessage)
        setStatus("idle")
        if (!abortedByChunk) optionsRef.current.onFinish?.(finalMessage)
        return finalMessage
      } catch (cause) {
        if (requestRef.current !== requestId) return runtimeRef.current?.message
        const nextError =
          cause instanceof Error ? cause : new Error("AI stream failed")
        setError(nextError)
        setStatus("error")
        optionsRef.current.onError?.(nextError)
        return runtimeRef.current?.message
      } finally {
        if (requestRef.current === requestId) {
          readerRef.current = null
          controllerRef.current = null
        }
      }
    },
    []
  )

  const consume = React.useCallback(
    (response: Response) => {
      cancelCurrent(false)
      const requestId = requestRef.current
      setStatus("submitted")
      return consumeResponse(response, requestId)
    },
    [cancelCurrent, consumeResponse]
  )

  const send = React.useCallback(
    async (input?: unknown, init: AiStreamSendOptions = {}) => {
      const {
        api,
        fetch: customFetch,
        headers: sharedHeaders,
      } = optionsRef.current
      if (!api) throw new Error("useAiStream send() requires an api option")

      cancelCurrent(false)
      const requestId = requestRef.current
      const controller = new AbortController()
      controllerRef.current = controller
      setError(null)
      setStatus("submitted")

      const headers = new Headers(sharedHeaders)
      new Headers(init.headers).forEach((value, key) => headers.set(key, value))
      const body =
        init.body !== undefined
          ? init.body
          : input === undefined
            ? undefined
            : JSON.stringify(input)
      if (
        input !== undefined &&
        init.body === undefined &&
        !headers.has("content-type")
      ) {
        headers.set("content-type", "application/json")
      }

      try {
        const response = await (customFetch ?? globalThis.fetch)(api, {
          ...init,
          method: init.method ?? "POST",
          headers,
          body,
          signal: controller.signal,
        })
        return consumeResponse(response, requestId)
      } catch (cause) {
        if (requestRef.current !== requestId) return runtimeRef.current?.message
        controllerRef.current = null
        const nextError =
          cause instanceof Error ? cause : new Error("AI stream request failed")
        setError(nextError)
        setStatus("error")
        optionsRef.current.onError?.(nextError)
        return runtimeRef.current?.message
      }
    },
    [cancelCurrent, consumeResponse]
  )

  const reset = React.useCallback(() => {
    cancelCurrent(false)
    runtimeRef.current = null
    setMessage(null)
    setError(null)
    setStatus("idle")
  }, [cancelCurrent])

  const text = React.useMemo(
    () =>
      message?.parts
        .filter((part): part is AiStreamTextPart => part.type === "text")
        .map((part) => part.text)
        .join("") ?? "",
    [message]
  )
  const reasoning = React.useMemo(
    () =>
      message?.parts
        .filter(
          (part): part is AiStreamReasoningPart => part.type === "reasoning"
        )
        .map((part) => part.text)
        .join("") ?? "",
    [message]
  )
  const toolParts = React.useMemo(
    () =>
      message?.parts.filter((part): part is AiStreamToolPart =>
        isToolPart(part)
      ) ?? [],
    [message]
  )

  return {
    message,
    text,
    reasoning,
    toolParts,
    status,
    error,
    isStreaming: status === "submitted" || status === "streaming",
    send,
    consume,
    stop: () => cancelCurrent(true),
    reset,
  }
}
