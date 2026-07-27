"use client"

import * as React from "react"
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type Transition,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

type SlideDirection = -1 | 0 | 1

const defaultTransition: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 28,
}

function SlidingDigitValue({
  number,
  position,
}: {
  number: number
  position: MotionValue<number>
}) {
  const y = useTransform(position, (latest) => {
    const current = ((latest % 10) + 10) % 10
    let offset = (10 + number - current) % 10

    if (offset > 5) offset -= 10

    return `${offset}em`
  })

  return (
    <motion.span
      className="absolute inset-0 text-center leading-none"
      style={{ y }}
    >
      {number}
    </motion.span>
  )
}

export interface SlidingNumberProps extends React.ComponentProps<"span"> {
  /** Number or numeric string to display. */
  value: number | string
  /** Pad single-digit integer values with a leading zero. @default false */
  padStart?: boolean
  /** Character used in place of the decimal point. @default "." */
  decimalSeparator?: string
  /** Motion transition used by every digit. */
  transition?: Transition
}

function SlidingDigit({
  digit,
  direction,
  transition,
  reduceMotion,
}: {
  digit: number
  direction: SlideDirection
  transition: Transition
  reduceMotion: boolean
}) {
  const position = useMotionValue(digit)
  const previousDigit = React.useRef(digit)
  const targetPosition = React.useRef(digit)

  React.useEffect(() => {
    const previous = previousDigit.current
    let distance = digit - previous

    if (direction > 0 && distance < 0) distance += 10
    if (direction < 0 && distance > 0) distance -= 10

    targetPosition.current += distance
    previousDigit.current = digit

    if (reduceMotion) {
      position.set(targetPosition.current)
      return
    }

    const playback = animate(position, targetPosition.current, transition)
    return () => playback.stop()
  }, [digit, direction, position, reduceMotion, transition])

  return (
    <motion.span
      data-slot="sliding-number-digit"
      className="relative inline-block h-[1em] w-[0.62em] shrink-0 overflow-hidden align-[-0.08em]"
      initial={
        reduceMotion
          ? false
          : { opacity: 0, width: 0, y: direction < 0 ? "-0.15em" : "0.15em" }
      }
      animate={{ opacity: 1, width: "0.62em", y: "0em" }}
      exit={
        reduceMotion
          ? { opacity: 0, width: 0 }
          : { opacity: 0, width: 0, y: "0.15em" }
      }
      transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
    >
      {Array.from({ length: 10 }, (_, number) => (
        <SlidingDigitValue
          number={number}
          position={position}
          key={number}
        />
      ))}
    </motion.span>
  )
}

/** Displays each numeric digit on an independently sliding vertical reel. */
function SlidingNumber({
  value,
  padStart = false,
  decimalSeparator = ".",
  transition = defaultTransition,
  className,
  ...props
}: SlidingNumberProps) {
  const reduceMotion = useReducedMotion()
  const numericValue = Number(value)
  const previousValue = React.useRef(numericValue)
  const direction: SlideDirection = Number.isFinite(numericValue)
    ? numericValue > previousValue.current
      ? 1
      : numericValue < previousValue.current
        ? -1
        : 0
    : 0

  React.useEffect(() => {
    previousValue.current = numericValue
  }, [numericValue])

  let formatted = String(value)
  const [integerPart = "", fractionPart] = formatted.split(".")
  if (padStart && /^-?\d$/.test(integerPart)) {
    formatted = integerPart.startsWith("-")
      ? `-0${integerPart.slice(1)}`
      : integerPart.padStart(2, "0")
    if (fractionPart !== undefined) formatted += `.${fractionPart}`
  }
  const displayValue = formatted.replace(".", decimalSeparator)
  const characters = Array.from(displayValue)

  return (
    <span
      aria-label={displayValue}
      data-slot="sliding-number"
      className={cn("inline-flex items-baseline tabular-nums", className)}
      {...props}
    >
      <span aria-hidden="true" className="inline-flex items-baseline">
        <AnimatePresence initial={false}>
          {characters.map((character, index) => {
            const digit = Number(character)
            const place = characters.length - index - 1
            return Number.isInteger(digit) ? (
              <SlidingDigit
                digit={digit}
                direction={direction}
                transition={transition}
                reduceMotion={Boolean(reduceMotion)}
                key={`digit-${place}`}
              />
            ) : (
              <span
                data-slot="sliding-number-symbol"
                key={`${character}-${index}`}
              >
                {character}
              </span>
            )
          })}
        </AnimatePresence>
      </span>
    </span>
  )
}

export { SlidingNumber }
