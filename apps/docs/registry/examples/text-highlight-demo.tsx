import { TextHighlight } from "@/registry/ui/text-highlight"

export default function TextHighlightDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <h3 className="text-lg font-semibold tracking-tight">为什么选择按席位计费</h3>
      <p className="text-sm leading-7 text-muted-foreground">
        过去一年，我们访谈了 120 家客户，发现按用量计费让团队在月底
        <TextHighlight className="text-foreground">
          不敢放心地运行自动化
        </TextHighlight>
        。改为按席位计费后，
        <TextHighlight delay={0.5} className="text-foreground">
          每位成员都能无上限地使用全部功能
        </TextHighlight>
        ，账单也变得
        <TextHighlight
          delay={1}
          variant="underline"
          color="color-mix(in oklab, var(--primary) 22%, transparent)"
          className="text-foreground"
        >
          可预测、可审批
        </TextHighlight>
        。
      </p>
    </div>
  )
}
