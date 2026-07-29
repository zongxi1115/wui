"use client"

import * as React from "react"

import { ScrollExpand } from "@/registry/ui/scroll-expand"

export default function ScrollExpandDemo() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="h-[32rem] w-full max-w-4xl overflow-y-auto bg-[#dedbd1] text-[#20211d]"
    >
      <div className="grid h-60 items-end gap-5 px-6 pb-8 sm:grid-cols-[1.2fr_0.8fr] sm:px-10">
        <h3 className="font-serif text-5xl leading-[0.9] tracking-[-0.05em] sm:text-6xl">
          The frame gives way to the field.
        </h3>
        <p className="pb-1 text-[10px] uppercase leading-5 tracking-[0.25em]">
          Cliff study 02
          <br />
          Scroll to enter
        </p>
      </div>
      <ScrollExpand container={container} scrollLength={2.25} inset={14}>
        <div className="relative h-full w-full overflow-hidden">
          <img
            src="/wui/demo/field-notes/cliff-horizon.jpg"
            alt="Warm cliffs stretching into the ocean"
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/5" />
          <div className="absolute inset-x-6 bottom-6 flex items-end justify-between text-white sm:inset-x-9">
            <p className="max-w-sm font-serif text-3xl italic leading-none">
              Beyond the last marked road.
            </p>
            <span className="text-[10px] uppercase tracking-[0.25em]">
              Atlantic / West
            </span>
          </div>
        </div>
      </ScrollExpand>
    </div>
  )
}
