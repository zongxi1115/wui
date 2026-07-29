"use client"

import * as React from "react"

import { ScrollText } from "@/registry/ui/scroll-text"

export default function ScrollTextDemo() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="h-[32rem] w-full max-w-3xl overflow-y-auto bg-[#171b18] text-[#f2eee3]"
    >
      <div className="relative h-[20rem] overflow-hidden">
        <img
          src="/wui/demo/field-notes/cliff-horizon.jpg"
          alt="Rocky cliffs meeting the ocean"
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171b18] via-transparent to-black/10" />
        <div className="absolute inset-x-6 bottom-6 flex items-end justify-between sm:inset-x-10">
          <p className="text-[10px] uppercase tracking-[0.28em]">
            Scroll this panel to reveal
          </p>
          <span className="font-serif text-4xl italic">I</span>
        </div>
      </div>

      <div className="px-6 py-20 sm:px-10">
        <ScrollText
          container={container}
          per="line"
          offset={["start 0.9", "end 0.25"]}
          segmentClassName="leading-[0.98]"
          className="max-w-2xl font-serif text-4xl tracking-[-0.04em] [--tw-text-opacity:1] sm:text-5xl"
        >
          {
            "The coast is never still.\nWind edits the grass.\nSalt redraws the stone.\nEvery tide leaves a new sentence."
          }
        </ScrollText>

        <div className="ml-auto mt-36 max-w-md border-l border-[#f2eee3]/30 pl-6">
          <ScrollText
            container={container}
            mode="reveal"
            per="line"
            offset={["start 0.9", "end 0.25"]}
            className="font-serif text-3xl italic leading-tight"
          >
            {
              "Walk until the road thins.\nWait until the weather turns.\nLook again."
            }
          </ScrollText>
        </div>
      </div>
      <div className="h-32" />
    </div>
  )
}
