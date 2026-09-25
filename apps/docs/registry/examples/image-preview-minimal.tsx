import { ImagePreview } from "@/registry/ui/image-preview"

export default function ImagePreviewMinimal() {
  return (
    <article className="w-full max-w-md text-sm leading-6">
      <p className="text-muted-foreground">
        第二天清晨我们沿着台阶下到海边。退潮后的礁石露出大片青苔，
        光线从云层缝隙里斜着打下来。
      </p>
      <ImagePreview
        src="/wui/demo/field-notes/concrete-stairs.jpg"
        alt="通往海边的混凝土台阶"
        showToolbar={false}
        className="my-4 aspect-video w-full"
      />
      <p className="text-muted-foreground">
        这段路不长，但坡度很陡，雨天建议穿防滑鞋。
      </p>
    </article>
  )
}
