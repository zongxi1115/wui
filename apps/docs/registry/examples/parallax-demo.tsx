"use client"

import * as React from "react"

import { Parallax } from "@/registry/ui/parallax"

export default function ParallaxDemo() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="h-[32rem] w-full max-w-3xl overflow-y-auto bg-[#111817] text-[#edf0e9]"
    >
      <div className="flex min-h-72 flex-col justify-between px-6 py-7 sm:px-10 sm:py-9">
        <div className="flex items-center justify-between border-b border-white/15 pb-3 text-[10px] uppercase tracking-[0.22em] text-white/60">
          <span>Field study / 03</span>
          <span>Scroll inside</span>
        </div>
        <div className="max-w-xl">
          <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-[#b9c9a6]">
            Different speeds, one scene
          </p>
          <h3 className="font-serif text-5xl leading-[0.88] tracking-[-0.055em] sm:text-6xl">
            Scroll past the
            <br />
            still horizon.
          </h3>
        </div>
      </div>

      <div className="relative mx-5 h-[25rem] overflow-hidden border border-white/15 sm:mx-10">
        <Parallax
          container={container}
          distance={[-90, 90]}
          scale={[1.14, 1.24]}
          className="absolute -inset-24"
        >
          <img
            src="/wui/demo/field-notes/cliff-horizon.jpg"
            alt="A distant cliff above a calm sea"
            className="size-full object-cover"
          />
        </Parallax>
        <div className="absolute inset-0 bg-[#07100e]/25" />

        <Parallax
          container={container}
          axis="x"
          distance={[64, -64]}
          className="absolute inset-x-0 top-7 flex items-center gap-3 px-5 text-[10px] uppercase tracking-[0.24em] text-white/80 sm:px-7"
        >
          <span className="h-px w-10 bg-white/70" />
          <span>Near / moves first</span>
        </Parallax>

        <Parallax
          container={container}
          axis="x"
          distance={[-34, 34]}
          className="absolute inset-x-0 bottom-7 px-5 sm:px-7"
        >
          <p className="max-w-[13rem] font-serif text-3xl leading-[0.92] tracking-[-0.045em] text-white sm:text-4xl">
            The landscape stays. The frame travels.
          </p>
        </Parallax>
      </div>

      <div className="grid min-h-72 gap-8 px-6 py-12 sm:grid-cols-[1.1fr_0.9fr] sm:px-10">
        <p className="font-serif text-2xl leading-tight tracking-[-0.025em] text-[#d8e2cf]">
          One layer rises through the view; another drifts sideways across it.
        </p>
        <p className="border-l border-[#b9c9a6]/55 pl-4 text-sm leading-7 text-white/60">
          The scroll container is passed to every layer, so the effect stays
          contained to this demo instead of following the whole document.
        </p>
      </div>
    </div>
  )
}
