"use client"

import * as React from "react"
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type HTMLMotionProps,
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
  /** Scrollable element to observe instead of the page. */
  container?: React.RefObject<HTMLElement | null>
  /** Show a compact step indicator. @default true */
  showProgress?: boolean
  /** Called when the active step changes. */
  onStepChange?: (index: number) => void
  /** Classes applied to the pinned viewport. */
  viewportClassName?: string
  /** Classes applied to the active step wrapper. */
  stepClassName?: string
}

/** Pins a viewport and swaps its child steps according to scroll progress. */
function ScrollSequence({
  children,
  stepLength = 0.65,
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
  const [activeStep, setActiveStep] = React.useState(0)
  const [viewportHeight, setViewportHeight] = React.useState(0)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container,
    offset: ["start start", "end end"],
  })

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const next = Math.min(
      steps.length - 1,
      Math.floor(Math.min(latest, 0.9999) * steps.length)
    )
    if (next !== activeStep && next >= 0) {
      setActiveStep(next)
      onStepChange?.(next)
    }
  })

  React.useLayoutEffect(() => {
    const measure = () => {
      setViewportHeight(container?.current?.clientHeight ?? window.innerHeight)
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
        className={cn("sticky top-0 overflow-hidden", viewportClassName)}
        style={{ height: viewportHeight || "100vh" }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeKey}
            data-slot="scroll-sequence-step"
            className={cn("h-full w-full", stepClassName)}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {steps[activeStep]}
          </motion.div>
        </AnimatePresence>

        {showProgress && steps.length > 1 ? (
          <div
            aria-label={`Step ${activeStep + 1} of ${steps.length}`}
            data-slot="scroll-sequence-progress"
            className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-1.5"
          >
            {steps.map((_, index) => (
              <span
                key={index}
                aria-hidden="true"
                className={cn(
                  "bg-border h-0.5 w-5 transition-colors",
                  index <= activeStep && "bg-foreground"
                )}
              />
            ))}
          </div>
        ) : null}
      </div>
    </motion.section>
  )
}

export { ScrollSequence }
