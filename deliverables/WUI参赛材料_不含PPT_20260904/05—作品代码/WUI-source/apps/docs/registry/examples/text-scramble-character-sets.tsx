"use client"

import * as React from "react"
import { RefreshCw } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextScramble } from "@/registry/ui/text-scramble"

const presets = [
  {
    name: "二进制流 (Binary)",
    set: "01",
    text: "NEURAL_NETWORK_V4",
    desc: "纯 0 与 1 快速闪烁，适合黑客与底层计算主题。",
  },
  {
    name: "十六进制 (Hexadecimal)",
    set: "0123456789ABCDEF",
    text: "0x7F9A2B4C8D1E",
    desc: "内存地址与加密哈希常用的字符集。",
  },
  {
    name: "代码符号 (Syntax & Matrix)",
    set: "{}[]<>/\\!@#$%^&*~:;?",
    text: "COMPILER_SYNTAX_OK",
    desc: "代码标点符号闪烁，极具科幻未来感。",
  },
  {
    name: "标准全字母数字 (Alphanumeric)",
    set: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    text: "Enterprise Cloud Cluster",
    desc: "全字母数字平滑过渡，通用且清晰。",
  },
]

export default function TextScrambleCharacterSets() {
  const [trigger, setTrigger] = React.useState(true)

  const handleReplay = () => {
    setTrigger(false)
    window.setTimeout(() => setTrigger(true), 60)
  }

  return (
    <div className="flex w-full max-w-xl flex-col gap-5 rounded-xl border border-border bg-card p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          自定义字符采样集 (characterSet)
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleReplay}
          className="gap-1.5 text-xs"
        >
          <RefreshCw className="size-3" />
          全量重放
        </Button>
      </div>

      <div className="space-y-3">
        {presets.map((item, index) => (
          <div
            key={index}
            className="flex flex-col gap-1 rounded-lg border border-border bg-muted/20 p-3.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted-foreground">
                {item.name}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground/80">
                set: {item.set.length > 20 ? item.set.slice(0, 16) + "..." : item.set}
              </span>
            </div>
            <TextScramble
              as="div"
              trigger={trigger}
              duration={1.0}
              characterSet={item.set}
              className="font-mono text-sm font-semibold text-foreground tracking-wide"
            >
              {item.text}
            </TextScramble>
            <span className="text-[10px] text-muted-foreground">{item.desc}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
