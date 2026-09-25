import { ProgressiveBlur } from "@/registry/ui/progressive-blur"

export default function ProgressiveBlurDirections() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
      <figure className="relative aspect-[4/5] overflow-hidden rounded-lg">
        <img
          src="/wui/demo/field-notes/silver-grass.jpg"
          alt="逆光下的芒草"
          className="size-full object-cover"
        />
        <ProgressiveBlur
          direction="bottom"
          blurLayers={10}
          blurIntensity={1}
          className="absolute inset-x-0 bottom-0 h-1/2"
        />
        <figcaption className="absolute inset-x-0 bottom-0 p-4 text-white">
          <p className="text-sm font-medium">芒草与秋分</p>
          <p className="text-xs text-white/75">底部模糊，托住标题文字</p>
        </figcaption>
      </figure>

      <figure className="relative aspect-[4/5] overflow-hidden rounded-lg">
        <img
          src="/wui/demo/field-notes/white-stairs.jpg"
          alt="白色的螺旋楼梯"
          className="size-full object-cover"
        />
        <ProgressiveBlur
          direction="top"
          blurLayers={10}
          blurIntensity={1}
          className="absolute inset-x-0 top-0 h-1/2"
        />
        <figcaption className="absolute inset-x-0 top-0 p-4 text-white">
          <p className="text-sm font-medium">向上的秩序</p>
          <p className="text-xs text-white/75">顶部模糊，适合悬浮导航</p>
        </figcaption>
      </figure>
    </div>
  )
}
