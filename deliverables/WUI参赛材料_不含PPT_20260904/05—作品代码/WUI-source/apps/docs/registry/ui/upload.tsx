"use client"

import * as React from "react"
import {
  CheckIcon,
  CloudUploadIcon,
  LoaderCircleIcon,
  RotateCcwIcon,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
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
  /** Main instruction displayed inside the drop zone. @default "Drop files here or click to browse" */
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
  label = "Drop files here or click to browse",
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
    idle: { detail: description ?? "Choose files from your device", icon: CloudUploadIcon },
    uploading: {
      detail: normalizedProgress > 0 ? `${Math.round(normalizedProgress)}% uploaded` : "Uploading files",
      icon: LoaderCircleIcon,
    },
    complete: { detail: "Upload complete", icon: CheckIcon },
    error: { detail: "Upload failed. Choose files to try again", icon: RotateCcwIcon },
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
      animate={reduceMotion ? undefined : { scale: dragging ? 1.008 : 1 }}
      whileHover={reduceMotion || disabled ? undefined : { y: -2 }}
      whileTap={reduceMotion || disabled ? undefined : { scale: 0.992 }}
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

export { Upload, uploadVariants }
