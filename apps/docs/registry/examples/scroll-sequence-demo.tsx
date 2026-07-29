"use client"

import * as React from "react"

import { ScrollSequence } from "@/registry/ui/scroll-sequence"

const steps = [
  {
    number: "01",
    title: "Ascend",
    copy: "Leave the road and take the concrete line upward.",
    image: "/wui/demo/field-notes/white-stairs.jpg",
    position: "object-center",
  },
  {
    number: "02",
    title: "Cross",
    copy: "The structure bends; the horizon stays level.",
    image: "/wui/demo/field-notes/concrete-stairs.jpg",
    position: "object-center",
  },
  {
    number: "03",
    title: "Arrive",
    copy: "At the edge, architecture finally yields to weather.",
    image: "/wui/demo/field-notes/concrete-forest.jpg",
    position: "object-center",
  },
]

export default function ScrollSequenceDemo() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="h-[32rem] w-full max-w-4xl overflow-y-auto bg-[#20231f]"
    >
      <ScrollSequence
        container={container}
        viewportClassName="bg-[#dedbd1] text-[#20211d]"
        stepClassName="p-0"
      >
        {steps.map((step, index) => (
          <article
            key={step.number}
            className="grid h-full w-full sm:grid-cols-[0.85fr_1.15fr]"
          >
            <div className="flex flex-col justify-between p-6 sm:p-9">
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.26em]">
                <span>{step.number} / 03</span>
                <span className="h-px w-10 bg-current" />
                <span>Passage</span>
              </div>
              <div>
                <h3 className="font-serif text-5xl leading-none tracking-[-0.05em] sm:text-6xl">
                  {step.title}
                </h3>
                <p className="mt-4 max-w-xs text-sm leading-6 text-[#55594f]">
                  {step.copy}
                </p>
              </div>
            </div>
            <div
              className={`m-4 overflow-hidden sm:m-6 ${index === 0 ? "rounded-t-[10rem]" : index === 1 ? "rounded-[50%]" : "rounded-bl-[10rem]"}`}
            >
              <img
                src={step.image}
                alt={`${step.title} architectural passage`}
                className={`size-full object-cover ${step.position}`}
              />
            </div>
          </article>
        ))}
      </ScrollSequence>
    </div>
  )
}
