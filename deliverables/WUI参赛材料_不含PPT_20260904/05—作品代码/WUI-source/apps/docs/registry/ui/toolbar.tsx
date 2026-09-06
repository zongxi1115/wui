"use client"

import * as React from "react"
import { Toolbar as ToolbarPrimitive } from "radix-ui"

import { cn } from "@/registry/lib/utils"

export interface ToolbarProps extends React.ComponentProps<
  typeof ToolbarPrimitive.Root
> {
  /** 是否将 Toolbar 的行为合并到唯一的子元素上。 @default false */
  asChild?: boolean
  /** 工具项的排列方向。 @default "horizontal" */
  orientation?: "horizontal" | "vertical"
}

/** 协调一组紧凑操作的方向键导航与排列，不重复实现按钮外观。 */
function Toolbar({
  className,
  orientation = "horizontal",
  ...props
}: ToolbarProps) {
  return (
    <ToolbarPrimitive.Root
      data-slot="toolbar"
      orientation={orientation}
      className={cn(
        "border-border bg-background shadow-xs inline-flex w-fit items-center gap-1 rounded-lg border p-1",
        orientation === "vertical" && "flex-col items-stretch",
        className
      )}
      {...props}
    />
  )
}

function ToolbarGroup({
  className,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.ToggleGroup>) {
  return (
    <ToolbarPrimitive.ToggleGroup
      data-slot="toolbar-group"
      className={cn("flex items-center gap-0.5", className)}
      {...props}
    />
  )
}

export interface ToolbarButtonProps extends Omit<
  React.ComponentProps<typeof ToolbarPrimitive.Button>,
  "asChild"
> {
  /** 已有的 Button、链接按钮或其他单一交互元素。 */
  children: React.ReactElement
}

/** 将已有按钮接入 Toolbar 的 roving focus，不接管按钮视觉。 */
function ToolbarButton({ children, ...props }: ToolbarButtonProps) {
  return (
    <ToolbarPrimitive.Button asChild data-slot="toolbar-button" {...props}>
      {children}
    </ToolbarPrimitive.Button>
  )
}

function ToolbarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.Separator>) {
  return (
    <ToolbarPrimitive.Separator
      data-slot="toolbar-separator"
      className={cn(
        "bg-border mx-1 h-5 w-px shrink-0 data-[orientation=vertical]:mx-0 data-[orientation=vertical]:my-1 data-[orientation=vertical]:h-px data-[orientation=vertical]:w-full",
        className
      )}
      {...props}
    />
  )
}

export { Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator }
