"use client"

import * as React from "react"
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import type { VariantProps } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"
import { toggleVariants } from "@/registry/ui/toggle"

type ToggleGroupStyle = VariantProps<typeof toggleVariants>

type SelectionValue = string | string[] | undefined

interface ToggleGroupContextValue extends ToggleGroupStyle {
  type: "single" | "multiple"
  selected: string[]
  layoutId: string
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({
  type: "single",
  selected: [],
  layoutId: "wui-toggle-group",
})

const indicatorSpring = {
  type: "spring",
  stiffness: 520,
  damping: 38,
  mass: 0.7,
} as const

/**
 * Mirrors the selected value(s) of a Radix toggle group (controlled or not) so
 * items can render an animated indicator. Shared with `ToolbarGroup`.
 */
function useToggleGroupSelection({
  value,
  defaultValue,
  onValueChange,
}: {
  value?: SelectionValue
  defaultValue?: SelectionValue
  onValueChange?: (value: never) => void
}) {
  const layoutId = React.useId()
  const [internal, setInternal] = React.useState<SelectionValue>(defaultValue)
  const current = value !== undefined ? value : internal
  const selected = Array.isArray(current) ? current : current ? [current] : []

  const handleValueChange = (next: string | string[]) => {
    if (value === undefined) setInternal(next)
    onValueChange?.(next as never)
  }

  return { layoutId, selected, handleValueChange }
}

export interface ToggleGroupIndicatorProps {
  /** Whether the owning item is currently on. */
  active: boolean
  /** Shared layout id; pass it in single mode so the highlight slides between items. */
  layoutId?: string
}

/**
 * Background highlight for a toggle group item. With a `layoutId` it slides
 * between items (single selection); without one, each item's highlight scales
 * in and out on its own (multiple selection).
 */
function ToggleGroupIndicator({ active, layoutId }: ToggleGroupIndicatorProps) {
  const reduceMotion = useReducedMotion()
  const transition = reduceMotion ? { duration: 0 } : indicatorSpring
  const className =
    "pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-accent"

  if (layoutId) {
    return active ? (
      <motion.span
        aria-hidden
        data-slot="toggle-group-indicator"
        layoutId={layoutId}
        className={className}
        transition={transition}
      />
    ) : null
  }

  return (
    <AnimatePresence initial={false}>
      {active ? (
        <motion.span
          key="indicator"
          aria-hidden
          data-slot="toggle-group-indicator"
          className={className}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={transition}
        />
      ) : null}
    </AnimatePresence>
  )
}

/** Item classes shared by `ToggleGroupItem` and `ToolbarToggleItem`. */
const toggleGroupItemClassName =
  "relative isolate bg-transparent data-[state=on]:bg-transparent"

export type ToggleGroupProps = React.ComponentProps<
  typeof ToggleGroupPrimitive.Root
> &
  ToggleGroupStyle

/**
 * 将一组双态按钮组织为单选或多选控件。单选模式下选中背景会在选项之间平滑滑动，
 * 多选模式下每个选项的背景独立缩放淡入。
 */
function ToggleGroup({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: ToggleGroupProps) {
  const { layoutId, selected, handleValueChange } = useToggleGroupSelection(
    props as Parameters<typeof useToggleGroupSelection>[0]
  )

  const rootProps = {
    ...props,
    onValueChange: handleValueChange,
  } as React.ComponentProps<typeof ToggleGroupPrimitive.Root>

  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      className={cn("flex w-fit items-center gap-1", className)}
      {...rootProps}
    >
      <ToggleGroupContext.Provider
        value={{ variant, size, type: props.type, selected, layoutId }}
      >
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
}

export interface ToggleGroupItemProps
  extends
    React.ComponentProps<typeof ToggleGroupPrimitive.Item>,
    ToggleGroupStyle {}

/** ToggleGroup 中的单个可选项。 */
function ToggleGroupItem({
  className,
  variant,
  size,
  value,
  children,
  ...props
}: ToggleGroupItemProps) {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      value={value}
      className={cn(
        toggleVariants({
          variant: variant ?? context.variant,
          size: size ?? context.size,
        }),
        toggleGroupItemClassName,
        className
      )}
      {...props}
    >
      <ToggleGroupIndicator
        active={context.selected.includes(value)}
        layoutId={
          context.type === "single" ? `${context.layoutId}-indicator` : undefined
        }
      />
      {children}
    </ToggleGroupPrimitive.Item>
  )
}

export {
  ToggleGroup,
  ToggleGroupIndicator,
  ToggleGroupItem,
  toggleGroupItemClassName,
  useToggleGroupSelection,
}
