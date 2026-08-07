"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"

import { cn } from "@/registry/lib/utils"

/** 管理浮层的受控或非受控打开状态。 */
function Popover(props: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

/** 将浮层定位到指定容器，默认挂载到 document.body。 */
function PopoverPortal(
  props: React.ComponentProps<typeof PopoverPrimitive.Portal>
) {
  return <PopoverPrimitive.Portal data-slot="popover-portal" {...props} />
}

/** 触发浮层打开或关闭，通常配合 asChild 复用现有按钮。 */
function PopoverTrigger(
  props: React.ComponentProps<typeof PopoverPrimitive.Trigger>
) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

/** 可访问性友好的浮层标题。 */
function PopoverTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="popover-title"
      className={cn("text-sm font-semibold leading-none", className)}
      {...props}
    />
  )
}

/** 浮层的辅助说明文本。 */
function PopoverDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="popover-description"
      className={cn("text-muted-foreground text-sm leading-5", className)}
      {...props}
    />
  )
}

/** 关闭当前浮层，可通过 asChild 附着到现有控件。 */
function PopoverClose(
  props: React.ComponentProps<typeof PopoverPrimitive.Close>
) {
  return <PopoverPrimitive.Close data-slot="popover-close" {...props} />
}

export interface PopoverContentProps extends React.ComponentProps<
  typeof PopoverPrimitive.Content
> {
  /** 浮层与触发器之间的距离，单位为像素。@default 6 */
  sideOffset?: number
  /** 是否显示指向触发器的箭头。@default false */
  showArrow?: boolean
}

/** 承载可交互内容的浮层面板，并自动处理碰撞避让与焦点。 */
function PopoverContent({
  className,
  align = "center",
  sideOffset = 6,
  showArrow = false,
  children,
  ...props
}: PopoverContentProps) {
  return (
    <PopoverPortal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 z-50 w-72 rounded-lg border p-4 shadow-md outline-none will-change-[transform,opacity] motion-reduce:animate-none",
          className
        )}
        {...props}
      >
        {children}
        {showArrow ? (
          <PopoverPrimitive.Arrow
            data-slot="popover-arrow"
            className="fill-popover stroke-border"
            width={10}
            height={5}
          />
        ) : null}
      </PopoverPrimitive.Content>
    </PopoverPortal>
  )
}

/** 为嵌套浮层指定定位锚点。 */
function PopoverAnchor(
  props: React.ComponentProps<typeof PopoverPrimitive.Anchor>
) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

export {
  Popover,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverPortal,
  PopoverTitle,
  PopoverTrigger,
}
