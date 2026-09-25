import { ImageTrail } from "@/registry/ui/image-trail"

const tags = [
  { label: "品牌", color: "var(--chart-1)" },
  { label: "插画", color: "var(--chart-2)" },
  { label: "交互", color: "var(--chart-3)" },
  { label: "动效", color: "var(--chart-4)" },
  { label: "字体", color: "var(--chart-5)" },
]

const items = tags.map((tag) => (
  <span
    key={tag.label}
    className="bg-background flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium shadow-sm"
  >
    <span className="size-1.5 rounded-full" style={{ background: tag.color }} />
    {tag.label}
  </span>
))

export default function ImageTrailCards() {
  return (
    <ImageTrail
      items={items}
      distance={48}
      lifetime={700}
      rotation={14}
      className="bg-muted/40 flex h-72 w-full max-w-xl items-center justify-center rounded-lg border"
    >
      <div className="pointer-events-none text-center select-none">
        <h4 className="text-xl font-semibold tracking-tight">我们擅长的事</h4>
        <p className="text-muted-foreground mt-1 text-sm">在这里移动指针</p>
      </div>
    </ImageTrail>
  )
}
