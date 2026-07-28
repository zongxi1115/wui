"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import {
  DownloadIcon,
  MinusIcon,
  PlusIcon,
  RotateCcwIcon,
  RotateCwIcon,
  XIcon,
} from "lucide-react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

export interface ImagePreviewProps
  extends Omit<React.ComponentProps<"button">, "children"> {
  /** Image URL used by both the thumbnail and full-size preview. */
  src: string
  /** Accessible description of the image. */
  alt: string
  /** Optional higher-resolution URL used only in the preview. */
  previewSrc?: string
  /** Caption shown below the expanded image. */
  caption?: React.ReactNode
  /** Controlled open state. */
  open?: boolean
  /** Initial open state when uncontrolled. @default false */
  defaultOpen?: boolean
  /** Called whenever the preview opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Smallest available zoom level. @default 0.5 */
  minZoom?: number
  /** Largest available zoom level. @default 3 */
  maxZoom?: number
  /** Amount added or removed by each zoom action. @default 0.25 */
  zoomStep?: number
  /** Show zoom, rotate, reset, and optional download actions. @default true */
  showToolbar?: boolean
  /** Download filename. Supplying it adds a download action. */
  downloadName?: string
  /** Classes applied to the thumbnail image. */
  thumbnailClassName?: string
  /** Classes applied to the expanded image. */
  previewClassName?: string
}

/** An image thumbnail that opens into a focused, transformable lightbox. */
function ImagePreview({
  src,
  alt,
  previewSrc,
  caption,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  minZoom = 0.5,
  maxZoom = 3,
  zoomStep = 0.25,
  showToolbar = true,
  downloadName,
  className,
  thumbnailClassName,
  previewClassName,
  ...props
}: ImagePreviewProps) {
  const reduceMotion = useReducedMotion()
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const [zoom, setZoom] = React.useState(1)
  const [rotation, setRotation] = React.useState(0)
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const imageX = useMotionValue(0)
  const imageY = useMotionValue(0)
  const open = openProp ?? internalOpen
  const fullSizeSrc = previewSrc ?? src

  function handleOpenChange(next: boolean) {
    if (openProp === undefined) setInternalOpen(next)
    if (!next) {
      setZoom(1)
      setRotation(0)
      imageX.set(0)
      imageY.set(0)
    }
    onOpenChange?.(next)
  }

  function changeZoom(amount: number) {
    setZoom((current) => {
      const next = Math.min(maxZoom, Math.max(minZoom, current + amount))
      if (next <= 1) {
        imageX.set(0)
        imageY.set(0)
      }
      return next
    })
  }

  function resetTransform() {
    setZoom(1)
    setRotation(0)
    imageX.set(0)
    imageY.set(0)
  }

  function handleDownload() {
    const anchor = document.createElement("a")
    anchor.href = fullSizeSrc
    anchor.download = downloadName ?? ""
    anchor.click()
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "+" || event.key === "=") changeZoom(zoomStep)
    if (event.key === "-") changeZoom(-zoomStep)
    if (event.key === "0") resetTransform()
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          data-slot="image-preview-trigger"
          aria-label={`Preview ${alt}`}
          className={cn(
            "group relative block overflow-hidden rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
            className
          )}
          {...props}
        >
          <img
            data-slot="image-preview-thumbnail"
            src={src}
            alt={alt}
            className={cn(
              "block size-full object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none",
              thumbnailClassName
            )}
          />
        </button>
      </DialogPrimitive.Trigger>

      <AnimatePresence>
        {open ? (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                data-slot="image-preview-overlay"
                className="fixed inset-0 z-50 bg-overlay/90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.18 }}
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content
              forceMount
              data-slot="image-preview-content"
              className="fixed inset-0 z-50 flex flex-col overflow-hidden outline-none"
              onKeyDown={handleKeyDown}
            >
              <DialogPrimitive.Title className="sr-only">
                Image preview: {alt}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="sr-only">
                {caption ?? "Expanded image preview with transform controls."}
              </DialogPrimitive.Description>

              <div className="relative z-10 flex h-14 shrink-0 items-center justify-end gap-1 px-3">
                {showToolbar ? (
                  <div
                    data-slot="image-preview-toolbar"
                    className="flex items-center gap-1 rounded-md border bg-background p-1 shadow-sm"
                  >
                    <PreviewAction
                      label="Zoom out"
                      disabled={zoom <= minZoom}
                      onClick={() => changeZoom(-zoomStep)}
                    >
                      <MinusIcon />
                    </PreviewAction>
                    <span className="min-w-12 px-1 text-center text-xs tabular-nums text-muted-foreground">
                      {Math.round(zoom * 100)}%
                    </span>
                    <PreviewAction
                      label="Zoom in"
                      disabled={zoom >= maxZoom}
                      onClick={() => changeZoom(zoomStep)}
                    >
                      <PlusIcon />
                    </PreviewAction>
                    <span className="mx-1 h-5 w-px bg-border" />
                    <PreviewAction
                      label="Rotate counterclockwise"
                      onClick={() => setRotation((current) => current - 90)}
                    >
                      <RotateCcwIcon />
                    </PreviewAction>
                    <PreviewAction
                      label="Rotate clockwise"
                      onClick={() => setRotation((current) => current + 90)}
                    >
                      <RotateCwIcon />
                    </PreviewAction>
                    <PreviewAction label="Reset image" onClick={resetTransform}>
                      <span className="text-[11px] font-semibold">1:1</span>
                    </PreviewAction>
                    {downloadName ? (
                      <PreviewAction label="Download image" onClick={handleDownload}>
                        <DownloadIcon />
                      </PreviewAction>
                    ) : null}
                  </div>
                ) : null}

                <DialogPrimitive.Close asChild>
                  <PreviewAction label="Close preview">
                    <XIcon />
                  </PreviewAction>
                </DialogPrimitive.Close>
              </div>

              <div
                ref={viewportRef}
                className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-6 pt-2"
                onPointerDown={(event) => {
                  if (event.target === event.currentTarget) handleOpenChange(false)
                }}
              >
                <motion.img
                  data-slot="image-preview-image"
                  src={fullSizeSrc}
                  alt={alt}
                  className={cn(
                    "max-h-full max-w-full select-none object-contain shadow-lg",
                    zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default",
                    previewClassName
                  )}
                  style={{ x: imageX, y: imageY }}
                  drag={zoom > 1}
                  dragConstraints={viewportRef}
                  dragElastic={0.08}
                  dragMomentum={false}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: zoom, rotate: rotation }}
                  exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 360, damping: 32, mass: 0.7 }
                  }
                />
              </div>

              {caption ? (
                <div
                  data-slot="image-preview-caption"
                  className="relative z-10 shrink-0 px-6 pb-5 text-center text-sm text-background"
                >
                  {caption}
                </div>
              ) : null}
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        ) : null}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}

function PreviewAction({
  label,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & { label: string }) {
  return (
    <button
      type="button"
      data-slot="image-preview-action"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-sm bg-background text-foreground outline-none transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/35 disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export { ImagePreview }
