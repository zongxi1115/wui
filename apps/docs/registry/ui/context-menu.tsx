"use client"

import * as React from "react"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"
import { ContextMenu as ContextMenuPrimitive } from "radix-ui"

import { cn } from "@/registry/lib/utils"

/** 管理右键菜单的打开状态。 */
const ContextMenu = ContextMenuPrimitive.Root

/** 将右键或长按菜单绑定到指定区域。 */
function ContextMenuTrigger(
  props: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>
) {
  return (
    <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
  )
}

/** 将菜单内容挂载到文档浮层。 */
function ContextMenuPortal(
  props: React.ComponentProps<typeof ContextMenuPrimitive.Portal>
) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  )
}

/** 右键菜单的浮层容器。 */
function ContextMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
  return (
    <ContextMenuPortal>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        className={cn(
          "bg-popover text-popover-foreground z-50 min-w-44 origin-(--radix-context-menu-content-transform-origin) max-h-(--radix-context-menu-content-available-height) overflow-x-hidden overflow-y-auto rounded-lg border p-1 shadow-md outline-none will-change-[transform,opacity] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:duration-200 data-[state=open]:ease-[cubic-bezier(0.22,1,0.36,1)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-150 data-[state=closed]:ease-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 motion-reduce:animate-none",
          className
        )}
        {...props}
      />
    </ContextMenuPortal>
  )
}

export interface ContextMenuItemProps extends React.ComponentProps<
  typeof ContextMenuPrimitive.Item
> {
  /** 为危险操作启用警示色。 */
  destructive?: boolean
  /** 为前置图标或指示器预留空间。 */
  inset?: boolean
}

/** 可通过指针或键盘执行的菜单项。 */
function ContextMenuItem({
  className,
  destructive = false,
  inset = false,
  ...props
}: ContextMenuItemProps) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-destructive={destructive || undefined}
      data-inset={inset || undefined}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[destructive]:text-destructive data-[destructive]:focus:bg-destructive/10 data-[destructive]:focus:text-destructive relative flex cursor-default select-none items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none transition-colors duration-150 data-[disabled]:pointer-events-none data-[inset]:pl-8 data-[disabled]:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg:not([class*='text-'])]:text-muted-foreground data-[destructive]:[&_svg]:!text-destructive",
        className
      )}
      {...props}
    />
  )
}

/** 带开关状态的菜单项。 */
function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center gap-2 rounded-md py-2 pl-8 pr-2.5 text-sm outline-none transition-colors duration-150 data-[disabled]:pointer-events-none data-[disabled]:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="absolute left-2.5 flex size-4 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator className="flex animate-in fade-in-0 zoom-in-50 duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-none">
          <CheckIcon className="text-foreground size-4" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  )
}

/** 单选菜单项，需要放在 ContextMenuRadioGroup 内。 */
function ContextMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center gap-2 rounded-md py-2 pl-8 pr-2.5 text-sm outline-none transition-colors duration-150 data-[disabled]:pointer-events-none data-[disabled]:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      {...props}
    >
      <span className="absolute left-2.5 flex size-4 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator className="flex animate-in fade-in-0 zoom-in-0 duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-none">
          <CircleIcon className="text-foreground size-2 fill-current" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  )
}

/** 一组具有共同语义的菜单项。 */
function ContextMenuGroup(
  props: React.ComponentProps<typeof ContextMenuPrimitive.Group>
) {
  return (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  )
}

/** 管理一组互斥菜单项的当前值。 */
function ContextMenuRadioGroup(
  props: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>
) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  )
}

/** 菜单分组标题。 */
function ContextMenuLabel({
  className,
  inset = false,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
  /** 与带前置图标的菜单项对齐。 */
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.Label
      data-slot="context-menu-label"
      data-inset={inset || undefined}
      className={cn(
        "text-muted-foreground px-2.5 py-1.5 text-xs font-semibold data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  )
}

/** 分隔相邻的菜单分组。 */
function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

/** 在菜单项尾部展示快捷键提示。 */
function ContextMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-wide",
        className
      )}
      {...props}
    />
  )
}

/** 创建一组嵌套子菜单。 */
const ContextMenuSub = ContextMenuPrimitive.Sub

/** 打开嵌套子菜单的菜单项。 */
function ContextMenuSubTrigger({
  className,
  inset = false,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
  /** 为前置图标预留空间。 */
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.SubTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset || undefined}
      className={cn(
        "group/sub-trigger focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default select-none items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none transition-colors duration-150 data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto transition-transform duration-200 ease-out group-data-[state=open]/sub-trigger:translate-x-0.5 motion-reduce:transition-none" />
    </ContextMenuPrimitive.SubTrigger>
  )
}

/** 嵌套子菜单的浮层容器。 */
function ContextMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  return (
    <ContextMenuPrimitive.SubContent
      data-slot="context-menu-sub-content"
      className={cn(
        "bg-popover text-popover-foreground z-50 min-w-40 origin-(--radix-context-menu-content-transform-origin) overflow-hidden rounded-lg border p-1 shadow-md outline-none will-change-[transform,opacity] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:duration-200 data-[state=open]:ease-[cubic-bezier(0.22,1,0.36,1)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-150 data-[state=closed]:ease-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  )
}

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
}
