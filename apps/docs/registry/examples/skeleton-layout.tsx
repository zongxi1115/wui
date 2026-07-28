import { Skeleton, SkeletonText } from "@/registry/ui/skeleton"

export default function SkeletonLayout() {
  return (
    <div
      className="grid w-full max-w-lg gap-4 sm:grid-cols-[11rem_1fr]"
      aria-busy="true"
      aria-label="Loading article"
    >
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="flex flex-col justify-center gap-3">
        <Skeleton shape="text" className="h-5 w-3/4" />
        <SkeletonText lines={3} lastLineWidth="58%" />
      </div>
    </div>
  )
}
