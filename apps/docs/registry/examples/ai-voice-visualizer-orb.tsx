"use client"

import * as React from "react"
import { MicIcon, MicOffIcon, PhoneOffIcon, SparklesIcon, Volume2Icon } from "lucide-react"

import {
  AiVoiceVisualizer,
  type AiVoiceVisualizerState,
} from "@/registry/ui/ai-voice-visualizer"

export default function AiVoiceVisualizerOrb() {
  const [state, setState] = React.useState<AiVoiceVisualizerState>("listening")
  const [isMuted, setIsMuted] = React.useState(false)
  const [audioLevel, setAudioLevel] = React.useState(0.5)

  // 模拟声音起伏
  React.useEffect(() => {
    if (state === "idle" || isMuted) {
      setAudioLevel(0)
      return
    }

    const interval = setInterval(() => {
      setAudioLevel(0.2 + Math.random() * 0.6)
    }, 200)

    return () => clearInterval(interval)
  }, [state, isMuted])

  const stateLabels = {
    idle: "通话已暂停",
    listening: "正在聆听您的说话...",
    thinking: "AI 正在思考中...",
    speaking: "AI 正在回复您...",
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl border bg-card p-6 shadow-lg">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <SparklesIcon className="size-4" />
          <span>Realtime Voice Agent</span>
        </div>
        <span className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
          <Volume2Icon className="size-3.5 text-emerald-500" /> HD Audio
        </span>
      </div>

      {/* 核心呼吸光球区域 */}
      <div className="relative flex size-36 items-center justify-center">
        <AiVoiceVisualizer
          variant="orb"
          size="lg"
          state={isMuted ? "idle" : state}
          audioLevel={isMuted ? 0 : audioLevel}
          className="size-32"
        />
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-foreground">
          {isMuted ? "麦克风已静音" : stateLabels[state]}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          支持全双工实时打断与连续对话
        </p>
      </div>

      {/* 底部控制栏 */}
      <div className="flex w-full items-center justify-center gap-4 border-t pt-4">
        <button
          type="button"
          onClick={() => setIsMuted(!isMuted)}
          className={`flex size-11 items-center justify-center rounded-full border transition-colors cursor-pointer ${
            isMuted
              ? "border-destructive/40 bg-destructive/10 text-destructive"
              : "border-border bg-muted/60 text-foreground hover:bg-muted"
          }`}
          title={isMuted ? "解除静音" : "静音麦克风"}
        >
          {isMuted ? <MicOffIcon className="size-4" /> : <MicIcon className="size-4" />}
        </button>

        {/* 状态切换按钮模拟 */}
        <button
          type="button"
          onClick={() => {
            const nextStates: AiVoiceVisualizerState[] = ["listening", "thinking", "speaking"]
            const nextIdx = (nextStates.indexOf(state) + 1) % nextStates.length
            setState(nextStates[nextIdx])
          }}
          className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
        >
          模拟状态切换
        </button>

        <button
          type="button"
          onClick={() => setState("idle")}
          className="flex size-11 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
          title="挂断通话"
        >
          <PhoneOffIcon className="size-4" />
        </button>
      </div>
    </div>
  )
}
