"use client"

import * as React from "react"

import { Parallax } from "@/registry/ui/parallax"

const gallery = [
  {
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    alt: "雪山山脊",
    distance: [40, -40] as [number, number],
  },
  {
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80",
    alt: "云雾中的森林",
    distance: [-30, 60] as [number, number],
  },
  {
    src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80",
    alt: "湖泊与远山",
    distance: [70, -20] as [number, number],
  },
]

export default function ParallaxDemo() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="relative h-[28rem] w-full overflow-y-auto rounded-b-lg"
    >
      <div className="px-6 pt-10 pb-8 sm:px-10">
        <p className="text-muted-foreground text-sm">2026 秋季徒步路线</p>
        <h3 className="mt-2 max-w-md text-3xl font-semibold tracking-tight">
          在山野之间，慢慢走
        </h3>
        <p className="text-muted-foreground mt-3 max-w-md text-sm leading-6">
          向下滚动。背景、标题与图片以不同速度移动，远处的山比近处的字走得更慢。
        </p>
      </div>

      <div className="relative mx-6 h-80 overflow-hidden rounded-lg sm:mx-10">
        <Parallax
          container={container}
          distance={[-64, 64]}
          className="absolute inset-x-0 -inset-y-20"
        >
          <img
            src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80"
            alt="星空下的雪山"
            className="size-full object-cover"
          />
        </Parallax>
        <div className="absolute inset-0 bg-black/30" />
        <Parallax
          container={container}
          distance={[60, -60]}
          smooth
          className="absolute inset-x-0 bottom-8 px-6 text-white"
        >
          <p className="text-xs tracking-widest text-white/70">第 03 段 · 海拔 4,120 米</p>
          <p className="mt-1 text-2xl font-semibold">冰川营地</p>
        </Parallax>
      </div>

      <div className="grid grid-cols-3 gap-3 px-6 py-16 sm:gap-4 sm:px-10">
        {gallery.map((item) => (
          <Parallax
            key={item.src}
            container={container}
            distance={item.distance}
            smooth
          >
            <img
              src={item.src}
              alt={item.alt}
              className="bg-muted aspect-[3/4] w-full rounded-md object-cover"
            />
          </Parallax>
        ))}
      </div>

      <p className="text-muted-foreground px-6 pb-16 text-sm leading-6 sm:px-10">
        三张图片的位移方向和幅度各不相同，形成错落的层次。开启 smooth
        的图层会带一点跟随的惯性。
      </p>
    </div>
  )
}
