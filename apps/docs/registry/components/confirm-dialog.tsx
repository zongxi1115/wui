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
  trigger: React.ReactNode
  /** Heading shown at the top of the dialog. */
  title: string
  /** Optional supporting text under the title. */
  description?: string
  /** Label for the confirm button. @default "Confirm" */
  confirmLabel?: string
  /** Label for the cancel button. @default "Cancel" */
  cancelLabel?: string
  /** Visual style of the confirm button. @default "default" */
  variant?: "default" | "destructive"
  /** Called when the user clicks the confirm button. */
  onConfirm?: () => void
}

/**
 * A ready-made confirmation dialog composed from `Dialog` and `Button`.
 * Demonstrates a component that depends on other registry items.
 */
function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{cancelLabel}</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant={variant} onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { ConfirmDialog }
