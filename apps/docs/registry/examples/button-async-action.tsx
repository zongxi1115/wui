"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { CheckIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"

type Status = "idle" | "loading" | "success"

const labels: Record<Status, string> = {
  idle: "发布文章",
  loading: "发布中",
  success: "已发布",
}

export default function ButtonAsyncAction() {
  const [status, setStatus] = React.useState<Status>("idle")
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([])

  React.useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const publish = () => {
    timers.current.forEach(clearTimeout)
    setStatus("loading")
    timers.current.push(
      setTimeout(() => setStatus("success"), 1500),
      setTimeout(() => setStatus("idle"), 3200)
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        motion
        loading={status === "loading"}
        onClick={status === "idle" ? publish : undefined}
      >
        <AnimatePresence initial={false}>
          {status === "success" ? (
            <motion.span
              key="check"
              className="inline-flex"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <CheckIcon />
            </motion.span>
          ) : null}
        </AnimatePresence>
        {labels[status]}
      </Button>
      <span className="text-muted-foreground text-xs">
        发布期间按钮自动禁用，避免重复提交
      </span>
    </div>
  )
}
