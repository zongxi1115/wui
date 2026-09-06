"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { SparklesIcon, ArrowUpRightIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

const aiPromptSuggestionsVariants = cva("w-full", {
  variants: {
    layout: {
      grid: "grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3",
      scroll: "flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none",
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

/** 用于引导用户开启对话的预设提问卡片与标签组。 */
function AiPromptSuggestions({
  className,
  layout = "grid",
  children,
  ...props
}: AiPromptSuggestionsProps) {
  return (
    <div
      data-slot="ai-prompt-suggestions"
      data-layout={layout}
      className={cn(aiPromptSuggestionsVariants({ layout }), className)}
      {...props}
    >
      {children}
    </div>
  )
}

const aiPromptSuggestionItemVariants = cva(
  "group relative flex items-start text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 cursor-pointer select-none",
  {
    variants: {
      variant: {
        card: "flex-col gap-1.5 rounded-xl border border-border/80 bg-card p-3.5 shadow-xs hover:border-border hover:bg-muted/40 hover:shadow-sm",
        chip: "inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground",
        ghost: "flex-col gap-1 rounded-lg p-2.5 hover:bg-muted/50",
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
        className={cn(aiPromptSuggestionItemVariants({ variant }), className)}
        onClick={handleClick}
        {...props}
      >
        <span className="flex size-3.5 shrink-0 items-center justify-center text-muted-foreground group-hover:text-foreground">
          {icon ?? <SparklesIcon className="size-3" />}
        </span>
        <span className="truncate font-medium">{title}</span>
        {badge}
      </button>
    )
  }

  return (
    <button
      type="button"
      data-slot="ai-prompt-suggestion-item"
      className={cn(aiPromptSuggestionItemVariants({ variant }), className)}
      onClick={handleClick}
      {...props}
    >
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {icon && (
            <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground group-hover:text-foreground">
              {icon}
            </span>
          )}
          <span className="text-xs font-semibold text-foreground">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          {badge}
          <ArrowUpRightIcon className="size-3.5 text-muted-foreground opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
        </div>
      </div>
      {description && (
        <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
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
