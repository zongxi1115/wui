"use client"

import * as React from "react"
import { XIcon } from "lucide-react"
import { Dialog as DrawerPrimitive } from "radix-ui"
import {
  AnimatePresence,
  motion,
  useDragControls,
  useReducedMotion,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

type DrawerContextValue = {
  open: boolean
  modal: boolean
  setOpen: (open: boolean) => void
}

const DrawerContext = React.createContext<DrawerContextValue | null>(null)
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
  modal = true,
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
    <DrawerContext.Provider value={{ open, modal, setOpen: handleOpenChange }}>
      <DrawerPrimitive.Root
        data-slot="drawer"
        open={open}
        onOpenChange={handleOpenChange}
        modal={modal}
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
  /**
   * Render a grab handle on the inner edge; dragging it towards the entry edge
   * dismisses the panel once it passes a quarter of its size or is flung. @default false
   */
  swipeToClose?: boolean
}

const PANEL_SPRING = {
  type: "spring",
  stiffness: 380,
  damping: 40,
  mass: 0.8,
} as const

/** A focus-managed edge panel with spring-based enter and exit motion. */
function DrawerContent({
  className,
  children,
  side = "right",
  size = "default",
  hideClose = false,
  swipeToClose = false,
  ref,
  ...props
}: DrawerContentProps) {
  const { open, modal, setOpen } = useDrawerContext()
  const panelRef = React.useRef<HTMLDivElement | null>(null)
  const setPanelRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      panelRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )
  const reduceMotion = useReducedMotion()
  const dragControls = useDragControls()
  const horizontal = side === "left" || side === "right"
  // +1 when the panel leaves towards the positive axis (right / bottom).
  const exitSign = side === "right" || side === "bottom" ? 1 : -1

  const hidden = reduceMotion
    ? { opacity: 0 }
    : {
        x: side === "left" ? "-100%" : side === "right" ? "100%" : 0,
        y: side === "top" ? "-100%" : side === "bottom" ? "100%" : 0,
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

  const handle = swipeToClose ? (
    <div
      data-slot="drawer-handle"
      aria-hidden="true"
      className={cn(
        "flex shrink-0 cursor-grab touch-none items-center justify-center active:cursor-grabbing",
        horizontal
          ? cn("absolute inset-y-0 z-10 w-4", side === "right" ? "left-0" : "right-0")
          : "h-6 w-full"
      )}
      onPointerDown={(event) => dragControls.start(event)}
    >
      <span
        className={cn(
          "bg-muted-foreground/30 rounded-full",
          horizontal ? "h-10 w-1" : "h-1 w-10"
        )}
      />
    </div>
  ) : null

  const panel = (
    <MotionContent
      ref={setPanelRef}
      forceMount
      data-slot="drawer-content"
      data-side={side}
      data-size={size}
      className={cn(
        "bg-background fixed z-50 flex flex-col shadow-lg outline-none",
        placement,
        dimensions,
        className
      )}
      initial={hidden}
      animate={reduceMotion ? { opacity: 1 } : { x: 0, y: 0 }}
      exit={{
        ...hidden,
        transition: reduceMotion
          ? { duration: 0.12 }
          : { duration: 0.24, ease: [0.4, 0, 1, 1] },
      }}
      transition={reduceMotion ? { duration: 0.12 } : PANEL_SPRING}
      drag={swipeToClose && !reduceMotion ? (horizontal ? "x" : "y") : false}
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={
        horizontal
          ? { left: exitSign < 0 ? 1 : 0.04, right: exitSign > 0 ? 1 : 0.04 }
          : { top: exitSign < 0 ? 1 : 0.04, bottom: exitSign > 0 ? 1 : 0.04 }
      }
      onDragEnd={(_, info) => {
        const panel = panelRef.current
        const extent = horizontal
          ? (panel?.offsetWidth ?? 0)
          : (panel?.offsetHeight ?? 0)
        const offset = (horizontal ? info.offset.x : info.offset.y) * exitSign
        const velocity = (horizontal ? info.velocity.x : info.velocity.y) * exitSign
        if (offset > extent * 0.25 || velocity > 600) setOpen(false)
      }}
      {...(props as unknown as React.ComponentProps<
        typeof MotionContent
      >)}
    >
      {side === "top" ? null : handle}
      {children}
      {side === "top" ? handle : null}
      {hideClose ? null : (
        <DrawerPrimitive.Close
          className={cn(
            "text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring/40 absolute right-4 top-4 flex size-8 items-center justify-center rounded-md outline-none transition-colors focus-visible:ring-2",
            swipeToClose && side === "bottom" && "top-8"
          )}
        >
          <XIcon className="size-4" />
          <span className="sr-only">关闭</span>
        </DrawerPrimitive.Close>
      )}
    </MotionContent>
  )

  return (
    <AnimatePresence>
      {open ? (
        <DrawerPortal forceMount>
          {/*
            The overlay owns the panel in the React tree so portalled controls
            inside the drawer (select, popover, date picker) stay scrollable
            under Radix's scroll lock. The dimmed backdrop is its own layer, so
            fading it never fades the panel.
          */}
          {modal ? (
            <DrawerPrimitive.Overlay
              forceMount
              data-slot="drawer-overlay"
              className="fixed inset-0 z-50"
            >
              <motion.div
                data-slot="drawer-backdrop"
                aria-hidden="true"
                className="bg-overlay absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
              />
              {panel}
            </DrawerPrimitive.Overlay>
          ) : (
            panel
          )}
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
