"use client"

import * as React from "react"
import {
  CheckIcon,
  DownloadIcon,
  FileArchiveIcon,
  FileAudioIcon,
  FileCode2Icon,
  FileIcon,
  FileImageIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FileVideoIcon,
  LoaderCircleIcon,
  PresentationIcon,
  RotateCcwIcon,
  type LucideIcon,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion, type HTMLMotionProps } from "motion/react"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

export type DownloadStatus = "idle" | "downloading" | "complete" | "error"

const fileTypeIcons: Record<string, LucideIcon> = {
  "7z": FileArchiveIcon,
  aac: FileAudioIcon,
  ai: FileImageIcon,
  avi: FileVideoIcon,
  bmp: FileImageIcon,
  csv: FileSpreadsheetIcon,
  doc: FileTextIcon,
  docx: FileTextIcon,
  flac: FileAudioIcon,
  gif: FileImageIcon,
  gz: FileArchiveIcon,
  html: FileCode2Icon,
  jpeg: FileImageIcon,
  jpg: FileImageIcon,
  js: FileCode2Icon,
  json: FileCode2Icon,
  md: FileTextIcon,
  mov: FileVideoIcon,
  mp3: FileAudioIcon,
  mp4: FileVideoIcon,
  ods: FileSpreadsheetIcon,
  odp: PresentationIcon,
  odt: FileTextIcon,
  pdf: FileTextIcon,
  png: FileImageIcon,
  ppt: PresentationIcon,
  pptx: PresentationIcon,
  rar: FileArchiveIcon,
  svg: FileImageIcon,
  tar: FileArchiveIcon,
  ts: FileCode2Icon,
  tsx: FileCode2Icon,
  txt: FileTextIcon,
  wav: FileAudioIcon,
  webm: FileVideoIcon,
  webp: FileImageIcon,
  xls: FileSpreadsheetIcon,
  xlsx: FileSpreadsheetIcon,
  xml: FileCode2Icon,
  zip: FileArchiveIcon,
}

function getFileTypeIcon(filename: string) {
  const extension = filename.split(".").pop()?.toLowerCase()
  return extension ? fileTypeIcons[extension] ?? FileIcon : FileIcon
}

const downloadVariants = cva(
  "group relative flex w-full items-center gap-3 overflow-hidden rounded-lg border bg-card text-left shadow-sm outline-none transition-[border-color,background-color,box-shadow] duration-300 hover:border-ring/50 hover:bg-accent/35 focus-visible:ring-[3px] focus-visible:ring-ring/35 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        default: "min-h-20 px-4 py-3.5",
        compact: "min-h-14 rounded-md px-3 py-2.5",
      },
    },
    defaultVariants: { size: "default" },
  }
)

export interface DownloadProps
  extends Omit<HTMLMotionProps<"button">, "children" | "onClick"> {
  /** Main file label shown in the control. */
  filename: string
  /** Secondary metadata such as file type and size. */
  meta?: string
  /** File type icon inferred from the filename. Pass a node to override it or false to hide it. */
  fileIcon?: React.ReactNode | false
  /** Direct URL downloaded when the control is activated. */
  href?: string
  /** Visual lifecycle state. @default "idle" */
  status?: DownloadStatus
  /** Determinate progress from 0 to 100. */
  progress?: number
  /** Height and spacing preset. @default "default" */
  size?: "default" | "compact"
  /** Called when the user requests the download. */
  onDownload?: () => void | Promise<void>
}

/** A download action that communicates file identity, progress, and completion. */
function Download({
  className,
  filename,
  meta,
  fileIcon,
  href,
  status,
  progress = 0,
  size = "default",
  onDownload,
  disabled,
  ...props
}: DownloadProps) {
  const reduceMotion = useReducedMotion()
  const [internalStatus, setInternalStatus] = React.useState<DownloadStatus>("idle")
  const currentStatus = status ?? internalStatus
  const normalizedProgress = Math.min(100, Math.max(0, progress))
  const FileTypeIcon = getFileTypeIcon(filename)

  async function handleDownload() {
    if (currentStatus === "downloading") return
    if (status === undefined) setInternalStatus("downloading")

    try {
      if (href) {
        const anchor = document.createElement("a")
        anchor.href = href
        anchor.download = filename
        anchor.click()
      }
      await onDownload?.()
      if (status === undefined) setInternalStatus("complete")
    } catch {
      if (status === undefined) setInternalStatus("error")
    }
  }

  const copy = {
    idle: { eyebrow: "Ready to download", action: "Download" },
    downloading: { eyebrow: normalizedProgress > 0 ? `${Math.round(normalizedProgress)}% downloaded` : "Preparing download", action: "Downloading" },
    complete: { eyebrow: "Saved to your device", action: "Downloaded" },
    error: { eyebrow: "Download interrupted", action: "Try again" },
  }[currentStatus]

  return (
    <motion.button
      type="button"
      data-slot="download"
      data-status={currentStatus}
      className={cn(downloadVariants({ size }), className)}
      whileHover={reduceMotion || disabled ? undefined : { y: -2 }}
      whileTap={reduceMotion || disabled ? undefined : { scale: 0.985 }}
      transition={{ type: "spring", stiffness: 430, damping: 30, mass: 0.7 }}
      disabled={disabled}
      onClick={handleDownload}
      {...props}
    >
      {fileIcon !== false ? (
        <motion.span
          data-slot="download-icon"
          className={cn(
            "relative flex shrink-0 items-center justify-center rounded-md bg-muted text-foreground",
            size === "compact" ? "size-9" : "size-12"
          )}
          animate={reduceMotion ? undefined : { scale: currentStatus === "complete" ? [1, 1.12, 1] : 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {fileIcon ?? <FileTypeIcon className={size === "compact" ? "size-4" : "size-5"} />}
        </motion.span>
      ) : null}

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold tracking-[-0.01em]">{filename}</span>
        <span className="mt-0.5 block truncate text-xs text-muted-foreground">{meta ?? copy.eyebrow}</span>
        {currentStatus === "downloading" ? (
          <span data-slot="download-progress" className="mt-2 block h-1 overflow-hidden rounded-full bg-muted">
            <motion.span
              className="block h-full origin-left rounded-full bg-primary"
              initial={false}
              animate={{ scaleX: normalizedProgress > 0 ? normalizedProgress / 100 : 0.28, x: normalizedProgress > 0 ? 0 : ["-120%", "350%"] }}
              transition={normalizedProgress > 0 || reduceMotion ? { duration: reduceMotion ? 0 : 0.35, ease: "easeOut" } : { duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        ) : null}
      </span>

      <span className="flex shrink-0 items-center gap-2 text-xs font-medium text-muted-foreground">
        {size === "default" ? <span className="hidden sm:inline">{copy.action}</span> : null}
        <span className="relative flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={currentStatus}
              className="absolute flex items-center justify-center"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.5, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.5, y: -4 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
            >
              {currentStatus === "downloading" ? <LoaderCircleIcon className="size-4 animate-spin motion-reduce:animate-none" /> : null}
              {currentStatus === "complete" ? <CheckIcon className="size-4" /> : null}
              {currentStatus === "error" ? <RotateCcwIcon className="size-4" /> : null}
              {currentStatus === "idle" ? <DownloadIcon className="size-4" /> : null}
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
    </motion.button>
  )
}

export { Download, downloadVariants }
