"use client"

import * as React from "react"
import { Check, Copy, Eye, EyeOff, KeyRound } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextScramble } from "@/registry/ui/text-scramble"

const RAW_TOKEN = "wui_sec_994a8f17e34cb129486c"
const MASKED_TOKEN = "wui_sec_••••••••••••••••••••"

export default function TextScrambleAuthToken() {
  const [revealed, setRevealed] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(RAW_TOKEN)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex w-full max-w-lg flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <KeyRound className="size-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground">API 生产环境密钥</h4>
            <p className="text-[11px] text-muted-foreground">解密揭示真实 Token 字符串</p>
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setRevealed((prev) => !prev)}
          className="gap-1.5 text-xs"
        >
          {revealed ? (
            <>
              <EyeOff className="size-3" />
              隐藏密钥
            </>
          ) : (
            <>
              <Eye className="size-3" />
              解密揭示
            </>
          )}
        </Button>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3.5 py-2.5">
        <TextScramble
          as="span"
          trigger={revealed}
          duration={0.8}
          characterSet="0123456789abcdef"
          className="font-mono text-xs font-semibold text-foreground"
        >
          {revealed ? RAW_TOKEN : MASKED_TOKEN}
        </TextScramble>

        <Button
          type="button"
          size="icon"
          className="size-7"
          variant="ghost"
          onClick={handleCopy}
          aria-label="复制密钥"
          title="复制到剪贴板"
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-500" />
          ) : (
            <Copy className="size-3.5 text-muted-foreground" />
          )}
        </Button>
      </div>
    </div>
  )
}
