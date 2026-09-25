"use client"

import * as React from "react"

import { Slider } from "@/registry/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/registry/ui/toggle-group"
import {
  AiVoiceVisualizer,
  type AiVoiceVisualizerState,
} from "@/registry/ui/ai-voice-visualizer"

const STATES: Array<{ value: AiVoiceVisualizerState; label: string }> = [
  { value: "idle", label: "空闲" },
  { value: "listening", label: "聆听" },
  { value: "thinking", label: "思考" },
  { value: "speaking", label: "回复" },
]

const VARIANTS = [
  { variant: "bars", label: "柱状" },
  { variant: "orb", label: "光环" },
  { variant: "wave", label: "波形" },
] as const

export default function AiVoiceVisualizerDemo() {
  const [state, setState] = React.useState<AiVoiceVisualizerState>("speaking")
  const [level, setLevel] = React.useState([60])

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8">
      <div className="grid w-full grid-cols-3 gap-4">
        {VARIANTS.map((item) => (
          <div key={item.variant} className="flex flex-col items-center gap-3">
            <div className="flex h-16 items-center justify-center">
              <AiVoiceVisualizer
                variant={item.variant}
                state={state}
                audioLevel={level[0] / 100}
                size="lg"
              />
            </div>
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="flex w-full flex-col gap-4">
        <ToggleGroup
          type="single"
          value={state}
          onValueChange={(value) =>
            value && setState(value as AiVoiceVisualizerState)
          }
          aria-label="语音状态"
          className="self-center"
        >
          {STATES.map((item) => (
            <ToggleGroupItem key={item.value} value={item.value} className="px-3">
              {item.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <label className="grid gap-2.5 text-xs">
          <span className="flex justify-between text-muted-foreground">
            输入电平
            <span className="font-mono tabular-nums text-foreground">
              {level[0]}%
            </span>
          </span>
          <Slider
            value={level}
            onValueChange={setLevel}
            min={0}
            max={100}
            step={5}
            showValue="never"
          />
        </label>
      </div>
    </div>
  )
}
