"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowUpRightIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

const aiPromptSuggestionsVariants = cva("w-full", {
  variants: {
    layout: {
      grid: "grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3",
      scroll:
        "flex snap-x snap-mandatory items-stretch gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>*]:shrink-0 [&>*]:snap-start",
      chips: "flex flex-wrap items-center gap-1.5",
    },
  },
  defaultVariants: {
    layout: "grid",
  },
})

export interface AiPromptSuggestionsProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof aiPromptSuggestionsVariants> {
  /** 快捷提示词组的排版布局方式（网格、横向滚动或胶囊标签）。 @default "grid" */
  layout?: "grid" | "scroll" | "chips"
}

/** 用于引导用户开启对话的预设提问卡片与标签组。子项挂载时依次错峰进入。 */
function AiPromptSuggestions({
  className,
  layout = "grid",
  children,
  ...props
}: AiPromptSuggestionsProps) {
  let order = 0

  return (
    <div
      data-slot="ai-prompt-suggestions"
      data-layout={layout}
      className={cn(aiPromptSuggestionsVariants({ layout }), className)}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement<{ style?: React.CSSProperties }>(child)) {
          return child
        }
        const delay = `${Math.min(order++, 10) * 40}ms`
        return React.cloneElement(child, {
          style: {
            "--tw-animation-delay": delay,
            ...child.props.style,
          } as React.CSSProperties,
        })
      })}
    </div>
  )
}

const aiPromptSuggestionItemVariants = cva(
  "group relative flex cursor-pointer select-none items-start text-left outline-none transition-[background-color,border-color,color,translate] duration-200 ease-out focus-visible:ring-[3px] focus-visible:ring-ring/35 disabled:pointer-events-none disabled:opacity-50 fill-mode-both animation-duration-300 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1",
  {
    variants: {
      variant: {
        card: "flex-col gap-1 rounded-lg border bg-background p-3 hover:border-foreground/20 hover:bg-muted/40 motion-safe:hover:-translate-y-px motion-safe:active:translate-y-0",
        chip: "inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:border-foreground/20 hover:bg-muted/60 hover:text-foreground",
        ghost: "flex-col gap-1 rounded-md p-2.5 hover:bg-muted/60",
      },
    },
    defaultVariants: {
      variant: "card",
    },
  }
)

export interface AiPromptSuggestionItemProps
  extends Omit<React.ComponentProps<"button">, "title">,
    VariantProps<typeof aiPromptSuggestionItemVariants> {
  /** Main prompt headline or question. */
  title: React.ReactNode
  /** Optional supporting description or detail. */
  description?: React.ReactNode
  /** Optional leading icon. */
  icon?: React.ReactNode
  /** Optional tag/badge indicator (e.g. "Popular", "Code"). */
  badge?: React.ReactNode
  /** Full prompt text to send when clicked. */
  promptText?: string
  /** Callback fired with the prompt text upon selection. */
  onSelectPrompt?: (prompt: string) => void
}

function AiPromptSuggestionItem({
  className,
  variant = "card",
  title,
  description,
  icon,
  badge,
  promptText,
  onSelectPrompt,
  onClick,
  ...props
}: AiPromptSuggestionItemProps) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    const text = promptText ?? (typeof title === "string" ? title : "")
    if (text) {
      onSelectPrompt?.(text)
    }
  }

  if (variant === "chip") {
    return (
      <button
        type="button"
        data-slot="ai-prompt-suggestion-item"
        data-variant={variant}
        className={cn(aiPromptSuggestionItemVariants({ variant }), className)}
        onClick={handleClick}
        {...props}
      >
        {icon ? (
          <span className="flex size-3.5 shrink-0 items-center justify-center text-muted-foreground transition-colors group-hover:text-foreground [&_svg]:size-3.5">
            {icon}
          </span>
        ) : null}
        <span className="truncate font-medium">{title}</span>
        {badge}
      </button>
    )
  }

  return (
    <button
      type="button"
      data-slot="ai-prompt-suggestion-item"
      data-variant={variant}
      className={cn(aiPromptSuggestionItemVariants({ variant }), className)}
      onClick={handleClick}
      {...props}
    >
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {icon && (
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:text-foreground [&_svg]:size-3.5">
              {icon}
            </span>
          )}
          <span className="truncate text-sm font-medium text-foreground">
            {title}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {badge}
          <ArrowUpRightIcon className="size-3.5 -translate-x-0.5 translate-y-0.5 text-muted-foreground opacity-0 transition-[opacity,translate] duration-200 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100" />
        </div>
      </div>
      {description && (
        <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      )}
    </button>
  )
}

export {
  AiPromptSuggestionItem,
  AiPromptSuggestions,
  aiPromptSuggestionItemVariants,
  aiPromptSuggestionsVariants,
}
