import { Skeleton, SkeletonText } from "@/registry/ui/skeleton"

export default function SkeletonDemo() {
  return (
    <div
      className="flex w-full max-w-md items-start gap-4 border-y py-4"
      aria-busy="true"
      aria-label="Loading profile"
    >
      <Skeleton shape="circle" className="size-12" />
      <div className="min-w-0 flex-1 space-y-3">
        <div className="space-y-2">
          <Skeleton shape="text" className="w-32" />
          <Skeleton shape="text" className="h-3 w-20" />
        </div>
        <SkeletonText lines={2} lastLineWidth="82%" />
      </div>
    </div>
  )
}
