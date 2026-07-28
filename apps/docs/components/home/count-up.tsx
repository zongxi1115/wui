"use client"

import * as React from "react"

import { SlidingNumber } from "@/registry/ui/sliding-number"

/** Rolls from zero up to `value` after mount, dogfooding SlidingNumber in the hero. */
export function CountUp({ value }: { value: number }) {
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    const timer = window.setTimeout(() => setCurrent(value), 200)
    return () => window.clearTimeout(timer)
  }, [value])

  return <SlidingNumber value={current} />
}
