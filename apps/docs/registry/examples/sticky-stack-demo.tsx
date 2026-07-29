"use client"

import * as React from "react"

import { StickyStack, StickyStackItem } from "@/registry/ui/sticky-stack"

const chapters = [
  {
    index: "01",
    label: "Dune",
    title: "A path written in wind.",
    image: "/wui/demo/field-notes/dune-figure.jpg",
    tone: "bg-[#d9d0bd] text-[#20211d]",
  },
  {
    index: "02",
    label: "Fault",
    title: "The continent breaks open.",
    image: "/wui/demo/field-notes/aerial-coast.jpg",
    tone: "bg-[#bb5c35] text-[#f5eee2]",
  },
  {
    index: "03",
    label: "Shelter",
    title: "A hard line in soft weather.",
    image: "/wui/demo/field-notes/concrete-forest.jpg",
    tone: "bg-[#1b211c] text-[#f5eee2]",
  },
]

export default function StickyStackDemo() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="h-[32rem] w-full max-w-3xl overflow-y-auto bg-[#dedbd1] px-4 text-[#20211d] sm:px-8"
    >
      <div className="flex h-56 items-end justify-between pb-8">
        <h3 className="max-w-sm font-serif text-5xl leading-[0.92] tracking-[-0.05em]">
          Three ways to meet the edge.
        </h3>
        <p className="hidden text-[10px] uppercase leading-5 tracking-[0.25em] sm:block">
          Field index
          <br />
          01—03
        </p>
      </div>
      <StickyStack container={container} top={16} gap={12} className="pb-36">
        {chapters.map((chapter, index) => (
          <StickyStackItem
            key={chapter.index}
            className={`overflow-hidden ${chapter.tone}`}
          >
            <article className="grid min-h-[18rem] grid-cols-[0.9fr_1.1fr] sm:min-h-[20rem]">
              <div className="flex flex-col justify-between p-5 sm:p-7">
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.24em]">
                  <span>{chapter.index}</span>
                  <span className="h-px w-8 bg-current" />
                  <span>{chapter.label}</span>
                </div>
                <h4 className="font-serif text-3xl leading-[0.98] tracking-[-0.04em] sm:text-4xl">
                  {chapter.title}
                </h4>
              </div>
              <div
                className={
                  index === 1
                    ? "m-4 overflow-hidden rounded-[50%]"
                    : index === 2
                      ? "overflow-hidden rounded-tl-[8rem]"
                      : "overflow-hidden rounded-bl-[8rem]"
                }
              >
                <img
                  src={chapter.image}
                  alt={`${chapter.label} field study`}
                  className="size-full object-cover"
                />
              </div>
            </article>
          </StickyStackItem>
        ))}
      </StickyStack>
    </div>
  )
}
