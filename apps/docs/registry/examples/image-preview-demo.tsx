import { ImagePreview } from "@/registry/ui/image-preview"

export default function ImagePreviewDemo() {
  return (
    <figure className="w-full max-w-md">
      <ImagePreview
        src="/wui/demo/field-notes/cliff-horizon.jpg"
        alt="金石滩悬崖上的日落与海平线"
        caption="金石滩 · 18:42 · 1/320s f/5.6 ISO 100"
        downloadName="jinshitan-sunset.jpg"
        className="aspect-[4/3] w-full"
      />
      <figcaption className="text-muted-foreground mt-2 text-xs">
        点击查看大图，支持滚轮缩放、拖动与旋转
      </figcaption>
    </figure>
  )
}
