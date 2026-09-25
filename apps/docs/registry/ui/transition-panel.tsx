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

export interface TransitionPanelProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /** Panels, one per index. Only the active one is rendered. */
  children: React.ReactNode[]
  /** Index of the visible panel. Moving forward slides in from the end side. */
  activeIndex: number
  /** Axis panels travel along. @default "x" */
  axis?: "x" | "y"
  /** Travel distance of entering and exiting panels, in pixels. @default 24 */
  offset?: number
  /** Blur panels while they enter and exit. @default true */
  blur?: boolean
  /** Ease the container height to fit the next panel. @default true */
  animateHeight?: boolean
  /** Transition of the entering and exiting panels. */
  transition?: Transition
  /** Transition of the container height. */
  heightTransition?: Transition
  /** Class applied to the element wrapping each panel. */
  panelClassName?: string
}

const defaultTransition: Transition = {
  duration: 0.36,
  ease: [0.22, 1, 0.36, 1],
}

const defaultHeightTransition: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 40,
  mass: 0.8,
}

interface PanelProps extends Omit<React.ComponentProps<typeof motion.div>, "onResize"> {
  onResize: (height: number) => void
}

function Panel({ ref, onResize, ...props }: PanelProps) {
  const localRef = React.useRef<HTMLDivElement>(null)
  const isPresent = useIsPresent()

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
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
      onResize(entry.borderBoxSize[0].blockSize)
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [isPresent, onResize])

  return <motion.div ref={setRefs} {...props} />
}

/**
 * Shows one panel at a time. Panels slide in the direction of travel, fade
 * and optionally blur, while the container eases to the next panel's height.
 */
function TransitionPanel({
  children,
  activeIndex,
  axis = "x",
  offset = 24,
  blur = true,
  animateHeight = true,
  transition = defaultTransition,
  heightTransition = defaultHeightTransition,
  panelClassName,
  className,
  ...props
}: TransitionPanelProps) {
  const reduceMotion = useReducedMotion()
  const [height, setHeight] = React.useState<number | null>(null)
  const [travel, setTravel] = React.useState({ index: activeIndex, direction: 1 })

  if (travel.index !== activeIndex) {
    setTravel({
      index: activeIndex,
      direction: activeIndex > travel.index ? 1 : -1,
    })
  }

  const variants = React.useMemo<Variants>(() => {
    const moved = (direction: number) => ({
      [axis]: direction * offset,
      opacity: 0,
      ...(blur ? { filter: "blur(4px)" } : null),
    })
    return {
      enter: (direction: number) => moved(direction),
      center: {
        [axis]: 0,
        opacity: 1,
        ...(blur ? { filter: "blur(0px)" } : null),
      },
      exit: (direction: number) => moved(-direction),
    }
  }, [axis, blur, offset])

  const handleResize = React.useCallback((next: number) => setHeight(next), [])

  return (
    <div
      data-slot="transition-panel"
      className={cn("relative", className)}
      {...props}
    >
      <motion.div
        data-slot="transition-panel-viewport"
        className="relative overflow-hidden"
        initial={false}
        animate={animateHeight && height !== null ? { height } : undefined}
        transition={reduceMotion ? { duration: 0 } : heightTransition}
      >
        <AnimatePresence
          initial={false}
          mode="popLayout"
          custom={travel.direction}
        >
          <Panel
            key={activeIndex}
            data-slot="transition-panel-item"
            className={cn("w-full", panelClassName)}
            custom={travel.direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={reduceMotion ? { duration: 0 } : transition}
            onResize={handleResize}
          >
            {children[activeIndex]}
          </Panel>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export { TransitionPanel }
