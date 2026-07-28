"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import {
  LoaderCircleIcon,
  PlusIcon,
  QuoteIcon,
  SparklesIcon,
  SquareIcon,
  XIcon,
} from "lucide-react"

import {
  BrandAnthropicIcon,
  BrandOpenaiIcon,
  BrandXaiIcon,
  FileDescriptionIcon,
  SendHorizontalIcon,
} from "@/registry/icons/animated"
import type { AnimatedIconHandle } from "@/registry/icons/animated/types"

import { cn } from "@/registry/lib/utils"
import { Button, buttonVariants } from "@/registry/ui/button"
import {
  Cascader,
  type CascaderProps,
} from "@/registry/ui/cascader"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/registry/ui/select"

export type AiPromptStatus = "idle" | "submitted" | "streaming" | "error"
export type AiModelProvider = "openai" | "anthropic" | "xai"

export interface AiPromptMentionItem {
  /** Stable option identifier. */
  id: string
  /** Visible name inserted after the trigger. */
  label: string
  /** Optional secondary line in the mention menu. */
  description?: string
  /** Custom value inserted into the textarea. Defaults to label. */
  value?: string
  /** Additional terms included in local filtering. */
  keywords?: string[]
  /** Avatar or icon displayed before the label. */
  avatar?: React.ReactNode
}

type MentionRange = {
  start: number
  end: number
  query: string
}

type AiPromptMentionContextValue = {
  activeIndex: number
  filteredItems: AiPromptMentionItem[]
  menuId: string
  open: boolean
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  value: string
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>
  handleKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void
  selectItem: (item: AiPromptMentionItem) => void
  updateValue: (value: string, caret: number) => void
}

const AiPromptMentionContext =
  React.createContext<AiPromptMentionContextValue | null>(null)

