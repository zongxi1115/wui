"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  MinusIcon,
  PlusIcon,
  RotateCcwIcon,
  RotateCwIcon,
  XIcon,
} from "lucide-react"
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  type PanInfo,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

const EASE = [0.22, 1, 0.36, 1] as const
const SPRING = { type: "spring", stiffness: 520, damping: 38, mass: 0.7 } as const

type PreviewItem = {
  id: string
  src: string
  alt: string
  caption?: React.ReactNode
  downloadName?: string
}

type LightboxOptions = {
  minZoom: number
  maxZoom: number
  zoomStep: number
  showToolbar: boolean
  previewClassName?: string
}

type ImagePreviewGroupContextValue = {
  register: (item: PreviewItem) => () => void
  openItem: (id: string) => void
}

const ImagePreviewGroupContext =
  React.createContext<ImagePreviewGroupContextValue | null>(null)

export interface ImagePreviewProps extends Omit<
  React.ComponentProps<"button">,
  "children"
> {
  /** Image URL used by both the thumbnail and full-size preview. */
  src: string
  /** Accessible description of the image. */
  alt: string
  /** Optional higher-resolution URL used only in the preview. */
  previewSrc?: string
  /** Caption shown below the expanded image. */
  caption?: React.ReactNode
  /** Controlled open state. Ignored inside ImagePreviewGroup. */
  open?: boolean
  /** Initial open state when uncontrolled. Ignored inside ImagePreviewGroup. @default false */
  defaultOpen?: boolean
  /** Called whenever the preview opens or closes. Ignored inside ImagePreviewGroup. */
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
  onClick,
  ...props
}: ImagePreviewProps) {
  const group = React.useContext(ImagePreviewGroupContext)
  const id = React.useId()
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const open = openProp ?? internalOpen
  const fullSizeSrc = previewSrc ?? src

  React.useLayoutEffect(() => {
    if (!group) return
    return group.register({
      id,
      src: fullSizeSrc,
      alt,
      caption,
      downloadName,
    })
  }, [alt, caption, downloadName, fullSizeSrc, group, id])

  const trigger = (
    <button
      type="button"
      data-slot="image-preview-trigger"
      data-preview-id={id}
      aria-haspopup={group ? "dialog" : undefined}
      aria-label={`预览图片：${alt}`}
      className={cn(
        "group/preview relative block overflow-hidden rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
        className
      )}
      onClick={(event) => {
        onClick?.(event)
        if (group && !event.defaultPrevented) group.openItem(id)
      }}
      {...props}
    >
      <img
        data-slot="image-preview-thumbnail"
        src={src}
        alt={alt}
        className={cn(
          "block size-full object-cover transition-transform duration-300 ease-out group-hover/preview:scale-[1.03] motion-reduce:transition-none",
          thumbnailClassName
        )}
      />
    </button>
  )

  if (group) return trigger

  function handleOpenChange(next: boolean) {
    if (openProp === undefined) setInternalOpen(next)
    onOpenChange?.(next)
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <ImagePreviewLightbox
        open={open}
        onOpenChange={handleOpenChange}
        items={[{ id, src: fullSizeSrc, alt, caption, downloadName }]}
        index={0}
        onIndexChange={() => {}}
        minZoom={minZoom}
        maxZoom={maxZoom}
        zoomStep={zoomStep}
        showToolbar={showToolbar}
        previewClassName={previewClassName}
      />
    </DialogPrimitive.Root>
  )
}

export interface ImagePreviewGroupProps extends React.ComponentProps<"div"> {
  /** Controlled open state of the shared lightbox. */
  open?: boolean
  /** Initial open state when uncontrolled. @default false */
  defaultOpen?: boolean
  /** Called whenever the shared lightbox opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Controlled index of the image shown in the lightbox. */
  index?: number
  /** Initial index when uncontrolled. @default 0 */
  defaultIndex?: number
  /** Called when the lightbox switches to another image. */
  onIndexChange?: (index: number) => void
  /** Smallest available zoom level. @default 0.5 */
  minZoom?: number
  /** Largest available zoom level. @default 3 */
  maxZoom?: number
  /** Amount added or removed by each zoom action. @default 0.25 */
  zoomStep?: number
  /** Show zoom, rotate, reset, and optional download actions. @default true */
  showToolbar?: boolean
  /** Classes applied to the expanded image. */
  previewClassName?: string
}

