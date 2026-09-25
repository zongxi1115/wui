"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "radix-ui"
import { motion, useReducedMotion } from "motion/react"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

type TabsStyle = "pill" | "underline"
type TabsOrientation = "horizontal" | "vertical"

const INDICATOR_SPRING = {
  type: "spring",
  stiffness: 520,
  damping: 38,
  mass: 0.7,
} as const

const TabsContext = React.createContext<{
  value?: string
  layoutId: string
  /** -1 when the newly selected tab sits before the previous one, 1 after, 0 unknown. */
  direction: number
  orientation: TabsOrientation
}>({ layoutId: "wui-tabs", direction: 0, orientation: "horizontal" })

const TabsListContext = React.createContext<TabsStyle>("pill")

function getTriggerIndex(root: HTMLElement | null, value: string | undefined) {
  if (!root || value === undefined) return -1
  const triggers = Array.from(
    root.querySelectorAll<HTMLElement>("[data-slot=tabs-trigger]")
  ).filter((trigger) => trigger.closest("[data-slot=tabs]") === root)
  return triggers.findIndex((trigger) => trigger.dataset.value === value)
}

export interface TabsProps extends React.ComponentProps<typeof TabsPrimitive.Root> {}

function Tabs({
  value,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  className,
  ref,
  children,
  ...props
}: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const selectedValue = value ?? internalValue
  const layoutId = React.useId()
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const [previousValue, setPreviousValue] = React.useState(selectedValue)
  const [direction, setDirection] = React.useState(0)

  // Derive the travel direction while rendering (the DOM still holds the
  // previous commit), so content can slide in from the side of the tab the
  // user moved towards — including controlled changes made from outside.
  if (previousValue !== selectedValue) {
    const from = getTriggerIndex(rootRef.current, previousValue)
    const to = getTriggerIndex(rootRef.current, selectedValue)
    setPreviousValue(selectedValue)
    setDirection(from === -1 || to === -1 ? 0 : Math.sign(to - from))
  }

  function handleValueChange(next: string) {
    if (value === undefined) setInternalValue(next)
    onValueChange?.(next)
  }

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )

  return (
    <TabsContext.Provider
      value={{ value: selectedValue, layoutId, direction, orientation }}
    >
      <TabsPrimitive.Root
        ref={setRefs}
        data-slot="tabs"
        value={value}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        orientation={orientation}
        className={cn(
          "data-[orientation=vertical]:flex data-[orientation=vertical]:gap-6",
          className
        )}
        {...props}
      >
        {children}
      </TabsPrimitive.Root>
    </TabsContext.Provider>
  )
}

const tabsListVariants = cva(
  "inline-flex w-fit items-center text-muted-foreground data-[orientation=vertical]:h-fit data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
  {
    variants: {
      variant: {
        pill: "rounded-lg bg-muted p-1",
        underline:
          "gap-1 border-b data-[orientation=vertical]:gap-0.5 data-[orientation=vertical]:border-b-0 data-[orientation=vertical]:border-l",
      },
    },
    defaultVariants: { variant: "pill" },
  }
)

export interface TabsListProps extends React.ComponentProps<typeof TabsPrimitive.List> {
  /** Indicator treatment used by every trigger inside the list. @default "pill" */
  variant?: TabsStyle
}

function TabsList({ className, variant = "pill", ...props }: TabsListProps) {
  return (
    <TabsListContext.Provider value={variant}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        data-variant={variant}
        className={cn(tabsListVariants({ variant }), className)}
        {...props}
      />
    </TabsListContext.Provider>
  )
}

function TabsTrigger({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const tabs = React.useContext(TabsContext)
  const variant = React.useContext(TabsListContext)
  const reduceMotion = useReducedMotion()
  const active = tabs.value === value
  const vertical = tabs.orientation === "vertical"

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      data-value={value}
      className={cn(
        "relative isolate inline-flex min-w-20 items-center justify-center gap-2 whitespace-nowrap px-4 py-2 text-sm font-medium outline-none transition-colors duration-200 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground data-[orientation=vertical]:justify-start [&_svg]:size-4 [&_svg]:shrink-0",
        variant === "pill" && "rounded-md",
        variant === "underline" &&
          (vertical ? "rounded-r-md px-3 py-2" : "rounded-t-md px-3 py-2.5"),
        className
      )}
      value={value}
      {...props}
    >
      {active ? (
        <motion.span
          aria-hidden
          data-slot="tabs-indicator"
          layoutId={`${tabs.layoutId}-${variant}`}
          className={cn(
            "absolute -z-10",
            variant === "pill" &&
              "inset-0 rounded-md bg-background shadow-xs dark:bg-input/40",
            variant === "underline" &&
              (vertical
                ? "inset-y-1.5 -left-px w-0.5 rounded-full bg-primary"
                : "inset-x-2 -bottom-px h-0.5 rounded-full bg-primary")
          )}
          transition={reduceMotion ? { duration: 0 } : INDICATOR_SPRING}
        />
      ) : null}
      {children}
    </TabsPrimitive.Trigger>
  )
}

function TabsContent({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  const tabs = React.useContext(TabsContext)
  const reduceMotion = useReducedMotion()
  const active = tabs.value === value
  const distance = reduceMotion ? 0 : tabs.direction * 16
  const offset =
    tabs.orientation === "vertical"
      ? { x: 0, y: distance || (reduceMotion ? 0 : 6) }
      : { x: distance, y: distance ? 0 : reduceMotion ? 0 : 6 }

  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      value={value}
      className={cn(
        "mt-4 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30 data-[orientation=vertical]:mt-0 data-[orientation=vertical]:min-w-0 data-[orientation=vertical]:flex-1",
        className
      )}
      {...props}
    >
      <motion.div
        initial={{ opacity: 0, ...offset }}
        animate={active ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offset }}
        transition={
          reduceMotion ? { duration: 0 } : { duration: 0.26, ease: [0.22, 1, 0.36, 1] }
        }
      >
        {children}
      </motion.div>
    </TabsPrimitive.Content>
  )
}

export { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants }
