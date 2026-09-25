"use client"

import * as React from "react"
import {
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
  type Transition,
  type UseInViewOptions,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

export interface NumberTickerProps
  extends Omit<React.ComponentProps<"span">, "children" | "prefix"> {
  /** Target value the number animates to. */
  value: number
  /** Value the first animation starts from. @default 0 */
  from?: number
  /** Seconds to wait before the first animation starts. @default 0 */
  delay?: number
  /** Fixed number of decimal places. @default 0 */
  decimalPlaces?: number
  /** BCP 47 locale used by `Intl.NumberFormat`. @default "zh-CN" */
  locale?: string
  /** Extra `Intl.NumberFormat` options such as currency, percent or compact notation. */
  formatOptions?: Intl.NumberFormatOptions
  /** Text rendered before the number. */
  prefix?: React.ReactNode
  /** Text rendered after the number. */
  suffix?: React.ReactNode
  /** Wait until the number scrolls into view before counting. @default true */
  startOnView?: boolean
  /** Intersection options used when `startOnView` is on. */
  viewOptions?: UseInViewOptions
  /** Motion transition for every count. Defaults to a spring with no overshoot. */
  transition?: Transition
  /** Called when a count finishes, with the final value. */
  onComplete?: (value: number) => void
}

const defaultTransition: Transition = {
  type: "spring",
  duration: 1.6,
  bounce: 0,
}

/**
 * Counts up or down to `value` once it scrolls into view, then animates from
 * the current number whenever `value` changes.
 */
function NumberTicker({
  value,
  from = 0,
  delay = 0,
  decimalPlaces = 0,
  locale = "zh-CN",
  formatOptions,
  prefix,
  suffix,
  startOnView = true,
  viewOptions,
  transition = defaultTransition,
  onComplete,
  className,
  ...props
}: NumberTickerProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const numberRef = React.useRef<HTMLSpanElement>(null)
  const reduceMotion = useReducedMotion()
  const inView = useInView(ref, { once: true, ...viewOptions })
  const motionValue = useMotionValue(from)
  const hasStarted = React.useRef(false)
  const options = React.useRef({ transition, delay, onComplete })

  React.useEffect(() => {
    options.current = { transition, delay, onComplete }
  })

  const formatter = React.useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
        ...formatOptions,
      }),
    [decimalPlaces, formatOptions, locale]
  )

  React.useEffect(() => {
    const node = numberRef.current
    if (!node) return
    node.textContent = formatter.format(motionValue.get())
    return motionValue.on("change", (latest) => {
      node.textContent = formatter.format(latest)
    })
  }, [formatter, motionValue])

  React.useEffect(() => {
    if (startOnView && !inView) return
    if (reduceMotion) {
      motionValue.jump(value)
      return
    }
    const { transition, delay, onComplete } = options.current
    const firstRun = !hasStarted.current
    hasStarted.current = true
    const controls = animate(motionValue, value, {
      ...transition,
      delay: firstRun ? delay : 0,
      onComplete: () => onComplete?.(value),
    })
    return () => controls.stop()
  }, [inView, motionValue, reduceMotion, startOnView, value])

  return (
    <span
      ref={ref}
      data-slot="number-ticker"
      className={cn("inline-flex items-baseline tabular-nums", className)}
      {...props}
    >
      <span className="sr-only">
        {prefix}
        {formatter.format(value)}
        {suffix}
      </span>
      <span aria-hidden="true" className="inline-flex items-baseline">
        {prefix}
        <span ref={numberRef} data-slot="number-ticker-value">
          {formatter.format(from)}
        </span>
        {suffix}
      </span>
    </span>
  )
}

export { NumberTicker }