/**
 * Groups several ImagePreview thumbnails into one lightbox with previous /
 * next navigation, a thumbnail strip, arrow keys, and swipe gestures.
 * Images are ordered by their position in the DOM.
 */
function ImagePreviewGroup({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  minZoom = 0.5,
  maxZoom = 3,
  zoomStep = 0.25,
  showToolbar = true,
  previewClassName,
  children,
  ...props
}: ImagePreviewGroupProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const registry = React.useRef(new Map<string, PreviewItem>())
  const [items, setItems] = React.useState<PreviewItem[]>([])
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const [internalIndex, setInternalIndex] = React.useState(defaultIndex)
  const open = openProp ?? internalOpen
  const index = indexProp ?? internalIndex

  const collectItems = React.useCallback(() => {
    const triggers = rootRef.current?.querySelectorAll<HTMLElement>(
      "[data-slot=image-preview-trigger][data-preview-id]"
    )
    const ordered = Array.from(triggers ?? [])
      .map((trigger) => registry.current.get(trigger.dataset.previewId ?? ""))
      .filter((item): item is PreviewItem => Boolean(item))
    setItems(ordered)
    return ordered
  }, [])

  const register = React.useCallback(
    (item: PreviewItem) => {
      registry.current.set(item.id, item)
      collectItems()
      return () => {
        registry.current.delete(item.id)
        collectItems()
      }
    },
    [collectItems]
  )

  const setIndex = React.useCallback(
    (next: number) => {
      if (indexProp === undefined) setInternalIndex(next)
      onIndexChange?.(next)
    },
    [indexProp, onIndexChange]
  )

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [onOpenChange, openProp]
  )

  const openItem = React.useCallback(
    (id: string) => {
      const ordered = collectItems()
      setIndex(Math.max(0, ordered.findIndex((item) => item.id === id)))
      setOpen(true)
    },
    [collectItems, setIndex, setOpen]
  )

  const context = React.useMemo(
    () => ({ register, openItem }),
    [openItem, register]
  )

  return (
    <ImagePreviewGroupContext.Provider value={context}>
      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <div ref={rootRef} data-slot="image-preview-group" {...props}>
          {children}
        </div>
        <ImagePreviewLightbox
          open={open}
          onOpenChange={setOpen}
          items={items}
          index={Math.min(index, Math.max(items.length - 1, 0))}
          onIndexChange={setIndex}
          minZoom={minZoom}
          maxZoom={maxZoom}
          zoomStep={zoomStep}
          showToolbar={showToolbar}
          previewClassName={previewClassName}
          onCloseAutoFocus={(event) => {
            // There is no single Dialog.Trigger in a group, so return focus to
            // the thumbnail of the image that was viewed last.
            event.preventDefault()
            rootRef.current
              ?.querySelector<HTMLElement>(
                `[data-preview-id="${items[index]?.id}"]`
              )
              ?.focus()
          }}
        />
      </DialogPrimitive.Root>
    </ImagePreviewGroupContext.Provider>
  )
}

type ImagePreviewLightboxProps = LightboxOptions & {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: PreviewItem[]
  index: number
  onIndexChange: (index: number) => void
  onCloseAutoFocus?: (event: Event) => void
}

