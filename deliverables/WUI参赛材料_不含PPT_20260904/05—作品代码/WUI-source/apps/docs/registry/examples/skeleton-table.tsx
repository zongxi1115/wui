import { Skeleton } from "@/registry/ui/skeleton"

export default function SkeletonTable() {
  return (
    <div
      className="w-full space-y-3 rounded-lg border p-4"
      aria-busy="true"
      aria-label="正在加载表格数据"
    >
      <div className="flex items-center justify-between pb-2 border-b">
        <Skeleton shape="text" className="h-5 w-28" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4 py-2 border-b">
          <Skeleton shape="text" className="h-4 w-24" />
          <Skeleton shape="text" className="h-4 w-32" />
          <Skeleton shape="text" className="h-4 w-20" />
          <Skeleton shape="text" className="h-4 w-16" />
        </div>

        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between gap-4 py-2">
            <div className="flex items-center gap-2.5">
              <Skeleton shape="circle" className="size-7" />
              <Skeleton shape="text" className="h-4 w-28" />
            </div>
            <Skeleton shape="text" className="h-4 w-40" />
            <Skeleton shape="text" className="h-4 w-16 rounded-full" />
            <Skeleton shape="text" className="h-4 w-12" />
          </div>
        ))}
      </div>
    </div>
  )
}