const aiPromptVariants = cva(
  "relative isolate w-full border bg-background text-foreground outline-none transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/15",
  {
    variants: {
      size: {
        compact:
          "rounded-md [&_[data-slot=ai-prompt-textarea]]:min-h-8",
        default:
          "rounded-lg [&_[data-slot=ai-prompt-textarea]]:min-h-10",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function useAiPromptMention() {
  return React.useContext(AiPromptMentionContext)
}

function findMentionRange(
  value: string,
  caret: number,
  trigger: string
): MentionRange | null {
  const beforeCaret = value.slice(0, caret)
  const start = beforeCaret.lastIndexOf(trigger)
  if (start < 0) return null

  const precedingCharacter = beforeCaret[start - 1]
  const hasBoundary =
    start === 0 ||
    /[\s([{"'，。！？、]/.test(precedingCharacter)
  if (!hasBoundary) return null

  const query = beforeCaret.slice(start + trigger.length)
  if (!query || !/\s/.test(query)) {
    return query.includes(trigger) ? null : { start, end: caret, query }
  }

  return null
}

function setReactRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value)
  else if (ref) ref.current = value
}

export interface AiPromptMentionProps {
  /** Full textarea value controlled by the provider. */
  value: string
  /** Called for normal typing and mention insertion. */
  onValueChange: (value: string) => void
  /** Available mention targets. */
  items: AiPromptMentionItem[]
  /** Character that opens the mention menu. @default "@" */
  trigger?: string
  /** Called after a target is inserted. */
  onMentionSelect?: (item: AiPromptMentionItem) => void
  children: React.ReactNode
}

/** Coordinates mention detection, keyboard navigation, and insertion. */
function AiPromptMention({
  value,
  onValueChange,
  items,
  trigger = "@",
  onMentionSelect,
  children,
}: AiPromptMentionProps) {
  const menuId = React.useId()
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const [range, setRange] = React.useState<MentionRange | null>(null)
  const [activeIndex, setActiveIndex] = React.useState(0)

  const filteredItems = React.useMemo(() => {
    if (!range) return []
    const query = range.query.trim().toLocaleLowerCase()
    if (!query) return items
    return items.filter((item) =>
      [item.label, item.description, ...(item.keywords ?? [])]
        .filter(Boolean)
        .some((term) => term!.toLocaleLowerCase().includes(query))
    )
  }, [items, range])

  React.useEffect(() => {
    setActiveIndex(0)
  }, [range?.query])

  const selectItem = React.useCallback(
    (item: AiPromptMentionItem) => {
      if (!range) return
      const insertion = `${trigger}${item.value ?? item.label} `
      const nextValue =
        value.slice(0, range.start) + insertion + value.slice(range.end)
      const nextCaret = range.start + insertion.length

      onValueChange(nextValue)
      onMentionSelect?.(item)
      setRange(null)

      requestAnimationFrame(() => {
        textareaRef.current?.focus()
        textareaRef.current?.setSelectionRange(nextCaret, nextCaret)
      })
    },
    [onMentionSelect, onValueChange, range, trigger, value]
  )

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (!range) return

      if (event.key === "ArrowDown") {
        event.preventDefault()
        setActiveIndex((current) =>
          filteredItems.length ? (current + 1) % filteredItems.length : 0
        )
      } else if (event.key === "ArrowUp") {
        event.preventDefault()
        setActiveIndex((current) =>
          filteredItems.length
            ? (current - 1 + filteredItems.length) % filteredItems.length
            : 0
        )
      } else if (
        (event.key === "Enter" || event.key === "Tab") &&
        filteredItems[activeIndex]
      ) {
        event.preventDefault()
        selectItem(filteredItems[activeIndex])
      } else if (event.key === "Escape") {
        event.preventDefault()
        setRange(null)
      }
    },
    [activeIndex, filteredItems, range, selectItem]
  )

  const updateValue = React.useCallback(
    (nextValue: string, caret: number) => {
      onValueChange(nextValue)
      setRange(findMentionRange(nextValue, caret, trigger))
    },
    [onValueChange, trigger]
  )

  return (
    <AiPromptMentionContext.Provider
      value={{
        activeIndex,
        filteredItems,
        menuId,
        open: range !== null,
        textareaRef,
        value,
        setActiveIndex,
        handleKeyDown,
        selectItem,
        updateValue,
      }}
    >
      {children}
    </AiPromptMentionContext.Provider>
  )
}

export interface AiPromptProps extends React.ComponentProps<"form"> {
  /** Composer density. @default "default" */
  size?: "compact" | "default"
}

/** A standalone, composable prompt composer for AI products. */
function AiPrompt({
  className,
  size = "default",
  onSubmit,
  ...props
}: AiPromptProps) {
  return (
    <form
      data-slot="ai-prompt"
      data-size={size}
      className={cn(aiPromptVariants({ size }), className)}
      onSubmit={(event) => {
        if (!onSubmit) event.preventDefault()
        onSubmit?.(event)
      }}
      {...props}
    />
  )
}

function AiPromptHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ai-prompt-header"
      className={cn(
        "flex min-h-10 flex-nowrap items-center gap-2 overflow-hidden border-b px-3 py-1.5",
        className
      )}
      {...props}
    />
  )
}

function AiPromptContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ai-prompt-content"
      className={cn("relative", className)}
      {...props}
    />
  )
}

export interface AiPromptTextareaProps
  extends React.ComponentProps<"textarea"> {
  /** Grow with the content until maxHeight is reached. @default true */
  autoResize?: boolean
  /** Maximum auto-resized height in pixels. @default 160 */
  maxHeight?: number
}

