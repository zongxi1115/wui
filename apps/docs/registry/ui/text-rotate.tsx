"use client"

import * as React from "react"
import {
  AnimatePresence,
  motion,
  useIsPresent,
  useReducedMotion,
  type Transition,
  type Variants,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

export type TextRotateSplit = "characters" | "words" | "lines"

export type TextRotateStaggerFrom =
  | "first"
  | "last"
  | "center"
  | "random"
  | number

/** Imperative methods exposed through `ref`. */
export interface TextRotateHandle {
  /** Rotate to the next text. Wraps to the first one when `loop` is on. */
  next: () => void
  /** Rotate to the previous text. Wraps to the last one when `loop` is on. */
  previous: () => void
  /** Rotate to a specific index. Out-of-range values are clamped. */
  jumpTo: (index: number) => void
  /** Rotate back to the first text. */
  reset: () => void
}

export interface TextRotateProps
  extends Omit<React.ComponentProps<"span">, "children" | "ref"> {
  /** Texts shown one after another. */
  texts: string[]
  /** Imperative handle with `next`, `previous`, `jumpTo` and `reset`. */
  ref?: React.Ref<TextRotateHandle>
  /** Controlled active index. Pair with `onIndexChange`. */
  index?: number
  /** Initial index when uncontrolled. @default 0 */
  defaultIndex?: number
  /** Called whenever the component wants to move to another index. */
  onIndexChange?: (index: number) => void
  /** Rotate automatically every `interval` seconds. @default true */
  auto?: boolean
  /** Seconds each text stays visible before rotating. @default 2.5 */
  interval?: number
  /** Wrap around after the last text. @default true */
  loop?: boolean
  /** Temporarily stop automatic rotation, e.g. while hovered. @default false */
  paused?: boolean
  /** Granularity of the staggered animation. @default "characters" */
  split?: TextRotateSplit
  /** Travel direction: `up` exits upward and enters from below. @default "up" */
  direction?: "up" | "down"
  /** Element the stagger starts from, or an explicit element index. @default "first" */
  staggerFrom?: TextRotateStaggerFrom
  /** Delay between two neighbouring elements, in seconds. @default 0.025 */
  staggerDuration?: number
  /** Blur elements while they enter and exit. @default false */
  blur?: boolean
  /** Transition applied to every animated element. */
  transition?: Transition
  /**
   * Transition used when the container resizes to fit the next text. Width is
   * animated for `characters` and `words`; height for `lines`, which may wrap.
   */
  sizeTransition?: Transition
  /** Class applied to every word or line group. */
  groupClassName?: string
  /** Class applied to every animated element (character, word or line). */
  elementClassName?: string
}

const defaultTransition: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 32,
  mass: 0.8,
}

const defaultSizeTransition: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 38,
  mass: 0.7,
}

const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" })

function splitText(text: string, split: TextRotateSplit): string[][] {
  if (split === "lines") return text.split("\n").map((line) => [line])
  if (split === "words") return text.split(" ").map((word) => [word])
  return text
    .split(" ")
    .map((word) => Array.from(graphemes.segment(word), (part) => part.segment))
}

function pseudoRandom(seed: number) {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return value - Math.floor(value)
}

function getStaggerDelay(
  position: number,
  total: number,
  from: TextRotateStaggerFrom,
  step: number,
  seed: number
) {
  if (from === "first") return position * step
  if (from === "last") return (total - 1 - position) * step
  if (from === "center") return Math.abs((total - 1) / 2 - position) * step
  if (from === "random")
    return Math.floor(pseudoRandom(position + seed * 97) * total) * step
  return Math.abs(from - position) * step
}

// Variants live in context so an exiting item picks up a direction change made
// in the same render that removed it (AnimatePresence keeps its stale props).
const TextRotateVariantsContext = React.createContext<Variants>({})

interface TextRotateItemProps {
  ref?: React.Ref<HTMLSpanElement>
  text: string
  seed: number
  split: TextRotateSplit
  staggerFrom: TextRotateStaggerFrom
  staggerDuration: number
  groupClassName?: string
  elementClassName?: string
  onResize: (size: ResizeObserverSize) => void
}