function ImagePreviewLightbox({
  open,
  onOpenChange,
  items,
  index,
  onIndexChange,
  minZoom,
  maxZoom,
  zoomStep,
  showToolbar,
  previewClassName,
  onCloseAutoFocus,
}: ImagePreviewLightboxProps) {
  const reduceMotion = useReducedMotion()
  const layoutId = React.useId()
  const [zoom, setZoom] = React.useState(1)
  const [rotation, setRotation] = React.useState(0)
  const [direction, setDirection] = React.useState(0)
  // Radix portals mount one tick after `open` flips, so the viewport is kept
  // in state to re-run effects once the element actually exists.
  const [viewport, setViewport] = React.useState<HTMLDivElement | null>(null)
  const stripRef = React.useRef<HTMLDivElement>(null)
  const item = items[index]
  const multiple = items.length > 1
  const fade = reduceMotion ? { duration: 0 } : { duration: 0.22, ease: EASE }

  const resetTransform = React.useCallback(() => {
    setZoom(1)
    setRotation(0)
  }, [])

  React.useEffect(() => {
    if (!open) resetTransform()
  }, [open, resetTransform])

  const changeZoom = React.useCallback(
    (update: (current: number) => number) => {
      setZoom((current) =>
        Math.min(maxZoom, Math.max(minZoom, update(current)))
      )
    },
    [maxZoom, minZoom]
  )

  // React registers wheel listeners as passive, so preventDefault() would be
  // ignored there. A native non-passive listener keeps the page from scrolling
  // while the wheel / trackpad pinch zooms the image.
  React.useEffect(() => {
    if (!viewport) return
    function handleWheel(event: WheelEvent) {
      event.preventDefault()
      if (event.deltaY === 0) return
      const factor = Math.exp(-event.deltaY * (event.ctrlKey ? 0.01 : 0.0015))
      changeZoom((current) => current * factor)
    }
    viewport.addEventListener("wheel", handleWheel, { passive: false })
    return () => viewport.removeEventListener("wheel", handleWheel)
  }, [changeZoom, viewport])

  React.useEffect(() => {
    if (!viewport) return
    stripRef.current
      ?.querySelector<HTMLElement>("[data-active]")
      ?.scrollIntoView({
        block: "nearest",
        inline: "center",
        behavior: reduceMotion ? "auto" : "smooth",
      })
  }, [index, reduceMotion, viewport])

  function goTo(next: number) {
    if (!multiple) return
    const wrapped = (next + items.length) % items.length
    if (wrapped === index) return
    setDirection(next > index ? 1 : -1)
    resetTransform()
    onIndexChange(wrapped)
  }

  function handleDownload() {
    const anchor = document.createElement("a")
    anchor.href = item.src
    anchor.download = item.downloadName ?? ""
    anchor.click()
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "+" || event.key === "=") changeZoom((z) => z + zoomStep)
    if (event.key === "-") changeZoom((z) => z - zoomStep)
    if (event.key === "0") resetTransform()
    if (event.key === "ArrowLeft") goTo(index - 1)
    if (event.key === "ArrowRight") goTo(index + 1)
  }

  return (
    <AnimatePresence>
      {open && item ? (
        <DialogPrimitive.Portal forceMount>
          <DialogPrimitive.Overlay asChild forceMount>
            <motion.div
              data-slot="image-preview-overlay"
              className="fixed inset-0 z-50 bg-black/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fade}
            />
          </DialogPrimitive.Overlay>

          <DialogPrimitive.Content
            forceMount
            data-slot="image-preview-content"
            className="fixed inset-0 z-50 flex flex-col overflow-hidden text-white outline-none"
            onKeyDown={handleKeyDown}
            onCloseAutoFocus={onCloseAutoFocus}
          >
            <DialogPrimitive.Title className="sr-only">
              图片预览：{item.alt}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              {multiple
                ? `第 ${index + 1} 张，共 ${items.length} 张。使用左右方向键切换图片。`
                : "可缩放、旋转和拖动的大图预览。"}
            </DialogPrimitive.Description>

            <motion.div
              className="relative z-10 flex h-14 shrink-0 items-center justify-between gap-3 px-3"
              initial={reduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={fade}
            >
              <span
                aria-hidden="true"
                className="px-2 text-sm tabular-nums text-white/70"
              >
                {multiple ? `${index + 1} / ${items.length}` : null}
              </span>
              <DialogPrimitive.Close asChild>
                <PreviewAction label="关闭预览">
                  <XIcon />
                </PreviewAction>
              </DialogPrimitive.Close>
            </motion.div>

            <div
              ref={setViewport}
              data-slot="image-preview-viewport"
              className="relative min-h-0 flex-1 overflow-hidden"
              onPointerDown={(event) => {
                if (event.target === event.currentTarget) onOpenChange(false)
              }}
            >
              <motion.div
                className="pointer-events-none absolute inset-0"
                initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
                transition={reduceMotion ? { duration: 0 } : SPRING}
              >
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={item.id}
                    custom={direction}
                    className="absolute inset-0 flex items-center justify-center px-6 py-2 sm:px-16"
                    variants={{
                      enter: (dir: number) => ({ opacity: 0, x: dir * 64 }),
                      center: { opacity: 1, x: 0 },
                      exit: (dir: number) => ({ opacity: 0, x: dir * -64 }),
                    }}
                    initial={reduceMotion ? false : "enter"}
                    animate="center"
                    exit={reduceMotion ? undefined : "exit"}
                    transition={
                      reduceMotion ? { duration: 0 } : { duration: 0.3, ease: EASE }
                    }
                  >
                    <PreviewImage
                      item={item}
                      zoom={zoom}
                      rotation={rotation}
                      swipeable={multiple}
                      className={previewClassName}
                      onSwipe={(step) => goTo(index + step)}
                      onDoubleClick={() =>
                        zoom > 1 ? resetTransform() : changeZoom(() => 2)
                      }
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {multiple ? (
                <>
                  <PreviewAction
                    label="上一张"
                    className="absolute left-3 top-1/2 size-10 -translate-y-1/2 rounded-full bg-neutral-900/80 hover:bg-neutral-800"
                    onClick={() => goTo(index - 1)}
                  >
                    <ChevronLeftIcon />
                  </PreviewAction>
                  <PreviewAction
                    label="下一张"
                    className="absolute right-3 top-1/2 size-10 -translate-y-1/2 rounded-full bg-neutral-900/80 hover:bg-neutral-800"
                    onClick={() => goTo(index + 1)}
                  >
                    <ChevronRightIcon />
                  </PreviewAction>
                </>
              ) : null}
            </div>

            <motion.div
              className="relative z-10 flex shrink-0 flex-col items-center gap-3 px-4 pb-4 pt-3"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={fade}
            >
              {item.caption ? (
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={item.id}
                    data-slot="image-preview-caption"
                    className="max-w-2xl text-center text-sm text-white/80"
                    initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: reduceMotion ? 0 : 0.15 }}
                  >
                    {item.caption}
                  </motion.p>
                </AnimatePresence>
              ) : null}

              {showToolbar ? (
                <div
                  data-slot="image-preview-toolbar"
                  className="flex items-center gap-0.5 rounded-md border border-white/10 bg-neutral-900 p-1"
                >
                  <PreviewAction
                    label="缩小"
                    disabled={zoom <= minZoom}
                    onClick={() => changeZoom((z) => z - zoomStep)}
                  >
                    <MinusIcon />
                  </PreviewAction>
                  <span className="min-w-12 px-1 text-center text-xs tabular-nums text-white/70">
                    {Math.round(zoom * 100)}%
                  </span>
                  <PreviewAction
                    label="放大"
                    disabled={zoom >= maxZoom}
                    onClick={() => changeZoom((z) => z + zoomStep)}
                  >
                    <PlusIcon />
                  </PreviewAction>
                  <span className="mx-1 h-5 w-px bg-white/15" />
                  <PreviewAction
                    label="逆时针旋转"
                    onClick={() => setRotation((current) => current - 90)}
                  >
                    <RotateCcwIcon />
                  </PreviewAction>
                  <PreviewAction
                    label="顺时针旋转"
                    onClick={() => setRotation((current) => current + 90)}
                  >
                    <RotateCwIcon />
                  </PreviewAction>
                  <PreviewAction label="重置" onClick={resetTransform}>
                    <span className="text-[11px] font-semibold">1:1</span>
                  </PreviewAction>
                  {item.downloadName ? (
                    <PreviewAction label="下载原图" onClick={handleDownload}>
                      <DownloadIcon />
                    </PreviewAction>
                  ) : null}
                </div>
              ) : null}

              {multiple ? (
                <motion.div
                  ref={stripRef}
                  layoutScroll
                  data-slot="image-preview-thumbnails"
                  className="flex max-w-full gap-2 overflow-x-auto p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {items.map((thumbnail, thumbnailIndex) => {
                    const active = thumbnailIndex === index
                    return (
                      <button
                        key={thumbnail.id}
                        type="button"
                        data-active={active ? "" : undefined}
                        aria-label={`查看第 ${thumbnailIndex + 1} 张：${thumbnail.alt}`}
                        aria-current={active ? "true" : undefined}
                        className="relative size-12 shrink-0 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                        onClick={() => goTo(thumbnailIndex)}
                      >
                        <img
                          src={thumbnail.src}
                          alt=""
                          className={cn(
                            "size-full rounded-sm object-cover transition-opacity duration-200",
                            active ? "opacity-100" : "opacity-40 hover:opacity-75"
                          )}
                        />
                        {active ? (
                          <motion.span
                            aria-hidden
                            layoutId={`${layoutId}-thumbnail`}
                            className="absolute -inset-1 rounded-md border-2 border-white"
                            transition={reduceMotion ? { duration: 0 } : SPRING}
                          />
                        ) : null}
                      </button>
                    )
                  })}
                </motion.div>
              ) : null}
            </motion.div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      ) : null}
    </AnimatePresence>
  )
}

/**
 * One image on the stage. Each image owns its pan position so the outgoing
 * image keeps its offset while the next one slides in.
 */
function PreviewImage({
  item,
  zoom,
  rotation,
  swipeable,
  className,
  onSwipe,
  onDoubleClick,
}: {
  item: PreviewItem
  zoom: number
  rotation: number
  swipeable: boolean
  className?: string
  onSwipe: (step: 1 | -1) => void
  onDoubleClick: () => void
}) {
  const reduceMotion = useReducedMotion()
  const imageRef = React.useRef<HTMLImageElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [bounds, setBounds] = React.useState({ x: 0, y: 0 })
  const canPan = bounds.x > 0 || bounds.y > 0

  const measure = React.useCallback(() => {
    const image = imageRef.current
    if (!image) return
    const quarterTurn = Math.abs(Math.round(rotation / 90)) % 2 === 1
    const width = quarterTurn ? image.offsetHeight : image.offsetWidth
    const height = quarterTurn ? image.offsetWidth : image.offsetHeight
    // Keep the image pannable on both axes after zooming. Basing the range on
    // viewport overflow locked one axis for portrait or landscape images.
    const next = {
      x: (width * Math.max(0, zoom - 1)) / 2,
      y: (height * Math.max(0, zoom - 1)) / 2,
    }
    setBounds((current) =>
      current.x === next.x && current.y === next.y ? current : next
    )
    const transition = reduceMotion ? { duration: 0 } : SPRING
    const clampedX = Math.min(next.x, Math.max(-next.x, x.get()))
    const clampedY = Math.min(next.y, Math.max(-next.y, y.get()))
    if (clampedX !== x.get()) animate(x, clampedX, transition)
    if (clampedY !== y.get()) animate(y, clampedY, transition)
  }, [reduceMotion, rotation, x, y, zoom])

  React.useLayoutEffect(() => {
    measure()
    const observer = new ResizeObserver(measure)
    if (imageRef.current) observer.observe(imageRef.current)
    return () => observer.disconnect()
  }, [measure])

  function handleDragEnd(
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) {
    const swipe = info.offset.x + info.velocity.x * 0.2
    if (swipe < -80) onSwipe(1)
    else if (swipe > 80) onSwipe(-1)
  }

  return (
    <motion.img
      ref={imageRef}
      data-slot="image-preview-image"
      src={item.src}
      alt={item.alt}
      draggable={false}
      onLoad={measure}
      onDoubleClick={onDoubleClick}
      className={cn(
        "pointer-events-auto max-h-full max-w-full select-none object-contain",
        canPan
          ? "cursor-grab touch-none active:cursor-grabbing"
          : swipeable
            ? "touch-pan-y"
            : "cursor-default",
        className
      )}
      style={{ x, y }}
      drag={canPan ? true : swipeable ? "x" : false}
      dragConstraints={
        canPan
          ? { left: -bounds.x, right: bounds.x, top: -bounds.y, bottom: bounds.y }
          : { left: 0, right: 0 }
      }
      dragElastic={canPan ? 0.08 : 0.35}
      dragMomentum={false}
      onDragEnd={canPan ? undefined : handleDragEnd}
      animate={{ scale: zoom, rotate: rotation }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 360, damping: 34, mass: 0.7 }
      }
    />
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
        "inline-flex size-8 items-center justify-center rounded-sm text-white/85 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/50 disabled:pointer-events-none disabled:opacity-35 [&_svg]:size-4",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export { ImagePreview, ImagePreviewGroup }
