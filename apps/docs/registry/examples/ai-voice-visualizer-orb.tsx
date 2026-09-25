"use client"

import * as React from "react"
import { MicIcon, MicOffIcon, PhoneOffIcon, PhoneIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  AiVoiceVisualizer,
  type AiVoiceVisualizerState,
} from "@/registry/ui/ai-voice-visualizer"

/** A scripted voice turn: listen → think → speak → listen … */
const SCRIPT: Array<{ state: AiVoiceVisualizerState; ms: number }> = [
  { state: "listening", ms: 3200 },
  { state: "thinking", ms: 1600 },
  { state: "speaking", ms: 4200 },
]

const LABELS: Record<AiVoiceVisualizerState, string> = {
  idle: "通话已结束",
  listening: "正在聆听…",
  thinking: "正在思考…",
  speaking: "正在回复",
}

export default function AiVoiceVisualizerOrb() {
  const [active, setActive] = React.useState(true)
  const [muted, setMuted] = React.useState(false)
  const [step, setStep] = React.useState(0)

  React.useEffect(() => {
    if (!active) return
    const timer = window.setTimeout(
      () => setStep((current) => (current + 1) % SCRIPT.length),
      SCRIPT[step].ms
    )
    return () => window.clearTimeout(timer)
  }, [active, step])

  const scripted = SCRIPT[step].state
  const state: AiVoiceVisualizerState = !active
    ? "idle"
    : muted && scripted === "listening"
      ? "idle"
      : scripted

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col items-center gap-6">
      <AiVoiceVisualizer variant="orb" state={state} className="size-32" />

      <div className="text-center" aria-live="polite">
        <p className="text-sm font-medium text-foreground">
          {muted && scripted === "listening" && active ? "麦克风已静音" : LABELS[state]}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          说话时可以随时打断回复
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-11 rounded-full"
          aria-label={muted ? "取消静音" : "静音"}
          aria-pressed={muted}
          disabled={!active}
          onClick={() => setMuted((current) => !current)}
        >
          {muted ? <MicOffIcon /> : <MicIcon />}
        </Button>
        <Button
          type="button"
          variant={active ? "destructive" : "default"}
          size="icon"
          className="size-11 rounded-full"
          aria-label={active ? "挂断" : "重新呼叫"}
          onClick={() => {
            setStep(0)
            setActive((current) => !current)
          }}
        >
          {active ? <PhoneOffIcon /> : <PhoneIcon />}
        </Button>
      </div>
    </div>
  )
}
