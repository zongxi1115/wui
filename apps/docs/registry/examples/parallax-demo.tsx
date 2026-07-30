"use client"

import * as React from "react"

import { Parallax } from "@/registry/ui/parallax"

export default function ParallaxDemo() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="h-[32rem] w-full max-w-3xl overflow-y-auto bg-[#101412] text-[#edf0e9]"
    >
      <div className="flex min-h-56 flex-col justify-between px-6 py-7 sm:px-10 sm:py-9">
        <div className="flex items-center justify-between border-b border-white/15 pb-3 text-[10px] uppercase tracking-[0.22em] text-white/60">
          <span>Field study / 03</span>
          <span className="flex items-center gap-2 text-[#d5e2bd]">
            Scroll inside <span aria-hidden="true">↓</span>
          </span>
        </div>
        <div className="max-w-xl">
          <h3 className="font-serif text-4xl leading-[0.9] tracking-[-0.05em] sm:text-5xl">
            One scroll.
            <br />Three different speeds.
          </h3>
        </div>
      </div>

      <div className="relative mx-5 h-[28rem] overflow-hidden border-y border-white/20 sm:mx-10">
        <Parallax
          container={container}
          distance={[-150, 150]}
          scale={[1.18, 1.3]}
          className="absolute -inset-x-20 -inset-y-40"
        >
          <img
            src="/wui/demo/field-notes/cliff-horizon.jpg"
            alt="A distant cliff above a calm sea"
            className="size-full object-cover"
          />
        </Parallax>
        <div className="pointer-events-none absolute inset-0 bg-[#07100e]/35" />

        <div className="pointer-events-none absolute inset-5 z-10 border border-white/45">
          <span className="absolute -left-px top-1/2 h-px w-12 bg-white/60" />
          <span className="absolute -right-px top-1/2 h-px w-12 bg-white/60" />
          <span className="absolute left-1/2 top-3 -translate-x-1/2 text-[9px] uppercase tracking-[0.24em] text-white/65">
            Fixed frame
          </span>
        </div>

        <Parallax
          container={container}
          axis="x"
          distance={[140, -140]}
          className="absolute inset-x-0 top-16 z-20 flex items-center gap-3 px-5 text-[10px] uppercase tracking-[0.24em] text-[#e8f2d3] sm:px-8"
        >
          <span className="h-px w-16 bg-current" />
          <span>Foreground →</span>
        </Parallax>

        <Parallax
          container={container}
          axis="x"
          distance={[-72, 72]}
          className="absolute inset-x-0 bottom-14 z-20 px-5 sm:px-8"
        >
          <p className="max-w-[15rem] font-serif text-4xl leading-[0.88] tracking-[-0.05em] text-white sm:text-5xl">
            ← The slower layer
          </p>
        </Parallax>
      </div>

      <div className="grid min-h-64 gap-8 px-6 py-12 sm:grid-cols-[1.1fr_0.9fr] sm:px-10">
        <p className="font-serif text-2xl leading-tight tracking-[-0.025em] text-[#d8e2cf]">
          The border stays fixed while the image and two labels travel at
          clearly different rates.
        </p>
        <p className="border-l border-[#b9c9a6]/55 pl-4 text-sm leading-7 text-white/60">
          The scroll container is passed to every layer, so the effect stays
          contained to this demo instead of following the whole document.
        </p>
      </div>
    </div>
  )
}
