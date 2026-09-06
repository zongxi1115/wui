import { ImagePreview } from "@/registry/ui/image-preview"

export default function ImagePreviewDemo() {
  return (
    <ImagePreview
      src="/images/image-preview-landscape.svg"
      alt="A quiet mountain lake at dusk"
      caption="North Cascades · Evening study"
      downloadName="north-cascades.svg"
      className="aspect-[4/3] w-full max-w-md"
      thumbnailClassName="border"
    />
  )
}
