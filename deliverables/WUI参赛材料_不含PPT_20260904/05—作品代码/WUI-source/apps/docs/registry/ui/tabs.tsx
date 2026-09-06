"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "radix-ui"
import { motion, useReducedMotion } from "motion/react"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

type TabsStyle = "pill" | "underline"

const TabsContext = React.createContext<{
  value?: string
  layoutId: string
}>({ layoutId: "wui-tabs" })

const TabsListContext = React.createContext<TabsStyle>("pill")

export interface TabsProps extends React.ComponentProps<typeof TabsPrimitive.Root> {}

function Tabs({ value, defaultValue, onValueChange, children, ...props }: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const selectedValue = value ?? internalValue
  const layoutId = React.useId()

  function handleValueChange(next: string) {
    if (value === undefined) setInternalValue(next)
    onValueChange?.(next)
  }

  return (
    <TabsContext.Provider value={{ value: selectedValue, layoutId }}>
      <TabsPrimitive.Root
        data-slot="tabs"
        value={value}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        {...props}
      >
        {children}
      </TabsPrimitive.Root>
    </TabsContext.Provider>
  )
}

const tabsListVariants = cva("inline-flex w-fit items-center text-muted-foreground", {
  variants: {
    variant: {
      pill: "rounded-lg bg-muted p-1",
      underline: "gap-1 border-b",
    },
  },
  defaultVariants: { variant: "pill" },
})

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

function TabsTrigger({ className, children, value, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const tabs = React.useContext(TabsContext)
  const variant = React.useContext(TabsListContext)
  const reduceMotion = useReducedMotion()
  const active = tabs.value === value

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative isolate inline-flex min-w-20 items-center justify-center gap-2 whitespace-nowrap px-4 py-2 text-sm font-medium outline-none transition-colors duration-200 focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground [&_svg]:relative [&_svg]:z-10 [&_svg]:size-4",
        variant === "pill" ? "rounded-md" : "rounded-t-md px-3 py-2.5",
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
            "absolute z-[-1]",
            variant === "pill"
              ? "inset-0 rounded-md bg-background shadow-sm"
              : "inset-x-2 -bottom-px h-0.5 rounded-full bg-primary"
          )}
          transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 38, mass: 0.7 }}
        />
      ) : null}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </TabsPrimitive.Trigger>
  )
}

function TabsContent({ className, children, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  const reduceMotion = useReducedMotion()
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("mt-4 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30", className)}
      {...props}
    >
      <motion.div
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </TabsPrimitive.Content>
  )
}

export { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants }
