import { Skeleton, SkeletonText } from "@/registry/ui/skeleton"

const animations = [
  { value: "pulse", label: "pulse", note: "默认，整体明暗呼吸" },
  { value: "shimmer", label: "shimmer", note: "高光扫过，适合大面积版面" },
  { value: "none", label: "none", note: "静态占位" },
] as const

export default function SkeletonAnimation() {
  return (
    <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-3">
      {animations.map((item) => (
        <div key={item.value} className="space-y-3">
          <div
            className="flex items-center gap-3"
            aria-busy="true"
            aria-label={`${item.label} 动画示例`}
          >
            <Skeleton animation={item.value} shape="circle" className="size-9" />
            <SkeletonText
              animation={item.value}
              lines={2}
              lastLineWidth="60%"
              className="gap-1.5"
            />
          </div>
          <Skeleton animation={item.value} className="aspect-video w-full" />
          <div>
            <code className="font-mono text-xs">animation=&quot;{item.label}&quot;</code>
            <p className="text-muted-foreground mt-1 text-xs">{item.note}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
