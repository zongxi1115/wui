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
  type Variants,
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

const digitVariants: Variants = {
  initial: (direction: SlideDirection) => ({
    opacity: 0,
    width: 0,
    y: direction < 0 ? "-0.3em" : "0.3em",
    filter: "blur(2px)",
  }),
  animate: { opacity: 1, width: "0.62em", y: "0em", filter: "blur(0px)" },
  exit: (direction: SlideDirection) => ({
    opacity: 0,
    width: 0,
    y: direction < 0 ? "0.3em" : "-0.3em",
    filter: "blur(2px)",
  }),
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
  // Read the latest direction/transition without restarting the roll on
  // unrelated re-renders.
  const latest = React.useRef({ direction, transition })

  React.useEffect(() => {
    latest.current = { direction, transition }
  })

  React.useEffect(() => {
    const previous = previousDigit.current
    if (previous === digit) return
    const { direction: currentDirection, transition: currentTransition } =
      latest.current
    let distance = digit - previous

    // Roll the long way round so every reel moves with the value's direction
    // (e.g. 9 → 0 keeps rolling up when the number increases).
    if (currentDirection > 0 && distance < 0) distance += 10
    if (currentDirection < 0 && distance > 0) distance -= 10

    targetPosition.current += distance
    previousDigit.current = digit

    if (reduceMotion) {
      position.set(targetPosition.current)
      return
    }

    const playback = animate(position, targetPosition.current, currentTransition)
    return () => playback.stop()
  }, [digit, position, reduceMotion])

  return (
    <motion.span
      data-slot="sliding-number-digit"
      className="relative inline-block h-[1em] w-[0.62em] shrink-0 overflow-hidden align-[-0.08em]"
      custom={direction}
      variants={digitVariants}
      initial={reduceMotion ? false : "initial"}
      animate="animate"
      exit="exit"
      transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
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
  // Ignore grouping separators and units so "12,480" still resolves a
  // direction for the roll.
  const numericValue =
    typeof value === "number"
      ? value
      : Number(value.replace(/[^\d.-]/g, ""))
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
        <AnimatePresence initial={false} custom={direction}>
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