function AiPromptTextarea({
  className,
  ref,
  value,
  onChange,
  onKeyDown,
  autoResize = true,
  maxHeight = 160,
  style,
  ...props
}: AiPromptTextareaProps) {
  const mention = useAiPromptMention()
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const resize = React.useCallback(
    (textarea: HTMLTextAreaElement | null) => {
      if (!textarea || !autoResize) return

      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
      textarea.style.overflowY =
        textarea.scrollHeight > maxHeight ? "auto" : "hidden"
    },
    [autoResize, maxHeight]
  )

  React.useLayoutEffect(() => {
    resize(textareaRef.current)
  }, [mention?.value, resize, value])

  return (
    <textarea
      ref={(node) => {
        textareaRef.current = node
        setReactRef(ref, node)
        if (mention) mention.textareaRef.current = node
      }}
      data-slot="ai-prompt-textarea"
      rows={1}
      value={value ?? mention?.value}
      role={mention ? "combobox" : undefined}
      aria-autocomplete={mention ? "list" : undefined}
      aria-controls={mention?.menuId}
      aria-expanded={mention?.open}
      aria-activedescendant={
        mention?.open && mention.filteredItems[mention.activeIndex]
          ? `${mention.menuId}-option-${mention.activeIndex}`
          : undefined
      }
      className={cn(
        "block w-full resize-none overflow-y-hidden bg-transparent px-2 py-2 text-[15px] leading-6 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      style={{ ...style, maxHeight }}
      onChange={(event) => {
        onChange?.(event)
        if (!event.defaultPrevented && mention) {
          mention.updateValue(
            event.currentTarget.value,
            event.currentTarget.selectionStart
          )
        }
        resize(event.currentTarget)
      }}
      onKeyDown={(event) => {
        mention?.handleKeyDown(event)
        onKeyDown?.(event)
      }}
      {...props}
    />
  )
}

export interface AiPromptMentionMenuProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /** Message shown when the current query has no matches. */
  emptyMessage?: React.ReactNode
}

function AiPromptMentionMenu({
  className,
  emptyMessage = "没有匹配的提及对象",
  ...props
}: AiPromptMentionMenuProps) {
  const mention = useAiPromptMention()
  if (!mention?.open) return null

  return (
    <div
      id={mention.menuId}
      data-slot="ai-prompt-mention-menu"
      role="listbox"
      className={cn(
        "absolute inset-x-3 bottom-[calc(100%+0.5rem)] z-30 max-h-64 overflow-y-auto rounded-lg border bg-popover p-1 text-popover-foreground shadow-md",
        className
      )}
      {...props}
    >
      {mention.filteredItems.length ? (
        mention.filteredItems.map((item, index) => (
          <button
            key={item.id}
            id={`${mention.menuId}-option-${index}`}
            type="button"
            role="option"
            aria-selected={index === mention.activeIndex}
            data-slot="ai-prompt-mention-item"
            data-active={index === mention.activeIndex}
            className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
            onMouseEnter={() => mention.setActiveIndex(index)}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => mention.selectItem(item)}
          >
            {item.avatar ? (
              <span className="shrink-0">{item.avatar}</span>
            ) : null}
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{item.label}</span>
              {item.description ? (
                <span className="block truncate text-xs text-muted-foreground">
                  {item.description}
                </span>
              ) : null}
            </span>
          </button>
        ))
      ) : (
        <div className="px-3 py-5 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </div>
      )}
    </div>
  )
}

function AiPromptFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ai-prompt-footer"
      className={cn(
        "flex min-h-12 items-end gap-2 px-2.5 py-1.5",
        className
      )}
      {...props}
    />
  )
}

function AiPromptTools({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ai-prompt-tools"
      className={cn(
        "flex shrink-0 items-center gap-1.5",
        className
      )}
      {...props}
    />
  )
}

export interface AiPromptActionProps
  extends React.ComponentProps<typeof Button> {
  /** Persistent toggle state for optional prompt capabilities. */
  active?: boolean
  /** Leading icon, including an animated icon from the collection. */
  icon?: React.ReactNode
  /** Text revealed on hover, focus, or while active. */
  label?: React.ReactNode
}

function AiPromptAction({
  className,
  variant = "ghost",
  size = "sm",
  active = false,
  icon,
  label,
  children,
  ...props
}: AiPromptActionProps) {
  return (
    <Button
      type="button"
      data-slot="ai-prompt-action"
      data-active={active}
      aria-pressed={active || undefined}
      variant={variant}
      size={size}
      className={cn(
        "group h-9 gap-0 rounded-md border border-transparent px-2.5 text-muted-foreground hover:border-border hover:bg-muted/60 data-[active=true]:border-border data-[active=true]:bg-muted data-[active=true]:text-foreground",
        className
      )}
      {...props}
    >
      {icon ? <span className="flex size-4 shrink-0 items-center justify-center">{icon}</span> : null}
      {label ? (
        <span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,margin,opacity] duration-300 ease-out group-hover:ml-1.5 group-hover:max-w-32 group-hover:opacity-100 group-focus-visible:ml-1.5 group-focus-visible:max-w-32 group-focus-visible:opacity-100 group-data-[active=true]:ml-1.5 group-data-[active=true]:max-w-32 group-data-[active=true]:opacity-100 motion-reduce:transition-none">
          {label}
        </span>
      ) : (
        children
      )}
    </Button>
  )
}

export interface AiPromptCapabilitySelectorProps
  extends Omit<CascaderProps, "renderValue"> {
  /** Leading icon shown while the text label is collapsed. */
  icon?: React.ReactNode
}

/** A compact hierarchical picker for modes with nested effort levels. */
function AiPromptCapabilitySelector({
  className,
  contentClassName,
  separator = "·",
  icon,
  ...props
}: AiPromptCapabilitySelectorProps) {
  return (
    <Cascader
      data-slot="ai-prompt-capability-selector"
      separator={separator}
      className={cn(
        "h-9 w-auto min-w-0 gap-1.5 rounded-md border-transparent bg-transparent px-2.5 text-muted-foreground shadow-none hover:border-border hover:bg-muted/60",
        className
      )}
      contentClassName={cn("rounded-lg shadow-md", contentClassName)}
      renderValue={(selectedOptions) => (
        <span className="flex min-w-0 items-center">
          {icon ? (
            <span className="flex size-4 shrink-0 items-center justify-center">
              {icon}
            </span>
          ) : null}
          <span
            className={cn(
              "flex min-w-0 items-center whitespace-nowrap",
              icon &&
                "ml-0 max-w-0 overflow-hidden opacity-0 transition-[max-width,margin,opacity] duration-300 ease-out group-hover:ml-1.5 group-hover:max-w-40 group-hover:opacity-100 group-focus-visible:ml-1.5 group-focus-visible:max-w-40 group-focus-visible:opacity-100 motion-reduce:transition-none"
            )}
          >
            {selectedOptions.map((option, index) => (
              <React.Fragment key={option.value}>
                {index ? (
                  <span className="mx-1 text-muted-foreground/60">
                    {separator}
                  </span>
                ) : null}
                <span>{option.label}</span>
              </React.Fragment>
            ))}
          </span>
        </span>
      )}
      {...props}
    />
  )
}

export interface AiPromptAttachmentButtonProps
  extends Omit<
    React.ComponentProps<"input">,
    "children" | "onChange" | "type" | "value"
  > {
  /** Called whenever files are selected. */
  onFilesChange?: (files: File[]) => void
  /** Visible trigger content. */
  children?: React.ReactNode
}

function AiPromptAttachmentButton({
  className,
  multiple = false,
  disabled,
  onFilesChange,
  children,
  ...props
}: AiPromptAttachmentButtonProps) {
  return (
    <label
      data-slot="ai-prompt-attachment-button"
      aria-disabled={disabled}
      className={cn(
        buttonVariants({ variant: "outline", size: "icon" }),
        "size-9 cursor-pointer rounded-full bg-background text-muted-foreground shadow-none aria-disabled:pointer-events-none aria-disabled:opacity-50",
        className
      )}
    >
      <input
        type="file"
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(event) => {
          const files = Array.from(event.currentTarget.files ?? [])
          onFilesChange?.(multiple ? files : files.slice(0, 1))
          event.currentTarget.value = ""
        }}
        {...props}
      />
      {children ?? (
        <PlusIcon />
      )}
    </label>
  )
}

function AiPromptAttachments({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ai-prompt-attachments"
      className={cn("flex min-w-0 flex-wrap items-center gap-2", className)}
      {...props}
    />
  )
}

export interface AiPromptAttachmentProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /** File name shown in the attachment chip. */
  name: string
  /** Optional file size, type, or upload state. */
  metadata?: React.ReactNode
  /** Called by the remove button. Omit to render a read-only attachment. */
  onRemove?: () => void
  /** Custom leading preview or file icon. */
  preview?: React.ReactNode
}

function AiPromptAttachment({
  className,
  name,
  metadata,
  onRemove,
  preview,
  ...props
}: AiPromptAttachmentProps) {
  return (
    <div
      data-slot="ai-prompt-attachment"
      className={cn(
        "flex h-7 min-w-0 max-w-72 items-center gap-1.5 rounded-md px-1.5 transition-colors hover:bg-muted/60",
        className
      )}
      {...props}
    >
      <span className="flex size-5 shrink-0 items-center justify-center text-muted-foreground">
        {preview ?? <FileDescriptionIcon size={16} />}
      </span>
      <span className="min-w-0 flex-1 truncate text-xs font-medium">
        {name}
      </span>
      {metadata ? (
        <span className="shrink-0 text-[11px] text-muted-foreground">
          {metadata}
        </span>
      ) : null}
      {onRemove ? (
        <button
          type="button"
          aria-label={`移除 ${name}`}
          className="flex size-5 shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
          onClick={onRemove}
        >
          <XIcon className="size-3.5" />
        </button>
      ) : null}
    </div>
  )
}

export interface AiPromptQuoteProps extends React.ComponentProps<"blockquote"> {
  /** Optional source label shown before the quoted content. */
  label?: React.ReactNode
  /** Called by the remove button. */
  onRemove?: () => void
}

function AiPromptQuote({
  className,
  label,
  onRemove,
  children,
  ...props
}: AiPromptQuoteProps) {
  return (
    <blockquote
      data-slot="ai-prompt-quote"
      className={cn(
        "flex h-7 min-w-0 flex-1 items-center gap-2 text-sm",
        className
      )}
      {...props}
    >
      <QuoteIcon className="size-4 shrink-0 text-muted-foreground" />
      {label ? (
        <span className="shrink-0 text-xs font-medium text-foreground">
          {label}
        </span>
      ) : null}
      <span className="min-w-0 flex-1 truncate text-muted-foreground">
        {children}
      </span>
      {onRemove ? (
        <button
          type="button"
          aria-label="移除引用"
          className="flex size-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
          onClick={onRemove}
        >
          <XIcon className="size-3.5" />
        </button>
      ) : null}
    </blockquote>
  )
}

function AiModelSelector(
  props: React.ComponentProps<typeof Select>
) {
  return <Select {...props} />
}

function AiModelSelectorValue(
  props: React.ComponentProps<typeof SelectValue>
) {
  return <SelectValue {...props} />
}

export interface AiModelProviderIconProps
  extends React.ComponentProps<"span"> {
  /** AI model provider represented by the brand mark. */
  provider: AiModelProvider
}

function AiModelProviderIcon({
  className,
  provider,
  onMouseEnter,
  onMouseLeave,
  ...props
}: AiModelProviderIconProps) {
  const iconRef = React.useRef<AnimatedIconHandle>(null)
  const ProviderIcon =
    provider === "openai"
      ? BrandOpenaiIcon
      : provider === "anthropic"
        ? BrandAnthropicIcon
        : BrandXaiIcon

  return (
    <span
      data-slot="ai-model-provider-icon"
      data-provider={provider}
      aria-hidden="true"
      className={cn("flex size-8 shrink-0 items-center justify-center text-foreground", className)}
      onMouseEnter={(event) => {
        iconRef.current?.startAnimation()
        onMouseEnter?.(event)
      }}
      onMouseLeave={(event) => {
        iconRef.current?.stopAnimation()
        onMouseLeave?.(event)
      }}
      {...props}
    >
      <ProviderIcon ref={iconRef} size={20} className="shrink-0" />
    </span>
  )
}

export interface AiModelSelectorTriggerProps
  extends React.ComponentProps<typeof SelectTrigger> {
  /** Provider used to render the leading brand icon. */
  provider?: AiModelProvider
  /** Primary selected model label. */
  model?: React.ReactNode
  /** Secondary mode or capability label. */
  description?: React.ReactNode
  /** Custom icon that replaces the provider mark. */
  icon?: React.ReactNode
}

function AiModelSelectorTrigger({
  className,
  children,
  size = "sm",
  provider,
  model,
  description,
  icon,
  ...props
}: AiModelSelectorTriggerProps) {
  return (
    <SelectTrigger
      data-slot="ai-model-selector-trigger"
      size={size}
      className={cn(
        "h-9 min-h-0 min-w-0 gap-1.5 border-transparent bg-transparent px-2 py-0 text-foreground shadow-none hover:bg-muted/50 focus-visible:ring-2",
        className
      )}
      {...props}
    >
      {icon ??
        (provider ? (
          <AiModelProviderIcon
            provider={provider}
            className="size-5"
          />
        ) : (
          <SparklesIcon className="size-4 text-muted-foreground" />
        ))}
      <span className="min-w-0 flex-1 truncate text-left text-sm font-medium">
        {model ?? children}
      </span>
    </SelectTrigger>
  )
}

