"use client"

import * as React from "react"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"

import { cn } from "@/registry/lib/utils"

/** 管理下拉菜单的打开状态。 */
const DropdownMenu = DropdownMenuPrimitive.Root

/** 将触发能力附着到按钮或其他可交互元素。 */
function DropdownMenuTrigger(
  props: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>
) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  )
}

/** 将菜单内容挂载到指定容器。 */
function DropdownMenuPortal(
  props: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>
) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  )
}

/** 下拉菜单的浮层容器。 */
function DropdownMenuContent({
  className,
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPortal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground z-50 min-w-44 origin-(--radix-dropdown-menu-content-transform-origin) max-h-(--radix-dropdown-menu-content-available-height) overflow-x-hidden overflow-y-auto rounded-lg border p-1 shadow-md outline-none will-change-[transform,opacity] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:duration-200 data-[state=open]:ease-[cubic-bezier(0.22,1,0.36,1)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-150 data-[state=closed]:ease-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 motion-reduce:animate-none",
          className
        )}
        {...props}
      />
    </DropdownMenuPortal>
  )
}

export interface DropdownMenuItemProps extends React.ComponentProps<
  typeof DropdownMenuPrimitive.Item
> {
  /** 为危险操作启用警示色。 */
  destructive?: boolean
  /** 为前置图标或指示器预留空间。 */
  inset?: boolean
}

/** 可通过指针或键盘执行的菜单项。 */
function DropdownMenuItem({
  className,
  destructive = false,
  inset = false,
  ...props
}: DropdownMenuItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
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
function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center gap-2 rounded-md py-2 pl-8 pr-2.5 text-sm outline-none transition-colors duration-150 data-[disabled]:pointer-events-none data-[disabled]:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="absolute left-2.5 flex size-4 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator className="flex animate-in fade-in-0 zoom-in-50 duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-none">
          <CheckIcon className="text-foreground size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

/** 单选菜单项，需要放在 DropdownMenuRadioGroup 内。 */
function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center gap-2 rounded-md py-2 pl-8 pr-2.5 text-sm outline-none transition-colors duration-150 data-[disabled]:pointer-events-none data-[disabled]:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      {...props}
    >
      <span className="absolute left-2.5 flex size-4 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator className="flex animate-in fade-in-0 zoom-in-0 duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-none">
          <CircleIcon className="text-foreground size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

/** 一组具有共同语义的菜单项。 */
const DropdownMenuGroup = DropdownMenuPrimitive.Group

/** 管理一组互斥菜单项的当前值。 */
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

/** 菜单分组标题。 */
function DropdownMenuLabel({
  className,
  inset = false,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  /** 与带前置图标的菜单项对齐。 */
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
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
function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

/** 在菜单项尾部展示快捷键提示。 */
function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-wide",
        className
      )}
      {...props}
    />
  )
}

/** 创建一组嵌套子菜单。 */
const DropdownMenuSub = DropdownMenuPrimitive.Sub

/** 打开嵌套子菜单的菜单项。 */
function DropdownMenuSubTrigger({
  className,
  inset = false,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  /** 为前置图标预留空间。 */
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset || undefined}
      className={cn(
        "group/sub-trigger focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default select-none items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none transition-colors duration-150 data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto transition-transform duration-200 ease-out group-data-[state=open]/sub-trigger:translate-x-0.5 motion-reduce:transition-none" />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

/** 嵌套子菜单的浮层容器。 */
function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "bg-popover text-popover-foreground z-50 min-w-40 origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-lg border p-1 shadow-md outline-none will-change-[transform,opacity] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:duration-200 data-[state=open]:ease-[cubic-bezier(0.22,1,0.36,1)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-150 data-[state=closed]:ease-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
}
