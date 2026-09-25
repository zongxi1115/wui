"use client"

import * as React from "react"

import { Switch } from "@/registry/ui/switch"
import {
  TextRotate,
  type TextRotateStaggerFrom,
} from "@/registry/ui/text-rotate"
import { ToggleGroup, ToggleGroupItem } from "@/registry/ui/toggle-group"

const origins: { value: Exclude<TextRotateStaggerFrom, number>; label: string }[] = [
  { value: "first", label: "首字" },
  { value: "center", label: "居中" },
  { value: "last", label: "末字" },
  { value: "random", label: "随机" },
]

export default function TextRotateCharacters() {
  const [staggerFrom, setStaggerFrom] =
    React.useState<Exclude<TextRotateStaggerFrom, number>>("first")
  const [direction, setDirection] = React.useState<"up" | "down">("up")
  const [blur, setBlur] = React.useState(false)

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-8">
      <div className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        <TextRotate
          texts={["Design", "Prototype", "Review", "Ship"]}
          staggerFrom={staggerFrom}
          direction={direction}
          blur={blur}
          interval={2}
        />
      </div>

      <div className="flex w-full flex-col gap-3 border-t pt-4 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">错峰起点</span>
          <ToggleGroup
            type="single"
            size="sm"
            value={staggerFrom}
            onValueChange={(value) =>
              value && setStaggerFrom(value as typeof staggerFrom)
            }
            aria-label="错峰起点"
          >
            {origins.map((origin) => (
              <ToggleGroupItem key={origin.value} value={origin.value}>
                {origin.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">运动方向</span>
          <ToggleGroup
            type="single"
            size="sm"
            value={direction}
            onValueChange={(value) =>
              value && setDirection(value as typeof direction)
            }
            aria-label="运动方向"
          >
            <ToggleGroupItem value="up">向上</ToggleGroupItem>
            <ToggleGroupItem value="down">向下</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <label className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">进出场模糊</span>
          <Switch checked={blur} onCheckedChange={setBlur} />
        </label>
      </div>
    </div>
  )
}
