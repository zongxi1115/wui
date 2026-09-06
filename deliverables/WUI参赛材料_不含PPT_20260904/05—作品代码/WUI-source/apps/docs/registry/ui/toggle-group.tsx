"use client"

import * as React from "react"
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"
import type { VariantProps } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"
import { toggleVariants } from "@/registry/ui/toggle"

type ToggleGroupStyle = VariantProps<typeof toggleVariants>

const ToggleGroupContext = React.createContext<ToggleGroupStyle>({})

export type ToggleGroupProps = React.ComponentProps<
  typeof ToggleGroupPrimitive.Root
> &
  ToggleGroupStyle

/** 将一组双态按钮组织为单选或多选控件。 */
function ToggleGroup({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: ToggleGroupProps) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={cn("flex w-fit items-center gap-1", className)}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
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
  ...props
}: ToggleGroupItemProps) {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        toggleVariants({
          variant: variant ?? context.variant,
          size: size ?? context.size,
        }),
        className
      )}
      {...props}
    />
  )
}

export { ToggleGroup, ToggleGroupItem }
