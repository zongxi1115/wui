"use client"

import * as React from "react"

import { cn } from "@/registry/lib/utils"

const resizeClasses = {
  none: "resize-none",
  vertical: "resize-y",
  horizontal: "resize-x",
  both: "resize",
} as const

export interface TextareaProps extends Omit<
  React.ComponentProps<"textarea">,
  "children"
> {
  /** 是否在右下角显示当前字符数。@default false */
  showCount?: boolean
  /** 文本域允许调整尺寸的方向。@default "vertical" */
  resize?: keyof typeof resizeClasses
  /** 应用于最外层容器的额外样式类。 */
  wrapperClassName?: string
}

/** A multiline text field with optional character count and resize control. */
function Textarea({
  className,
  wrapperClassName,
  showCount = false,
  resize = "vertical",
  value,
  defaultValue,
  maxLength,
  onChange,
  "aria-describedby": ariaDescribedBy,
  ...props
}: TextareaProps) {
  const counterId = React.useId()
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "")
  const currentValue = value ?? internalValue
  const characterCount = String(currentValue).length

  return (
    <div
      data-slot="textarea-shell"
      className={cn(
        "border-input bg-background shadow-xs focus-within:border-ring focus-within:ring-ring/30 has-[textarea[aria-invalid=true]]:border-destructive has-[textarea[aria-invalid=true]]:ring-destructive/20 relative w-full rounded-md border transition-[border-color,box-shadow] duration-200 ease-out focus-within:ring-[3px] has-[textarea:disabled]:cursor-not-allowed has-[textarea:disabled]:opacity-50 has-[textarea[aria-invalid=true]]:ring-[3px]",
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
        className={cn(
          "placeholder:text-muted-foreground/75 block min-h-24 w-full rounded-[inherit] bg-transparent px-3 py-2.5 text-sm leading-6 outline-none disabled:cursor-not-allowed",
          resizeClasses[resize],
          showCount && "pb-7 pr-16",
          className
        )}
        {...props}
      />
      {showCount ? (
        <span
          id={counterId}
          data-slot="textarea-count"
          aria-live="polite"
          className="text-muted-foreground pointer-events-none absolute bottom-2 right-3 text-xs tabular-nums"
        >
          {characterCount}
          {typeof maxLength === "number" ? ` / ${maxLength}` : null}
        </span>
      ) : null}
    </div>
  )
}

export { Textarea }
