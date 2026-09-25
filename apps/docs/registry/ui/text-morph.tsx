"use client"

import * as React from "react"
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

const defaultTransition: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 32,
  mass: 0.6,
}

const defaultVariants: Variants = {
  initial: { opacity: 0, filter: "blur(2px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(2px)" },
}

export interface TextMorphProps extends React.ComponentProps<"p"> {
  /** Text whose shared characters morph between positions. */
  children: string
  /** HTML element rendered by the component. @default "p" */
  as?: React.ElementType
  /** Spring or tween used to move shared characters. */
  transition?: Transition
  /** Initial, animate and exit states for characters that appear or leave. */
  variants?: Variants
}

function characterKeys(text: string) {
  const seen = new Map<string, number>()
  return Array.from(text).map((character) => {
    const count = seen.get(character) ?? 0
    seen.set(character, count + 1)
    return { character, key: `${character}-${count}` }
  })
}

/**
 * Morphs shared characters into their new positions when the text changes,
 * while characters that only exist on one side fade in or out.
 */
function TextMorph({
  children,
  as = "p",
  transition = defaultTransition,
  variants = defaultVariants,
  className,
  ...props
}: TextMorphProps) {
  const reduceMotion = useReducedMotion()
  const Component = as
  const groupId = React.useId()
  const characters = React.useMemo(() => characterKeys(children), [children])
  const resolvedTransition = reduceMotion ? { duration: 0 } : transition

  return (
    <Component
      data-slot="text-morph"
      className={cn("relative inline-flex", className)}
      {...props}
    >
      <span className="sr-only">{children}</span>
      {/* A per-instance group keeps layout ids from jumping between morphs. */}
      <LayoutGroup id={groupId}>
        <AnimatePresence mode="popLayout" initial={false}>
          {characters.map(({ character, key }) => (
            <motion.span
              aria-hidden="true"
              data-slot="text-morph-character"
              className="inline-block whitespace-pre"
              layoutId={key}
              key={key}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={resolvedTransition}
            >
              {character}
            </motion.span>
          ))}
        </AnimatePresence>
      </LayoutGroup>
    </Component>
  )
}

export { TextMorph }
