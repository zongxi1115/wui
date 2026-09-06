"use client"

import * as React from "react"
import { Slot } from "radix-ui"
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

const defaultTransition = {
  type: "spring",
  stiffness: 460,
  damping: 36,
  mass: 0.65,
} as const

type MorphingPopoverContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  layoutId: string
  transition: Transition
  variants?: Variants
  triggerRef: React.RefObject<HTMLElement | null>
  contentRef: React.RefObject<HTMLDivElement | null>
}

const MorphingPopoverContext =
  React.createContext<MorphingPopoverContextValue | null>(null)

function useMorphingPopover() {
  const context = React.useContext(MorphingPopoverContext)
  if (!context) {
    throw new Error(
      "MorphingPopover parts must be used inside <MorphingPopover>."
    )
  }
  return context
}

export interface MorphingPopoverProps extends React.ComponentProps<"div"> {
  /** Whether the popover is open in controlled mode. */
  open?: boolean
  /** Initial state in uncontrolled mode. @default false */
  defaultOpen?: boolean
  /** Called whenever the open state changes. */
  onOpenChange?: (open: boolean) => void
  /** Spring or tween used by the shared-layout morph. */
  transition?: Transition
  /** Motion variants for content entering and leaving the expanded surface. */
  variants?: Variants
}

function MorphingPopover({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  transition = defaultTransition,
  variants,
  className,
  children,
  ...props
}: MorphingPopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = openProp ?? uncontrolledOpen
  const layoutId = React.useId()
  const triggerRef = React.useRef<HTMLElement | null>(null)
  const contentRef = React.useRef<HTMLDivElement | null>(null)
  const wasOpen = React.useRef(open)

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (openProp === undefined) setUncontrolledOpen(nextOpen)
      onOpenChange?.(nextOpen)
    },
    [onOpenChange, openProp]
  )

  React.useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (
        !contentRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        setOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, setOpen])

  React.useEffect(() => {
    if (open) {
      contentRef.current
        ?.querySelector<HTMLElement>(
          "[autofocus], textarea, input, select, button, [href], [tabindex]:not([tabindex='-1'])"
        )
        ?.focus()
    } else if (wasOpen.current) {
      triggerRef.current?.focus()
    }
    wasOpen.current = open
  }, [open])

  return (
    <MorphingPopoverContext.Provider
      value={{
        open,
        setOpen,
        layoutId,
        transition,
        variants,
        triggerRef,
        contentRef,
      }}
    >
      <LayoutGroup id={layoutId}>
        <div
          data-slot="morphing-popover"
          className={cn("relative inline-flex", className)}
          {...props}
        >
          {children}
        </div>
      </LayoutGroup>
    </MorphingPopoverContext.Provider>
  )
}

export interface MorphingPopoverTriggerProps extends React.ComponentProps<"button"> {
  /** Merge trigger behavior onto the single child element. @default false */
  asChild?: boolean
}

function MorphingPopoverTrigger({
  className,
  children,
  asChild = false,
  onClick,
  ...props
}: MorphingPopoverTriggerProps) {
  const { open, setOpen, layoutId, transition, triggerRef } =
    useMorphingPopover()
  const reduceMotion = useReducedMotion()
  const Comp = asChild ? Slot.Root : "button"

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (!event.defaultPrevented) setOpen(true)
  }

  return (
    <span
      className="relative inline-flex"
      data-slot="morphing-popover-trigger-wrapper"
    >
      {!open ? (
        <motion.span
          aria-hidden
          layoutId={`${layoutId}-surface`}
          className="bg-background shadow-xs pointer-events-none absolute inset-0 rounded-md border"
          transition={reduceMotion ? { duration: 0 } : transition}
        />
      ) : null}
      <Comp
        ref={triggerRef as React.Ref<HTMLButtonElement>}
        type={asChild ? undefined : "button"}
        data-slot="morphing-popover-trigger"
        aria-expanded={open}
        aria-haspopup="dialog"
        className={cn(
          "focus-visible:ring-ring/50 relative z-10 inline-flex min-h-9 items-center justify-center rounded-md px-4 text-sm font-medium outline-none transition-opacity focus-visible:ring-[3px]",
          open && "pointer-events-none opacity-0",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Comp>
    </span>
  )
}

export interface MorphingPopoverContentProps extends React.ComponentProps<
  typeof motion.div
> {}

function MorphingPopoverContent({
  className,
  children,
  ...props
}: MorphingPopoverContentProps) {
  const { open, layoutId, transition, variants, contentRef } =
    useMorphingPopover()
  const reduceMotion = useReducedMotion()
  const contentVariants: Variants = variants ?? {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  }

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          data-slot="morphing-popover-positioner"
          className="absolute left-1/2 top-1/2 z-50 w-max -translate-x-1/2 -translate-y-1/2"
        >
          <motion.div
            ref={contentRef}
            data-slot="morphing-popover-content"
            role="dialog"
            layoutId={`${layoutId}-surface`}
            className={cn(
              "bg-popover text-popover-foreground relative w-72 overflow-hidden rounded-lg border p-4 shadow-md outline-none",
              className
            )}
            variants={reduceMotion ? undefined : contentVariants}
            initial={reduceMotion ? false : "initial"}
            animate="animate"
            exit="exit"
            transition={reduceMotion ? { duration: 0 } : transition}
            {...props}
          >
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export interface MorphingPopoverCloseProps extends React.ComponentProps<"button"> {
  /** Merge close behavior onto the single child element. @default false */
  asChild?: boolean
}

function MorphingPopoverClose({
  asChild = false,
  onClick,
  children,
  ...props
}: MorphingPopoverCloseProps) {
  const { setOpen } = useMorphingPopover()
  const Comp = asChild ? Slot.Root : "button"

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (!event.defaultPrevented) setOpen(false)
  }

  return (
    <Comp
      type={asChild ? undefined : "button"}
      data-slot="morphing-popover-close"
      onClick={handleClick}
      {...props}
    >
      {children}
    </Comp>
  )
}

export {
  MorphingPopover,
  MorphingPopoverClose,
  MorphingPopoverContent,
  MorphingPopoverTrigger,
}
