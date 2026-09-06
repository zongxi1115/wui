"use client"

import * as React from "react"
import { LayoutGroup, motion, useReducedMotion } from "motion/react"

import { cn } from "@/registry/lib/utils"

export interface TextMorphProps extends React.ComponentProps<"p"> {
  /** Text whose shared characters morph between positions. */
  children: string
  /** HTML element rendered by the component. @default "p" */
  as?: React.ElementType
}

function characterKeys(text: string) {
  const seen = new Map<string, number>()
  return Array.from(text).map((character) => {
    const count = seen.get(character) ?? 0
    seen.set(character, count + 1)
    return `${character}-${count}`
  })
}

/** Morphs shared characters into their new positions when the text changes. */
function TextMorph({
  children,
  as = "p",
  className,
  ...props
}: TextMorphProps) {
  const reduceMotion = useReducedMotion()
  const Component = as
  const keys = React.useMemo(() => characterKeys(children), [children])

  if (reduceMotion) {
    return (
      <Component data-slot="text-morph" className={className} {...props}>
        {children}
      </Component>
    )
  }

  return (
    <LayoutGroup>
      <Component
        aria-label={children}
        data-slot="text-morph"
        className={cn("inline-flex", className)}
        {...props}
      >
        {Array.from(children).map((character, index) => (
          <motion.span
            aria-hidden="true"
            data-slot="text-morph-character"
            className="inline-block whitespace-pre"
            layout
            layoutId={keys[index]}
            transition={{ type: "spring", stiffness: 420, damping: 35 }}
            key={keys[index]}
          >
            {character === " " ? "\u00a0" : character}
          </motion.span>
        ))}
      </Component>
    </LayoutGroup>
  )
}

export { TextMorph }
