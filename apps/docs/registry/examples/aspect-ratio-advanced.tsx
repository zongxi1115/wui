import { AspectRatio } from "@/registry/ui/aspect-ratio"

const media = [
  {
    ratio: 4 / 5,
    src: "/wui/demo/field-notes/silver-grass.jpg",
    alt: "银色草地",
    label: "4:5 竖幅",
  },
  {
    ratio: 1,
    src: "/wui/demo/field-notes/concrete-stairs.jpg",
    alt: "混凝土楼梯",
    label: "1:1 方形",
  },
  {
    ratio: 3 / 2,
    src: "/wui/demo/field-notes/cliff-horizon.jpg",
    alt: "悬崖地平线",
    label: "3:2 横幅",
  },
]

export default function AspectRatioAdvanced() {
  return (
    <div className="grid w-full max-w-3xl items-end gap-5 sm:grid-cols-3">
      {media.map((item) => (
        <figure key={item.label}>
          <AspectRatio ratio={item.ratio} className="bg-muted">
            <img
              src={item.src}
              alt={item.alt}
              className="size-full object-cover"
            />
          </AspectRatio>
          <figcaption className="text-muted-foreground mt-2 text-xs">
            {item.label}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
