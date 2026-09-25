"use client"

import * as React from "react"
import { CheckIcon, CopyIcon, EyeIcon, EyeOffIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextScramble } from "@/registry/ui/text-scramble"

const TOKEN = "wui_prod_994a8f17e34cb129486c"
const MASKED = "wui_prod_••••••••••••••••••••"

export default function TextScrambleAuthToken() {
  const [revealed, setRevealed] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(TOKEN)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-2 flex items-baseline justify-between">
        <p className="text-sm font-medium">生产环境密钥</p>
        <p className="text-muted-foreground text-xs">创建于 2026-08-12</p>
      </div>
      <div className="flex items-center gap-1 rounded-md border bg-muted/40 py-1 pl-3 pr-1">
        <TextScramble
          as="span"
          trigger={revealed}
          duration={0.7}
          characterSet="0123456789abcdef"
          className="min-w-0 flex-1 truncate text-sm"
        >
          {revealed ? TOKEN : MASKED}
        </TextScramble>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={() => setRevealed((value) => !value)}
          aria-label={revealed ? "隐藏密钥" : "显示密钥"}
        >
          {revealed ? <EyeOffIcon className="size-3.5" /> : <EyeIcon className="size-3.5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={copy}
          aria-label="复制密钥"
        >
          {copied ? <CheckIcon className="text-success size-3.5" /> : <CopyIcon className="size-3.5" />}
        </Button>
      </div>
      <p className="text-muted-foreground mt-2 text-xs">
        请勿在前端代码或公开仓库中暴露此密钥。
      </p>
    </div>
  )
}
