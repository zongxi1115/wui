import { Skeleton, SkeletonText } from "@/registry/ui/skeleton"

export default function SkeletonDemo() {
  return (
    <div
      className="flex w-full max-w-md items-start gap-4"
      aria-busy="true"
      aria-label="正在加载个人资料"
    >
      <Skeleton shape="circle" className="size-11" />
      <div className="min-w-0 flex-1 space-y-3 pt-0.5">
        <div className="flex items-center gap-2">
          <Skeleton shape="text" className="w-28" />
          <Skeleton shape="text" className="h-3 w-14" />
        </div>
        <SkeletonText lines={2} lastLineWidth="82%" />
      </div>
    </div>
  )
}
