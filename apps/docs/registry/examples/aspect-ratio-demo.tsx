import { AspectRatio } from "@/registry/ui/aspect-ratio"

export default function AspectRatioDemo() {
  return (
    <div className="w-full max-w-xl">
      <AspectRatio ratio={16 / 9} className="bg-muted">
        <img
          src="/wui/demo/field-notes/coastal-hill.jpg"
          alt="海岸山丘"
          className="size-full object-cover"
        />
      </AspectRatio>
    </div>
  )
}
