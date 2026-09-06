"use client"

import * as React from "react"
import { Button } from "@/registry/ui/button"
import {
  AiVoiceVisualizer,
  type AiVoiceVisualizerState,
} from "@/registry/ui/ai-voice-visualizer"

export default function AiVoiceVisualizerDemo() {
  const [state, setState] = React.useState<AiVoiceVisualizerState>("speaking")
  const [audioLevel, setAudioLevel] = React.useState(0.6)

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-6">
      <div className="flex w-full flex-wrap items-center justify-around gap-6 rounded-xl border bg-card p-6 shadow-xs">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground">Bars (柱状波形)</span>
          <AiVoiceVisualizer
            variant="bars"
            state={state}
            audioLevel={audioLevel}
            size="md"
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground">Orb (呼吸光环)</span>
          <AiVoiceVisualizer
            variant="orb"
            state={state}
            audioLevel={audioLevel}
            size="md"
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground">Wave (声波曲线)</span>
          <AiVoiceVisualizer
            variant="wave"
            state={state}
            audioLevel={audioLevel}
            size="md"
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 w-full max-w-xs">
        <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
          <span>实时音量 (Audio Level):</span>
          <span className="font-mono">{(audioLevel * 100).toFixed(0)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={audioLevel}
          onChange={(e) => setAudioLevel(parseFloat(e.target.value))}
          className="h-1.5 w-full cursor-pointer accent-primary"
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          variant={state === "idle" ? "default" : "outline"}
          size="sm"
          onClick={() => setState("idle")}
        >
          Idle (静止)
        </Button>
        <Button
          variant={state === "listening" ? "default" : "outline"}
          size="sm"
          onClick={() => setState("listening")}
        >
          Listening (聆听)
        </Button>
        <Button
          variant={state === "thinking" ? "default" : "outline"}
          size="sm"
          onClick={() => setState("thinking")}
        >
          Thinking (思考)
        </Button>
        <Button
          variant={state === "speaking" ? "default" : "outline"}
          size="sm"
          onClick={() => setState("speaking")}
        >
          Speaking (发音)
        </Button>
      </div>
    </div>
  )
}
