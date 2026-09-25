"use client"

import * as React from "react"

import { Parallax } from "@/registry/ui/parallax"

export default function ParallaxScale() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="h-[26rem] w-full overflow-y-auto rounded-b-lg"
    >
      <div className="mx-auto max-w-xl px-6 py-24">
        <p className="text-muted-foreground text-sm">建筑档案 · No. 17</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight">
          光线落在混凝土上
        </h3>

        <div className="bg-muted relative mt-6 aspect-[4/3] overflow-hidden rounded-lg">
          <Parallax
            container={container}
            distance={[-16, 16]}
            scale={[1.3, 1.12]}
            smooth
            className="size-full"
          >
            <img
              src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=80"
              alt="白色建筑立面"
              className="size-full object-cover"
            />
          </Parallax>
        </div>

        <Parallax
          container={container}
          distance={[24, 0]}
          opacity={[0, 1]}
          offset={["start end", "center center"]}
        >
          <p className="text-muted-foreground mt-6 text-sm leading-7">
            图片在画框内由 1.3 倍逐渐缩小，同时以慢于页面的速度移动；说明文字随后淡入。画框本身保持静止，
            视差只发生在裁切区域内部，不会影响页面布局。
          </p>
        </Parallax>
      </div>
    </div>
  )
}
