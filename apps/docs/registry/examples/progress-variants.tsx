import { Progress } from "@/registry/ui/progress"

const quotas = [
  { label: "对象存储", value: 76, color: "blue", detail: "760 / 1000 GB" },
  { label: "每日备份", value: 58, color: "success", detail: "已完成 7 / 12" },
  { label: "短信额度", value: 91, color: "warning", detail: "剩余 900 条" },
  { label: "API 调用", value: 100, color: "destructive", detail: "已超出配额" },
] as const

export default function ProgressVariants() {
  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <dl className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-x-4 gap-y-3.5">
        {quotas.map((quota) => (
          <div key={quota.label} className="contents">
            <dt className="text-muted-foreground text-xs">{quota.label}</dt>
            <dd>
              <Progress value={quota.value} color={quota.color} aria-label={quota.label} />
            </dd>
            <dd className="text-muted-foreground text-right text-xs tabular-nums">
              {quota.detail}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex items-center justify-between border-t pt-6">
        <div className="flex items-center gap-3">
          <Progress variant="circular" value={68} color="success" showValue aria-label="构建通过率" />
          <div className="text-xs">
            <p className="font-medium">构建通过率</p>
            <p className="text-muted-foreground mt-0.5">近 7 天</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Progress variant="circular" value={null} color="blue" aria-label="正在同步" />
          <div className="text-xs">
            <p className="font-medium">正在同步</p>
            <p className="text-muted-foreground mt-0.5">时长未知</p>
          </div>
        </div>
      </div>
    </div>
  )
}
