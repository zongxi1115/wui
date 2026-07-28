"use client"

import * as React from "react"
import { Collapsible as CollapsiblePrimitive } from "radix-ui"
import { ChevronDownIcon } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/registry/lib/utils"

const CollapsibleContext = React.createContext(false)

export interface CollapsibleProps
  extends React.ComponentProps<typeof CollapsiblePrimitive.Root> {}

/** A disclosure region with controlled and uncontrolled open state. */
function Collapsible({
  open,
  defaultOpen = false,
  onOpenChange,
  ...props
}: CollapsibleProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const resolvedOpen = open ?? internalOpen
  return (
    <CollapsibleContext.Provider value={resolvedOpen}>
      <CollapsiblePrimitive.Root
        data-slot="collapsible"
        open={resolvedOpen}
        onOpenChange={(next) => {
          if (open === undefined) setInternalOpen(next)
          onOpenChange?.(next)
        }}
        {...props}
      />
    </CollapsibleContext.Provider>
  )
}

export interface CollapsibleTriggerProps
  extends React.ComponentProps<typeof CollapsiblePrimitive.Trigger> {
  /** Show the built-in rotating chevron after the label. @default true */
  showIndicator?: boolean
}

function CollapsibleTrigger({
  className,
  children,
  showIndicator = true,
  asChild = false,
  ...props
}: CollapsibleTriggerProps) {
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapsible-trigger"
      asChild={asChild}
      className={cn(
        "group flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/35 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          <span className="min-w-0 flex-1">{children}</span>
          {showIndicator ? (
            <ChevronDownIcon
              aria-hidden
              data-slot="collapsible-indicator"
              className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 motion-reduce:transition-none"
            />
          ) : null}
        </>
      )}
    </CollapsiblePrimitive.Trigger>
  )
}

function CollapsibleContent({
  className,
  children,
  ...props
}: Omit<
  React.ComponentProps<typeof CollapsiblePrimitive.Content>,
  "asChild" | "forceMount"
>) {
  const open = React.useContext(CollapsibleContext)
  const reduceMotion = useReducedMotion()
  return (
    <CollapsiblePrimitive.Content forceMount asChild {...props}>
      <motion.div
        data-slot="collapsible-content"
        aria-hidden={!open}
        inert={!open}
        className={cn("overflow-hidden", className)}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }
        }
      >
        {children}
      </motion.div>
    </CollapsiblePrimitive.Content>
  )
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger }
