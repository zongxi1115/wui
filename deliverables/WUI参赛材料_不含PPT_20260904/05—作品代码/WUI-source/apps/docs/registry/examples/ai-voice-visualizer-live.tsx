"use client"

import * as React from "react"
import { MicIcon, SquareIcon } from "lucide-react"

import { AiVoiceVisualizer } from "@/registry/ui/ai-voice-visualizer"

export default function AiVoiceVisualizerLive() {
  const [isRecording, setIsRecording] = React.useState(true)
  const [level, setLevel] = React.useState(0.4)

  React.useEffect(() => {
    if (!isRecording) return
    const timer = setInterval(() => {
      setLevel(0.15 + Math.random() * 0.75)
    }, 120)
    return () => clearInterval(timer)
  }, [isRecording])

  return (
    <div className="flex w-full max-w-md flex-col gap-4 rounded-xl border bg-card p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground">语音输入条 (Live Bar Spectrum)</span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {isRecording ? (
            <>
              <span className="size-2 rounded-full bg-red-500 animate-pulse" />
              正在录音 (16kHz)
            </>
          ) : (
            "已暂停"
          )}
        </span>
      </div>

      <div className="flex h-12 items-center justify-between rounded-lg border bg-muted/30 px-4">
        <div className="flex items-center gap-3">
          <AiVoiceVisualizer
            variant="bars"
            barCount={7}
            size="md"
            state={isRecording ? "speaking" : "idle"}
            audioLevel={isRecording ? level : 0}
          />
          <span className="text-xs text-muted-foreground">
            {isRecording ? "识别到声音信号..." : "点击麦克风开启录音"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsRecording(!isRecording)}
          className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-xs transition-opacity hover:opacity-90 cursor-pointer"
        >
          {isRecording ? <SquareIcon className="size-3.5" /> : <MicIcon className="size-3.5" />}
        </button>
      </div>

      {/* 尺寸对比 */}
      <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
        <span>小尺寸 (sm):</span>
        <AiVoiceVisualizer
          variant="bars"
          size="sm"
          state="speaking"
          audioLevel={level}
        />
        <span>标准 (md):</span>
        <AiVoiceVisualizer
          variant="wave"
          size="md"
          state="speaking"
          audioLevel={level}
        />
      </div>
    </div>
  )
}
