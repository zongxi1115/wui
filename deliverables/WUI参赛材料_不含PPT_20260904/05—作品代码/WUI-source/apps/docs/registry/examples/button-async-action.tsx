"use client"

import * as React from "react"
import { CheckIcon, Loader2Icon, SendIcon } from "lucide-react"
import { Button } from "@/registry/ui/button"

export default function ButtonAsyncAction() {
  const [status, setStatus] = React.useState<"idle" | "loading" | "success">("idle")

  const handleSubmit = async () => {
    setStatus("loading")
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setStatus("success")
    setTimeout(() => setStatus("idle"), 2000)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        onClick={handleSubmit}
        disabled={status !== "idle"}
        motion
        ripple
        className="min-w-32"
      >
        {status === "loading" && <Loader2Icon className="animate-spin" />}
        {status === "success" && <CheckIcon className="text-emerald-300" />}
        {status === "idle" && <SendIcon />}
        <span>
          {status === "loading"
            ? "发布中..."
            : status === "success"
              ? "发布成功"
              : "发布内容"}
        </span>
      </Button>

      <Button
        variant="outline"
        onClick={() => setStatus("idle")}
        disabled={status === "idle"}
      >
        重置状态
      </Button>
    </div>
  )
}
