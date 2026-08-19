"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

const accordionVariants = cva("w-full", {
  variants: {
    variant: {
      default: "divide-y divide-border border-y border-border",
      bordered: "divide-y divide-border rounded-xl border border-border overflow-hidden bg-card",
      separated: "flex flex-col gap-2.5",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const AccordionContext = React.createContext<{
  variant?: "default" | "bordered" | "separated"
}>({ variant: "default" })

export type AccordionProps = React.ComponentProps<typeof AccordionPrimitive.Root> &
  VariantProps<typeof accordionVariants> & {
    /** 手风琴的外观样式变体。 @default "default" */
    variant?: "default" | "bordered" | "separated"
    /** 是否禁用整个手风琴组件的所有交互。 */
    disabled?: boolean
    /** 是否将属性传递给子元素渲染。 */
    asChild?: boolean
  }

/** 手风琴折叠面板，支持单项或多项内容的高效折叠与展开。 */
function Accordion({
  className,
  variant = "default",
  children,
  ...props
}: AccordionProps) {
  return (
    <AccordionContext.Provider value={{ variant }}>
      <AccordionPrimitive.Root
        data-slot="accordion"
        data-variant={variant}
        className={cn(accordionVariants({ variant }), className)}
        {...(props as any)}
      >
        {children}
      </AccordionPrimitive.Root>
    </AccordionContext.Provider>
  )
}

const accordionItemVariants = cva("transition-colors", {
  variants: {
    variant: {
      default: "",
      bordered: "",
      separated: "rounded-xl border border-border bg-card shadow-xs",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface AccordionItemProps
  extends React.ComponentProps<typeof AccordionPrimitive.Item> {}

function AccordionItem({
  className,
  value,
  children,
  ...props
}: AccordionItemProps) {
  const { variant } = React.useContext(AccordionContext)
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      value={value}
      className={cn(accordionItemVariants({ variant }), className)}
      {...props}
    >
      {children}
    </AccordionPrimitive.Item>
  )
}

export interface AccordionTriggerProps
  extends React.ComponentProps<typeof AccordionPrimitive.Trigger> {
  /** 是否展示右侧旋转指示箭头。 @default true */
  showIndicator?: boolean
}

function AccordionTrigger({
  className,
  children,
  showIndicator = true,
  ...props
}: AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group flex flex-1 items-center justify-between py-3.5 px-4 text-left text-sm font-medium text-foreground transition-all hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
          className
        )}
        {...props}
      >
        <span className="flex-1 min-w-0">{children}</span>
        {showIndicator && (
          <ChevronDownIcon
            aria-hidden
            className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
          />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

export interface AccordionContentProps
  extends React.ComponentProps<typeof AccordionPrimitive.Content> {}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionContentProps) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(
        "overflow-hidden text-xs sm:text-sm text-muted-foreground leading-relaxed transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className
      )}
      {...props}
    >
      <div className="px-4 pb-4 pt-0">{children}</div>
    </AccordionPrimitive.Content>
  )
}

export {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  accordionVariants,
}
