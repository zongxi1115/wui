import { TextRoll } from "@/registry/ui/text-roll"

export default function TextRollDemo() {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <TextRoll className="cursor-default text-4xl font-semibold tracking-tight sm:text-5xl">
        向上翻一页
      </TextRoll>
      <p className="text-muted-foreground text-xs">
        鼠标悬停时逐字向上翻滚，离开后依次回落
      </p>
    </div>
  )
}
