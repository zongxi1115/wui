"use client"

import * as React from "react"

import { Button } from "@/registry/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/ui/dialog"

export interface ConfirmDialogProps {
  /** The element that opens the dialog. Rendered inside the trigger via `asChild`. */
  trigger?: React.ReactNode
  /** Controlled open state. */
  open?: boolean
  /** Initial open state in uncontrolled mode. @default false */
  defaultOpen?: boolean
  /** Callback fired when the open state changes. */
  onOpenChange?: (open: boolean) => void
  /** Heading shown at the top of the dialog. */
  title: string
  /** Optional supporting text under the title. */
  description?: string
  /** Optional custom content rendered between description and footer. */
  children?: React.ReactNode
  /** Label for the confirm button. @default "确认" */
  confirmLabel?: string
  /** Label for the cancel button. @default "取消" */
  cancelLabel?: string
  /** Visual style of the confirm button. @default "default" */
  variant?: "default" | "destructive"
  /** Controlled loading state for the confirm button. */
  loading?: boolean
  /** Called when the user clicks the confirm button. Can return a Promise for auto-loading. */
  onConfirm?: () => void | Promise<void>
}

/**
 * A ready-made confirmation dialog composed from `Dialog` and `Button`.
 * Demonstrates a component that depends on other registry items.
 */
function ConfirmDialog({
  trigger,
  open: openProp,
  defaultOpen,
  onOpenChange,
  title,
  description,
  children,
  confirmLabel = "确认",
  cancelLabel = "取消",
  variant = "default",
  loading: loadingProp,
  onConfirm,
}: ConfirmDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false)
  const [asyncLoading, setAsyncLoading] = React.useState(false)

  const isControlled = openProp !== undefined
  const open = isControlled ? openProp : internalOpen
  const isLoading = loadingProp ?? asyncLoading

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalOpen(next)
      }
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange]
  )

  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!onConfirm) {
      handleOpenChange(false)
      return
    }

    try {
      const result = onConfirm()
      if (result && typeof (result as Promise<void>).then === "function") {
        setAsyncLoading(true)
        await result
        setAsyncLoading(false)
        handleOpenChange(false)
      } else {
        handleOpenChange(false)
      }
    } catch {
      setAsyncLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        {children ? <div className="py-2">{children}</div> : null}
        <DialogFooter>
          <DialogClose asChild disabled={isLoading}>
            <Button variant="outline" disabled={isLoading}>
              {cancelLabel}
            </Button>
          </DialogClose>
          <Button
            variant={variant}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "处理中..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { ConfirmDialog }
