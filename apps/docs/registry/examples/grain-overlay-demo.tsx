import { GrainOverlay } from "@/registry/ui/grain-overlay"

export default function GrainOverlayDemo() {
  return (
    <figure className="w-full max-w-2xl">
      <div className="bg-muted relative aspect-[16/9] overflow-hidden rounded-lg">
        <img
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80"
          alt="星空下的雪山"
          className="size-full object-cover"
        />
        <GrainOverlay opacity={0.4} blendMode="overlay" animated />
        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <p className="text-sm text-white/70">胶片计划 · 第 04 卷</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">
            零下九度的星轨
          </p>
        </div>
      </div>
      <figcaption className="text-muted-foreground mt-3 text-sm">
        开启 animated 后颗粒以每秒 10 帧跳动，模拟放映中的胶片。
      </figcaption>
    </figure>
  )
}