function TextRotateItem({
  ref,
  text,
  seed,
  split,
  staggerFrom,
  staggerDuration,
  groupClassName,
  elementClassName,
  onResize,
}: TextRotateItemProps) {
  const variants = React.useContext(TextRotateVariantsContext)
  const localRef = React.useRef<HTMLSpanElement>(null)
  const isPresent = useIsPresent()
  const groups = React.useMemo(() => splitText(text, split), [text, split])
  const total = groups.reduce((count, group) => count + group.length, 0)

  const setRefs = React.useCallback(
    (node: HTMLSpanElement | null) => {
      localRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )

  React.useEffect(() => {
    const node = localRef.current
    if (!isPresent || !node) return
    const observer = new ResizeObserver(([entry]) => {
      onResize(entry.borderBoxSize[0])
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [isPresent, onResize])

  let position = 0

  return (
    <span
      ref={setRefs}
      data-slot="text-rotate-item"
      className={cn(
        split === "lines"
          ? "flex w-full flex-col"
          : "inline-flex shrink-0 whitespace-pre"
      )}
    >
      {groups.map((group, groupIndex) => (
        <React.Fragment key={groupIndex}>
          <span
            data-slot="text-rotate-group"
            className={cn(
              split === "lines" ? "flex" : "inline-flex",
              groupClassName
            )}
          >
            {group.map((element, elementIndex) => {
              const delay = getStaggerDelay(
                position++,
                total,
                staggerFrom,
                staggerDuration,
                seed
              )
              return (
                <motion.span
                  key={elementIndex}
                  data-slot="text-rotate-element"
                  className={cn("inline-block", elementClassName)}
                  custom={delay}
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {element}
                </motion.span>
              )
            })}
          </span>
          {split !== "lines" && groupIndex < groups.length - 1 ? (
            <span className="whitespace-pre"> </span>
          ) : null}
        </React.Fragment>
      ))}
    </span>
  )
}

/**
 * Rotates through a list of texts. Outgoing characters, words or lines leave
 * in one direction with a stagger while the next text enters from the other
 * side, and the container eases to the size of the new text.
 */
function TextRotate({
  texts,
  ref,
  index,
  defaultIndex = 0,
  onIndexChange,
  auto = true,
  interval = 2.5,
  loop = true,
  paused = false,
  split = "characters",
  direction = "up",
  staggerFrom = "first",
  staggerDuration = 0.025,
  blur = false,
  transition = defaultTransition,
  sizeTransition = defaultSizeTransition,
  groupClassName,
  elementClassName,
  className,
  ...props
}: TextRotateProps) {
  const reduceMotion = useReducedMotion()
  const [internalIndex, setInternalIndex] = React.useState(defaultIndex)
  const [size, setSize] = React.useState<ResizeObserverSize | null>(null)
  const isControlled = index !== undefined
  const lastIndex = texts.length - 1
  const currentIndex = Math.min(isControlled ? index : internalIndex, lastIndex)

  // Keep the latest callback without restarting the auto-rotate timer when a
  // parent passes an inline function.
  const onIndexChangeRef = React.useRef(onIndexChange)
  React.useEffect(() => {
    onIndexChangeRef.current = onIndexChange
  })

  const setIndex = React.useCallback(
    (nextIndex: number) => {
      if (nextIndex === currentIndex) return
      if (!isControlled) setInternalIndex(nextIndex)
      onIndexChangeRef.current?.(nextIndex)
    },
    [currentIndex, isControlled]
  )

  const next = React.useCallback(() => {
    if (currentIndex < lastIndex) setIndex(currentIndex + 1)
    else if (loop) setIndex(0)
  }, [currentIndex, lastIndex, loop, setIndex])

  const previous = React.useCallback(() => {
    if (currentIndex > 0) setIndex(currentIndex - 1)
    else if (loop) setIndex(lastIndex)
  }, [currentIndex, lastIndex, loop, setIndex])

  React.useImperativeHandle(
    ref,
    () => ({
      next,
      previous,
      jumpTo: (target) => setIndex(Math.max(0, Math.min(target, lastIndex))),
      reset: () => setIndex(0),
    }),
    [lastIndex, next, previous, setIndex]
  )

  React.useEffect(() => {
    if (!auto || paused || texts.length < 2) return
    if (!loop && currentIndex === lastIndex) return
    const timer = window.setTimeout(next, interval * 1000)
    return () => window.clearTimeout(timer)
  }, [auto, currentIndex, interval, lastIndex, loop, next, paused, texts.length])

  const variants = React.useMemo<Variants>(() => {
    const enterY = direction === "up" ? "100%" : "-100%"
    const exitY = direction === "up" ? "-120%" : "120%"
    const hidden = (y: string) =>
      blur ? { y, opacity: 0, filter: "blur(6px)" } : { y, opacity: 0 }
    const shown = blur
      ? { y: "0%", opacity: 1, filter: "blur(0px)" }
      : { y: "0%", opacity: 1 }
    const timed = (delay: number) =>
      reduceMotion ? { duration: 0 } : { ...transition, delay }

    return {
      initial: hidden(enterY),
      animate: (delay: number) => ({ ...shown, transition: timed(delay) }),
      exit: (delay: number) => ({ ...hidden(exitY), transition: timed(delay) }),
    }
  }, [blur, direction, reduceMotion, transition])

  const handleResize = React.useCallback(
    (next: ResizeObserverSize) => setSize(next),
    []
  )
  const lines = split === "lines"
  const target =
    size === null
      ? undefined
      : lines
        ? { height: size.blockSize }
        : { width: size.inlineSize }

  return (
    <span
      data-slot="text-rotate"
      className={cn("inline-flex", className)}
      {...props}
    >
      <span className="sr-only">{texts[currentIndex]}</span>
      <motion.span
        aria-hidden="true"
        data-slot="text-rotate-viewport"
        className={cn(
          "relative -my-[0.15em] overflow-hidden py-[0.15em]",
          lines ? "box-content flex min-w-0 flex-1" : "inline-flex"
        )}
        initial={false}
        animate={target}
        transition={reduceMotion ? { duration: 0 } : sizeTransition}
      >
        <TextRotateVariantsContext.Provider value={variants}>
          <AnimatePresence initial={false} mode="popLayout">
            <TextRotateItem
              key={currentIndex}
              text={texts[currentIndex]}
              seed={currentIndex}
              split={split}
              staggerFrom={staggerFrom}
              staggerDuration={reduceMotion ? 0 : staggerDuration}
              groupClassName={groupClassName}
              elementClassName={elementClassName}
              onResize={handleResize}
            />
          </AnimatePresence>
        </TextRotateVariantsContext.Provider>
      </motion.span>
    </span>
  )
}

export { TextRotate }
