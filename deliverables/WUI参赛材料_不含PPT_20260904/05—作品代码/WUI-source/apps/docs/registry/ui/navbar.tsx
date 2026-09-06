"use client"

import * as React from "react"
import { HoverCard, Slot } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

type NavbarOrientation = "horizontal" | "vertical"

const NavbarContext = React.createContext<{
  orientation: NavbarOrientation
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}>({
  orientation: "horizontal",
  collapsed: false,
  setCollapsed: () => undefined,
})

const navbarVariants = cva("bg-background text-foreground", {
  variants: {
    orientation: {
      horizontal: "flex h-14 w-full items-center gap-2 border-b px-3",
      vertical:
        "relative flex h-full min-h-0 w-64 shrink-0 flex-col border-r px-3 py-4 transition-[width] duration-200 data-[collapsed=true]:w-16 motion-reduce:transition-none",
    },
  },
  defaultVariants: { orientation: "horizontal" },
})

export interface NavbarProps
  extends React.ComponentProps<"nav">,
    VariantProps<typeof navbarVariants> {
  /** Layout direction. Use `vertical` for an application-level left rail. @default "horizontal" */
  orientation?: NavbarOrientation
  /** Controlled compact state for a vertical navbar. */
  collapsed?: boolean
  /** Initial compact state when uncontrolled. @default false */
  defaultCollapsed?: boolean
  /** Called when the vertical navbar changes between full and compact widths. */
  onCollapsedChange?: (collapsed: boolean) => void
}

/** A composable application navigation region. */
function Navbar({
  className,
  orientation = "horizontal",
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  ...props
}: NavbarProps) {
  const [internalCollapsed, setInternalCollapsed] =
    React.useState(defaultCollapsed)
  const resolvedCollapsed =
    orientation === "vertical" ? (collapsed ?? internalCollapsed) : false

  function setCollapsed(next: boolean) {
    if (collapsed === undefined) setInternalCollapsed(next)
    onCollapsedChange?.(next)
  }

  return (
    <NavbarContext.Provider
      value={{
        orientation,
        collapsed: resolvedCollapsed,
        setCollapsed,
      }}
    >
      <nav
        data-slot="navbar"
        data-orientation={orientation}
        data-collapsed={resolvedCollapsed ? "true" : "false"}
        className={cn(navbarVariants({ orientation }), className)}
        {...props}
      />
    </NavbarContext.Provider>
  )
}

function NavbarHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { collapsed, orientation } = React.useContext(NavbarContext)
  return (
    <div
      data-slot="navbar-header"
      className={cn(
        "flex shrink-0 items-center",
        orientation === "vertical" ? "w-full pb-4" : "mr-4",
        collapsed && "justify-center",
        className
      )}
      {...props}
    />
  )
}

function NavbarBrand({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"a"> & { asChild?: boolean }) {
  const Component = asChild ? Slot.Root : "a"
  return (
    <Component
      data-slot="navbar-brand"
      className={cn(
        "inline-flex items-center gap-2 rounded-md text-sm font-semibold tracking-tight no-underline outline-none hover:no-underline focus-visible:ring-[3px] focus-visible:ring-ring/35",
        className
      )}
      {...props}
    />
  )
}

function NavbarContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { orientation } = React.useContext(NavbarContext)
  return (
    <div
      data-slot="navbar-content"
      className={cn(
        "flex min-w-0 flex-1",
        orientation === "vertical"
          ? "w-full flex-col gap-5 overflow-y-auto"
          : "items-center gap-1",
        className
      )}
      {...props}
    />
  )
}

function NavbarGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navbar-group"
      className={cn("min-w-0", className)}
      {...props}
    />
  )
}

function NavbarLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { collapsed, orientation } = React.useContext(NavbarContext)
  if (orientation !== "vertical") return null
  return (
    <div
      data-slot="navbar-label"
      className={cn(
        "mb-1 px-3 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground",
        collapsed && "sr-only",
        className
      )}
      {...props}
    />
  )
}

function NavbarList({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  const { orientation } = React.useContext(NavbarContext)
  return (
    <ul
      data-slot="navbar-list"
      className={cn(
        "m-0 flex min-w-0 list-none p-0 [&>li]:m-0",
        orientation === "vertical"
          ? "w-full flex-col gap-0.5"
          : "items-center gap-1",
        className
      )}
      {...props}
    />
  )
}

function NavbarItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="navbar-item"
      className={cn("min-w-0", className)}
      {...props}
    />
  )
}

export interface NavbarLinkProps extends React.ComponentProps<"a"> {
  /** Mark the destination as the current page. */
  active?: boolean
  /** Render as the single child element, such as a router Link or button. */
  asChild?: boolean
}

function NavbarLink({
  className,
  active = false,
  asChild = false,
  ...props
}: NavbarLinkProps) {
  const { collapsed, orientation } = React.useContext(NavbarContext)
  const Component = asChild ? Slot.Root : "a"
  return (
    <Component
      data-slot="navbar-link"
      data-active={active ? "true" : "false"}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex min-w-0 items-center gap-2.5 rounded-md text-sm font-medium text-muted-foreground no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground hover:no-underline focus-visible:ring-[3px] focus-visible:ring-ring/35 [&_svg]:size-4 [&_svg]:shrink-0",
        orientation === "vertical"
          ? "h-9 w-full px-3 before:absolute before:left-0 before:h-4 before:w-0.5 before:scale-y-0 before:rounded-full before:bg-primary before:transition-transform data-[active=true]:bg-accent data-[active=true]:text-accent-foreground data-[active=true]:before:scale-y-100"
          : "h-9 px-3 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground",
        collapsed && "justify-center px-0 before:hidden",
        className
      )}
      {...props}
    />
  )
}

