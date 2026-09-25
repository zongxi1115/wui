import { InfiniteSlider } from "@/registry/ui/infinite-slider"

const partners = [
  "青禾零售",
  "远帆科技",
  "知行教育",
  "山海工作室",
  "北辰物流",
  "云栖医疗",
  "拾光影像",
]

export default function InfiniteSliderDemo() {
  return (
    <div className="w-full max-w-2xl">
      <p className="text-muted-foreground mb-4 text-center text-xs">
        超过 2,000 家团队正在使用
      </p>
      <div className="[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <InfiniteSlider speed={40} speedOnHover={12} gap={40}>
          {partners.map((name) => (
            <span
              key={name}
              className="text-muted-foreground hover:text-foreground shrink-0 text-lg font-semibold tracking-tight transition-colors"
            >
              {name}
            </span>
          ))}
        </InfiniteSlider>
      </div>
    </div>
  )
}
