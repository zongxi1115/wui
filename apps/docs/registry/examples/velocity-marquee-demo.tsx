"use client"

import * as React from "react"

import { VelocityMarquee } from "@/registry/ui/velocity-marquee"

function MarqueeContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-8 whitespace-nowrap font-serif text-3xl italic tracking-tight sm:text-4xl">
      <span>{children}</span>
      <span aria-hidden className="text-lg not-italic">
        ✦
      </span>
      <span>Notes from the Atlantic edge</span>
      <span aria-hidden className="text-lg not-italic">
        ✦
      </span>
    </div>
  )
}

export default function VelocityMarqueeDemo() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="relative h-[32rem] w-full max-w-4xl overflow-y-auto bg-[#18201c] text-[#f4eddf]"
    >
      <div className="relative h-[30rem] overflow-hidden">
        <img
          src="/wui/demo/field-notes/dune-figure.jpg"
          alt="Figures walking through dune grass"
          className="size-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#18201c] via-black/5 to-transparent" />
        <div className="absolute inset-x-6 top-6 flex justify-between text-[10px] uppercase tracking-[0.26em] sm:inset-x-9">
          <span>Walk / 04</span>
          <span>38°57′N</span>
        </div>
        <h3 className="absolute bottom-8 left-6 max-w-md font-serif text-5xl leading-[0.9] tracking-[-0.05em] sm:left-9 sm:text-6xl">
          Move at the speed of weather.
        </h3>
      </div>
      <div className="relative z-10 -mt-5 space-y-3 overflow-hidden py-5">
        <VelocityMarquee
          container={container}
          className="-rotate-2 bg-[#c6d0b8] py-3 text-[#18201c]"
        >
          <MarqueeContent>Wind changes the route</MarqueeContent>
        </VelocityMarquee>
        <VelocityMarquee
          container={container}
          reverse
          baseSpeed={28}
          className="rotate-1 border-y border-[#f4eddf]/40 py-3"
        >
          <MarqueeContent>The horizon keeps its distance</MarqueeContent>
        </VelocityMarquee>
      </div>
      <div className="flex h-72 items-start justify-end px-7 pt-20">
        <p className="max-w-xs text-sm leading-7 text-[#bfc3b9]">
          Direction follows the gesture: scroll down to press forward, reverse
          to pull the landscape back.
        </p>
      </div>
    </div>
  )
}
