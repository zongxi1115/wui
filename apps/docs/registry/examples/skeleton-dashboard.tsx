import { Skeleton, SkeletonText } from "@/registry/ui/skeleton"

const bars = [42, 58, 36, 72, 64, 80, 54, 88, 70, 62, 76, 92]

export default function SkeletonDashboard() {
  return (
    <div
      className="w-full space-y-5"
      aria-busy="true"
      aria-label="正在加载仪表盘概览"
    >
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton animation="shimmer" shape="text" className="h-5 w-36" />
          <Skeleton animation="shimmer" shape="text" className="h-3 w-52" />
        </div>
        <Skeleton animation="shimmer" className="h-8 w-28" />
      </div>

      <div className="grid grid-cols-1 divide-y rounded-lg border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <Skeleton animation="shimmer" shape="text" className="h-3 w-20" />
              <Skeleton animation="shimmer" shape="circle" className="size-4" />
            </div>
            <Skeleton animation="shimmer" shape="text" className="h-7 w-24" />
            <Skeleton animation="shimmer" shape="text" className="h-3 w-32" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <Skeleton animation="shimmer" shape="text" className="w-28" />
            <Skeleton animation="shimmer" className="h-7 w-24" />
          </div>
          <div className="flex h-44 items-end gap-2 border-b pb-px">
            {bars.map((height, index) => (
              <Skeleton
                key={index}
                animation="shimmer"
                className="flex-1 rounded-b-none rounded-t-sm"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <Skeleton animation="shimmer" shape="text" className="w-24" />
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton animation="shimmer" shape="circle" className="size-8" />
              <SkeletonText
                animation="shimmer"
                lines={2}
                lastLineWidth="55%"
                className="gap-1.5"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
