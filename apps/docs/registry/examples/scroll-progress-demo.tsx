"use client"

import * as React from "react"

import { ScrollProgress } from "@/registry/ui/scroll-progress"

export default function ScrollProgressDemo() {
  const container = React.useRef<HTMLDivElement>(null)
  const article = React.useRef<HTMLElement>(null)

  return (
    <div
      ref={container}
      className="relative h-[32rem] w-full max-w-3xl overflow-y-auto bg-[#e8e4d9] text-[#1e211d]"
    >
      <ScrollProgress
        container={container}
        target={article}
        position="inline"
        className="sticky top-0 z-30"
        offset={["start start", "end end"]}
      />
      <div className="sticky top-5 z-20 flex justify-end px-5">
        <ScrollProgress
          container={container}
          target={article}
          variant="circle"
          size={44}
          className="bg-[#e8e4d9]"
          offset={["start start", "end end"]}
        />
      </div>

      <article ref={article} className="pb-24">
        <header className="relative -mt-11 min-h-[29rem] overflow-hidden">
          <img
            src="/wui/demo/field-notes/coastal-hill.jpg"
            alt="A lone walker on a coastal hill"
            className="absolute inset-0 size-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#e8e4d9]" />
          <div className="relative flex min-h-[29rem] flex-col justify-end px-6 pb-8 sm:px-10">
            <p className="text-[10px] uppercase tracking-[0.3em]">
              Field notes 07 · 6 min
            </p>
            <h3 className="mt-3 max-w-xl font-serif text-5xl leading-[0.9] tracking-[-0.05em] sm:text-7xl">
              The long way to the water.
            </h3>
          </div>
        </header>

        <div className="mx-auto grid max-w-2xl gap-10 px-6 pt-8 sm:grid-cols-[7rem_1fr] sm:px-10">
          <aside className="text-[10px] uppercase leading-5 tracking-[0.22em]">
            38°57′N
            <br />
            Four days
            <br />
            On foot
          </aside>
          <div className="space-y-12">
            {["Arrival", "Weather", "The last ridge", "At the water"].map(
              (title, index) => (
                <section
                  key={title}
                  className="border-t border-[#1e211d]/25 pt-4"
                >
                  <p className="font-serif text-2xl italic">{title}</p>
                  <p className="mt-3 text-sm leading-7 text-[#44483f]">
                    The path disappears into grass, then returns as a pale line
                    above the sea. Distance is measured here by weather, not
                    kilometres.
                    {index === 3
                      ? " By dusk, the cliffs hold the last light."
                      : " Each turn edits the horizon again."}
                  </p>
                </section>
              )
            )}
          </div>
        </div>
      </article>
    </div>
  )
}
