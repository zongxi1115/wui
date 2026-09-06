import { Progress } from "@/registry/ui/progress"

export default function ProgressSizes() {
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>小号线性 (size="sm" - 4px)</span>
            <span>45%</span>
          </div>
          <Progress size="sm" value={45} />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>标准线性 (size="default" - 6px)</span>
            <span>65%</span>
          </div>
          <Progress size="default" value={65} />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>大号线性 (size="lg" - 8px)</span>
            <span>85%</span>
          </div>
          <Progress size="lg" value={85} />
        </div>
      </div>

      <div className="flex items-center justify-around pt-4 border-t">
        <div className="flex flex-col items-center gap-2">
          <Progress variant="circular" size="sm" value={40} />
          <span className="text-xs text-muted-foreground">小号环形 (size="sm")</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Progress variant="circular" size="default" value={65} showValue />
          <span className="text-xs text-muted-foreground">标准环形 (size="default")</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Progress variant="circular" size="lg" value={90} showValue color="success" />
          <span className="text-xs text-muted-foreground">大号环形 (size="lg")</span>
        </div>
      </div>
    </div>
  )
}
