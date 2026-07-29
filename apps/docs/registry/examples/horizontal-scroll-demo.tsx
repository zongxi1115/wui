"use client"

import * as React from "react"

import { HorizontalScroll } from "@/registry/ui/horizontal-scroll"

const chapters = [
  {
    number: "01",
    place: "Dunes",
    title: "A pale road through silver grass.",
    image: "/wui/demo/field-notes/silver-grass.jpg",
    className: "bg-[#d6d7cf] text-[#18201c]",
  },
  {
    number: "02",
    place: "Headland",
    title: "The sea begins where certainty ends.",
    image: "/wui/demo/field-notes/coastal-hill.jpg",
    className: "bg-[#a34f31] text-[#f4eddf]",
  },
  {
    number: "03",
    place: "Shelter",
    title: "Geometry holds its ground.",
    image: "/wui/demo/field-notes/concrete-stairs.jpg",
    className: "bg-[#20231f] text-[#f4eddf]",
  },
]

export default function HorizontalScrollDemo() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="h-[32rem] w-full max-w-4xl overflow-y-auto bg-[#d6d7cf]"
    >
      <HorizontalScroll container={container} trackClassName="items-stretch">
        <section className="flex h-full w-[18rem] shrink-0 flex-col justify-between p-6 sm:w-[24rem] sm:p-9">
          <p className="text-[10px] uppercase leading-5 tracking-[0.28em]">
            Atlantic field notes
            <br />
            Westward, 2026
          </p>
          <h3 className="font-serif text-5xl leading-[0.88] tracking-[-0.055em] sm:text-6xl">
            Three landscapes, one line of travel.
          </h3>
          <p className="text-[10px] uppercase tracking-[0.28em]">
            Scroll to cross →
          </p>
        </section>
        {chapters.map((chapter, index) => (
          <article
            key={chapter.number}
            className={`relative flex h-full w-[23rem] shrink-0 overflow-hidden sm:w-[31rem] ${chapter.className}`}
          >
            <img
              src={chapter.image}
              alt={`${chapter.place} landscape`}
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/10" />
            <div className="relative flex w-full flex-col justify-between p-6 text-white sm:p-8">
              <div className="flex justify-between text-[10px] uppercase tracking-[0.25em]">
                <span>{chapter.place}</span>
                <span>{chapter.number} / 03</span>
              </div>
              <h4
                className={`max-w-sm font-serif text-4xl leading-[0.94] tracking-[-0.045em] ${index === 1 ? "ml-auto text-right" : ""}`}
              >
                {chapter.title}
              </h4>
            </div>
          </article>
        ))}
      </HorizontalScroll>
    </div>
  )
}
