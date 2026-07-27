"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { XIcon } from "lucide-react"
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

// The button and the panel each own a text-less background surface that shares
// this spring. Motion morphs the `layoutId` between them — like the tabs
// indicator — so the outline glides from button to panel and back.
const SURFACE_SPRING = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.7,
} as const

// Shared between the parts so the panel can (a) drive its own enter/exit with
// AnimatePresence and (b) emerge from — and return to — the trigger's position.
type DialogContextValue = {
  open: boolean
  triggerRef: React.RefObject<HTMLElement | null>
  variant: "modal" | "inline"
  layoutId: string
}

const DialogContext = React.createContext<DialogContextValue | null>(null)

function useDialogContext() {
  const ctx = React.useContext(DialogContext)
  if (!ctx) throw new Error("Dialog parts must be used inside <Dialog>.")
  return ctx
}

const MotionOverlay = motion.create(DialogPrimitive.Overlay)
const MotionContent = motion.create(DialogPrimitive.Content)

export interface DialogProps
  extends React.ComponentProps<typeof DialogPrimitive.Root> {
  /** Render as a centred modal or morph in place inside the document flow. @default "modal" */
  variant?: "modal" | "inline"
}

function Dialog({
  open: openProp,
  defaultOpen,
  onOpenChange,
  modal,
  variant = "modal",
  children,
  ...props
}: DialogProps) {
  // Mirror the open state (without taking ownership away from a controlled
  // caller) so the content can run motion enter/exit via AnimatePresence.
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
    defaultOpen ?? false
  )
  const open = openProp ?? uncontrolledOpen
  const triggerRef = React.useRef<HTMLElement | null>(null)
  const layoutId = React.useId()

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [openProp, onOpenChange]
  )

  const root = (
    <DialogPrimitive.Root
      data-slot="dialog"
      open={open}
      modal={variant === "inline" ? false : modal}
      onOpenChange={handleOpenChange}
      {...props}
    >
      {children}
    </DialogPrimitive.Root>
  )

  return (
    <DialogContext.Provider value={{ open, triggerRef, variant, layoutId }}>
      <LayoutGroup id={layoutId}>{root}</LayoutGroup>
    </DialogContext.Provider>
  )
}

function DialogTrigger(
  props: React.ComponentProps<typeof DialogPrimitive.Trigger>
) {
  const { open, triggerRef, variant, layoutId } = useDialogContext()
  const reduceMotion = useReducedMotion()

  if (variant === "inline") {
    // While the panel is open the button is gone; its surface has already
    // handed its `layoutId` off to the panel. Conditional render (no
    // AnimatePresence/popLayout) keeps the hand-off in a single commit so the
    // shared-layout morph fires — the same pattern as the tabs indicator.
    if (open) return null
    return (
      <div className="relative inline-block [&_[data-slot=button]]:border-transparent [&_[data-slot=button]]:bg-transparent [&_[data-slot=button]]:shadow-none">
        <motion.div
          aria-hidden
          data-slot="dialog-layout-surface"
          layoutId={`${layoutId}-surface`}
          className="pointer-events-none absolute inset-0 rounded-md border bg-background shadow-xs"
          transition={reduceMotion ? { duration: 0 } : SURFACE_SPRING}
        />
        <motion.div
          className="relative z-10"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.14, delay: 0.05, ease: "easeOut" }
          }
        >
          <DialogPrimitive.Trigger
            ref={triggerRef as React.Ref<HTMLButtonElement>}
            data-slot="dialog-trigger"
            {...props}
          />
        </motion.div>
      </div>
    )
  }

  return (
    <DialogPrimitive.Trigger
      ref={triggerRef as React.Ref<HTMLButtonElement>}
      data-slot="dialog-trigger"
      {...props}
    />
  )
}

function DialogPortal(
  props: React.ComponentProps<typeof DialogPrimitive.Portal>
) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn("fixed inset-0 z-50 bg-overlay", className)}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  const { open, triggerRef, variant, layoutId } = useDialogContext()
  const reduceMotion = useReducedMotion()

  if (variant === "inline") {
    // Mirror of DialogTrigger: render only while open, so the panel's surface
    // adopts the `layoutId` in the same commit the button's surface releases it
    // and Motion morphs the outline between the two boxes. `forceMount` stops
    // Radix from re-animating the mount/unmount on top of the layout morph.
    if (!open) return null
    return (
      <MotionContent
        forceMount
        data-slot="dialog-content"
        className={cn(
          "relative w-[min(32rem,calc(100vw-2rem))] overflow-hidden rounded-lg outline-none",
          className
        )}
        initial={false}
        {...(props as unknown as React.ComponentProps<typeof MotionContent>)}
      >
        <motion.div
          aria-hidden
          data-slot="dialog-layout-surface"
          layoutId={`${layoutId}-surface`}
          className="pointer-events-none absolute inset-0 rounded-lg border bg-background shadow-sm"
          transition={reduceMotion ? { duration: 0 } : SURFACE_SPRING}
        />
        <motion.div
          data-slot="dialog-layout-content"
          className="relative z-10 grid gap-4 p-6"
          initial={reduceMotion ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.18, delay: 0.05, ease: "easeOut" }
          }
        >
          {children}
          <DialogContentClose />
        </motion.div>
      </MotionContent>
    )
  }

  // The panel rests at the viewport centre (flex container below). Express the
  // trigger's centre as an offset from there, so the panel can grow out of the
  // button on open and shrink back into it on close.
  const origin = React.useMemo(() => {
    if (!open || reduceMotion) return { x: 0, y: 0 }
    const el = triggerRef.current
    if (!el || typeof window === "undefined") return { x: 0, y: 0 }
    const rect = el.getBoundingClientRect()
    return {
      x: rect.left + rect.width / 2 - window.innerWidth / 2,
      y: rect.top + rect.height / 2 - window.innerHeight / 2,
    }
    // Recompute each time the panel opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reduceMotion])

  const hidden = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.78, x: origin.x, y: origin.y }
  const shown = reduceMotion
    ? { opacity: 1 }
    : { opacity: 1, scale: 1, x: 0, y: 0 }

  return (
    <AnimatePresence>
      {open ? (
        <DialogPortal key="dialog" forceMount>
          <MotionOverlay
            data-slot="dialog-overlay"
            forceMount
            className="fixed inset-0 z-50 bg-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
          />
          {/*
            Centre with a flex container (not a translate on the panel) so the
            motion transform is free to drive the button→dialog morph. The panel
            is `relative` so the close button anchors to it.
          */}
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
            <MotionContent
              data-slot="dialog-content"
              forceMount
              className={cn(
                "relative grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-lg border bg-background p-6 shadow-lg sm:max-w-lg",
                className
              )}
              initial={hidden}
              animate={shown}
              exit={hidden}
              transition={
                reduceMotion
                  ? { duration: 0.15 }
                  : { type: "spring", stiffness: 440, damping: 34, mass: 0.65 }
              }
              {...(props as unknown as React.ComponentProps<typeof MotionContent>)}
            >
              {children}
              <DialogContentClose />
            </MotionContent>
          </div>
        </DialogPortal>
      ) : null}
    </AnimatePresence>
  )
}

function DialogContentClose() {
  return (
    <DialogPrimitive.Close className="absolute right-4 top-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
      <XIcon />
      <span className="sr-only">Close</span>
    </DialogPrimitive.Close>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg font-semibold leading-none", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
