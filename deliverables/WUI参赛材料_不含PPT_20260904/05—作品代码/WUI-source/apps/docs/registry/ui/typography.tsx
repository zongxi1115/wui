import * as React from "react"
import { Slot } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

const typographyVariants = cva("text-foreground", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-semibold tracking-[-0.03em] text-balance lg:text-5xl",
      h2: "scroll-m-20 text-3xl font-semibold tracking-[-0.025em] text-balance",
      h3: "scroll-m-20 text-2xl font-semibold tracking-[-0.02em] text-balance",
      h4: "scroll-m-20 text-xl font-semibold tracking-[-0.015em] text-balance",
      body: "text-base leading-7 text-pretty",
      lead: "text-muted-foreground text-xl leading-8 text-pretty",
      small: "text-sm font-medium leading-5",
      muted: "text-muted-foreground text-sm leading-6",
      code: "bg-muted rounded-sm px-1.5 py-0.5 font-mono text-[0.875em] font-medium",
      blockquote:
        "border-border text-muted-foreground border-l-2 pl-4 text-base italic leading-7",
    },
  },
  defaultVariants: { variant: "body" },
})

type TypographyVariant = NonNullable<
  VariantProps<typeof typographyVariants>["variant"]
>

const defaultElements: Record<TypographyVariant, React.ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  body: "p",
  lead: "p",
  small: "small",
  muted: "p",
  code: "code",
  blockquote: "blockquote",
}

export interface TypographyProps
  extends
    React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  /** 覆盖当前排版变体默认使用的 HTML 元素。 */
  as?: React.ElementType
  /** 将排版样式合并到唯一子元素。@default false */
  asChild?: boolean
}

/** 为标题、正文和辅助文本提供一致的语义层级与阅读节奏。 */
function Typography({
  className,
  variant = "body",
  as,
  asChild = false,
  ...props
}: TypographyProps) {
  const resolvedVariant = variant ?? "body"
  const Comp = asChild ? Slot.Root : (as ?? defaultElements[resolvedVariant])

  return (
    <Comp
      data-slot="typography"
      data-variant={resolvedVariant}
      className={cn(
        typographyVariants({ variant: resolvedVariant }),
        className
      )}
      {...props}
    />
  )
}

/** 使用正文节奏排布有序或无序列表。 */
function TypographyList({
  className,
  ordered = false,
  ...props
}: React.HTMLAttributes<HTMLOListElement | HTMLUListElement> & {
  /** 是否渲染为有序列表。@default false */
  ordered?: boolean
}) {
  const Comp = ordered ? "ol" : "ul"

  return (
    <Comp
      data-slot="typography-list"
      className={cn(
        "marker:text-muted-foreground my-4 ml-6 space-y-2 text-base leading-7",
        ordered ? "list-decimal" : "list-disc",
        className
      )}
      {...props}
    />
  )
}

/** 与正文颜色和焦点样式一致的文本链接。 */
function TypographyLink({ className, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      data-slot="typography-link"
      className={cn(
        "decoration-primary/40 hover:decoration-primary focus-visible:ring-ring/30 text-primary rounded-sm font-medium underline underline-offset-4 outline-none transition-colors focus-visible:ring-[3px]",
        className
      )}
      {...props}
    />
  )
}

export { Typography, TypographyLink, TypographyList, typographyVariants }
