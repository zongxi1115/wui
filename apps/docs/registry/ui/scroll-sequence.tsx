"use client"

import * as React from "react"
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type HTMLMotionProps,
  type MotionValue,
  type Variants,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

export interface ScrollSequenceProps extends Omit<
  HTMLMotionProps<"section">,
  "children"
> {
  /** Steps displayed one at a time in the pinned viewport. */
  children: React.ReactNode
  /** Scroll distance per transition, in viewport-height units. @default 0.65 */
  stepLength?: number
  /** Transition used between steps. Direction follows the scroll direction. @default "slide" */
  effect?: "slide" | "fade" | "blur"
  /** Scrollable element to observe instead of the page. */
  container?: React.RefObject<HTMLElement | null>
  /** Show a compact step indicator that fills with scroll. @default true */
  showProgress?: boolean
  /** Called when the active step changes. */
  onStepChange?: (index: number) => void
  /** Classes applied to the pinned viewport. */
  viewportClassName?: string
  /** Classes applied to the active step wrapper. */
  stepClassName?: string
}

function getViewportHeight(container?: HTMLElement | null) {
  if (!container) return window.innerHeight
  const style = window.getComputedStyle(container)
  return (
    container.clientHeight -
    parseFloat(style.paddingTop) -
    parseFloat(style.paddingBottom)
  )
}

const stepVariants: Record<
  NonNullable<ScrollSequenceProps["effect"]>,
  Variants
> = {
  slide: {
    enter: (direction: number) => ({ opacity: 0, y: 28 * direction }),
    center: { opacity: 1, y: 0 },
    exit: (direction: number) => ({ opacity: 0, y: -28 * direction }),
  },
  fade: {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  },
  blur: {
    enter: (direction: number) => ({
      opacity: 0,
      y: 12 * direction,
      filter: "blur(8px)",
    }),
    center: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: (direction: number) => ({
      opacity: 0,
      y: -12 * direction,
      filter: "blur(8px)",
    }),
  },
}

interface IndicatorSegmentProps {
  index: number
  count: number
  progress: MotionValue<number>
}

function IndicatorSegment({ index, count, progress }: IndicatorSegmentProps) {
  const fill = useTransform(progress, (latest) =>
    Math.min(Math.max(latest * count - index, 0), 1)
  )

  return (
    <span className="bg-foreground/15 relative h-0.5 w-6 overflow-hidden rounded-full">
      <motion.span
        className="bg-foreground absolute inset-0 origin-left"
        style={{ scaleX: fill }}
      />
    </span>
  )
}

/** Pins a viewport and swaps its child steps according to scroll progress. */
function ScrollSequence({
  children,
  stepLength = 0.65,
  effect = "slide",
  container,
  showProgress = true,
  onStepChange,
  className,
  viewportClassName,
  stepClassName,
  style,
  ...props
}: ScrollSequenceProps) {
  const sectionRef = React.useRef<HTMLElement>(null)
  const steps = React.Children.toArray(children)
  const [[activeStep, direction], setActive] = React.useState<[number, number]>(
    [0, 1]
  )
  const [viewportHeight, setViewportHeight] = React.useState(0)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container,
    offset: ["start start", "end end"],
  })

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const next = Math.max(
      0,
      Math.min(steps.length - 1, Math.floor(latest * steps.length))
    )
    if (next !== activeStep) {
      setActive([next, next > activeStep ? 1 : -1])
      onStepChange?.(next)
    }
  })

  React.useLayoutEffect(() => {
    const measure = () => {
      setViewportHeight(getViewportHeight(container?.current))
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (container?.current) observer.observe(container.current)
    window.addEventListener("resize", measure)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [container])

  if (reduceMotion) {
    return (
      <motion.section
        ref={sectionRef}
        data-slot="scroll-sequence"
        className={className}
        style={style}
        {...props}
      >
        <div className={cn("grid gap-6", viewportClassName)}>{children}</div>
      </motion.section>
    )
  }

  const sectionHeight = viewportHeight
    ? viewportHeight * (1 + Math.max(steps.length - 1, 0) * stepLength)
    : `${(1 + Math.max(steps.length - 1, 0) * stepLength) * 100}vh`
  const activeKey = React.isValidElement(steps[activeStep])
    ? steps[activeStep].key
    : activeStep

  return (
    <motion.section
      ref={sectionRef}
      data-slot="scroll-sequence"
      className={cn("relative", className)}
      style={{ ...style, height: sectionHeight }}
      {...props}
    >
      <div
        data-slot="scroll-sequence-viewport"
        className={cn("sticky top-0 grid overflow-hidden", viewportClassName)}
        style={{ height: viewportHeight || "100vh" }}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={activeKey}
            data-slot="scroll-sequence-step"
            className={cn("col-start-1 row-start-1 h-full w-full", stepClassName)}
            custom={direction}
            variants={stepVariants[effect]}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {steps[activeStep]}
          </motion.div>
        </AnimatePresence>

        {showProgress && steps.length > 1 ? (
          <div
            role="status"
            aria-label={`Step ${activeStep + 1} of ${steps.length}`}
            data-slot="scroll-sequence-progress"
            className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-1.5"
          >
            {steps.map((_, index) => (
              <IndicatorSegment
                key={index}
                index={index}
                count={steps.length}
                progress={scrollYProgress}
              />
            ))}
          </div>
        ) : null}
      </div>
    </motion.section>
  )
}

export { ScrollSequence }
