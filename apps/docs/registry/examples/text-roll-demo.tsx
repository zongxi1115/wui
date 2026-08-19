import { TextRoll } from "@/registry/ui/text-roll"

export default function TextRollDemo() {
  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card p-8 text-center shadow-xs">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        悬停文字触发翻滚动效
      </div>

      <TextRoll className="cursor-pointer text-3xl font-bold tracking-tight text-foreground transition-colors hover:text-primary sm:text-4xl">
        Hover to roll text
      </TextRoll>

      <p className="text-xs text-muted-foreground">
        鼠标悬停或轻触以触发逐字符波浪翻转。
      </p>
    </div>
  )
}
