"use client"

import * as React from "react"
import { CheckIcon, LoaderCircleIcon, SaveIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextMorph } from "@/registry/ui/text-morph"

type State = "idle" | "saving" | "saved"

const labels: Record<State, string> = {
  idle: "保存草稿",
  saving: "正在保存草稿",
  saved: "草稿已保存",
}

const icons: Record<State, React.ReactNode> = {
  idle: <SaveIcon />,
  saving: <LoaderCircleIcon className="animate-spin" />,
  saved: <CheckIcon />,
}

export default function TextMorphDemo() {
  const [state, setState] = React.useState<State>("idle")
  const timers = React.useRef<number[]>([])

  React.useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((timer) => window.clearTimeout(timer))
  }, [])

  const save = () => {
    if (state !== "idle") return
    setState("saving")
    timers.current.push(
      window.setTimeout(() => setState("saved"), 1200),
      window.setTimeout(() => setState("idle"), 3000)
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="outline" onClick={save} aria-live="polite">
        {icons[state]}
        <TextMorph as="span">{labels[state]}</TextMorph>
      </Button>
      <p className="text-muted-foreground text-xs">
        相同的字会滑到新位置，新出现的字淡入，消失的字淡出
      </p>
    </div>
  )
}
