import { NumberTicker } from "@/registry/ui/number-ticker"

export default function NumberTickerDemo() {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <NumberTicker
        value={12846}
        className="text-5xl font-semibold tracking-tight text-foreground"
      />
      <p className="text-sm text-muted-foreground">
        家企业正在使用我们管理研发流程
      </p>
    </div>
  )
}
