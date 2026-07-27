"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { XIcon } from "lucide-react"
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
  stiffness: 420,
  damping: 34,
  mass: 0.7,
} as const

type MorphingDialogContextValue = {
  open: boolean
  layoutId: string
  transition: Transition
}

const MorphingDialogContext =
  React.createContext<MorphingDialogContextValue | null>(null)

function useMorphingDialog() {
  const context = React.useContext(MorphingDialogContext)
  if (!context) {
    throw new Error(
      "MorphingDialog parts must be used inside <MorphingDialog>."
    )
  }
  return context
}

const MotionContent = motion.create(DialogPrimitive.Content)

export interface MorphingDialogProps extends React.ComponentProps<
  typeof DialogPrimitive.Root
> {
  /** Spring or tween used by the shared-layout morph. */
  transition?: Transition
}

function MorphingDialog({
  open: openProp,
  defaultOpen,
  onOpenChange,
  transition = defaultTransition,
  children,
  ...props
}: MorphingDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
    defaultOpen ?? false
  )
  const open = openProp ?? uncontrolledOpen
  const layoutId = React.useId()

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (openProp === undefined) setUncontrolledOpen(nextOpen)
      onOpenChange?.(nextOpen)
    },
    [onOpenChange, openProp]
  )

  return (
    <MorphingDialogContext.Provider value={{ open, layoutId, transition }}>
      <LayoutGroup id={layoutId}>
        <DialogPrimitive.Root
          open={open}
          onOpenChange={handleOpenChange}
          {...props}
        >
          {children}
        </DialogPrimitive.Root>
      </LayoutGroup>
    </MorphingDialogContext.Provider>
  )
}

function MorphingDialogTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  const { open, layoutId, transition } = useMorphingDialog()
  const reduceMotion = useReducedMotion()

  return (
    <span
      data-slot="morphing-dialog-trigger-wrapper"
      className="relative inline-flex"
    >
      {!open ? (
        <motion.span
          aria-hidden
          layoutId={`${layoutId}-surface`}
          className="bg-background shadow-xs pointer-events-none absolute inset-0 rounded-md border"
          transition={reduceMotion ? { duration: 0 } : transition}
        />
      ) : null}
      <DialogPrimitive.Trigger
        data-slot="morphing-dialog-trigger"
        className={cn(
          "focus-visible:ring-ring/50 relative z-10 inline-flex min-h-9 items-center justify-center rounded-md px-4 text-sm font-medium outline-none transition-opacity focus-visible:ring-[3px] [&[data-slot=button]]:border-transparent [&[data-slot=button]]:bg-transparent [&[data-slot=button]]:shadow-none",
          open && "pointer-events-none opacity-0",
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Trigger>
    </span>
  )
}

export interface MorphingDialogContentProps extends React.ComponentProps<
  typeof DialogPrimitive.Content
> {
  /** Classes applied to the viewport backdrop. */
  overlayClassName?: string
  /** Motion variants for the content inside the morphing surface. */
  variants?: Variants
}

function MorphingDialogContent({
  className,
  overlayClassName,
  variants,
  children,
  ...props
}: MorphingDialogContentProps) {
  const { open, layoutId, transition } = useMorphingDialog()
  const reduceMotion = useReducedMotion()
  const contentVariants: Variants = variants ?? {
    initial: { opacity: 0, y: 8, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: 4, filter: "blur(3px)" },
  }

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <DialogPrimitive.Portal forceMount>
          <DialogPrimitive.Overlay asChild forceMount>
            <motion.div
              data-slot="morphing-dialog-overlay"
              className={cn("fixed inset-0 z-50 bg-overlay/90", overlayClassName)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.18,
                ease: "easeOut",
              }}
            />
          </DialogPrimitive.Overlay>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
            <MotionContent
              forceMount
              data-slot="morphing-dialog-content"
              className={cn(
                "relative w-full max-w-lg overflow-hidden rounded-lg outline-none",
                className
              )}
              initial={false}
              {...(props as React.ComponentProps<typeof MotionContent>)}
            >
              <motion.div
                aria-hidden
                layoutId={`${layoutId}-surface`}
                className="bg-background pointer-events-none absolute inset-0 rounded-lg border shadow-lg"
                transition={reduceMotion ? { duration: 0 } : transition}
              />
              <motion.div
                data-slot="morphing-dialog-body"
                className="relative z-10 p-6"
                variants={reduceMotion ? undefined : contentVariants}
                initial={reduceMotion ? false : "initial"}
                animate="animate"
                exit="exit"
                transition={{
                  duration: reduceMotion ? 0 : 0.2,
                  delay: reduceMotion ? 0 : 0.08,
                }}
              >
                {children}
              </motion.div>
            </MotionContent>
          </div>
        </DialogPrimitive.Portal>
      ) : null}
    </AnimatePresence>
  )
}

function MorphingDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="morphing-dialog-title"
      className={cn("text-lg font-semibold leading-none", className)}
      {...props}
    />
  )
}

function MorphingDialogSubtitle({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="morphing-dialog-subtitle"
      className={cn("text-foreground/80 mt-1 text-sm font-medium", className)}
      {...props}
    />
  )
}

function MorphingDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="morphing-dialog-description"
      className={cn(
        "text-muted-foreground mt-3 text-sm leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

function MorphingDialogImage({
  className,
  ...props
}: React.ComponentProps<typeof motion.img>) {
  const { layoutId, transition } = useMorphingDialog()
  const reduceMotion = useReducedMotion()

  return (
    <motion.img
      data-slot="morphing-dialog-image"
      layoutId={`${layoutId}-image`}
      className={cn("block w-full object-cover", className)}
      transition={reduceMotion ? { duration: 0 } : transition}
      {...props}
    />
  )
}

function MorphingDialogClose({
  className,
  children,
  asChild,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  if (asChild) {
    return (
      <DialogPrimitive.Close
        asChild
        data-slot="morphing-dialog-close"
        className={className}
        {...props}
      >
        {children}
      </DialogPrimitive.Close>
    )
  }

  return (
    <DialogPrimitive.Close
      data-slot="morphing-dialog-close"
      className={cn(
        "text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring/50 absolute right-4 top-4 z-20 inline-flex size-8 items-center justify-center rounded-md outline-none transition-colors focus-visible:ring-[3px]",
        className
      )}
      {...props}
    >
      {children ?? <XIcon className="size-4" />}
      {!children ? <span className="sr-only">Close</span> : null}
    </DialogPrimitive.Close>
  )
}

export {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContent,
  MorphingDialogDescription,
  MorphingDialogImage,
  MorphingDialogSubtitle,
  MorphingDialogTitle,
  MorphingDialogTrigger,
}
