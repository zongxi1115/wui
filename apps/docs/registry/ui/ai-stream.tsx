"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { cn } from "@/registry/lib/utils"

export interface AiStreamProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /** The complete text received so far. */
  children: string
  /** Whether more text is expected. @default false */
  isStreaming?: boolean
  /** Number of trailing characters covered by the live feather. @default 18 */
  featherLength?: number
}

/** Renders cumulative streamed text with a feathered right edge. */
function AiStream({
  className,
  children,
  isStreaming = false,
  featherLength = 18,
  ...props
}: AiStreamProps) {
  const tailLength = isStreaming
    ? Math.min(Math.max(featherLength, 0), children.length)
    : 0
  const stableText = tailLength > 0 ? children.slice(0, -tailLength) : children
  const liveEdge = tailLength > 0 ? children.slice(-tailLength) : ""

  return (
    <div
      data-slot="ai-stream"
      aria-live={isStreaming ? "polite" : undefined}
      aria-busy={isStreaming}
      className={cn("whitespace-pre-wrap", className)}
      {...props}
    >
      {stableText}
      {liveEdge ? (
        <span
          data-slot="ai-stream-edge"
          className="box-decoration-clone"
          style={{
            backgroundImage:
              "linear-gradient(90deg, currentColor 0%, currentColor 42%, transparent 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {liveEdge}
        </span>
      ) : null}
    </div>
  )
}

export interface AiStreamDeltasProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /** Ordered delta segments. Append entries without rewriting previous ones. */
  deltas: readonly string[]
  /** Whether more deltas are expected. @default false */
  isStreaming?: boolean
}

/** Renders each incoming delta as a short, independent fade-in segment. */
function AiStreamDeltas({
  className,
  deltas,
  isStreaming = false,
  ...props
}: AiStreamDeltasProps) {
  const reduceMotion = useReducedMotion()

  return (
    <div
      data-slot="ai-stream-deltas"
      aria-live={isStreaming ? "polite" : undefined}
      aria-busy={isStreaming}
      className={cn("whitespace-pre-wrap", className)}
      {...props}
    >
      <AnimatePresence initial={false}>
        {deltas.map((delta, index) => (
          <motion.span
            key={index}
            data-slot="ai-stream-delta"
            initial={
              reduceMotion
                ? false
                : { opacity: 0, y: 3, filter: "blur(3px)" }
            }
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
            }
          >
            {delta}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}

export { AiStream, AiStreamDeltas }
