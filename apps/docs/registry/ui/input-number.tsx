"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"

import { cn } from "@/registry/lib/utils"

export interface InputNumberProps extends Omit<
  React.ComponentProps<"input">,
  "defaultValue" | "onChange" | "type" | "value"
> {
  /** 当前数值；传入后组件进入受控模式。 */
  value?: number | null
  /** 非受控模式下的初始数值。 */
  defaultValue?: number
  /** 数值变化时触发，清空输入时返回 `null`。 */
  onValueChange?: (value: number | null) => void
  /** 允许输入的最小值。 */
  min?: number
  /** 允许输入的最大值。 */
  max?: number
  /** 点击按钮或按方向键时的步进值。 @default 1 */
  step?: number
  /** 输入框外层样式。 */
  wrapperClassName?: string
}

/** 支持范围约束、步进按钮和键盘操作的数值输入框。 */
function InputNumber({
  value,
  defaultValue,
  onValueChange,
  min,
  max,
  step = 1,
  disabled,
  readOnly,
  className,
  wrapperClassName,
  onBlur,
  onKeyDown,
  ...props
}: InputNumberProps) {
  const controlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState<number | null>(
    defaultValue ?? null
  )
  const currentValue = controlled ? value : internalValue
  const [draft, setDraft] = React.useState(
    currentValue === null || currentValue === undefined
      ? ""
      : String(currentValue)
  )

  React.useEffect(() => {
    if (!controlled) return
    const parsedDraft = draft.trim() === "" ? null : Number(draft)
    if (value !== parsedDraft) setDraft(value === null ? "" : String(value))
    // `draft` intentionally stays out of this dependency list so intermediate
    // input such as `-` and `1.` is not replaced while the user is typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlled, value])

  const precision = Math.max(
    String(step).split(".")[1]?.length ?? 0,
    String(min ?? "").split(".")[1]?.length ?? 0,
    String(max ?? "").split(".")[1]?.length ?? 0
  )

  const clamp = React.useCallback(
    (next: number) => {
      const bounded = Math.min(
        max ?? Infinity,
        Math.max(min ?? -Infinity, next)
      )
      return Number(bounded.toFixed(precision))
    },
    [max, min, precision]
  )

  const commit = React.useCallback(
    (next: number | null) => {
      if (!controlled) setInternalValue(next)
      setDraft(next === null ? "" : String(next))
      onValueChange?.(next)
    },
    [controlled, onValueChange]
  )

  const stepBy = (direction: 1 | -1) => {
    if (disabled || readOnly) return
    const base = currentValue ?? (direction > 0 ? (min ?? 0) : (max ?? 0))
    commit(clamp(base + direction * step))
  }

  const atMin =
    currentValue !== null &&
    currentValue !== undefined &&
    min !== undefined &&
    currentValue <= min
  const atMax =
    currentValue !== null &&
    currentValue !== undefined &&
    max !== undefined &&
    currentValue >= max

  return (
    <div
      data-slot="input-number"
      className={cn(
        "border-input bg-background shadow-xs focus-within:border-ring focus-within:ring-ring/30 flex h-10 w-full items-center rounded-md border transition-[border-color,box-shadow] focus-within:ring-[3px] has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
        wrapperClassName
      )}
    >
      <input
        data-slot="input-number-input"
        type="text"
        inputMode="decimal"
        role="spinbutton"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={currentValue ?? undefined}
        value={draft}
        disabled={disabled}
        readOnly={readOnly}
        className={cn(
          "placeholder:text-muted-foreground h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none disabled:cursor-not-allowed",
          className
        )}
        onChange={(event) => {
          const nextDraft = event.target.value
          setDraft(nextDraft)
          if (nextDraft.trim() === "") {
            if (!controlled) setInternalValue(null)
            onValueChange?.(null)
            return
          }
          const parsed = Number(nextDraft)
          if (Number.isFinite(parsed)) {
            if (!controlled) setInternalValue(parsed)
            onValueChange?.(parsed)
          }
        }}
        onBlur={(event) => {
          const parsed = Number(draft)
          if (draft.trim() === "" || !Number.isFinite(parsed)) commit(null)
          else commit(clamp(parsed))
          onBlur?.(event)
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault()
            stepBy(event.key === "ArrowUp" ? 1 : -1)
          }
          onKeyDown?.(event)
        }}
        {...props}
      />
      <div
        data-slot="input-number-controls"
        className="flex h-full shrink-0 border-l"
      >
        <button
          type="button"
          data-slot="input-number-decrement"
          aria-label="减小数值"
          tabIndex={-1}
          disabled={disabled || readOnly || atMin}
          className="text-muted-foreground hover:bg-accent hover:text-foreground inline-flex w-9 items-center justify-center outline-none transition-colors disabled:pointer-events-none disabled:opacity-40"
          onClick={() => stepBy(-1)}
        >
          <Minus className="size-3.5" />
        </button>
        <button
          type="button"
          data-slot="input-number-increment"
          aria-label="增大数值"
          tabIndex={-1}
          disabled={disabled || readOnly || atMax}
          className="text-muted-foreground hover:bg-accent hover:text-foreground inline-flex w-9 items-center justify-center border-l outline-none transition-colors disabled:pointer-events-none disabled:opacity-40"
          onClick={() => stepBy(1)}
        >
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  )
}

export { InputNumber }
