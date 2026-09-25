"use client"

import * as React from "react"

import { cn } from "@/registry/lib/utils"

const resizeClasses = {
  none: "resize-none",
  vertical: "resize-y",
  horizontal: "resize-x",
  both: "resize",
} as const

export interface TextareaAutoSize {
  /** 自适应高度时的最少行数。@default 2 */
  minRows?: number
  /** 自适应高度时的最多行数，超出后出现滚动条。 */
  maxRows?: number
}

export interface TextareaProps extends Omit<
  React.ComponentProps<"textarea">,
  "children"
> {
  /** 是否在右下角显示当前字符数。@default false */
  showCount?: boolean
  /** 文本域允许调整尺寸的方向；开启 `autoSize` 时固定为 `"none"`。@default "vertical" */
  resize?: keyof typeof resizeClasses
  /** 根据内容平滑地自适应高度；传入对象可限制最少与最多行数。@default false */
  autoSize?: boolean | TextareaAutoSize
  /** 应用于最外层容器的额外样式类。 */
  wrapperClassName?: string
}

/** A multiline text field with optional smooth auto-sizing, character count and resize control. */
function Textarea({
  className,
  wrapperClassName,
  showCount = false,
  resize = "vertical",
  autoSize = false,
  value,
  defaultValue,
  maxLength,
  onChange,
  style,
  "aria-describedby": ariaDescribedBy,
  ...props
}: TextareaProps) {
  const counterId = React.useId()
  const measureRef = React.useRef<HTMLTextAreaElement>(null)
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "")
  const [height, setHeight] = React.useState<number>()
  const [overflowing, setOverflowing] = React.useState(false)
  const currentValue = String(value ?? internalValue)
  const characterCount = currentValue.length
  const autoSizeEnabled = Boolean(autoSize)
  const autoSizeConfig = typeof autoSize === "object" ? autoSize : autoSize ? {} : null
  const minRows = autoSizeConfig?.minRows ?? 2
  const maxRows = autoSizeConfig?.maxRows
  const countRatio = typeof maxLength === "number" && maxLength > 0 ? characterCount / maxLength : 0

  React.useLayoutEffect(() => {
    const measure = measureRef.current
    if (!autoSizeEnabled || !measure) return

    function sync() {
      if (!measure) return
      const styles = window.getComputedStyle(measure)
      const lineHeight = Number.parseFloat(styles.lineHeight)
      const chrome =
        Number.parseFloat(styles.paddingTop) + Number.parseFloat(styles.paddingBottom)
      const minHeight = lineHeight * minRows + chrome
      const maxHeight = maxRows ? lineHeight * maxRows + chrome : Infinity
      const contentHeight = measure.scrollHeight
      setHeight(Math.min(Math.max(contentHeight, minHeight), maxHeight))
      setOverflowing(contentHeight > maxHeight)
    }

    sync()
    const observer = new ResizeObserver(sync)
    observer.observe(measure)
    return () => observer.disconnect()
  }, [autoSizeEnabled, currentValue, minRows, maxRows, showCount])

  const textareaClassName = cn(
    "placeholder:text-muted-foreground/75 block w-full rounded-[inherit] bg-transparent px-3 py-2.5 text-sm leading-6 outline-none disabled:cursor-not-allowed",
    showCount && "pb-7 pr-16",
    className
  )

  return (
    <div
      data-slot="textarea-shell"
      className={cn(
        "border-input bg-background shadow-xs focus-within:border-ring focus-within:ring-ring/30 has-[textarea[aria-invalid=true]]:border-destructive has-[textarea[aria-invalid=true]]:ring-destructive/20 relative w-full rounded-md border transition-[border-color,box-shadow] duration-200 ease-out focus-within:ring-[3px] has-[textarea:disabled]:cursor-not-allowed has-[textarea:disabled]:opacity-50 has-[textarea[aria-invalid=true]]:ring-[3px] motion-reduce:transition-none",
        wrapperClassName
      )}
    >
      <textarea
        data-slot="textarea"
        value={value}
        defaultValue={defaultValue}
        maxLength={maxLength}
        aria-describedby={
          showCount
            ? [ariaDescribedBy, counterId].filter(Boolean).join(" ")
            : ariaDescribedBy
        }
        onChange={(event) => {
          if (value === undefined) setInternalValue(event.target.value)
          onChange?.(event)
        }}
        style={autoSizeConfig ? { ...style, height, overflowY: overflowing ? "auto" : "hidden" } : style}
        className={cn(
          textareaClassName,
          autoSizeConfig
            ? "resize-none transition-[height] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            : cn("min-h-24", resizeClasses[resize])
        )}
        {...props}
      />
      {autoSizeConfig ? (
        <textarea
          ref={measureRef}
          aria-hidden="true"
          tabIndex={-1}
          readOnly
          rows={1}
          value={currentValue || " "}
          className={cn(
            textareaClassName,
            "pointer-events-none invisible absolute inset-x-0 top-0 h-0 resize-none overflow-hidden"
          )}
        />
      ) : null}
      {showCount ? (
        <span
          id={counterId}
          data-slot="textarea-count"
          data-state={countRatio >= 1 ? "full" : countRatio >= 0.9 ? "near" : undefined}
          className="text-muted-foreground data-[state=near]:text-warning data-[state=full]:text-destructive pointer-events-none absolute bottom-2 right-3 text-xs tabular-nums transition-colors duration-200"
        >
          {characterCount}
          {typeof maxLength === "number" ? ` / ${maxLength}` : null}
        </span>
      ) : null}
    </div>
  )
}

export { Textarea }
