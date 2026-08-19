import { Spin } from "@/registry/ui/spin"

export default function SpinSizes() {
  return (
    <div className="flex flex-wrap items-center gap-10">
      <div className="flex flex-col items-center gap-2">
        <Spin size="sm" />
        <span className="text-xs text-muted-foreground">小号 (sm - 16px)</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Spin size="default" />
        <span className="text-xs text-muted-foreground">标准 (default - 24px)</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Spin size="lg" />
        <span className="text-xs text-muted-foreground">大号 (lg - 36px)</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Spin size="default" label="正在同步数据…" />
        <span className="text-xs text-muted-foreground">带文字描述</span>
      </div>
    </div>
  )
}