function AiModelSelectorContent({
  className,
  ...props
}: React.ComponentProps<typeof SelectContent>) {
  return (
    <SelectContent
      data-slot="ai-model-selector-content"
      className={cn("min-w-64", className)}
      {...props}
    />
  )
}

function AiModelSelectorGroup(
  props: React.ComponentProps<typeof SelectGroup>
) {
  return <SelectGroup data-slot="ai-model-selector-group" {...props} />
}

function AiModelSelectorLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectLabel>) {
  return (
    <SelectLabel
      data-slot="ai-model-selector-label"
      className={cn(
        "px-3 pb-1 pt-2 text-[11px] font-medium normal-case tracking-normal",
        className
      )}
      {...props}
    />
  )
}

function AiModelSelectorSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectSeparator>) {
  return (
    <SelectSeparator
      data-slot="ai-model-selector-separator"
      className={cn("my-1", className)}
      {...props}
    />
  )
}

export interface AiModelSelectorItemProps
  extends React.ComponentProps<typeof SelectItem> {
  /** Supporting capability or cost note. */
  description?: React.ReactNode
  /** Provider used to render the model's brand icon. */
  provider?: AiModelProvider
  /** Right-aligned context, speed, or plan metadata. */
  meta?: React.ReactNode
  /** Custom icon that replaces the provider mark. */
  icon?: React.ReactNode
}

function AiModelSelectorItem({
  className,
  description,
  provider,
  meta,
  icon,
  children,
  ...props
}: AiModelSelectorItemProps) {
  return (
    <SelectItem
      data-slot="ai-model-selector-item"
      className={cn("min-h-10 items-center py-1.5 pr-3", className)}
      {...props}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        {icon ??
          (provider ? (
            <AiModelProviderIcon provider={provider} className="size-7" />
          ) : null)}
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium">{children}</span>
          {description ? (
            <span className="mt-0.5 block truncate text-xs font-normal text-muted-foreground">
              {description}
            </span>
          ) : null}
        </span>
        {meta ? (
          <span className="shrink-0 text-[11px] font-normal text-muted-foreground">
            {meta}
          </span>
        ) : null}
      </span>
    </SelectItem>
  )
}

export interface AiPromptSubmitProps
  extends React.ComponentProps<typeof Button> {
  /** Current request lifecycle. @default "idle" */
  status?: AiPromptStatus
}

function AiPromptSubmit({
  className,
  status = "idle",
  children,
  ...props
}: AiPromptSubmitProps) {
  const busy = status === "submitted" || status === "streaming"
  return (
    <Button
      type={busy ? "button" : "submit"}
      size="icon"
      aria-label={busy ? "停止生成" : "发送消息"}
      data-slot="ai-prompt-submit"
      data-status={status}
      className={cn("size-10 rounded-full", className)}
      {...props}
    >
      {children ??
        (status === "submitted" ? (
          <LoaderCircleIcon className="motion-safe:animate-spin" />
        ) : status === "streaming" ? (
          <SquareIcon className="size-3 fill-current" />
        ) : (
          <SendHorizontalIcon size={18} />
        ))}
    </Button>
  )
}

export {
  AiModelProviderIcon,
  AiModelSelector,
  AiModelSelectorContent,
  AiModelSelectorGroup,
  AiModelSelectorItem,
  AiModelSelectorLabel,
  AiModelSelectorSeparator,
  AiModelSelectorTrigger,
  AiModelSelectorValue,
  AiPrompt,
  AiPromptAction,
  AiPromptCapabilitySelector,
  AiPromptAttachment,
  AiPromptAttachmentButton,
  AiPromptAttachments,
  AiPromptContent,
  AiPromptFooter,
  AiPromptHeader,
  AiPromptMention,
  AiPromptMentionMenu,
  AiPromptQuote,
  AiPromptSubmit,
  AiPromptTextarea,
  AiPromptTools,
  aiPromptVariants,
}
