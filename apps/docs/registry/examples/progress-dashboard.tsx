import { Progress } from "@/registry/ui/progress"
import { HardDriveIcon, CpuIcon, ActivityIcon } from "lucide-react"

export default function ProgressDashboard() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-xl border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <HardDriveIcon className="size-4 text-muted-foreground" />
            <span>存储容量</span>
          </div>
          <span className="text-xs font-semibold text-warning">86%</span>
        </div>
        <Progress value={86} color="warning" size="sm" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>已用 860 GB</span>
          <span>总计 1 TB</span>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CpuIcon className="size-4 text-muted-foreground" />
            <span>CPU 负载</span>
          </div>
          <span className="text-xs font-semibold text-primary">34%</span>
        </div>
        <Progress value={34} color="primary" size="sm" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>8 核心正常</span>
          <span>峰值 48%</span>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <ActivityIcon className="size-4 text-muted-foreground" />
            <span>健康度评级</span>
          </div>
          <span className="text-xs font-semibold text-success">98%</span>
        </div>
        <Progress value={98} color="success" size="sm" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>SLA 达标</span>
          <span>99.99%</span>
        </div>
      </div>
    </div>
  )
}
