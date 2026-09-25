"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { XIcon } from "lucide-react"
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValue,
  useReducedMotion,
  type Transition,
  type Variants,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

const defaultTransition = {
  type: "spring",
  bounce: 0.12,
  visualDuration: 0.42,
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

/**
 * The shared-layout surface that morphs between the trigger and the dialog.
 * It copies the corner radius of the element it sits on (as a motion value,
 * before the first paint) so Motion can animate and scale-correct the radius
 * instead of stretching it mid-morph.
 */
function MorphingSurface({
  layoutId,
  transition,
  source,
  className,
}: {
  layoutId: string
  transition: Transition
  source: "parent" | "next-sibling"
  className?: string
}) {
  // Start close to the default radii so the server-rendered surface already
  // looks right before the measurement runs.
  const borderRadius = useMotionValue(source === "parent" ? 10 : 8)
  const measure = React.useCallback(
    (node: HTMLSpanElement | null) => {
      const element =
        source === "parent" ? node?.parentElement : node?.nextElementSibling
      if (!element) return
      const rect = element.getBoundingClientRect()
      const radius =
        Number.parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0
      borderRadius.set(Math.min(radius, rect.width / 2, rect.height / 2))
    },
    [borderRadius, source]
  )

  return (
    <motion.span
      ref={measure}
      aria-hidden
      layoutId={layoutId}
      className={cn(
        "bg-background pointer-events-none absolute inset-0 block border",
        className
      )}
      style={{ borderRadius }}
      transition={transition}
    />
  )
}

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
        <MorphingSurface
          layoutId={`${layoutId}-surface`}
          source="next-sibling"
          className="shadow-xs"
          transition={reduceMotion ? { duration: 0 } : transition}
        />
      ) : null}
      <DialogPrimitive.Trigger
        data-slot="morphing-dialog-trigger"
        className={cn(
          "focus-visible:ring-ring/50 relative z-10 inline-flex min-h-9 items-center justify-center rounded-md px-4 text-sm font-medium outline-none transition-opacity focus-visible:ring-[3px] [&[data-variant]]:border-transparent [&[data-variant]]:bg-transparent [&[data-variant]]:shadow-none",
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
  /**
   * Content rendered above the body without the fade-in, typically a
   * `MorphingDialogImage`, so shared media stays fully visible while it morphs.
   */
  media?: React.ReactNode
}

function MorphingDialogContent({
  className,
  overlayClassName,
  variants,
  media,
  children,
  ...props
}: MorphingDialogContentProps) {
  const { open, layoutId, transition } = useMorphingDialog()
  const reduceMotion = useReducedMotion()
  const contentVariants: Variants = variants ?? {
    initial: { opacity: 0, y: 10, scale: 0.98, filter: "blur(6px)" },
    animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    exit: {
      opacity: 0,
      y: 6,
      filter: "blur(4px)",
      transition: { duration: 0.12, delay: 0 },
    },
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
              <MorphingSurface
                layoutId={`${layoutId}-surface`}
                source="parent"
                className="shadow-lg"
                transition={reduceMotion ? { duration: 0 } : transition}
              />
              {media ? (
                <div
                  data-slot="morphing-dialog-media"
                  className="relative z-10 overflow-hidden rounded-t-[inherit]"
                >
                  {media}
                </div>
              ) : null}
              <motion.div
                data-slot="morphing-dialog-body"
                className="relative z-10 p-6"
                variants={reduceMotion ? undefined : contentVariants}
                initial={reduceMotion ? false : "initial"}
                animate="animate"
                exit="exit"
                transition={{
                  duration: reduceMotion ? 0 : 0.28,
                  delay: reduceMotion ? 0 : 0.1,
                  ease: [0.22, 1, 0.36, 1],
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
      {!children ? <span className="sr-only">关闭</span> : null}
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
