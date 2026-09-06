import { Skeleton, SkeletonText } from "@/registry/ui/skeleton"

export default function SkeletonDashboard() {
  return (
    <div
      className="w-full space-y-4 rounded-xl border bg-card p-5"
      aria-busy="true"
      aria-label="正在加载仪表盘概览"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton shape="text" className="h-6 w-36" />
          <Skeleton shape="text" className="h-3.5 w-48" />
        </div>
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-lg border p-4 space-y-3 bg-muted/20">
            <div className="flex items-center justify-between">
              <Skeleton shape="text" className="h-3.5 w-20" />
              <Skeleton shape="circle" className="size-5" />
            </div>
            <Skeleton shape="text" className="h-7 w-28" />
            <Skeleton shape="text" className="h-3 w-32" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="col-span-2 rounded-lg border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton shape="text" className="h-4 w-32" />
            <Skeleton shape="text" className="h-4 w-20" />
          </div>
          <Skeleton className="h-48 w-full rounded-md" />
        </div>

        <div className="col-span-1 rounded-lg border p-4 space-y-4">
          <Skeleton shape="text" className="h-4 w-24" />
          <SkeletonText lines={4} lastLineWidth="60%" />
          <Skeleton className="h-20 w-full rounded-md" />
        </div>
      </div>
    </div>
  )
}
