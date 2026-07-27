import { InfiniteSlider } from "@/registry/ui/infinite-slider"

export default function InfiniteSliderVertical() {
  return (
    <div className="bg-muted/30 rounded-lg border p-3">
      <InfiniteSlider
        direction="vertical"
        reverse
        speed={32}
        gap={8}
        className="h-64 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]"
      >
        {["Research", "Prototype", "Review", "Ship"].map((label, index) => (
          <div
            className="bg-background shadow-xs flex w-64 items-center gap-4 rounded-md border px-4 py-3"
            key={label}
          >
            <span className="text-muted-foreground font-mono text-xs">
              0{index + 1}
            </span>
            <span className="font-medium">{label}</span>
          </div>
        ))}
      </InfiniteSlider>
    </div>
  )
}
