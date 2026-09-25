"use client"

import * as React from "react"
import { Toolbar as ToolbarPrimitive } from "radix-ui"
import type { VariantProps } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"
import { toggleVariants } from "@/registry/ui/toggle"
import {
  ToggleGroupIndicator,
  toggleGroupItemClassName,
  useToggleGroupSelection,
} from "@/registry/ui/toggle-group"

type ToolbarToggleStyle = VariantProps<typeof toggleVariants>

interface ToolbarGroupContextValue extends ToolbarToggleStyle {
  type: "single" | "multiple"
  selected: string[]
  layoutId: string
}

const ToolbarGroupContext = React.createContext<ToolbarGroupContextValue>({
  type: "single",
  selected: [],
  layoutId: "wui-toolbar-group",
})

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

export type ToolbarGroupProps = React.ComponentProps<
  typeof ToolbarPrimitive.ToggleGroup
> & {
  /** 组内 ToolbarToggleItem 的统一外观。 @default "default" */
  variant?: ToolbarToggleStyle["variant"]
  /** 组内 ToolbarToggleItem 的统一尺寸。 @default "sm" */
  size?: ToolbarToggleStyle["size"]
}

/**
 * 工具栏内的单选或多选切换组。单选时选中背景在选项之间滑动，
 * 多选时各选项背景独立缩放淡入。
 */
function ToolbarGroup({
  className,
  variant = "default",
  size = "sm",
  children,
  ...props
}: ToolbarGroupProps) {
  const { layoutId, selected, handleValueChange } = useToggleGroupSelection(
    props as Parameters<typeof useToggleGroupSelection>[0]
  )

  const rootProps = {
    ...props,
    onValueChange: handleValueChange,
  } as React.ComponentProps<typeof ToolbarPrimitive.ToggleGroup>

  return (
    <ToolbarPrimitive.ToggleGroup
      data-slot="toolbar-group"
      className={cn("flex items-center gap-0.5", className)}
      {...rootProps}
    >
      <ToolbarGroupContext.Provider
        value={{ variant, size, type: props.type, selected, layoutId }}
      >
        {children}
      </ToolbarGroupContext.Provider>
    </ToolbarPrimitive.ToggleGroup>
  )
}

export interface ToolbarToggleItemProps
  extends React.ComponentProps<typeof ToolbarPrimitive.ToggleItem>,
    ToolbarToggleStyle {}

/** ToolbarGroup 中的切换项，复用 Toggle 的外观与选中指示动效。 */
function ToolbarToggleItem({
  className,
  variant,
  size,
  value,
  children,
  ...props
}: ToolbarToggleItemProps) {
  const context = React.useContext(ToolbarGroupContext)

  return (
    <ToolbarPrimitive.ToggleItem
      data-slot="toolbar-toggle-item"
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
    </ToolbarPrimitive.ToggleItem>
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

/**
 * 分隔相邻的工具项。Radix 会为分隔线设置与工具栏垂直的 orientation：
 * 横向工具栏中为 `vertical`（竖线），纵向工具栏中为 `horizontal`（横线）。
 */
function ToolbarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.Separator>) {
  return (
    <ToolbarPrimitive.Separator
      data-slot="toolbar-separator"
      className={cn(
        "bg-border mx-1 h-5 w-px shrink-0 data-[orientation=horizontal]:mx-0 data-[orientation=horizontal]:my-1 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full",
        className
      )}
      {...props}
    />
  )
}

export {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarToggleItem,
}
