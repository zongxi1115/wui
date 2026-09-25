"use client"

import * as React from "react"
import {
  CheckIcon,
  CircleAlertIcon,
  CloudUploadIcon,
  FileIcon,
  LoaderCircleIcon,
  RotateCcwIcon,
  XIcon,
} from "lucide-react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "motion/react"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

export type UploadStatus = "idle" | "uploading" | "complete" | "error"

const uploadVariants = cva(
  "group relative flex w-full cursor-pointer flex-col items-center justify-center border border-dashed bg-background text-center outline-none transition-[border-color,background-color,box-shadow] hover:border-ring/60 hover:bg-accent/35 focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/25 has-[:disabled]:pointer-events-none has-[:disabled]:opacity-50",
  {
    variants: {
      size: {
        default: "min-h-52 gap-4 px-6 py-8",
        compact: "min-h-32 gap-3 px-4 py-5",
      },
    },
    defaultVariants: { size: "default" },
  }
)

export interface UploadProps
  extends Omit<
    React.ComponentProps<"input">,
    "children" | "onChange" | "size" | "type" | "value"
  > {
  /** Main instruction displayed inside the drop zone. @default "拖拽文件到此处，或点击选择" */
  label?: string
  /** Supporting copy displayed under the main instruction. */
  description?: string
  /** Visual lifecycle state. @default "idle" */
  status?: UploadStatus
  /** Determinate upload progress from 0 to 100. */
  progress?: number
  /** Height and spacing preset. @default "default" */
  size?: "default" | "compact"
  /** Allows more than one file to be selected. @default false */
  multiple?: boolean
  /** Comma-separated list of accepted MIME types or file extensions. */
  accept?: string
  /** Called whenever files are selected or dropped. */
  onFilesChange?: (files: File[]) => void
  /** Called after file selection and reflected in the internal lifecycle state. */
  onUpload?: (files: File[]) => void | Promise<void>
}

/** A click and drag-and-drop file picker with upload lifecycle feedback. */
function Upload({
  className,
  label = "拖拽文件到此处，或点击选择",
  description,
  status,
  progress = 0,
  size = "default",
  multiple = false,
  accept,
  disabled,
  onFilesChange,
  onUpload,
  ...props
}: UploadProps) {
  const reduceMotion = useReducedMotion()
  const [internalStatus, setInternalStatus] = React.useState<UploadStatus>("idle")
  const [dragging, setDragging] = React.useState(false)
  const currentStatus = status ?? internalStatus
  const normalizedProgress = Math.min(100, Math.max(0, progress))

  async function handleFiles(fileList: FileList | null) {
    if (!fileList?.length || disabled || currentStatus === "uploading") return

    const files = Array.from(fileList)
    const selectedFiles = multiple ? files : files.slice(0, 1)
    onFilesChange?.(selectedFiles)

    if (!onUpload) return

    if (status === undefined) setInternalStatus("uploading")
    try {
      await onUpload(selectedFiles)
      if (status === undefined) setInternalStatus("complete")
    } catch {
      if (status === undefined) setInternalStatus("error")
    }
  }

  const copy = {
    idle: { detail: description ?? "从设备中选择文件", icon: CloudUploadIcon },
    uploading: {
      detail: normalizedProgress > 0 ? `已上传 ${Math.round(normalizedProgress)}%` : "正在上传…",
      icon: LoaderCircleIcon,
    },
    complete: { detail: "上传完成", icon: CheckIcon },
    error: { detail: "上传失败，请重新选择文件", icon: RotateCcwIcon },
  }[currentStatus]
  const StatusIcon = copy.icon
  const springTransition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 32, mass: 0.72 }

  return (
    <motion.label
      layout
      data-slot="upload"
      data-status={currentStatus}
      data-dragging={dragging || undefined}
      className={cn(
        uploadVariants({ size }),
        dragging && "border-ring bg-accent/55 ring-[3px] ring-ring/20",
        className
      )}
      animate={reduceMotion ? undefined : { scale: dragging ? 1.01 : 1 }}
      whileTap={reduceMotion || disabled ? undefined : { scale: 0.995 }}
      transition={springTransition}
      onDragEnter={(event) => {
        event.preventDefault()
        if (!disabled) setDragging(true)
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => {
        event.preventDefault()
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false)
      }}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        void handleFiles(event.dataTransfer.files)
      }}
    >
      <input
        data-slot="upload-input"
        className="sr-only"
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled || currentStatus === "uploading"}
        onChange={(event) => {
          void handleFiles(event.currentTarget.files)
          event.currentTarget.value = ""
        }}
        {...props}
      />

      <motion.span
        layout="position"
        data-slot="upload-icon"
        className={cn(
          "relative flex items-center justify-center overflow-hidden rounded-full border bg-card text-foreground transition-colors duration-300",
          currentStatus === "complete" && "border-primary bg-primary text-primary-foreground",
          currentStatus === "error" && "border-destructive/30 text-destructive",
          size === "compact" ? "size-10" : "size-12"
        )}
        animate={
          reduceMotion
            ? undefined
            : {
                scale: currentStatus === "complete" ? [1, 1.08, 1] : dragging ? 1.06 : 1,
                y: dragging ? -2 : 0,
              }
        }
        transition={
          currentStatus === "complete" && !reduceMotion
            ? { duration: 0.52, ease: [0.22, 1, 0.36, 1] }
            : springTransition
        }
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={currentStatus}
            className="absolute flex items-center justify-center"
            initial={
              reduceMotion
                ? false
                : { opacity: 0, scale: 0.62, y: 7, filter: "blur(4px)", rotate: 0 }
            }
            animate={{
              opacity: 1,
              scale: currentStatus === "complete" && !reduceMotion ? [0.8, 1.16, 1] : 1,
              y: 0,
              filter: "blur(0px)",
              rotate: currentStatus === "uploading" && !reduceMotion ? 360 : 0,
            }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.68, y: -7, filter: "blur(4px)" }
            }
            transition={
              currentStatus === "uploading" && !reduceMotion
                ? {
                    opacity: { duration: 0.2 },
                    scale: springTransition,
                    y: springTransition,
                    filter: { duration: 0.2 },
                    rotate: { duration: 1.05, ease: "linear", repeat: Infinity },
                  }
                : currentStatus === "complete" && !reduceMotion
                  ? { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
                  : springTransition
            }
          >
            <StatusIcon className={size === "compact" ? "size-4" : "size-5"} />
          </motion.span>
        </AnimatePresence>
      </motion.span>

      <motion.span layout="position" className="space-y-1" transition={springTransition}>
        <span className="block text-sm font-semibold tracking-[-0.01em]">{label}</span>
        <span className="relative block min-h-4 overflow-hidden text-xs text-muted-foreground" aria-live="polite">
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              key={currentStatus}
              className="block"
              initial={reduceMotion ? false : { opacity: 0, y: 6, filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, filter: "blur(3px)" }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {copy.detail}
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.span>

      <AnimatePresence initial={false}>
        {currentStatus === "uploading" ? (
          <motion.span
            layout="position"
            data-slot="upload-progress"
            className="block h-1 w-full max-w-48 overflow-hidden rounded-full bg-muted"
            initial={reduceMotion ? false : { opacity: 0, scaleX: 0.72, y: 5 }}
            animate={{ opacity: 1, scaleX: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scaleX: 0.78, y: -4 }}
            transition={springTransition}
          >
            {normalizedProgress > 0 ? (
              <motion.span
                className="block h-full w-full origin-left rounded-full bg-primary"
                initial={false}
                animate={{ scaleX: normalizedProgress / 100 }}
                transition={springTransition}
              />
            ) : (
              <motion.span
                className="block h-full w-[28%] rounded-full bg-primary"
                animate={reduceMotion ? { x: 0 } : { x: ["-130%", "460%"] }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: 1.2, ease: [0.45, 0, 0.55, 1], repeat: Infinity }
                }
              />
            )}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </motion.label>
  )
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

/** Animated container for UploadFileItem rows: rows slide in, fade out and the rest reflow smoothly. */
function UploadFileList({ className, children, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="upload-file-list"
      className={cn("relative grid gap-2", className)}
      {...props}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {children}
      </AnimatePresence>
    </ul>
  )
}

export interface UploadFileItemProps extends Omit<HTMLMotionProps<"li">, "children"> {
  /** File name shown as the primary text. */
  name: string
  /** File size in bytes, or a preformatted label. */
  size?: number | string
  /** Upload lifecycle of this file. @default "complete" */
  status?: UploadStatus
  /** Determinate progress from 0 to 100 while uploading. */
  progress?: number
  /** Helper or error text replacing the size line. */
  description?: React.ReactNode
  /** Leading visual such as a thumbnail; defaults to a file glyph. */
  icon?: React.ReactNode
  /** Shows a remove button and is called when it is pressed. */
  onRemove?: () => void
}

/** One file row with a lifecycle icon, a smooth progress bar and an optional remove action. */
function UploadFileItem({
  className,
  name,
  size,
  status = "complete",
  progress = 0,
  description,
  icon,
  onRemove,
  ...props
}: UploadFileItemProps) {
  const reduceMotion = useReducedMotion()
  const normalizedProgress = Math.min(100, Math.max(0, progress))
  const sizeLabel = typeof size === "number" ? formatFileSize(size) : size
  const meta =
    description ??
    (status === "uploading"
      ? `${sizeLabel ? `${sizeLabel} · ` : ""}${Math.round(normalizedProgress)}%`
      : status === "error"
        ? "上传失败"
        : sizeLabel)
  const spring = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 520, damping: 38, mass: 0.7 }

  return (
    <motion.li
      layout={!reduceMotion}
      data-slot="upload-file-item"
      data-status={status}
      className={cn(
        "relative flex items-center gap-3 overflow-hidden rounded-md border bg-background px-3 py-2.5 text-sm transition-colors data-[status=error]:border-destructive/40",
        className
      )}
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, scale: 0.97, transition: { duration: 0.16 } }
      }
      transition={spring}
      {...props}
    >
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground [&_svg]:size-4",
          status === "error" && "bg-destructive/10 text-destructive"
        )}
      >
        {icon ?? <FileIcon />}
      </span>
      <span className="grid min-w-0 flex-1 gap-0.5">
        <span className="truncate font-medium leading-5">{name}</span>
        {meta ? (
          <span
            className={cn(
              "truncate text-xs tabular-nums text-muted-foreground",
              status === "error" && "text-destructive"
            )}
          >
            {meta}
          </span>
        ) : null}
      </span>
      {status !== "idle" ? (
        <span className="relative flex size-6 shrink-0 items-center justify-center [&_svg]:size-4">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={status}
              className={cn(
                "flex items-center justify-center",
                status === "complete" && "text-success",
                status === "error" && "text-destructive",
                status === "uploading" && "text-muted-foreground"
              )}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
              transition={spring}
            >
              {status === "uploading" ? (
                <LoaderCircleIcon className="animate-spin motion-reduce:animate-none" />
              ) : status === "complete" ? (
                <CheckIcon />
              ) : (
                <CircleAlertIcon />
              )}
            </motion.span>
          </AnimatePresence>
        </span>
      ) : null}
      {onRemove ? (
        <button
          type="button"
          data-slot="upload-file-remove"
          aria-label={`移除 ${name}`}
          className="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/30 [&_svg]:size-3.5"
          onClick={onRemove}
        >
          <XIcon />
        </button>
      ) : null}
      <AnimatePresence initial={false}>
        {status === "uploading" ? (
          <motion.span
            key="progress"
            aria-hidden="true"
            data-slot="upload-file-progress"
            className="absolute inset-x-0 bottom-0 h-0.5 bg-muted"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: reduceMotion ? 0 : 0.3, delay: reduceMotion ? 0 : 0.2 },
            }}
          >
            <motion.span
              className="block h-full origin-left bg-primary"
              initial={false}
              animate={{ scaleX: normalizedProgress / 100 }}
              transition={spring}
            />
          </motion.span>
        ) : null}
      </AnimatePresence>
    </motion.li>
  )
}

export { Upload, UploadFileItem, UploadFileList, uploadVariants }
