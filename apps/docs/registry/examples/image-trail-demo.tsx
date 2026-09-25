import { ImageTrail } from "@/registry/ui/image-trail"

const photos = [
  "photo-1464822759023-fed622ff2c3b",
  "photo-1470071459604-3b5ec3a7fe05",
  "photo-1501785888041-af3ef285b470",
  "photo-1519681393784-d120267933ba",
  "photo-1441974231531-c6227db76b6e",
  "photo-1469474968028-56623f02e42e",
]

const items = photos.map((id) => (
  <img
    key={id}
    src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=320&h=400&q=70`}
    alt=""
    className="bg-muted h-40 w-32 rounded-md object-cover shadow-md"
  />
))

export default function ImageTrailDemo() {
  return (
    <ImageTrail
      items={items}
      distance={64}
      lifetime={600}
      maxItems={10}
      className="flex h-[26rem] w-full cursor-crosshair items-center justify-center rounded-b-lg"
    >
      <div className="pointer-events-none relative z-20 text-center select-none">
        <p className="text-muted-foreground text-sm">许然摄影作品集</p>
        <h3 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          在山里的一年
        </h3>
        <p className="text-muted-foreground mt-3 text-sm">移动鼠标翻阅照片</p>
      </div>
    </ImageTrail>
  )
}
