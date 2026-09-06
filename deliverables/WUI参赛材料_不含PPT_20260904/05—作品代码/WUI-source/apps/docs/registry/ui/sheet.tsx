"use client"

import * as React from "react"
import { XIcon } from "lucide-react"
import { Dialog as SheetPrimitive } from "radix-ui"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

type SheetContextValue = {
  open: boolean
}

const SheetContext = React.createContext<SheetContextValue | null>(null)
const MotionOverlay = motion.create(SheetPrimitive.Overlay)
const MotionContent = motion.create(SheetPrimitive.Content)

function useSheetContext() {
  const context = React.useContext(SheetContext)
  if (!context) throw new Error("Sheet parts must be used inside <Sheet>.")
  return context
}

export interface SheetProps
  extends React.ComponentProps<typeof SheetPrimitive.Root> {
  /** Controlled visibility state. */
  open?: boolean
  /** Initial visibility in uncontrolled mode. @default false */
  defaultOpen?: boolean
  /** Called whenever the sheet requests a visibility change. */
  onOpenChange?: (open: boolean) => void
  /** Trap focus and disable interaction outside the panel. @default true */
  modal?: boolean
}

function Sheet({
  open: openProp,
  defaultOpen,
  onOpenChange,
  children,
  ...props
}: SheetProps) {
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
    <SheetContext.Provider value={{ open }}>
      <SheetPrimitive.Root
        data-slot="sheet"
        open={open}
        onOpenChange={handleOpenChange}
        {...props}
      >
        {children}
      </SheetPrimitive.Root>
    </SheetContext.Provider>
  )
}

function SheetTrigger(
  props: React.ComponentProps<typeof SheetPrimitive.Trigger>
) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose(
  props: React.ComponentProps<typeof SheetPrimitive.Close>
) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal(
  props: React.ComponentProps<typeof SheetPrimitive.Portal>
) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

const sheetContentVariants = cva(
  "fixed z-50 flex flex-col bg-background shadow-xl outline-none",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b",
        bottom: "inset-x-0 bottom-0 border-t",
        left: "inset-y-0 left-0 border-r",
        right: "inset-y-0 right-0 border-l",
      },
      size: {
        sm: "",
        default: "",
        lg: "",
        xl: "",
        full: "",
      },
    },
    defaultVariants: {
      side: "right",
      size: "default",
    },
  }
)

export interface SheetContentProps
  extends React.ComponentProps<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetContentVariants> {
  /** Edge from which the sheet enters. @default "right" */
  side?: "top" | "right" | "bottom" | "left"
  /** Sheet dimension preset. @default "default" */
  size?: "sm" | "default" | "lg" | "xl" | "full"
  /** Hide the built-in close button. @default false */
  hideClose?: boolean
}

/** A focus-managed slide-out sheet panel with spring-based motion. */
function SheetContent({
  className,
  children,
  side = "right",
  size = "default",
  hideClose = false,
  ...props
}: SheetContentProps) {
  const { open } = useSheetContext()
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

  const dimensions = horizontal
    ? {
        sm: "w-[min(20rem,calc(100vw-1rem))]",
        default: "w-[min(24rem,calc(100vw-1rem))]",
        lg: "w-[min(34rem,calc(100vw-1rem))]",
        xl: "w-[min(44rem,calc(100vw-1rem))]",
        full: "w-screen",
      }[size]
    : {
        sm: "h-[min(16rem,calc(100vh-1rem))]",
        default: "h-[min(24rem,calc(100vh-1rem))]",
        lg: "h-[min(36rem,calc(100vh-1rem))]",
        xl: "h-[min(48rem,calc(100vh-1rem))]",
        full: "h-screen",
      }[size]

  return (
    <AnimatePresence>
      {open ? (
        <SheetPortal forceMount>
          <MotionOverlay
            forceMount
            data-slot="sheet-overlay"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
          />
          <MotionContent
            forceMount
            data-slot="sheet-content"
            data-side={side}
            data-size={size}
            className={cn(
              sheetContentVariants({ side }),
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
              <SheetPrimitive.Close
                data-slot="sheet-close-btn"
                className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <XIcon className="size-4" />
                <span className="sr-only">关闭</span>
              </SheetPrimitive.Close>
            )}
          </MotionContent>
        </SheetPortal>
      ) : null}
    </AnimatePresence>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("grid gap-1.5 border-b px-5 py-4 pr-14", className)}
      {...props}
    />
  )
}

function SheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-body"
      className={cn("min-h-0 flex-1 overflow-y-auto px-5 py-4", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "mt-auto flex flex-col-reverse gap-2 border-t px-5 py-4 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-base font-semibold tracking-tight", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm leading-5 text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
}
