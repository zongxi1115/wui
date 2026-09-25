"use client"

import * as React from "react"
import { ArrowUpIcon, MicIcon, SquareIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { AiVoiceVisualizer } from "@/registry/ui/ai-voice-visualizer"

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`
}

export default function AiVoiceVisualizerLive() {
  const [recording, setRecording] = React.useState(false)
  const [level, setLevel] = React.useState(0)
  const [seconds, setSeconds] = React.useState(0)

  // Simulated microphone input: a speech-like envelope with short pauses.
  React.useEffect(() => {
    if (!recording) return
    let frame = 0
    const timer = window.setInterval(() => {
      frame += 1
      const pause = Math.sin(frame / 9) < -0.6
      setLevel(pause ? 0.05 : 0.25 + Math.random() * 0.65)
    }, 110)
    const clock = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => {
      window.clearInterval(timer)
      window.clearInterval(clock)
    }
  }, [recording])

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="flex h-12 items-center gap-3 rounded-full border bg-background pl-2 pr-1.5">
        <Button
          type="button"
          variant={recording ? "destructive" : "ghost"}
          size="icon"
          className="size-9 shrink-0 rounded-full"
          aria-label={recording ? "停止录音" : "开始录音"}
          onClick={() => {
            if (!recording) setSeconds(0)
            setRecording((current) => !current)
          }}
        >
          {recording ? <SquareIcon className="size-3 fill-current" /> : <MicIcon />}
        </Button>

        <AiVoiceVisualizer
          variant="bars"
          barCount={24}
          size="sm"
          state={recording ? "listening" : "idle"}
          audioLevel={recording ? level : undefined}
          className="min-w-0 flex-1 justify-start overflow-hidden"
        />

        <span className="w-9 shrink-0 text-right font-mono text-xs tabular-nums text-muted-foreground">
          {formatTime(seconds)}
        </span>

        <Button
          type="button"
          size="icon"
          className="size-9 shrink-0 rounded-full"
          aria-label="发送语音"
          disabled={recording || seconds === 0}
        >
          <ArrowUpIcon />
        </Button>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        {recording ? "正在录音，停顿时电平会自然回落" : "点击麦克风开始录音"}
      </p>
    </div>
  )
}
