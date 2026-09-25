import { ImagePreview, ImagePreviewGroup } from "@/registry/ui/image-preview"

const photos = [
  {
    src: "/wui/demo/field-notes/coastal-hill.jpg",
    alt: "海边山坡上的步道",
    caption: "东极岛 · 环岛步道第 3 公里",
  },
  {
    src: "/wui/demo/field-notes/silver-grass.jpg",
    alt: "逆光下的芒草",
    caption: "安吉 · 傍晚逆光",
  },
  {
    src: "/wui/demo/field-notes/storm-cliffs.jpg",
    alt: "风暴过后的海岬",
    caption: "崂山 · 雨后云层散开",
  },
  {
    src: "/wui/demo/field-notes/aerial-coast.jpg",
    alt: "俯瞰海岸线",
    caption: "航拍 · 高度 120 m",
  },
  {
    src: "/wui/demo/field-notes/dune-figure.jpg",
    alt: "沙丘上的行人",
    caption: "鸣沙山 · 日出前 20 分钟",
  },
  {
    src: "/wui/demo/field-notes/white-stairs.jpg",
    alt: "白色建筑中的楼梯",
    caption: "城市漫步 · 美术馆东侧楼梯",
  },
]

export default function ImagePreviewGallery() {
  return (
    <div className="w-full max-w-xl">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-sm font-medium">国庆海岸行程</h3>
        <span className="text-muted-foreground text-xs tabular-nums">
          {photos.length} 张照片
        </span>
      </div>
      <ImagePreviewGroup className="grid grid-cols-3 gap-1.5">
        {photos.map((photo, index) => (
          <ImagePreview
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            caption={photo.caption}
            downloadName={`coast-trip-${index + 1}.jpg`}
            className="aspect-square w-full rounded-sm"
          />
        ))}
      </ImagePreviewGroup>
    </div>
  )
}
