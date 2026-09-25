"use client"

import * as React from "react"
import { RotateCcwIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextScramble } from "@/registry/ui/text-scramble"

const presets = [
  { name: "二进制", set: "01", text: "BUILD_7F3A_PASSED" },
  { name: "十六进制", set: "0123456789ABCDEF", text: "0x7F9A2B4C8D1E" },
  { name: "代码符号", set: "{}[]<>/\\!@#$%^&*~:;?", text: "deploy --prod --yes" },
  { name: "大写字母", set: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", text: "ORDER SHIPPED" },
]

export default function TextScrambleCharacterSets() {
  const [round, setRound] = React.useState(0)

  return (
    <div className="w-full max-w-lg">
      <dl key={round} className="divide-y border-y">
        {presets.map((item) => (
          <div
            key={item.name}
            className="grid grid-cols-[5.5rem_1fr] items-baseline gap-3 py-3"
          >
            <dt>
              <span className="block text-sm">{item.name}</span>
              <code className="text-muted-foreground block truncate text-xs">
                {item.set}
              </code>
            </dt>
            <dd>
              <TextScramble
                as="span"
                duration={1}
                characterSet={item.set}
                className="text-sm font-medium"
              >
                {item.text}
              </TextScramble>
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-3 flex justify-end">
        <Button variant="ghost" size="sm" onClick={() => setRound((r) => r + 1)}>
          <RotateCcwIcon />
          全部重播
        </Button>
      </div>
    </div>
  )
}
