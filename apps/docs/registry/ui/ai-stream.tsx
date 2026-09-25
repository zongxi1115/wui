"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/registry/lib/utils"

export interface AiStreamEdgeProps extends React.ComponentProps<"span"> {}

/** Renders the shared feather treatment used by streaming text edges. */
function AiStreamEdge({ className, style, ...props }: AiStreamEdgeProps) {
  return (
    <span
      data-slot="ai-stream-edge"
      className={cn("box-decoration-clone", className)}
      style={{
        backgroundImage:
          "linear-gradient(90deg, currentColor 0%, currentColor 42%, transparent 100%)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        ...style,
      }}
      {...props}
    />
  )
}

export interface AiStreamCaretProps extends React.ComponentProps<"span"> {}

/** A thin blinking caret appended to text that is still being generated. */
function AiStreamCaret({ className, ...props }: AiStreamCaretProps) {
  return (
    <span
      aria-hidden
      data-slot="ai-stream-caret"
      className={cn(
        "ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] rounded-full bg-current align-baseline motion-safe:animate-caret-blink",
        className
      )}
      {...props}
    />
  )
}

export interface AiStreamProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  /** The complete text received so far. */
  children: string
  /** Whether more text is expected. @default false */
  isStreaming?: boolean
  /** Number of trailing characters covered by the live feather. @default 18 */
  featherLength?: number
  /** Show a blinking caret after the newest character while streaming. @default false */
  caret?: boolean
}

/**
 * Renders cumulative streamed text with a feathered right edge. When the
 * stream ends, the feather dissolves into solid text instead of snapping.
 */
function AiStream({
  className,
  children,
  isStreaming = false,
  featherLength = 18,
  caret = false,
  ...props
}: AiStreamProps) {
  const reduceMotion = useReducedMotion()
  const [settling, setSettling] = React.useState(false)
  const wasStreaming = React.useRef(isStreaming)

  React.useEffect(() => {
    if (isStreaming) setSettling(false)
    else if (wasStreaming.current && !reduceMotion) setSettling(true)
    wasStreaming.current = isStreaming
  }, [isStreaming, reduceMotion])

  const split = isStreaming || settling
  const tailLength = split
    ? Math.min(Math.max(featherLength, 0), children.length)
    : 0
  const stableText = tailLength > 0 ? children.slice(0, -tailLength) : children
  const liveEdge = tailLength > 0 ? children.slice(-tailLength) : ""

  return (
    <div
      data-slot="ai-stream"
      data-streaming={isStreaming ? "true" : "false"}
      aria-live={isStreaming ? "polite" : undefined}
      aria-busy={isStreaming}
      className={cn("whitespace-pre-wrap", className)}
      {...props}
    >
      {stableText}
      {liveEdge ? (
        <AiStreamEdge
          className="transition-[background-size] duration-500 ease-out"
          style={{ backgroundSize: settling ? "420% 100%" : "100% 100%" }}
          onTransitionEnd={() => setSettling(false)}
        >
          {liveEdge}
        </AiStreamEdge>
      ) : null}
      {caret && isStreaming ? <AiStreamCaret /> : null}
    </div>
  )
}

export interface AiStreamDeltasProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  /** Ordered delta segments. Append entries without rewriting previous ones. */
  deltas: readonly string[]
  /** Whether more deltas are expected. @default false */
  isStreaming?: boolean
  /** Show a blinking caret after the newest delta while streaming. @default false */
  caret?: boolean
}

/** Renders each incoming delta as a short, independent blur-to-sharp segment. */
function AiStreamDeltas({
  className,
  deltas,
  isStreaming = false,
  caret = false,
  ...props
}: AiStreamDeltasProps) {
  const reduceMotion = useReducedMotion()

  return (
    <div
      data-slot="ai-stream-deltas"
      data-streaming={isStreaming ? "true" : "false"}
      aria-live={isStreaming ? "polite" : undefined}
      aria-busy={isStreaming}
      className={cn("whitespace-pre-wrap", className)}
      {...props}
    >
      {deltas.map((delta, index) => (
        <motion.span
          key={index}
          data-slot="ai-stream-delta"
          initial={
            reduceMotion ? false : { opacity: 0, filter: "blur(4px)" }
          }
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
          }
        >
          {delta}
        </motion.span>
      ))}
      {caret && isStreaming ? <AiStreamCaret /> : null}
    </div>
  )
}

export { AiStream, AiStreamCaret, AiStreamDeltas, AiStreamEdge }
