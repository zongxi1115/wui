import { Progress } from "@/registry/ui/progress"

export default function ProgressVariants() {
  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3">
        <span className="text-xs text-muted-foreground">Storage</span>
        <Progress value={76} color="blue" />
        <span className="text-xs text-muted-foreground">Backup</span>
        <Progress value={58} color="success" />
        <span className="text-xs text-muted-foreground">Battery</span>
        <Progress value={34} color="warning" />
      </div>

      <div className="flex items-center justify-center gap-6">
        <Progress variant="circular" size="sm" value={24} color="blue" aria-label="24 percent" />
        <Progress variant="circular" value={68} color="success" showValue aria-label="68 percent" />
        <Progress variant="circular" size="lg" value={86} color="warning" showValue aria-label="86 percent" />
        <Progress variant="circular" size="lg" value={null} color="blue" aria-label="Working" />
      </div>
    </div>
  )
}
