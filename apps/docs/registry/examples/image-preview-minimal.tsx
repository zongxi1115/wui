import { ImagePreview } from "@/registry/ui/image-preview"

export default function ImagePreviewMinimal() {
  return (
    <ImagePreview
      src="/images/image-preview-landscape.svg"
      alt="A quiet mountain lake at dusk"
      showToolbar={false}
      className="aspect-video w-64"
    />
  )
}