function NavbarBadge({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const { collapsed } = React.useContext(NavbarContext)
  return (
    <span
      data-slot="navbar-badge"
      className={cn(
        "ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-[10px] font-semibold tabular-nums text-muted-foreground",
        collapsed && "hidden",
        className
      )}
      {...props}
    />
  )
}

function NavbarFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { orientation } = React.useContext(NavbarContext)
  return (
    <div
      data-slot="navbar-footer"
      className={cn(
        "flex shrink-0 items-center",
        orientation === "vertical"
          ? "mt-auto w-full border-t pt-3"
          : "ml-auto",
        className
      )}
      {...props}
    />
  )
}

function NavbarSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { orientation } = React.useContext(NavbarContext)
  return (
    <div
      data-slot="navbar-separator"
      role="separator"
      aria-orientation={orientation === "vertical" ? "horizontal" : "vertical"}
      className={cn(
        "shrink-0 bg-border",
        orientation === "vertical" ? "my-3 h-px w-full" : "mx-2 h-5 w-px",
        className
      )}
      {...props}
    />
  )
}

function NavbarBrandLabel({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const { collapsed } = React.useContext(NavbarContext)
  return (
    <span
      data-slot="navbar-brand-label"
      className={cn(collapsed && "sr-only", className)}
      {...props}
    />
  )
}

function NavbarLinkLabel({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const { collapsed } = React.useContext(NavbarContext)
  return (
    <span
      data-slot="navbar-link-label"
      className={cn("min-w-0 truncate", collapsed && "sr-only", className)}
      {...props}
    />
  )
}

function NavbarLinkAccessory({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const { collapsed } = React.useContext(NavbarContext)
  return (
    <span
      data-slot="navbar-link-accessory"
      className={cn(
        "ml-auto flex shrink-0 items-center text-muted-foreground",
        collapsed && "hidden",
        className
      )}
      {...props}
    />
  )
}

function NavbarSubmenu(
  props: React.ComponentProps<typeof HoverCard.Root>
) {
  return <HoverCard.Root openDelay={100} closeDelay={120} {...props} />
}

function NavbarSubmenuTrigger(
  props: React.ComponentProps<typeof HoverCard.Trigger>
) {
  return <HoverCard.Trigger data-slot="navbar-submenu-trigger" {...props} />
}

function NavbarSubmenuContent({
  className,
  sideOffset = 8,
  align = "start",
  ...props
}: React.ComponentProps<typeof HoverCard.Content>) {
  return (
    <HoverCard.Portal>
      <HoverCard.Content
        data-slot="navbar-submenu-content"
        side="right"
        sideOffset={sideOffset}
        align={align}
        collisionPadding={12}
        className={cn(
          "z-50 min-w-40 rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-left-1 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-left-1 motion-reduce:animate-none",
          className
        )}
        {...props}
      />
    </HoverCard.Portal>
  )
}

function NavbarSubList({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  const { orientation } = React.useContext(NavbarContext)
  if (orientation !== "vertical") return null
  return (
    <ul
      data-slot="navbar-sub-list"
      className={cn(
        "m-0 w-full list-none p-0 [&>li]:m-0",
        className
      )}
      {...props}
    />
  )
}

function NavbarSubLink({
  className,
  active = false,
  asChild = false,
  ...props
}: NavbarLinkProps) {
  const Component = asChild ? Slot.Root : "a"
  return (
    <Component
      data-slot="navbar-sub-link"
      data-active={active ? "true" : "false"}
      aria-current={active ? "page" : undefined}
      role="menuitem"
      className={cn(
        "flex h-8 w-full min-w-0 items-center rounded-md px-3 text-left text-xs font-medium text-muted-foreground no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground hover:no-underline focus-visible:ring-[3px] focus-visible:ring-ring/35 data-[active=true]:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function NavbarCollapseTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<"button">) {
  const { collapsed, orientation, setCollapsed } =
    React.useContext(NavbarContext)
  if (orientation !== "vertical") return null
  const label = collapsed ? "展开导航栏" : "收起导航栏"
  return (
    <button
      type="button"
      data-slot="navbar-collapse-trigger"
      aria-label={label}
      title={label}
      className={cn(
        "absolute -right-3 top-5 z-20 flex size-6 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground shadow-xs outline-none transition-[color,background-color] hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/35",
        className
      )}
      onClick={(event) => {
        setCollapsed(!collapsed)
        onClick?.(event)
      }}
      {...props}
    >
      {collapsed ? (
        <PanelLeftOpenIcon className="size-4" />
      ) : (
        <PanelLeftCloseIcon className="size-4" />
      )}
    </button>
  )
}

export {
  Navbar,
  NavbarBadge,
  NavbarBrand,
  NavbarBrandLabel,
  NavbarCollapseTrigger,
  NavbarContent,
  NavbarFooter,
  NavbarGroup,
  NavbarHeader,
  NavbarItem,
  NavbarLabel,
  NavbarLink,
  NavbarLinkAccessory,
  NavbarLinkLabel,
  NavbarList,
  NavbarSeparator,
  NavbarSubLink,
  NavbarSubList,
  NavbarSubmenu,
  NavbarSubmenuContent,
  NavbarSubmenuTrigger,
  navbarVariants,
}
