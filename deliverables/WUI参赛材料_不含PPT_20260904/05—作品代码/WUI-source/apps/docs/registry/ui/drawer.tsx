"use client"

import * as React from "react"
import { XIcon } from "lucide-react"
import { Dialog as DrawerPrimitive } from "radix-ui"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { cn } from "@/registry/lib/utils"

type DrawerContextValue = {
  open: boolean
}

const DrawerContext = React.createContext<DrawerContextValue | null>(null)
const MotionOverlay = motion.create(DrawerPrimitive.Overlay)
const MotionContent = motion.create(DrawerPrimitive.Content)

function useDrawerContext() {
  const context = React.useContext(DrawerContext)
  if (!context) throw new Error("Drawer parts must be used inside <Drawer>.")
  return context
}

export interface DrawerProps extends React.ComponentProps<
  typeof DrawerPrimitive.Root
> {
  /** Controlled visibility state. */
  open?: boolean
  /** Initial visibility in uncontrolled mode. @default false */
  defaultOpen?: boolean
  /** Called whenever the drawer requests a visibility change. */
  onOpenChange?: (open: boolean) => void
  /** Trap focus and disable interaction outside the panel. @default true */
  modal?: boolean
}

function Drawer({
  open: openProp,
  defaultOpen,
  onOpenChange,
  children,
  ...props
}: DrawerProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false)
  const open = openProp ?? internalOpen

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [onOpenChange, openProp]
  )

  return (
    <DrawerContext.Provider value={{ open }}>
      <DrawerPrimitive.Root
        data-slot="drawer"
        open={open}
        onOpenChange={handleOpenChange}
        {...props}
      >
        {children}
      </DrawerPrimitive.Root>
    </DrawerContext.Provider>
  )
}

function DrawerTrigger(
  props: React.ComponentProps<typeof DrawerPrimitive.Trigger>
) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerClose(
  props: React.ComponentProps<typeof DrawerPrimitive.Close>
) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerPortal(
  props: React.ComponentProps<typeof DrawerPrimitive.Portal>
) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

export interface DrawerContentProps extends React.ComponentProps<
  typeof DrawerPrimitive.Content
> {
  /** Edge from which the panel enters. @default "right" */
  side?: "top" | "right" | "bottom" | "left"
  /** Panel width or height preset. @default "default" */
  size?: "sm" | "default" | "lg" | "full"
  /** Hide the built-in close button. @default false */
  hideClose?: boolean
}

/** A focus-managed edge panel with spring-based enter and exit motion. */
function DrawerContent({
  className,
  children,
  side = "right",
  size = "default",
  hideClose = false,
  ...props
}: DrawerContentProps) {
  const { open } = useDrawerContext()
  const reduceMotion = useReducedMotion()
  const horizontal = side === "left" || side === "right"

  const hidden = reduceMotion
    ? { opacity: 0 }
    : {
        opacity: 0.72,
        x: side === "left" ? "-100%" : side === "right" ? "100%" : 0,
        y: side === "top" ? "-100%" : side === "bottom" ? "100%" : 0,
        scale: 0.985,
      }

  const placement = {
    top: "inset-x-0 top-0 border-b",
    right: "inset-y-0 right-0 border-l",
    bottom: "inset-x-0 bottom-0 border-t",
    left: "inset-y-0 left-0 border-r",
  }[side]

  const dimensions = horizontal
    ? {
        sm: "w-[min(20rem,calc(100vw-1rem))]",
        default: "w-[min(26rem,calc(100vw-1rem))]",
        lg: "w-[min(38rem,calc(100vw-1rem))]",
        full: "w-screen",
      }[size]
    : {
        sm: "h-[min(16rem,calc(100vh-1rem))]",
        default: "h-[min(24rem,calc(100vh-1rem))]",
        lg: "h-[min(36rem,calc(100vh-1rem))]",
        full: "h-screen",
      }[size]

  return (
    <AnimatePresence>
      {open ? (
        <DrawerPortal forceMount>
          <MotionOverlay
            forceMount
            data-slot="drawer-overlay"
            className="bg-overlay fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
          />
          <MotionContent
            forceMount
            data-slot="drawer-content"
            data-side={side}
            data-size={size}
            className={cn(
              "bg-background fixed z-50 flex flex-col shadow-xl outline-none",
              placement,
              dimensions,
              className
            )}
            initial={hidden}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={hidden}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 360, damping: 38, mass: 0.82 }
            }
            {...(props as unknown as React.ComponentProps<
              typeof MotionContent
            >)}
          >
            {children}
            {hideClose ? null : (
              <DrawerPrimitive.Close className="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring/40 absolute right-4 top-4 flex size-8 items-center justify-center rounded-md outline-none transition-colors focus-visible:ring-2">
                <XIcon className="size-4" />
                <span className="sr-only">Close</span>
              </DrawerPrimitive.Close>
            )}
          </MotionContent>
        </DrawerPortal>
      ) : null}
    </AnimatePresence>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("grid gap-1.5 border-b px-5 py-4 pr-14", className)}
      {...props}
    />
  )
}

function DrawerBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-body"
      className={cn("min-h-0 flex-1 overflow-y-auto px-5 py-4", className)}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(
        "mt-auto flex flex-col-reverse gap-2 border-t px-5 py-4 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-base font-semibold tracking-tight", className)}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-muted-foreground text-sm leading-5", className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
}
