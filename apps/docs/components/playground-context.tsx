"use client"

import * as React from "react"
import type { PlaygroundConfig, PlaygroundValue } from "@/lib/playground-types"

interface PlaygroundContextValue {
  config: PlaygroundConfig
  values: Record<string, PlaygroundValue>
  report: (target: string, props: Record<string, PlaygroundValue>) => void
  change: (key: string, value: PlaygroundValue) => void
}

export const PlaygroundContext =
  React.createContext<PlaygroundContextValue | null>(null)

/** Inject props before parents inspect child types or read child.props. */
export function usePlaygroundProps() {
  const context = React.useContext(PlaygroundContext)!
  return (target: string) =>
    Object.fromEntries(
      Object.entries(context.values)
        .filter(([key]) => key.startsWith(`${target}.`))
        .map(([key, value]) => [key.slice(target.length + 1), value])
    )
}

// Keep the original component's public type, including generic props and refs.
// React 19 forwards ref through props, so Slot and trigger compositions still work.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withPlaygroundProps<T extends React.ComponentType<any>>(
  Component: T,
  targetId: string
): T {
  function PlaygroundComponent(props: React.ComponentProps<T>) {
    const context = React.useContext(PlaygroundContext)!
    const target = context.config.targets!.find((item) => item.id === targetId)!
    const overrides: Record<string, unknown> = {}
    const snapshot: Record<string, PlaygroundValue> = {}
    for (const control of target.controls) {
      const key = `${targetId}.${control.name}`
      if (key in context.values) overrides[control.name] = context.values[key]
      const actual = props[control.name]
      if (
        actual !== undefined &&
        (control.control === "json" ||
          actual === null ||
          ["string", "number", "boolean"].includes(typeof actual))
      ) {
        snapshot[control.name] = actual
      }
    }
    const serialized = JSON.stringify(snapshot)
    const report = context.report
    React.useEffect(() => {
      report(targetId, JSON.parse(serialized))
    }, [report, serialized])

    for (const [prop, event] of Object.entries(target.events)) {
      overrides[event] = (...args: unknown[]) => {
        props[event]?.(...args)
        const value = target.nativeEvents?.includes(event)
          ? (args[0] as React.ChangeEvent<HTMLInputElement>).target.value
          : (args[0] as PlaygroundValue)
        if (`${targetId}.${prop}` in context.values)
          context.change(`${targetId}.${prop}`, value)
        else context.report(targetId, { [prop]: value })
      }
    }
    return React.createElement(Component, { ...props, ...overrides })
  }
  PlaygroundComponent.displayName = `Playground(${Component.displayName ?? Component.name})`
  return PlaygroundComponent as T
}

export function usePlaygroundFunction<
  T extends (options: Record<string, unknown>) => unknown,
>(fn: T, target: string): T {
  const context = React.useContext(PlaygroundContext)!
  return ((options: Record<string, unknown>) => {
    const overrides = Object.fromEntries(
      Object.entries(context.values)
        .filter(([key]) => key.startsWith(`${target}.`))
        .map(([key, value]) => [key.slice(target.length + 1), value])
    )
    return fn({ ...options, ...overrides })
  }) as T
}
